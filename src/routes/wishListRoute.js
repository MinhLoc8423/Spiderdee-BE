const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const authenticate = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

router.get('/wish-list', authenticate, checkPermission("perm_read_category"), wishlistController.getAllWishlists);

router.get('/wish-list/user/:id', authenticate, checkPermission("perm_read_category"), wishlistController.getWishlistsByUserId);

router.get('/wish-list/:id', authenticate, checkPermission("perm_read_product"), wishlistController.getWishlistById);

router.post('/wish-list', authenticate, checkPermission("perm_create_category"), wishlistController.createWishlist);

router.put('/wish-list/:id', authenticate, checkPermission("perm_update_category"), wishlistController.updateWishlistById);

router.delete('/wish-list/:id', authenticate, checkPermission("perm_delete_category"), wishlistController.deleteWishlistById);

module.exports = router;