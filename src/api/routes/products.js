const express = require('express');
const router = express.Router();
const controller = require('../controllers/products');
const { verifyJWT, restrictTo } = require('../middlewares/authMiddleware');

// Public Routes
// GET all components
router.get('/', controller.readProducts)
// GET a specific component through its id
router.get('/:id', controller.readProduct)

// Protected Routes
router.use(verifyJWT);
// POST a component
router.post('/', controller.parseFormData, restrictTo('admin'), controller.createProduct);
// PATCH a component
router.patch('/:id', controller.parseFormData, restrictTo('admin'), controller.updateProduct)
// DELETE a component
router.delete('/:id', restrictTo('admin'), controller.deleteProduct)

module.exports = router;