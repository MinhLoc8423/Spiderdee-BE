const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticate = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

router.get('/products', authenticate, checkPermission("perm_read_product"), productController.getAllProducts);

router.get('/products/search', authenticate, checkPermission("perm_read_product"), productController.searchProducts);

router.get('/products/:id', authenticate, checkPermission("perm_read_product"), productController.getProductById);

router.post('/products', authenticate, checkPermission("perm_create_product"), productController.createProduct);

router.put('/products/:id', authenticate, checkPermission("perm_update_product"), productController.updateProductById);

router.delete('/products/:id', authenticate, checkPermission("perm_delete_product"), productController.deleteProductById);

module.exports = router;