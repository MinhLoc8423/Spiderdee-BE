const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');
const authenticate = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

router.get('/shipping', authenticate, checkPermission("perm_read_category"), shippingController.getAllShippings);

router.get('/shipping/user/:id', authenticate, checkPermission("perm_read_category"), shippingController.getShippingsByUserId);

router.get('/shipping/:id', authenticate, checkPermission("perm_read_product"), shippingController.getShippingByById);

router.post('/shipping', authenticate, checkPermission("perm_create_category"), shippingController.createShipping);

router.put('/shipping/:id', authenticate, checkPermission("perm_update_category"), shippingController.updateShippingById);

router.delete('/shipping/:id', authenticate, checkPermission("perm_delete_category"), shippingController.deleteShippingById);

module.exports = router;