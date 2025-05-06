const Locality = require('../../../models').Locality;
const catchAsync = require('../../../utils/catchAsync');
const NotFoundError = require("../../../errors/errorTypes/NotFoundError");
const ValidationError = require('../../../errors/errorTypes/ValidationError');
const ConflictError = require('../../../errors/errorTypes/ConflictError');
const multer = require("multer");
const upload = multer()

exports.parseFormData = upload.none();

exports.createLocality =catchAsync(async (req, res) => {
    const { name } = req.body;

    if (!name) {
        throw new ValidationError(
            [
                {field: 'name', message: 'Name is required'},
            ],
            'Missing required fields'
        );
    }

    const existing = await Locality.findOne({
        where: { name }
    })

    if (existing) {
        throw new ConflictError(`Locality name already exists`, name);
    }

    const newLocality = await Locality.create({
        name,
    })

    res.status(201).json({
        status: 'success',
        data: { newLocality }
    })
});

exports.readLocalities = catchAsync(async (req, res) => {
    const rows = await Locality.findAll();

    if (!rows || rows.length === 0) {
        throw new NotFoundError('Localities not found.');
    }

    res.status(200).json({
        status: 'success',
        results: rows.length,
        data: rows,
    });
})

exports.readLocality = catchAsync(async (req, res) => {
    const id = req.params.id;
    const locality = await Locality.findByPk(id);

    if (!locality) {
        throw new NotFoundError(`Locality not found by id: ${id}`);
    }

    res.status(200).json({
        status: 'success',
        data:  locality,
    })

});

exports.updateLocality = catchAsync(async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;

    if (!Number.isInteger(Number(id))) {
        throw new ValidationError([{
            field: 'id',
            message: 'Locality ID must be an integer'
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

    const locality = await Locality.findByPk(id)
    if (!locality) {
        throw new NotFoundError(`Locality ${id} not found.`);
    }

    const updatedLocality = await locality.update(updateData);

    res.status(200).json({
        status: 'success',
        data: updatedLocality
    })
});

exports.deleteLocality = catchAsync(async (req, res) => {
    const id = req.params.id;

    if (!Number.isInteger(Number(id))) {
        throw new ValidationError([{
            field: 'id',
            message: 'Country ID must be an integer'
        }])
    }

    const country = await Locality.findByPk(id)
    if (!country) {
        throw new NotFoundError(`Country ${id} not found.`);
    }

    await country.destroy();

    res.status(200).json({
        status: 'success',
        message: 'Country deleted.',
        data: { id }
    })
});