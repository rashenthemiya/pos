const express = require('express');
const router = express.Router();

const authenticateToken = require('../middlewares/authenticateToken');
const authorizeRoles = require('../middlewares/authorizeRoles');
const authController = require('../controllers/authController');

router.post('/register', authenticateToken, authorizeRoles('manager'), authController.register);
router.post('/login', authController.login);

module.exports = router;
