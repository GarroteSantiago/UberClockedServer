const express = require('express');
const router = express.Router();
const controller = require('../controllers/reviews');
const { verifyJWT, restrictTo } = require('../middlewares/authMiddleware');

// Public Routes
// GET all reviews
router.get('/', controller.readReviews);
// GET all reviews for a specific product
router.get('/product/:product_id', controller.getReviewsByProductId);
// GET a specific review by ID
router.get('/:id', controller.readReview);

// Protected Routes (requires login)
router.use(verifyJWT);

// Personal review actions
// GET all reviews by the current user
router.get('/me/all', controller.readMyReviews);
// GET specific review made by the current user on a product
router.get('/me/:product_id', controller.readMyReview);
// POST a new review
router.post('/', controller.parseFormData, controller.createReview);
// PATCH a review made by the current user
router.patch('/me/:product_id', controller.parseFormData, controller.updateReview);
// DELETE a review made by the current user
router.delete('/me/:product_id', controller.deleteMyReview);

// Admin-only routes
router.use(restrictTo('admin'));
// DELETE any review by ID
router.delete('/:id', controller.deleteReview);

module.exports = router;
