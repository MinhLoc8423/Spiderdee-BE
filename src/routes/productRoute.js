const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticate = require('../middlewares/authMiddleware');

router.get('/products', authenticate, productController.getAllProducts);

<<<<<<< Updated upstream
router.get('/products/:id', authenticate, productController.getProductById);
=======
router.get('/products/search', authenticate, checkPermission("perm_read_product"), productController.searchProducts);

router.get('/products/:id', authenticate, checkPermission("perm_read_product"), productController.getProductById);
>>>>>>> Stashed changes

router.post('/products', authenticate, productController.createProduct);

router.put('/products/:id', authenticate, productController.updateProductById);

router.delete('/products/:id', authenticate, productController.deleteProductById);

module.exports = router;