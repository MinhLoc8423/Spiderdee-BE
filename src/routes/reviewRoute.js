const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authenticate = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

router.get('/reviews', authenticate, checkPermission("perm_read_review"), reviewController.getAllReviews);

router.get('/reviews/filter', authenticate, checkPermission("perm_read_review"), reviewController.filterReview);

router.post('/reviews/order-detail', authenticate, checkPermission("perm_read_review"), reviewController.getReviewsByOrderDetailIds);

router.post('/reviews/product', authenticate, checkPermission("perm_read_review"), reviewController.getReviewByProductId);

router.get('/reviews/:id', authenticate, checkPermission("perm_read_review"), reviewController.getReviewByById);

router.post('/reviews', authenticate, checkPermission("perm_create_review"), reviewController.createReview);

router.put('/reviews/:id', authenticate, checkPermission("perm_update_review"), reviewController.updateReviewById);

router.delete('/reviews/:id', authenticate, checkPermission("perm_delete_review"), reviewController.deleteReviewById);

module.exports = router;