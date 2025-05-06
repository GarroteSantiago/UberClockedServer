const Ubication = require('../../../models').Ubication;
const catchAsync = require('../../../utils/catchAsync');
const NotFoundError = require("../../../errors/errorTypes/NotFoundError");
const ValidationError = require('../../../errors/errorTypes/ValidationError');
const ConflictError = require('../../../errors/errorTypes/ConflictError');
const multer = require("multer");
const upload = multer()

exports.parseFormData = upload.none();

exports.createUbication =catchAsync(async (req, res) => {
    const { country_id, province_id, locality_id } = req.body;

    if (!country_id || !province_id || !locality_id) {
        throw new ValidationError(
            [
                {field: 'country_id', message: 'country_id is required'},
                {field: 'province_id', message: 'province_id is required'},
                {field: 'locality_id', message: 'locality_id is required'},
            ],
            'Missing required fields'
        );
    }

    const existing = await Ubication.findOne({
        where: { country_id, province_id, locality_id }
    })

    if (existing) {
        throw new ConflictError(`Ubication already exists`);
    }

    const newUbication = await Ubication.create({
        country_id,
        province_id,
        locality_id,
    })

    res.status(201).json({
        status: 'success',
        data: { newUbication }
    })
});

exports.readUbications = catchAsync(async (req, res) => {
    const rows = await Ubication.findAll();

    if (!rows || rows.length === 0) {
        throw new NotFoundError('Ubications not found.');
    }

    res.status(200).json({
        status: 'success',
        results: rows.length,
        data: rows,
    });
})

exports.readUbication = catchAsync(async (req, res) => {
    const id = req.params.id;
    const ubication = await Ubication.findByPk(id);

    if (!ubication) {
        throw new NotFoundError(`Ubication not found by id: ${id}`);
    }

    res.status(200).json({
        status: 'success',
        data: { componentItem: ubication },
    })

});

exports.updateUbication = catchAsync(async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;

    if (!Number.isInteger(Number(id))) {
        throw new ValidationError([{
            field: 'id',
            message: 'Ubication ID must be an integer'
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

    const ubication = await Ubication.findByPk(id)
    if (!ubication) {
        throw new NotFoundError(`Ubication ${id} not found.`);
    }

    const updatedUbication = await ubication.update(updateData);

    res.status(200).json({
        status: 'success',
        data: updatedUbication
    })
});

exports.deleteUbication = catchAsync(async (req, res) => {
    const id = req.params.id;

    if (!Number.isInteger(Number(id))) {
        throw new ValidationError([{
            field: 'id',
            message: 'Ubication ID must be an integer'
        }])
    }

    const ubication = await Ubication.findByPk(id)
    if (!ubication) {
        throw new NotFoundError(`Ubication ${id} not found.`);
    }

    await ubication.destroy();

    res.status(200).json({
        status: 'success',
        message: 'Ubication deleted.',
        data: { id }
    })
});