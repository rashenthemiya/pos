// Placeholder for main router
const express = require('express');
const router = express.Router();


const customerRoutes = require('./customerRoutes');
const itemRoutes = require('./itemRoutes');
const orderRoutes = require('./orderRoutes');
const stockRoutes = require('./stockRoutes');
const supplierRoutes = require('./supplierRoutes');
const orderSupplyRoutes = require('./orderSupplyRoutes');


router.use('/auth', require('./auth'));
router.use('/customers', customerRoutes);
router.use('/items', itemRoutes);
router.use('/orders', orderRoutes);
router.use('/stocks', stockRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/ordersupply', orderSupplyRoutes);

module.exports = router;
