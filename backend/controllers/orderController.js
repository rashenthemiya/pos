const { Op } = require("sequelize");

module.exports = {
  async create(req, res, next) {
    const MAX_RETRIES = 3;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      let t;

      try {
        attempt++;
        console.log(`🌀 Order creation attempt ${attempt}`);

        // ✅ Start transaction safely
        t = await req.shopDb.transaction({
          isolationLevel: "READ COMMITTED",
        });

        const { customer_id, items, payment_method, paid_amount, discount = 0, user_id } = req.body;
        const { CustomerOrder, OrderProduct, Stock, StockBatch } = req.shopDb.models;

        if (!items || !Array.isArray(items) || items.length === 0) {
          throw new Error("Order must contain at least one item");
        }

        // ✅ Step 1: Validate stock availability
        for (const item of items) {
          const stock = await Stock.findOne({
            where: { item_id: item.item_id },
            include: [{ model: StockBatch }],
            transaction: t,
            lock: t.LOCK.UPDATE,
          });

          if (!stock) throw new Error(`Stock not found for item_id ${item.item_id}`);
          if (stock.healthy_quantity < item.qty) {
            throw new Error(`Not enough healthy stock for item_id ${item.item_id}`);
          }
        }

        // ✅ Step 2: Calculate totals
        let orderSubtotal = 0;
        let totalItemDiscount = 0;

        for (const item of items) {
          const itemDiscount = Number(item.discount || 0);
          const lineSubtotal = Number(item.qty) * Number(item.price);
          const lineTotal = lineSubtotal - itemDiscount;

          orderSubtotal += lineSubtotal;
          totalItemDiscount += itemDiscount;
          item.lineTotal = lineTotal;
        }

        const grandDiscount = Number(discount) + totalItemDiscount;
        const finalTotal = orderSubtotal - grandDiscount;

        // ✅ Step 3: Create the order
        const order = await CustomerOrder.create(
          {
            user_id,
            customer_id: customer_id || null,
            payment_method,
            paid_amount: paid_amount || 0,
            cost: orderSubtotal,
            discount: grandDiscount,
            total_cost: finalTotal,
            status: payment_method === "loan" ? "LOAN" : "COMPLETE",
            order_date: new Date(),
          },
          { transaction: t }
        );

        // ✅ Step 4: Process each ordered item
        for (const item of items) {
          let qtyToDeduct = Number(item.qty);
          let usedBatchId = null;

          // ✅ Step 4.1: Select batch
          let stockBatches;
          if (item.batch_id || item.barcode) {
            // User manually selected batch
            const whereCondition = {};
            if (item.batch_id) whereCondition.batch_id = item.batch_id;
            if (item.barcode) whereCondition.barcode = item.barcode;

            stockBatches = await StockBatch.findAll({
              where: whereCondition,
              transaction: t,
              lock: t.LOCK.UPDATE,
            });

            if (stockBatches.length === 0) {
              throw new Error(`No batch found for ${item.batch_id ? "batch_id" : "barcode"} ${item.batch_id || item.barcode}`);
            }
          } else {
            // Default FIFO selection
            stockBatches = await StockBatch.findAll({
              where: {
                stock_id: {
                  [Op.in]: (
                    await Stock.findAll({
                      where: { item_id: item.item_id },
                      attributes: ["stock_id"],
                      transaction: t,
                    })
                  ).map((s) => s.stock_id),
                },
                health_batch_quantity: { [Op.gt]: 0 },
              },
              order: [["expiry_date", "ASC"], ["batch_id", "ASC"]],
              transaction: t,
              lock: t.LOCK.UPDATE,
            });
          }

          // ✅ Step 4.2: Deduct quantities
          for (const batch of stockBatches) {
            if (qtyToDeduct <= 0) break;

            const available = Number(batch.health_batch_quantity);
            const deduct = Math.min(available, qtyToDeduct);

            batch.health_batch_quantity = available - deduct;
            batch.full_batch_quantity = Number(batch.full_batch_quantity) - deduct;

            await batch.save({ transaction: t });
            qtyToDeduct -= deduct;

            // Record last batch used for tracking
            usedBatchId = batch.batch_id;
          }

          if (qtyToDeduct > 0) {
            throw new Error(`Not enough healthy batch stock for item_id ${item.item_id}`);
          }

          // ✅ Step 4.3: Update main stock
          const stock = await Stock.findOne({
            where: { item_id: item.item_id },
            transaction: t,
            lock: t.LOCK.UPDATE,
          });

          if (stock) {
            stock.healthy_quantity -= Number(item.qty);
            stock.full_quantity -= Number(item.qty);

            // Auto update stock level
            if (stock.healthy_quantity <= 0) stock.stock_level = "outofstock";
            else if (stock.healthy_quantity < 50) stock.stock_level = "low";
            else if (stock.healthy_quantity < 200) stock.stock_level = "medium";
            else stock.stock_level = "high";

            await stock.save({ transaction: t });
          }

          // ✅ Step 4.4: Create OrderProduct record with batch_id
          await OrderProduct.create(
            {
              order_id: order.order_id,
              item_id: item.item_id,
              quantity: item.qty,
              unit_price: item.price,
              discountperitem: item.discount || 0,
              line_total: item.lineTotal,
              batch_id: usedBatchId, // 🔥 now stored for traceability
              status: payment_method === "loan" ? "LOAN" : "COMPLETE",
            },
            { transaction: t }
          );
        }

        // ✅ Commit if all good
        await t.commit();

        return res.status(201).json({
          message: "✅ Order created successfully",
          order_id: order.order_id,
          subtotal: orderSubtotal,
          total_discount: grandDiscount,
          total_cost: finalTotal,
        });
      } catch (error) {
        if (t) await t.rollback();

        // Retry on deadlock or lock wait timeout
        if (error.code === "ER_LOCK_DEADLOCK" || error.code === "ER_LOCK_WAIT_TIMEOUT") {
          console.warn(`⚠️ Lock conflict detected (attempt ${attempt}), retrying...`);
          if (attempt < MAX_RETRIES) continue;
        }

        console.error("❌ Error creating order:", error);
        return next(error);
      }
    }
  },
};
