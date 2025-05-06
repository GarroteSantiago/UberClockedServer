const express = require('express');
const router = express.Router();
const controller = require('../controllers/componentsController');

// GET all components
router.get('/', controller.getAllComponents)
// GET a specific component through its id
router.get('/:id', controller.getComponent)
// POST a component
router.post('/', controller.createComponent)
// PATCH a component
router.patch('/:id', controller.updateComponent)
// DELETE a component
router.delete('/:id', controller.deleteComponent)

module.exports = router;