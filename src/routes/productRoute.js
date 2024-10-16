const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticate = require('../middlewares/authMiddleware');

router.get('/products', authenticate, productController.getAllProducts);

router.get('/products/search', authenticate, checkPermission("perm_read_product"), productController.searchProducts);

router.get('/products/:id', authenticate, checkPermission("perm_read_product"), productController.getProductById);

router.post('/products', authenticate, productController.createProduct);

router.put('/products/:id', authenticate, productController.updateProductById);

router.delete('/products/:id', authenticate, productController.deleteProductById);

module.exports = router;