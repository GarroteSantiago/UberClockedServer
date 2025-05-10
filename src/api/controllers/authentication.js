const User = require('../../models').User;
const {generateToken} = require('../../utils/auth/generateToken');
const catchAsync = require('../../utils/catchAsync');
const NotFoundError = require("../../errors/errorTypes/NotFoundError");
const ValidationError = require('../../errors/errorTypes/ValidationError');
const multer = require("multer");
const BadRequestError = require("../../errors/errorTypes/BadRequestError");
const upload = multer()
const passwordUtils = require('../../utils/auth/passwordUtils');

exports.parseFormData = upload.none();

exports.createSession = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password ) {
        throw new ValidationError(
            [
                {field: 'email', message: 'E-mail is required'},
                {field: 'password', message: 'Password is required'},
            ],
            'Missing required fields'
        );
    }

    const user = await User.findOne({
        where: { email },
        include: [{
            model: Role,
            attributes: ['name']
        }]
    });

    const isPasswordCorrect = await passwordUtils.verifyPassword(password, user.password);

    if (!user || !isPasswordCorrect) {
        throw new NotFoundError('No user with those credentials.');
    }

    const role = user.Role.name;
    const token = await generateToken(user.id, role);

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS in production
        sameSite: process.env.NODE_ENV === 'development' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        domain: process.env.NODE_ENV === 'production' ? 'yourDomain.com' : undefined
    })

    const userData = {
        id: user.id,
        email: user.email,
        name_tag: user.name_tag,
        role: role,
    }

    res.status(200).json({
        success: true,
        user: userData,
    })
});

exports.deleteSession = catchAsync(async (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS in production
        sameSite: process.env.NODE_ENV === 'development' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        domain: process.env.NODE_ENV === 'production' ? 'yourDomain.com' : undefined
    });
    res.status(204).end();
});