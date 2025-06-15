const express = require('express');
const router = express.Router();
const controller = require('../../controllers/order/statuses');
const { verifyJWT, restrictTo } = require('../../middlewares/authMiddleware');

// Protected Routes
router.use(verifyJWT);
// GET all orders
router.get('/', restrictTo("admin"), controller.readStatuses);

module.exports = router;