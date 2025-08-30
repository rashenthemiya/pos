// Placeholder for main router
const express = require('express');
const router = express.Router();

const customerRoutes = require('./customerRoutes');
const itemRoutes = require('./itemRoutes');

router.use('/auth', require('./auth'));
router.use('/customers', customerRoutes);
router.use('/items', itemRoutes);

module.exports = router;
