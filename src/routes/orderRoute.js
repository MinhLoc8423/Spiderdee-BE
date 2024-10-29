const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticate = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

router.get('/orders', authenticate, checkPermission("perm_read_category"), orderController.getAllOrders);

router.get('/orders/filter', authenticate, checkPermission("perm_read_category"), orderController.filterOrders);

router.get('/orders/:id', authenticate, checkPermission("perm_read_product"), orderController.getOrderByById);

router.post('/orders', authenticate, checkPermission("perm_create_category"), orderController.createOrder);

router.put('/orders/:id', authenticate, checkPermission("perm_update_category"), orderController.updateOrderById);

router.put('/orders/:id/status', authenticate, checkPermission("perm_update_category"), orderController.updateOrderStatus);

router.delete('/orders/:id', authenticate, checkPermission("perm_delete_category"), orderController.deleteOrderById);

module.exports = router;