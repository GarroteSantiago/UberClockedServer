const Component = require('../../models').Component;
const catchAsync = require('../../utils/catchAsync');
const NotFoundError = require("../../errors/errorTypes/NotFoundError");
const ValidationError = require('../../errors/errorTypes/ValidationError');
const ConflictError = require('../../errors/errorTypes/ConflictError');
const {errors} = require("jose");
const multer = require("multer");
const upload = multer()

exports.getAllComponents = catchAsync(async (req, res) => {
    const rows = await Component.findAll();

    if (!rows || rows.length === 0) {
        throw new NotFoundError('Components not found.');
    }

    res.status(200).json({
        status: 'success',
        results: rows.length,
        data: rows,
    });
})

exports.getComponent = catchAsync(async (req, res) => {
    const id = req.params.id;
    const component = await Component.findByPk(id);

    if (!component) {
        throw new NotFoundError(`Component not found by id: ${id}`);
    }

    res.status(200).json({
        status: 'success',
        data: { componentItem: component },
    })

});

exports.parseFormData = upload.none();
exports.createComponent =catchAsync(async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        throw new ValidationError(
            [
                {field: 'name', message: 'Name is required'},
                {field: 'description', message: 'Description is required'},
            ],
            'Missing required fields'
        );
    }

    const existing = await Component.findOne({
        where: { name }
    })

    if (existing) {
        throw new ConflictError(`Component name`, name);
    }

    const newComponent = await Component.create({
        name,
        description,
    })

    res.status(201).json({
        status: 'success',
        data: { newComponent }
    })
});

exports.updateComponent = catchAsync(async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;

    if (!Number.isInteger(Number(id))) {
        throw new ValidationError([{
            field: 'id',
            message: 'Component ID must be an integer'
        }])
    }

    if (Object.keys(updateData).length === 0) {
        throw new ValidationError([{
            field: 'body',
            message: 'No fields provided for update'
        }])
    }

    const validFields = ['name', 'description'];
    const invalidFields = Object.keys(updateData).filter(field => !validFields.includes(field));

    if (invalidFields.length > validFields.length) {
        throw new ValidationError(
            invalidFields.map(field => ({
                field: {field},
                message: `Field ${field} is not updatable.`
            })),
        )
    }

    const component = await Component.findByPk(id)
    if (!component) {
        throw new NotFoundError(`Component ${id} not found.`);
    }

    const updatedComponent = await component.update(updateData);

    res.status(200).json({
        status: 'success',
        data: updatedComponent
    })
});

exports.deleteComponent = catchAsync(async (req, res) => {
    const id = req.params.id;

    if (!Number.isInteger(Number(id))) {
        throw new ValidationError([{
            field: 'id',
            message: 'Component ID must be an integer'
        }])
    }

    const component = await Component.findByPk(id)
    if (!component) {
        throw new NotFoundError(`Component ${id} not found.`);
    }

    await component.destroy();

    res.status(200).json({
        status: 'success',
        message: 'Component deleted.',
        data: { id }
    })
});