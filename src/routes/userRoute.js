const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

router.get('/users', authenticate, checkPermission("perm_read_user"), userController.getAllUsers);

router.get('/users/:id', authenticate, checkPermission("perm_read_user"), userController.getUserById);

router.post('/users', authenticate, checkPermission("perm_create_user"), userController.createUser);

router.put('/users/:id', authenticate, checkPermission("perm_update_user"), userController.updateUser);

router.delete('/users/:id', authenticate, checkPermission("perm_delete_user"), userController.deleteUser);

module.exports = router;