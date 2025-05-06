const express = require('express');
const router = express.Router();
const controller = require('../../controllers/ubication/provinces');
const { verifyJWT, restrictTo } = require('../../middlewares/authMiddleware');

// Public Routes
// GET all provinces
router.get('/', controller.readProvinces)
// GET a specific province through its id
router.get('/:id', controller.readProvince)

// Protected Routes
router.use(verifyJWT);
// POST a province
router.post('/', controller.parseFormData, restrictTo('admin'), controller.createProvince);
// PATCH a province
router.patch('/:id', controller.parseFormData, restrictTo('admin'), controller.updateProvince)
// DELETE a province
router.delete('/:id', restrictTo('admin'), controller.deleteProvince)

module.exports = router;