const User = require('../../models').User;
const Role = require('../../models').Role;
const {generateToken} = require('../../utils/auth/generateToken');
const catchAsync = require('../../utils/catchAsync');
const NotFoundError = require("../../errors/errorTypes/NotFoundError");
const ValidationError = require('../../errors/errorTypes/ValidationError');
const UnauthorizedError = require('../../errors/errorTypes/UnauthorizedError');
const multer = require("multer");
const upload = multer()
const passwordUtils = require('../../utils/auth/passwordUtils');
const jwt = require('jose')

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

    const role = user.Role;
    const token = await generateToken(user.id, role);

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        domain: undefined
    })

    const userData = {
        id: user.id,
        email: user.email,
        name_tag: user.name_tag,
        Role: role,
    }

    res.status(200).json({
        success: true,
        user: userData,
    })
});

exports.deleteSession = catchAsync(async (req, res) =>  {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        domain: undefined
    })
    res.status(204).end();
});

exports.checkSession = catchAsync(async (req, res) => {
    const token = req.cookies.jwt;

    if (!token) {
        throw new UnauthorizedError('Not authenticated');
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwt.jwtVerify(token, secret);

    const user = await User.findByPk(payload.id, {
        attributes: { exclude: ['password'] },
        include: [{
            model: Role,
            attributes: ['name']
        }]
    });

    if (!user) {
        throw new UnauthorizedError('User does not exist');
    }

    res.status(200).json({
        user: user,
    })
})