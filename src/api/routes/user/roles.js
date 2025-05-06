const express = require('express');
const router = express.Router();
const controller = require('../../controllers/user/roles');
const { verifyJWT, restrictTo } = require('../../middlewares/authMiddleware');

// Public Routes
// GET all roles
router.get('/', controller.readRoles);
// GET a specific role through its id
router.get('/:id', controller.readRole);

// Protected Routes
router.use(verifyJWT);
// POST a role
router.post('/', controller.parseFormData, restrictTo('admin'), controller.createRole);
// PATCH a role
router.patch('/:id', controller.parseFormData, restrictTo('admin'), controller.updateRole)
// DELETE a role
router.delete('/:id', restrictTo('admin'), controller.deleteRole)

module.exports = router;