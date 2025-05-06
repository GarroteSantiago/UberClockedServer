const express = require('express');
const router = express.Router();
const controller = require('../../controllers/ubication/countries');
const { verifyJWT, restrictTo } = require('../../middlewares/authMiddleware');

// Public Routes
// GET all countries
router.get('/', controller.readCountries)
// GET a specific country through its id
router.get('/:id', controller.readCountry)

// Protected Routes
router.use(verifyJWT);
// POST a component
router.post('/', controller.parseFormData, restrictTo('admin'), controller.createCountry);
// PATCH a component
router.patch('/:id', controller.parseFormData, restrictTo('admin'), controller.updateCountry)
// DELETE a component
router.delete('/:id', restrictTo('admin'), controller.deleteCountry)

module.exports = router;