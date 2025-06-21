const express = require('express');
const router = express.Router();
const controller = require('../controllers/generics');
const { verifyJWT, restrictTo } = require('../middlewares/authMiddleware');

// Public Routes

// GET all the necessary fields for a model type
router.get('/:model_name/fields', controller.readFields);

module.exports = router;