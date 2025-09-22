const { Op } = require('sequelize');

module.exports = {
  // POST /api/orders
  async create(req, res, next) {
    const t = await req.shopDb.sequelize.transaction();
    try {
      const { customer_id, items, payment_method, paid_amount, discount = 0 } = req.body;

      // Calculate cost and total_cost
      let cost = 0;
      for (const item of items) {
        cost += Number(item.qty) * Number(item.price);
      }
      const total_cost = cost - Number(discount);

      // 1. Create order
      const order = await req.shopDb.models.CustomerOrder.create({
        customer_id: customer_id || null,
        payment_method,
        paid_amount: paid_amount || 0,
        cost,
        discount: Number(discount),
        total_cost,
        status: payment_method === 'loan' ? 'LOAN' : 'COMPLETE',
        order_date: new Date(),
      }, { transaction: t });

      // 2. Create order items and update stock (FIFO batch deduction)
      for (const item of items) {
        // Create order product
        await req.shopDb.models.OrderProduct.create({
          order_id: order.order_id,
          item_id: item.item_id,
          quantity: item.qty,
          unit_price: item.price,
          line_total: item.qty * item.price,
          status: payment_method === 'loan' ? 'LOAN' : 'COMPLETE',
        }, { transaction: t });

        // FIFO batch deduction from StockBatch (only healthy batches)
        let qtyToDeduct = Number(item.qty);
        const stockBatches = await req.shopDb.models.StockBatch.findAll({
          where: {
            stock_id: { [Op.in]: [
              // Find all stock_id for this item
              ...(await req.shopDb.models.Stock.findAll({
                where: { item_id: item.item_id },
                attributes: ['stock_id']
              })).map(s => s.stock_id)
            ] },
            health_batch_quantity: { [Op.gt]: 0 }
          },
          order: [['expiry_date', 'ASC'], ['batch_id', 'ASC']],
          transaction: t
        });

        for (const batch of stockBatches) {
          if (qtyToDeduct <= 0) break;
          const available = Number(batch.health_batch_quantity);
          const deduct = Math.min(available, qtyToDeduct);
          batch.health_batch_quantity = available - deduct;
          batch.full_batch_quantity = Number(batch.full_batch_quantity) - deduct;
          await batch.save({ transaction: t });
          qtyToDeduct -= deduct;
        }

        // Update Stock table (healthy and full_quantity)
        const stock = await req.shopDb.models.Stock.findOne({ where: { item_id: item.item_id } });
        if (stock) {
          stock.healthy_quantity = Number(stock.healthy_quantity) - Number(item.qty);
          stock.full_quantity = Number(stock.full_quantity) - Number(item.qty);
          await stock.save({ transaction: t });
        }
        // Optionally: throw error if qtyToDeduct > 0 (not enough stock)
        if (qtyToDeduct > 0) {
          throw new Error(`Not enough healthy stock for item_id ${item.item_id}`);
        }
      }

      await t.commit();
      res.status(201).json({ message: 'Order created', order_id: order.order_id });
    } catch (err) {
      await t.rollback();
      next(err);
    }
  },
};
