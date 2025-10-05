// Stock Controller (multi-tenant version)

exports.createStock = async (req, res) => {
  try {
    const { item_id, batches } = req.body;

    if (!item_id) {
      console.error("Missing item_id in request body");
      return res.status(400).json({ message: "Missing item_id in request body" });
    }

    const { Stock, StockBatch, Item } = req.shopDb.models;

    // Check if item exists
    const item = await Item.findByPk(item_id);
    if (!item) {
      console.error(`Item not found for item_id: ${item_id}`);
      return res.status(404).json({ message: "Item not found", item_id });
    }

    // Check if stock already exists
    let stock;
    try {
      stock = await Stock.findOne({ where: { item_id } });
    } catch (err) {
      console.error("Error querying Stock:", err);
      return res.status(500).json({ message: "Database error when querying Stock", error: err.message });
    }

    if (!stock) {
      try {
        stock = await Stock.create({
          item_id,
          full_quantity: 0,
          healthy_quantity: 0,
          damaged_quantity: 0,
          expired_quantity: 0,
          unit: "kg", // fallback unit
          stock_level: "low",
          last_updated: new Date()
        });
      } catch (err) {
        console.error("Error creating Stock:", err);
        return res.status(500).json({ message: "Database error when creating Stock", error: err.message });
      }
    }

    let createdBatches = [];
    let totalFull = 0,
      totalHealthy = 0,
      totalDamaged = 0,
      totalExpired = 0;

    // Create batches if provided
    if (Array.isArray(batches) && batches.length > 0) {
      try {
        createdBatches = await Promise.all(
          batches.map(async (batch, idx) => {
            // Validate required batch fields
            if (!batch.full_batch_quantity || !batch.health_batch_quantity) {
              console.error(`Batch at index ${idx} missing quantity fields`, batch);
              throw new Error(`Batch at index ${idx} missing quantity fields`);
            }
            const newBatch = await StockBatch.create({
              stock_id: stock.stock_id,
              supplierid: batch.supplierid,
              barcode: batch.barcode,
              cost_price: batch.cost_price,
              selling_price: batch.selling_price,
              billing_price: batch.billing_price,
              full_batch_quantity: batch.full_batch_quantity,
              health_batch_quantity: batch.health_batch_quantity,
              damage_batch_quantity: batch.damage_batch_quantity,
              expired_batch_quantity: batch.expired_batch_quantity,
              expiry_date: batch.expiry_date,
              received_date: batch.received_date
            });

            totalFull += Number(batch.full_batch_quantity || 0);
            totalHealthy += Number(batch.health_batch_quantity || 0);
            totalDamaged += Number(batch.damage_batch_quantity || 0);
            totalExpired += Number(batch.expired_batch_quantity || 0);

            return newBatch;
          })
        );
      } catch (err) {
        console.error("Error creating StockBatch:", err);
        return res.status(500).json({ message: "Database error when creating StockBatch", error: err.message });
      }

      // Update stock summary
      try {
        stock.full_quantity = Number(stock.full_quantity) + totalFull;
        stock.healthy_quantity = Number(stock.healthy_quantity) + totalHealthy;
        stock.damaged_quantity = Number(stock.damaged_quantity) + totalDamaged;
        stock.expired_quantity = Number(stock.expired_quantity) + totalExpired;
        stock.last_updated = new Date();

        // Stock level logic
        if (stock.healthy_quantity <= 0) {
          stock.stock_level = "outofstock";
        } else if (stock.healthy_quantity < 50) {
          stock.stock_level = "low";
        } else if (stock.healthy_quantity < 200) {
          stock.stock_level = "medium";
        } else {
          stock.stock_level = "high";
        }

        await stock.save();
      } catch (err) {
        console.error("Error updating Stock summary:", err);
        return res.status(500).json({ message: "Database error when updating Stock summary", error: err.message });
      }
    } else {
      console.warn("No batches provided in request");
    }

    res.status(201).json({
      message: "Stock created/updated successfully",
      stock,
      batches: createdBatches
    });
  } catch (error) {
    console.error("General error in createStock:", error);
    res.status(500).json({ message: "Failed to create stock", error: error.message });
  }
};

// ✅ Get all stocks
exports.getAllStocks = async (req, res) => {
  try {
    const { Stock, StockBatch, Item } = req.shopDb.models;

    const stocks = await Stock.findAll({
      include: [
        { model: Item, attributes: ["item_id", "name"] },
        { model: StockBatch }
      ]
    });
    res.status(200).json(stocks);
  } catch (error) {
    console.error("Error fetching stocks:", error);
    res.status(500).json({ message: "Failed to fetch stocks" });
  }
};

// ✅ Get stock by ID
exports.getStockById = async (req, res) => {
  try {
    const { Stock, StockBatch, Item } = req.shopDb.models;
    const { id } = req.params;

    const stock = await Stock.findByPk(id, {
      include: [
        { model: Item, attributes: ["item_id", "name"] },
        { model: StockBatch }
      ]
    });

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    res.status(200).json(stock);
  } catch (error) {
    console.error("Error fetching stock:", error);
    res.status(500).json({ message: "Failed to fetch stock" });
  }
};

// ✅ Update stock manually
exports.updateStock = async (req, res) => {
  try {
    const { Stock } = req.shopDb.models;
    const { id } = req.params;

    const stock = await Stock.findByPk(id);
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    const {
      full_quantity,
      healthy_quantity,
      damaged_quantity,
      expired_quantity,
      unit,
      stock_level
    } = req.body;

    await stock.update({
      full_quantity,
      healthy_quantity,
      damaged_quantity,
      expired_quantity,
      unit,
      stock_level,
      last_updated: new Date()
    });

    res.status(200).json({
      message: "Stock updated successfully",
      data: stock
    });
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ message: "Failed to update stock" });
  }
};

// ✅ Delete stock
exports.deleteStock = async (req, res) => {
  try {
    const { Stock } = req.shopDb.models;
    const { id } = req.params;

    const stock = await Stock.findByPk(id);
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    await stock.destroy();
    res.status(200).json({ message: "Stock deleted successfully" });
  } catch (error) {
    console.error("Error deleting stock:", error);
    res.status(500).json({ message: "Failed to delete stock" });
  }
};
