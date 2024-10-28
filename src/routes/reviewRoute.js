const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authenticate = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');

router.get('/reviews', authenticate, checkPermission("perm_read_category"), reviewController.getAllReviews);

router.get('/reviews/filter', authenticate, checkPermission("perm_read_category"), reviewController.filterReview);

router.get('/reviews/:id', authenticate, checkPermission("perm_read_product"), reviewController.getReviewByById);

router.post('/reviews', authenticate, checkPermission("perm_create_category"), reviewController.createReview);

router.put('/reviews/:id', authenticate, checkPermission("perm_update_category"), reviewController.updateReviewById);

router.delete('/reviews/:id', authenticate, checkPermission("perm_delete_category"), reviewController.deleteReviewById);

module.exports = router;