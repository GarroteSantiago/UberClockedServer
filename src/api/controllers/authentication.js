const User = require('../../models').User;
const {generateToken} = require('../../utils/auth/generateToken');
const catchAsync = require('../../utils/catchAsync');
const NotFoundError = require("../../errors/errorTypes/NotFoundError");
const ValidationError = require('../../errors/errorTypes/ValidationError');
const multer = require("multer");
const BadRequestError = require("../../errors/errorTypes/BadRequestError");
const upload = multer()

exports.parseFormData = upload.none();
exports.createSession = catchAsync(async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password ) {
        throw new ValidationError(
            [
                {field: 'name', message: 'Name is required'},
                {field: 'password', message: 'Password is required'},
            ],
            'Missing required fields'
        );
    }

    const user = await User.findOne({
        where: {
            name: name,
            password: password,
        }
    })

    if (!user) {
        throw new NotFoundError('No user with those credentials.');
    }

    const token = await generateToken(user, 'admin');

    res.status(200).json({
        success: true,
        token: token
    })
});
exports.deleteSession = catchAsync(async (req, res) => {
    throw new BadRequestError("Server-side token invalidation not implemented. Client must delete the token manually. Use short-lived tokens for security.");
});
