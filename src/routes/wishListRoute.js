const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const authenticate = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

router.get('/wish-list', authenticate, checkPermission("perm_read_wishlist"), wishlistController.getAllWishlists);

router.get('/wish-list/user/:id', authenticate, checkPermission("perm_read_wishlist"), wishlistController.getWishlistsByUserId);

router.get('/wish-list/:id', authenticate, checkPermission("perm_read_wishlist"), wishlistController.getWishlistById);

router.post('/wish-list', authenticate, checkPermission("perm_create_wishlist"), wishlistController.createWishlist);

router.put('/wish-list/:id', authenticate, checkPermission("perm_update_wishlist"), wishlistController.updateWishlistById);

router.delete('/wish-list/:id', authenticate, checkPermission("perm_delete_wishlist"), wishlistController.deleteWishlistById);

module.exports = router;