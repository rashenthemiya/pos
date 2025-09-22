// Placeholder for main router
const express = require('express');
const router = express.Router();


const customerRoutes = require('./customerRoutes');
const itemRoutes = require('./itemRoutes');
const orderRoutes = require('./orderRoutes');


router.use('/auth', require('./auth'));
router.use('/customers', customerRoutes);
router.use('/items', itemRoutes);
router.use('/orders', orderRoutes);

module.exports = router;
