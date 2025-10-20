const { Op } = require('sequelize');

// Create a new supply order
exports.createOrderSupply = async (req, res) => {
  try {
    const {
      item_id,
      requested_quantity,
      supplier_id,
      status = 'pending'
    } = req.body;

    // Validate required fields
    if (!item_id || !requested_quantity) {
      return res.status(400).json({ 
        message: "Item ID and requested quantity are required" 
      });
    }

    // Check if item exists
    const item = await req.shopDb.models.Item.findByPk(item_id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if supplier exists (if provided)
    if (supplier_id) {
      const supplier = await req.shopDb.models.Supplier.findByPk(supplier_id);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
    }

    const orderSupply = await req.shopDb.models.OrderSupply.create({
      item_id,
      requested_quantity,
      supplier_id,
      status
    });

    // Fetch the created order with related data
    const orderWithDetails = await req.shopDb.models.OrderSupply.findByPk(
      orderSupply.order_supply_id,
      {
        include: [
          { model: req.shopDb.models.Item, as: 'Item' },
          { model: req.shopDb.models.Supplier, as: 'Supplier' }
        ]
      }
    );

    res.status(201).json({
      message: "Supply order created successfully",
      data: orderWithDetails
    });
  } catch (error) {
    console.error("Error creating supply order:", error);
    res.status(500).json({ message: "Failed to create supply order" });
  }
};

// Get all supply orders
exports.getAllOrderSupplies = async (req, res) => {
  try {
    const { status, supplier_id } = req.query;
    
    const whereClause = {};
    if (status) whereClause.status = status;
    if (supplier_id) whereClause.supplier_id = supplier_id;

    const orderSupplies = await req.shopDb.models.OrderSupply.findAll({
      where: whereClause,
      include: [
        { model: req.shopDb.models.Item, as: 'Item' },
        { model: req.shopDb.models.Supplier, as: 'Supplier' }
      ],
      order: [['requested_date', 'DESC']]
    });

    res.status(200).json(orderSupplies);
  } catch (error) {
    console.error("Error fetching supply orders:", error);
    res.status(500).json({ message: "Failed to fetch supply orders" });
  }
};

// Get supply order by ID
exports.getOrderSupplyById = async (req, res) => {
  try {
    const { id } = req.params;

    const orderSupply = await req.shopDb.models.OrderSupply.findByPk(id, {
      include: [
        { model: req.shopDb.models.Item, as: 'Item' },
        { model: req.shopDb.models.Supplier, as: 'Supplier' }
      ]
    });

    if (!orderSupply) {
      return res.status(404).json({ message: "Supply order not found" });
    }

    res.status(200).json(orderSupply);
  } catch (error) {
    console.error("Error fetching supply order:", error);
    res.status(500).json({ message: "Failed to fetch supply order" });
  }
};

// Update supply order
exports.updateOrderSupply = async (req, res) => {
  try {
    const { id } = req.params;

    const orderSupply = await req.shopDb.models.OrderSupply.findByPk(id);
    if (!orderSupply) {
      return res.status(404).json({ message: "Supply order not found" });
    }

    const {
      item_id,
      requested_quantity,
      supplier_id,
      status
    } = req.body;

    // Validate item if being updated
    if (item_id && item_id !== orderSupply.item_id) {
      const item = await req.shopDb.models.Item.findByPk(item_id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
    }

    // Validate supplier if being updated
    if (supplier_id && supplier_id !== orderSupply.supplier_id) {
      const supplier = await req.shopDb.models.Supplier.findByPk(supplier_id);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
    }

    await orderSupply.update({
      item_id,
      requested_quantity,
      supplier_id,
      status
    });

    // Fetch updated order with relations
    const updatedOrder = await req.shopDb.models.OrderSupply.findByPk(id, {
      include: [
        { model: req.shopDb.models.Item, as: 'Item' },
        { model: req.shopDb.models.Supplier, as: 'Supplier' }
      ]
    });

    res.status(200).json({
      message: "Supply order updated successfully",
      data: updatedOrder
    });
  } catch (error) {
    console.error("Error updating supply order:", error);
    res.status(500).json({ message: "Failed to update supply order" });
  }
};

// Update supply order status (dedicated endpoint)
exports.updateOrderSupplyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'ordered', 'received'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status. Must be one of: pending, ordered, received" 
      });
    }

    const orderSupply = await req.shopDb.models.OrderSupply.findByPk(id);
    if (!orderSupply) {
      return res.status(404).json({ message: "Supply order not found" });
    }

    // Update status
    await orderSupply.update({ status });

    // Fetch updated order with relations
    const updatedOrder = await req.shopDb.models.OrderSupply.findByPk(id, {
      include: [
        { model: req.shopDb.models.Item, as: 'Item' },
        { model: req.shopDb.models.Supplier, as: 'Supplier' }
      ]
    });

    res.status(200).json({
      message: `Supply order status updated to ${status}`,
      data: updatedOrder
    });
  } catch (error) {
    console.error("Error updating supply order status:", error);
    res.status(500).json({ message: "Failed to update supply order status" });
  }
};

