const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authenticate = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

router.get('/categories', authenticate, checkPermission("perm_read_category"), categoryController.getAllCategories);

router.get('/categories/search', authenticate, checkPermission("perm_read_category"), categoryController.searchCategories);

router.get('/categories/:id', authenticate, checkPermission("perm_read_product"), categoryController.getCategoryById);

router.post('/categories', authenticate, checkPermission("perm_create_category"), categoryController.createCategory);

router.put('/categories/:id', authenticate, checkPermission("perm_update_category"), categoryController.updateCategoryById);

router.delete('/categories/:id', authenticate, checkPermission("perm_delete_category"), categoryController.deleteCategoryById);

module.exports = router;