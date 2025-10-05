// Placeholder for main router
const express = require('express');
const router = express.Router();


const customerRoutes = require('./customerRoutes');
const itemRoutes = require('./itemRoutes');
const orderRoutes = require('./orderRoutes');
const stockRoutes = require('./stockRoutes');


router.use('/auth', require('./auth'));
router.use('/customers', customerRoutes);
router.use('/items', itemRoutes);
router.use('/orders', orderRoutes);
router.use('/stocks', stockRoutes);

module.exports = router;
