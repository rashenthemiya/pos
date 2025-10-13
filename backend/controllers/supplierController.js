const { Supplier } = require("../models");


exports.createSupplier = async (req, res) => {
  try {
    const {
      name,
      contact_person,
      phone,
      email,
      address
    } = req.body;

    
    const supplier = await req.shopDb.models.Supplier.create({
      name,
      contact_person,
      phone,
      email,
      address
    });

    res.status(201).json({
      message: "Supplier created successfully",
      data: supplier
    });
  } catch (error) {
    console.error("Error creating supplier:", error);
    res.status(500).json({ message: "Failed to create supplier" });
  }
};


exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await req.shopDb.models.Supplier.findAll({
      order: [['created_at', 'DESC']]
    });

    res.status(200).json(suppliers);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({ message: "Failed to fetch suppliers" });
  }
};


exports.getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await req.shopDb.models.Supplier.findByPk(id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json(supplier);
  } catch (error) {
    console.error("Error fetching supplier:", error);
    res.status(500).json({ message: "Failed to fetch supplier" });
  }
};

// Get supplier with related data using the relations (supplies, orders, stock batches)
exports.getSupplierWithDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await req.shopDb.models.Supplier.findByPk(id, {
      include: [
        { model: req.shopDb.models.Supply, as: 'Supplies' },
        { model: req.shopDb.models.OrderSupply, as: 'OrderSupplies' },
        { model: req.shopDb.models.StockBatch, as: 'StockBatches' }
      ]
    });

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json(supplier);
  } catch (error) {
    console.error("Error fetching supplier details:", error);
    res.status(500).json({ message: "Failed to fetch supplier details" });
  }
};


exports.updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await req.shopDb.models.Supplier.findByPk(id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    const {
      name,
      contact_person,
      phone,
      email,
      address
    } = req.body;

    await supplier.update({
      name,
      contact_person,
      phone,
      email,
      address
    });

    res.status(200).json({
      message: "Supplier updated successfully",
      data: supplier
    });
  } catch (error) {
    console.error("Error updating supplier:", error);
    res.status(500).json({ message: "Failed to update supplier" });
  }
};


exports.deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await req.shopDb.models.Supplier.findByPk(id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    await supplier.destroy();

    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    res.status(500).json({ message: "Failed to delete supplier" });
  }
};
