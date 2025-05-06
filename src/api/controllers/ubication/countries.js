const Country = require('../../../models').Country;
const catchAsync = require('../../../utils/catchAsync');
const NotFoundError = require("../../../errors/errorTypes/NotFoundError");
const ValidationError = require('../../../errors/errorTypes/ValidationError');
const ConflictError = require('../../../errors/errorTypes/ConflictError');
const multer = require("multer");
const upload = multer()

exports.parseFormData = upload.none();

exports.createCountry =catchAsync(async (req, res) => {
    const { name } = req.body;

    if (!name) {
        throw new ValidationError(
            [
                {field: 'name', message: 'Name is required'},
            ],
            'Missing required fields'
        );
    }

    const existing = await Country.findOne({
        where: { name }
    })

    if (existing) {
        throw new ConflictError(`Country name already exists`, name);
    }

    const newCountry = await Country.create({
        name,
    })

    res.status(201).json({
        status: 'success',
        data: { newCountry }
    })
});

exports.readCountries = catchAsync(async (req, res) => {
    const rows = await Country.findAll();

    if (!rows || rows.length === 0) {
        throw new NotFoundError('Countries not found.');
    }

    res.status(200).json({
        status: 'success',
        results: rows.length,
        data: rows,
    });
})

exports.readCountry = catchAsync(async (req, res) => {
    const id = req.params.id;
    const country = await Country.findByPk(id);

    if (!country) {
        throw new NotFoundError(`Country not found by id: ${id}`);
    }

    res.status(200).json({
        status: 'success',
        data: { componentItem: country },
    })

});

exports.updateCountry = catchAsync(async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;

    if (!Number.isInteger(Number(id))) {
        throw new ValidationError([{
            field: 'id',
            message: 'Country ID must be an integer'
        }])
    }

    console.log('updateCountry', updateData)

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

    const country = await Country.findByPk(id)
    if (!country) {
        throw new NotFoundError(`Country ${id} not found.`);
    }

    const updatedCountry = await country.update(updateData);

    res.status(200).json({
        status: 'success',
        data: updatedCountry
    })
});

exports.deleteCountry = catchAsync(async (req, res) => {
    const id = req.params.id;

    if (!Number.isInteger(Number(id))) {
        throw new ValidationError([{
            field: 'id',
            message: 'Country ID must be an integer'
        }])
    }

    const country = await Country.findByPk(id)
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