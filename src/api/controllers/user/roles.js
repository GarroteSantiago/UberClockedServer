const Role = require('../../../models').Role;
const catchAsync = require('../../../utils/catchAsync');
const NotFoundError = require("../../../errors/errorTypes/NotFoundError");
const ValidationError = require('../../../errors/errorTypes/ValidationError');
const ConflictError = require('../../../errors/errorTypes/ConflictError');
const multer = require("multer");
const upload = multer()

exports.parseFormData = upload.none();

exports.createRole =catchAsync(async (req, res) => {
    const { name } = req.body;

    if (!name) {
        throw new ValidationError(
            [
                {field: 'name', message: 'Name is required'},
            ],
            'Missing required fields'
        );
    }

    const existing = await Role.findOne({
        where: { name }
    })

    if (existing) {
        throw new ConflictError(`Role already exists`, name);
    }

    const newRole = await Role.create({
        name,
    })

    res.status(201).json({
        status: 'success',
        data: { newRole }
    })
});

exports.readRoles = catchAsync(async (req, res) => {
    const rows = await Role.findAll();

    if (!rows || rows.length === 0) {
        throw new NotFoundError('Roles not found.');
    }

    res.status(200).json({
        status: 'success',
        results: rows.length,
        data: rows,
    });
})

exports.readRole = catchAsync(async (req, res) => {
    const id = req.params.id;
    const role = await Role.findByPk(id);

    if (!role) {
        throw new NotFoundError(`Role not found by id: ${id}`);
    }

    res.status(200).json({
        status: 'success',
        data: { componentItem: role },
    })

});

exports.updateRole = catchAsync(async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;

    if (!Number.isInteger(Number(id))) {
        throw new ValidationError([{
            field: 'id',
            message: 'Role ID must be an integer'
        }])
    }

    if (Object.keys(updateData).length === 0) {
        throw new ValidationError([{
            field: 'body',
            message: 'No fields provided for update'
        }])
    }

    const validFields = ['name'];
    const invalidFields = Object.keys(updateData).filter(field => !(validFields.includes(field)));

    if (invalidFields.length > 0) {
        throw new ValidationError(
            invalidFields.map(field => ({
                field: {field},
                message: `Field ${field} is not updatable.`
            })),
        )
    }

    const role = await Role.findByPk(id)
    if (!role) {
        throw new NotFoundError(`Role ${id} not found.`);
    }

    const updatedRole = await role.update(updateData);

    res.status(200).json({
        status: 'success',
        data: updatedRole
    })
});

exports.deleteRole = catchAsync(async (req, res) => {
    const id = req.params.id;

    if (!Number.isInteger(Number(id))) {
        throw new ValidationError([{
            field: 'id',
            message: 'Role ID must be an integer'
        }])
    }

    const role = await Role.findByPk(id)
    if (!role) {
        throw new NotFoundError(`Role ${id} not found.`);
    }

    await role.destroy();

    res.status(200).json({
        status: 'success',
        message: 'Role deleted.',
        data: { id }
    })
});