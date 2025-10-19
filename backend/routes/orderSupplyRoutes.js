const express = require("express");
const router = express.Router();
const orderSupplyController = require('./controllers/orderSupplyController');

router.post('/', orderSupplyController.createOrderSupply);
router.get('/', orderSupplyController.getAllOrderSupplies);
router.get('/summary', orderSupplyController.getOrderSuppliesSummary);
router.get('/:id', orderSupplyController.getOrderSupplyById);
router.put('/:id', orderSupplyController.updateOrderSupply);
router.patch('/:id/status', orderSupplyController.updateOrderSupplyStatus);
router.post('/:id/receive', orderSupplyController.markOrderSupplyAsReceived);
router.delete('/:id', orderSupplyController.deleteOrderSupply);

module.exports = router;