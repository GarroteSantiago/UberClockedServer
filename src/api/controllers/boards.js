'use strict';

const { Board, User, BoardInterestedUsers } = require('../../models');
const catchAsync = require('../../utils/catchAsync');
const NotFoundError = require('../../errors/errorTypes/NotFoundError');
const ValidationError = require('../../errors/errorTypes/ValidationError');
const ConflictError = require('../../errors/errorTypes/ConflictError');
const multer = require("multer");
const upload = multer();

exports.parseFormData = upload.none();

// CREATE
exports.createBoard = catchAsync(async (req, res) => {
    const { title, description } = req.body;
    const owner_id = req.user.id;

    if (!title) {
        throw new ValidationError(
            [
                { field: 'title', message: 'Title is required' },
                { field: 'description', message: 'Description is required' }
            ],
            'Missing required fields'
        );
    }

    const board = await Board.create({
        title,
        description,
        owner_id,
        is_available: true
    });

    res.status(201).json({ status: 'success', data: board });
});

exports.createBoardInterest = catchAsync(async (req, res) => {
    const { board_id } = req.body;
    const userId = req.user.id;

    const board = await Board.findByPk(board_id);
    if (!board) throw new NotFoundError('Board not found');

    const exists = await BoardInterestedUsers.findOne({
        where: { user_id: userId, board_id }
    });
    if (exists) throw new ConflictError('Interest already registered');

    await BoardInterestedUsers.create({ user_id: userId, board_id });

    res.status(201).json({ status: 'success', message: 'Interest registered' });
});

// READ
exports.getAllBoards = catchAsync(async (req, res) => {
    const boards = await Board.findAll();
    res.status(200).json({ status: 'success', results: boards.length, data: boards });
});

exports.getBoardById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const board = await Board.findByPk(id);
    if (!board) throw new NotFoundError('Board not found');

    res.status(200).json({ status: 'success', data: board });
});

exports.getBoardInterestedUsers = catchAsync(async (req, res) => {
    const { board_id } = req.params;
    const board = await Board.findByPk(board_id, {
        include: [{ model: User, as: 'interested_users' }]
    });
    if (!board) throw new NotFoundError('Board not found');

    res.status(200).json({ status: 'success', data: board.interested_users });
});

exports.getMyBoards = catchAsync(async (req, res) => {
    const myBoards = await Board.findAll({ where: { owner_id: req.user.id } });
    res.status(200).json({ status: 'success', results: myBoards.length, data: myBoards });
});

// UPDATE
exports.updateBoard = catchAsync(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const board = await Board.findByPk(id);
    if (!board) throw new NotFoundError('Board not found');

    const validFields = ['title', 'description', 'is_available'];
    const invalidFields = Object.keys(updateData).filter(f => !validFields.includes(f));

    if (invalidFields.length > 0) {
        throw new ValidationError(
            invalidFields.map(f => ({ field: f, message: `Field ${f} is not updatable.` }))
        );
    }

    await board.update(updateData);
    res.status(200).json({ status: 'success', data: board });
});

// DELETE
exports.deleteBoardInterest = catchAsync(async (req, res) => {
    const { board_id } = req.params;
    const user_id = req.user.id;

    const interest = await BoardInterestedUsers.findOne({
        where: { board_id, user_id }
    });

    if (!interest) throw new NotFoundError('Interest not found');
    await interest.destroy();

    res.status(200).json({ status: 'success', message: 'Interest removed' });
});

exports.deleteBoard = catchAsync(async (req, res) => {
    const { id } = req.params;
    const board = await Board.findByPk(id);
    if (!board) throw new NotFoundError('Board not found');
    if (board.owner_id !== req.user.id) throw new ValidationError([{ field: 'owner', message: 'Not owner of board' }]);

    await board.destroy();
    res.status(200).json({ status: 'success', message: 'Board deleted' });
});
