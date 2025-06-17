const express = require('express');
const router = express.Router();
const Board = require("../../models").Board;
const controller = require('../controllers/boards');
const { checkOwnership } = require('../middlewares/ownershipMiddleware');
const { verifyJWT } = require('../middlewares/authMiddleware');

// Protected Routes
router.use(verifyJWT);

// GET my boards – debe ir antes que '/:id'
router.get('/me', controller.getMyBoards);

// GET all boards
router.get('/', controller.getAllBoards);

// GET a specific board
router.get('/:id', controller.getBoardById);

// GET all interested users of a board
router.get('/:id/interested-users', controller.getBoardInterestedUsers);

// POST a board
router.post('/', controller.parseFormData, controller.createBoard);

// POST interest in a board (relate current user to a board)
router.post('/:board_id/interested-users', controller.createBoardInterest);

// PATCH a board
router.patch('/:id', checkOwnership(Board), controller.parseFormData, controller.updateBoard);

// DELETE a board
router.delete('/:id', checkOwnership(Board), controller.deleteBoard);

// DELETE interest of current user in a board
router.delete('/:board_id/interested-users', controller.deleteBoardInterest);


module.exports = router;
