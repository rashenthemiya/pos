// Placeholder for main router
const express = require('express');
const router = express.Router();
const customerRoutes = require('./customerRoutes');


router.use('/auth', require('./auth'));
router.use('/customers', customerRoutes);

module.exports = router;
