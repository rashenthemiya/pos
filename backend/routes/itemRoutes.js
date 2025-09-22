const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const multer = require('multer');
const upload = multer(); // memory storage for image

// All routes use req.shopDb for multi-tenant
router.get('/', itemController.getAll);
router.get('/search', itemController.search);
router.get('/:id', itemController.getOne);
router.post('/', upload.single('image'), itemController.create);
router.put('/:id', upload.single('image'), itemController.update);
router.delete('/:id', itemController.remove);

module.exports = router;
