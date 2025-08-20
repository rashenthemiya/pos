const { Customer } = require("../models/Customer");

// ✅ Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    const {
      name,
      nic,
      shop_balance,
      phone,
      email,
      address
    } = req.body;

    // Convert images to BLOB (if uploaded)
    const nic_image_front = req.files?.nic_image_front
      ? req.files.nic_image_front[0].buffer
      : null;

    const nic_image_back = req.files?.nic_image_back
      ? req.files.nic_image_back[0].buffer
      : null;

    // Create customer
    const customer = await Customer.create({
      name,
      nic,
      nic_image_front,
      nic_image_back,
      shop_balance,
      phone,
      email,
      address
    });

    res.status(201).json({
      message: "Customer created successfully",
      data: customer
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ message: "Failed to create customer" });
  }
};

// ✅ Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      attributes: { exclude: ["nic_image_front", "nic_image_back"] } // avoid large BLOBs
    });

    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Failed to fetch customers" });
  }
};

// ✅ Get single customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ message: "Failed to fetch customer" });
  }
};

// ✅ Update customer details
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const {
      name,
      nic,
      shop_balance,
      phone,
      email,
      address
    } = req.body;

    // Update images only if uploaded
    const nic_image_front = req.files?.nic_image_front
      ? req.files.nic_image_front[0].buffer
      : customer.nic_image_front;

    const nic_image_back = req.files?.nic_image_back
      ? req.files.nic_image_back[0].buffer
      : customer.nic_image_back;

    await customer.update({
      name,
      nic,
      shop_balance,
      phone,
      email,
      address,
      nic_image_front,
      nic_image_back
    });

    res.status(200).json({
      message: "Customer updated successfully",
      data: customer
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Failed to update customer" });
  }
};

// ✅ Delete customer
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await customer.destroy();

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Failed to delete customer" });
  }
};
