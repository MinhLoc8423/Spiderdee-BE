const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');
const authenticate = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

router.get('/address', authenticate, checkPermission("perm_read_category"), shippingController.getAllShippings);

router.get('/address/user/:id', authenticate, checkPermission("perm_read_category"), shippingController.getShippingsByUserId);

router.get('/address/:id', authenticate, checkPermission("perm_read_product"), shippingController.getShippingByById);

router.post('/address', authenticate, checkPermission("perm_create_category"), shippingController.createShipping);

router.put('/address/:id', authenticate, checkPermission("perm_update_category"), shippingController.updateShippingById);

router.delete('/address/:id', authenticate, checkPermission("perm_delete_category"), shippingController.deleteShippingById);

module.exports = router;