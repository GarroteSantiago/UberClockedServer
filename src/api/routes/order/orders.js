const express = require('express');
const router = express.Router();
const Order = require("../../../models").Order;
const controller = require('../../controllers/order/orders');
const { checkOwnership } = require('../../middlewares/ownershipMiddleware');
const { verifyJWT, restrictTo } = require('../../middlewares/authMiddleware');

// Protected Routes
router.use(verifyJWT);
// GET all orders for a specific user
router.get('/', checkOwnership(Order), controller.readOrdersByUserId);
// GET all orders
router.get('/all', restrictTo("admin"), controller.readOrders);
// GET a specific order through its id
router.get('/:id', checkOwnership(Order), controller.readOrder);
// POST an order
router.post('/', restrictTo("user","admin"), controller.createOrder);
// PATCH an order
router.patch('/:id', restrictTo("admin"), controller.updateOrder);

module.exports = router;