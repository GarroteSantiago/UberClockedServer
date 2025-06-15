const Status = require('../../../models').Status;
const catchAsync = require('../../../utils/catchAsync');
const NotFoundError = require("../../../errors/errorTypes/NotFoundError");
const multer = require("multer");
const upload = multer()

exports.parseFormData = upload.none();

exports.readStatuses = catchAsync(async (req, res) => {
    const statuses = await Status.findAll();

    if (!statuses || statuses.length === 0) {
        throw new NotFoundError('Statuses not found.');
    }

    res.status(200).json({
        status: 'success',
        data: statuses,
    });
});