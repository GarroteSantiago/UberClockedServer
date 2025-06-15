const Invoice = require('../../../models').Invoice;
const catchAsync = require('../../../utils/catchAsync');
const NotFoundError = require("../../../errors/errorTypes/NotFoundError");
const multer = require("multer");
const upload = multer()

exports.parseFormData = upload.none();

exports.readInvoices = catchAsync(async (req, res) => {
    const invoices = await Invoice.findAll();

    if (!invoices || invoices.length === 0) {
        throw new NotFoundError('Invoices not found.');
    }

    res.status(200).json({
        status: 'success',
        data: invoices,
    });
});