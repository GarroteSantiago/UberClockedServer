const User = require('../../../models').User;
const catchAsync = require('../../../utils/catchAsync');
const NotFoundError = require("../../../errors/errorTypes/NotFoundError");
const ValidationError = require('../../../errors/errorTypes/ValidationError');
const ConflictError = require('../../../errors/errorTypes/ConflictError');
const ForbiddenError = require('../../../errors/errorTypes/ForbiddenError');
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

    if (role_id === process.env.ADMIN_ROLE_ID && req.user?.role !== 'admin') {
        throw new ForbiddenError('Only admins can create admin users');
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
        password: hashedPassword
    })

    res.status(201).json({
        status: 'Success',
        message: 'User successfully saved',
    })
});

exports.readUsers = catchAsync(async (req, res) => {

    const rows = await User.findAll({
        attributes: { exclude: ['password'] }
    });

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
    const id = req.params.id || req.user.id;

    // If it's trying to see another user and it's not admin
    if (id !== req.user.id && req.user.role !== 'admin') {
        throw new ForbiddenError('You can only view your own profile, only admins can see other users');
    }

    const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
    });

    if (!user) {
        throw new NotFoundError(`User not found`);
    }

    res.status(200).json({
        status: 'success',
        data: user,
    })

});

exports.updateUser = catchAsync(async (req, res) => {
    const id = req.params.id || req.user.id;
    const updateData = req.body;

    if (!Number.isInteger(Number(id))) {
        throw new ValidationError([{
            field: 'id',
            message: 'User ID must be an integer'
        }])
    }

    // Non-admins can only update themselves
    if (id !== req.user.id && req.user.role !== 'admin') {
        throw new ForbiddenError('You can only update your own profile');

    }

    // Prevent role escalation
    if (updateData.role_id && req.user.role !== 'admin') {
        throw new ForbiddenError('Only admins can change roles');

    }

    // Check for unique email
    if (updateData.email) {
        const existing = await User.findOne({ where: { email: updateData.email } });
        if (existing && existing.id !== id) {
            throw new ConflictError('Email already in use');
        }
    }

    // Check for unique name_tag
    if (updateData.name_tag) {
        const existing = await User.findOne({ where: { name_tag: updateData.name_tag } });
        if (existing && existing.id !== id) {
            throw new ConflictError('Name tag already in use');
        }
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
    const id = req.params.id || req.user.id;

    if (!Number.isInteger(Number(id))) {
        throw new ValidationError([{
            field: 'id',
            message: 'Role ID must be an integer'
        }])
    }

    // Non-admins can only delete themselves
    if (id !== req.user.id && req.user.role !== 'admin') {
        throw new ForbiddenError('You can only delete your own account');
    }



    const user = await User.findByPk(id)
    if (!user) {
        throw new NotFoundError(`User ${id} not found.`);
    }

    if (user.role_id === process.env.ADMIN_ROLE_ID) {
        const adminCount = await User.count({ where: { role_id: process.env.ADMIN_ROLE_ID } });
        if (adminCount <= 1) {
            throw new ForbiddenError('Cannot delete last admin');
        }
    }

    await user.destroy();

    res.status(200).json({
        status: 'success',
        message: 'User deleted.',
        data: id
    })
});