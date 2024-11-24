const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');
const authenticate = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

router.get('/address', authenticate, checkPermission("perm_read_shipment"), shippingController.getAllShippings);

router.get('/address/user/:user_id', authenticate, checkPermission("perm_read_shipment"), shippingController.getShippingsByUserId);

router.get('/address/:id', authenticate, checkPermission("perm_read_shipment"), shippingController.getShippingByById);

router.post('/address', authenticate, checkPermission("perm_create_shipment"), shippingController.createShipping);

router.put('/address/:id', authenticate, checkPermission("perm_update_shipment"), shippingController.updateShippingById);

router.delete('/address/:id', authenticate, checkPermission("perm_delete_shipment"), shippingController.deleteShippingById);

module.exports = router;