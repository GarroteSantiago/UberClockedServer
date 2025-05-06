const Province = require('../../../models').Province;
const catchAsync = require('../../../utils/catchAsync');
const NotFoundError = require("../../../errors/errorTypes/NotFoundError");
const ValidationError = require('../../../errors/errorTypes/ValidationError');
const ConflictError = require('../../../errors/errorTypes/ConflictError');
const multer = require("multer");
const upload = multer()

exports.parseFormData = upload.none();

exports.createProvince =catchAsync(async (req, res) => {
    const { name } = req.body;

    if (!name) {
        throw new ValidationError(
            [
                {field: 'name', message: 'Name is required'},
            ],
            'Missing required fields'
        );
    }

    const existing = await Province.findOne({
        where: { name }
    })

    if (existing) {
        throw new ConflictError(`Province name already exists`, name);
    }

    const newProvince = await Province.create({
        name,
    })

    res.status(201).json({
        status: 'success',
        data: { newProvince }
    })
});

exports.readProvinces = catchAsync(async (req, res) => {
    const rows = await Province.findAll();

    if (!rows || rows.length === 0) {
        throw new NotFoundError('Provinces not found.');
    }

    res.status(200).json({
        status: 'success',
        results: rows.length,
        data: rows,
    });
})

exports.readProvince = catchAsync(async (req, res) => {
    const id = req.params.id;
    const province = await Province.findByPk(id);

    if (!province) {
        throw new NotFoundError(`Province not found by id: ${id}`);
    }

    res.status(200).json({
        status: 'success',
        data: { componentItem: province },
    })

});

exports.updateProvince = catchAsync(async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;

    if (!Number.isInteger(Number(id))) {
        throw new ValidationError([{
            field: 'id',
            message: 'Province ID must be an integer'
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

    const province = await Province.findByPk(id)
    if (!province) {
        throw new NotFoundError(`Province ${id} not found.`);
    }

    const updatedProvince = await province.update(updateData);

    res.status(200).json({
        status: 'success',
        data: updatedProvince
    })
});

exports.deleteProvince = catchAsync(async (req, res) => {
    const id = req.params.id;

    if (!Number.isInteger(Number(id))) {
        throw new ValidationError([{
            field: 'id',
            message: 'Province ID must be an integer'
        }])
    }

    const province = await Province.findByPk(id)
    if (!province) {
        throw new NotFoundError(`Province ${id} not found.`);
    }

    await province.destroy();

    res.status(200).json({
        status: 'success',
        message: 'Province deleted.',
        data: { id }
    })
});