const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

// Create new stock (with batches)
router.post('/', stockController.createStock);

// Get all stocks (with batches and item info)
router.get('/', stockController.getAllStocks);

// Get stock by ID
router.get('/:id', stockController.getStockById);

// Update stock manually
router.put('/:id', stockController.updateStock);

// Delete stock
router.delete('/:id', stockController.deleteStock);

module.exports = router;