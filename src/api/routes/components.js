const express = require('express');
const router = express.Router();
const controller = require('../controllers/components');
const { verifyJWT, restrictTo } = require('../middlewares/authMiddleware');

// Public Routes
// GET all components
router.get('/', controller.readComponents)
// GET a specific component through its id
router.get('/:id', controller.readComponent)

// Protected Routes
router.use(verifyJWT);
// POST a component
router.post('/', controller.parseFormData, restrictTo('admin'), controller.createComponent);
// PATCH a component
router.patch('/:id', controller.parseFormData, restrictTo('admin'), controller.updateComponent)
// DELETE a component
router.delete('/:id', restrictTo('admin'), controller.deleteComponent)

module.exports = router;