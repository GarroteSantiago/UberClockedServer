const express = require('express');
const router = express.Router();
const controller = require('../../controllers/user/users');
const { verifyJWT, restrictTo } = require('../../middlewares/authMiddleware');

// Public Routes
// POST a user
router.post('/', controller.parseFormData, controller.createUser);
// Protected Routes
router.use(verifyJWT);
router.get('/', restrictTo('admin'), controller.readUsers);
// GET a specific user through its id
router.get('/:id', controller.readUser);
// PATCH a user
router.patch('/:id', controller.parseFormData, restrictTo('admin'), controller.updateUser)
// DELETE a user
router.delete('/:id', controller.deleteUser)

module.exports = router;