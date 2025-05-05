const component = require('../../models').Component;
const { DatabaseError, ServerError } = require('../../errors/errorTypes/');
const catchAsync = require('../../utils/catchAsync');
const NotFoundError = require("../../errors/errorTypes/NotFoundError");
const {ValidationError} = require('../../errors/errorTypes/ValidationError');
const {ConflictError} = require('../../errors/errorTypes/ConflictError');
const {errors} = require("jose");

exports.getAllComponents = catchAsync(async (req, res) => {
    const [rows] = await component.findAll();

    if (!rows || !rows.length) {
        throw new NotFoundError('Components not found.');
    }

    res.status(200).json({
        status: 'success',
        results: rows.length,
        data: rows,
    });
})
exports.getComponent =catchAsync((req, res) => async (req, res) => {
    const id = req.params.id;
    const component = await component.findByPk(id);

    if (!component) {
        throw new NotFoundError(`Component not found by id: ${id}`);
    }

    res.status(200).json({
        status: 'success',
        data: { component },
    })

});
exports.createComponent =catchAsync(async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        throw new ValidationError(
            [
                {field: 'name', message: 'Name is required'},
                {field: 'description', message: 'Description is required'},
            ]
        );
    }

    const [existing] = await component.findOne({
        where: { name }
    })

    if (existing) {
        throw new ConflictError(`Component name`, name);
    }

    const newComponent = await component.create({
        name: {name},
        description: {description},
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

    if (!invalidFields.length) {
        throw new ValidationError(
            invalidFields.map(field => ({
                field: {field},
                message: `Field ${field} is not updatable.`
            })),
        )
    }

    const [component] = await component.findByPk(id)
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

    const component = await component.findByPk(id)
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