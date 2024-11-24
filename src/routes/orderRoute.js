const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticate = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

router.get('/orders', authenticate, checkPermission("perm_read_order"), orderController.getAllOrders);

router.get('/orders/filter', authenticate, checkPermission("perm_read_order"), orderController.filterOrders);

router.get('/orders/:id', authenticate, checkPermission("perm_read_order"), orderController.getOrderByById);

router.post('/orders', authenticate, checkPermission("perm_create_order"), orderController.createOrder);

router.put('/orders/status/:id', authenticate, checkPermission("perm_update_order"), orderController.updateOrderStatus);

router.put('/orders/:id', authenticate, checkPermission("perm_update_order"), orderController.updateOrderById);

router.delete('/orders/:id', authenticate, checkPermission("perm_delete_order"), orderController.deleteOrderById);

module.exports = router;