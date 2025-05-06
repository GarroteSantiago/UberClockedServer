const express = require('express');
const router = express.Router();
const controller = require('../../controllers/ubication/ubications');
const { verifyJWT, restrictTo } = require('../../middlewares/authMiddleware');

// Public Routes
// GET all ubications
router.get('/', controller.readUbications)
// GET a specific ubication through its id
router.get('/:id', controller.readUbication)

// Protected Routes
router.use(verifyJWT);
// POST an ubication
router.post('/', controller.parseFormData, restrictTo('admin'), controller.createUbication);
// DELETE a ubication
router.delete('/:id', restrictTo('admin'), controller.deleteUbication);

module.exports = router;