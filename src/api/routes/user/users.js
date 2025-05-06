const express = require('express');
const router = express.Router();
const controller = require('../../controllers/user/users');
const { verifyJWT, restrictTo } = require('../../middlewares/authMiddleware');

// Public Routes
// POST a user
router.post('/', controller.parseFormData, controller.createUser);

// Protected Routes
router.use(verifyJWT);

// Personal use routes
// GET a personal specific user
router.get('/me', controller.readUser);
// PATCH personal user
router.patch('/me', controller.parseFormData, controller.updateUser)
// DELETE personal user
router.delete('/me', controller.deleteUser)

// Admin-only routes
router.use(restrictTo('admin'));
// GET all users
router.get('/', controller.readUsers);
// GET a specific user through its id
router.get('/:id', controller.readUser);
// PATCH a user
router.patch('/:id', controller.parseFormData, controller.updateUser)
// DELETE a user
router.delete('/:id', controller.deleteUser)

module.exports = router;