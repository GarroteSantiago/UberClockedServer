const express = require('express');
const router = express.Router();
const controller = require('../controllers/authentication');
const { verifyJWT, restrictTo } = require('../middlewares/authMiddleware');

// Public Routes
// POST authentication credentials to create a session
router.post('/token', controller.parseFormData, controller.createSession);
router.get('/me', controller.checkSession)
// Private Routes
router.use(verifyJWT);
// POST a JWT Token to delete session
router.post('/', controller.parseFormData, controller.deleteSession);

module.exports = router;