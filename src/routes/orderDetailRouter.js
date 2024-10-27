const express = require('express');
const router = express.Router();
const orderDetailController = require('../controllers/orderDetailController');
const authenticate = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

router.get('/orderdetails', authenticate, checkPermission("perm_read_category"), orderDetailController.getAllOrderDetails);

router.get('/orderdetails/search', authenticate, checkPermission("perm_read_category"), orderDetailController.searchOrderDetails);

router.get('/orderdetails/:id', authenticate, checkPermission("perm_read_product"), orderDetailController.getOrderDetailByById);

router.post('/orderdetails', authenticate, checkPermission("perm_create_category"), orderDetailController.createOrderDetail);

router.put('/orderdetails/:id', authenticate, checkPermission("perm_update_category"), orderDetailController.updateOrderDetailById);

router.delete('/orderdetails/:id', authenticate, checkPermission("perm_delete_category"), orderDetailController.deleteOrderDetailById);

module.exports = router;