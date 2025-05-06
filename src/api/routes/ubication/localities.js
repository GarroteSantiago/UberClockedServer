const express = require('express');
const router = express.Router();
const controller = require('../../controllers/ubication/localities');
const { verifyJWT, restrictTo } = require('../../middlewares/authMiddleware');

// Public Routes
// GET all localities
router.get('/', controller.readLocalities)
// GET a specific locality through its id
router.get('/:id', controller.readLocality)

// Protected Routes
router.use(verifyJWT);
// POST a locality
router.post('/', controller.parseFormData, restrictTo('admin'), controller.createLocality);
// PATCH a locality
router.patch('/:id', controller.parseFormData, restrictTo('admin'), controller.updateLocality)
// DELETE a locality
router.delete('/:id', restrictTo('admin'), controller.deleteLocality)

module.exports = router;