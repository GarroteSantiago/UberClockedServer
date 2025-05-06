const User = require('../../../models').User;
const catchAsync = require('../../../utils/catchAsync');
const NotFoundError = require("../../../errors/errorTypes/NotFoundError");
const ValidationError = require('../../../errors/errorTypes/ValidationError');
const ConflictError = require('../../../errors/errorTypes/ConflictError');
const multer = require("multer");
const upload = multer()
const passwordUtils = require('../../../utils/auth/passwordUtils');

exports.parseFormData = upload.none();

exports.createUser =catchAsync(async (req, res) => {
    const { role_id, name_tag, email, password } = req.body;

    if (!role_id || !name_tag || !email || !password) {
        throw new ValidationError(
            [
                {field: 'role_id', message: 'Role is required'},
                {field: 'name_tag', message: 'Name tag is required'},
                {field: 'email', message: 'E-mail is required'},
                {field: 'password', message: 'Password is required'},
            ],
            'Missing required fields'
        );
    }

    const existingEmail = await User.findOne({
        where: { email }
    })

    if (existingEmail) {
        throw new ConflictError(`User with this email already exists`, email);
    }

    const existingNameTag = await User.findOne({
        where: { name_tag }
    })

    if (existingNameTag) {
        throw new ConflictError(`User with this name tag already exists`, name_tag);
    }

    const hashedPassword = await passwordUtils.hashPassword(password);

    await User.create({
        role_id,
        name_tag,
        email,
        hashedPassword
    })

    res.status(201).json({
        status: 'Success',
        message: 'User successfully saved',
    })
});

exports.readUsers = catchAsync(async (req, res) => {
    const rows = await User.findAll();

    if (!rows || rows.length === 0) {
        throw new NotFoundError('Roles not found.');
    }

    res.status(200).json({
        status: 'success',
        results: rows.length,
        data: rows,
    });
})

exports.readUser = catchAsync(async (req, res) => {
    const id = req.params.id;
    const user = await User.findByPk(id);

    if (!user) {
        throw new NotFoundError(`User not found by id: ${id}`);
    }

    res.status(200).json({
        status: 'success',
        data: user,
    })

});

exports.updateUser = catchAsync(async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;

    if (!Number.isInteger(Number(id))) {
        throw new ValidationError([{
            field: 'id',
            message: 'User ID must be an integer'
        }])
    }

    if (Object.keys(updateData).length === 0) {
        throw new ValidationError([{
            field: 'body',
            message: 'No fields provided for update'
        }])
    }

    const validFields = ['role_id', 'name', 'name_tag', 'email', 'ubication', 'postal_code'];
    const invalidFields = Object.keys(updateData).filter(field => !(validFields.includes(field)));

    if (invalidFields.length > 0) {
        throw new ValidationError(
            invalidFields.map(field => ({
                field: {field},
                message: `Field ${field} is not updatable.`
            })),
        )
    }

    const user = await User.findByPk(id)
    if (!user) {
        throw new NotFoundError(`User ${id} not found.`);
    }

    const updatedUser = await user.update(updateData);

    res.status(200).json({
        status: 'success',
        data: updatedUser
    })
});

exports.deleteUser = catchAsync(async (req, res) => {
    const id = req.params.id;

    if (!Number.isInteger(Number(id))) {
        throw new ValidationError([{
            field: 'id',
            message: 'Role ID must be an integer'
        }])
    }

    const user = await User.findByPk(id)
    if (!user) {
        throw new NotFoundError(`User ${id} not found.`);
    }

    await user.destroy();

    res.status(200).json({
        status: 'success',
        message: 'User deleted.',
        data: id
    })
});