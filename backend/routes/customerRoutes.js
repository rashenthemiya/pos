const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const multer = require("multer");

// Use Multer to handle BLOB image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// CRUD Routes
router.post(
  "/",
  upload.fields([
    { name: "nic_image_front", maxCount: 1 },
    { name: "nic_image_back", maxCount: 1 }
  ]),
  customerController.createCustomer
);

router.get("/", customerController.getAllCustomers);
router.get("/:id", customerController.getCustomerById);

router.put(
  "/:id",
  upload.fields([
    { name: "nic_image_front", maxCount: 1 },
    { name: "nic_image_back", maxCount: 1 }
  ]),
  customerController.updateCustomer
);

router.delete("/:id", customerController.deleteCustomer);

module.exports = router;