// Mark supply order as received (convenience endpoint)
exports.markOrderSupplyAsReceived = async (req, res) => {
  try {
    const { id } = req.params;
    const { received_quantity, create_stock_batch = false } = req.body;

    const orderSupply = await req.shopDb.models.OrderSupply.findByPk(id, {
      include: [
        { model: req.shopDb.models.Item, as: 'Item' },
        { model: req.shopDb.models.Supplier, as: 'Supplier' }
      ]
    });

    if (!orderSupply) {
      return res.status(404).json({ message: "Supply order not found" });
    }

    // Update status to received
    await orderSupply.update({ status: 'received' });

    // Optionally create a stock batch when marking as received
    let stockBatch = null;
    if (create_stock_batch && orderSupply.supplier_id) {
      const quantity = received_quantity || orderSupply.requested_quantity;
      
      stockBatch = await req.shopDb.models.StockBatch.create({
        item_id: orderSupply.item_id,
        supplierid: orderSupply.supplier_id,
        quantity: quantity,
        received_date: new Date()
      });

      // Update item stock quantity
      const item = orderSupply.Item;
      if (item) {
        await item.update({
          stock_quantity: parseFloat(item.stock_quantity || 0) + parseFloat(quantity)
        });
      }
    }

    res.status(200).json({
      message: "Supply order marked as received",
      data: {
        orderSupply,
        stockBatch
      }
    });
  } catch (error) {
    console.error("Error marking supply order as received:", error);
    res.status(500).json({ message: "Failed to mark supply order as received" });
  }
};

// Delete supply order
exports.deleteOrderSupply = async (req, res) => {
  try {
    const { id } = req.params;

    const orderSupply = await req.shopDb.models.OrderSupply.findByPk(id);
    if (!orderSupply) {
      return res.status(404).json({ message: "Supply order not found" });
    }

    // Only allow deletion of pending orders
    if (orderSupply.status !== 'pending') {
      return res.status(400).json({ 
        message: "Only pending orders can be deleted" 
      });
    }

    await orderSupply.destroy();

    res.status(200).json({ message: "Supply order deleted successfully" });
  } catch (error) {
    console.error("Error deleting supply order:", error);
    res.status(500).json({ message: "Failed to delete supply order" });
  }
};

// Get supply orders summary/statistics
exports.getOrderSuppliesSummary = async (req, res) => {
  try {
    const [pendingCount, orderedCount, receivedCount] = await Promise.all([
      req.shopDb.models.OrderSupply.count({ where: { status: 'pending' } }),
      req.shopDb.models.OrderSupply.count({ where: { status: 'ordered' } }),
      req.shopDb.models.OrderSupply.count({ where: { status: 'received' } })
    ]);

    res.status(200).json({
      total: pendingCount + orderedCount + receivedCount,
      pending: pendingCount,
      ordered: orderedCount,
      received: receivedCount
    });
  } catch (error) {
    console.error("Error fetching supply orders summary:", error);
    res.status(500).json({ message: "Failed to fetch summary" });
  }
};