const Product = require('../../models').Product;
const catchAsync = require('../../utils/catchAsync');
const NotFoundError = require("../../errors/errorTypes/NotFoundError");
const ValidationError = require('../../errors/errorTypes/ValidationError');
const ConflictError = require('../../errors/errorTypes/ConflictError');
const multer = require("multer");
const upload = multer()

exports.parseFormData = upload.none();

exports.createProduct =catchAsync(async (req, res) => {
    const { name, description, image_url, image_alt, component_id, price, rating } = req.body;
    console.log(name)
    if (!name || !description || !image_url || !image_alt || !component_id || !price || !rating) {
        throw new ValidationError(
            [
                {field: 'name', message: 'Name is required'},
                {field: 'description', message: 'Description is required'},
                {field: 'image_url', message: 'Image URL is required'},
                {field: 'image_alt', message: 'Image alt is required'},
                {field: 'component_id', message: 'Component is required'},
                {field: 'price', message: 'Price is required'},
                {field: 'rating', message: 'Rating is required'},
            ],
            'Missing required fields'
        );
    }

    const existing = await Product.findOne({
        where: { name }
    })

    if (existing) {
        throw new ConflictError(`Product with that name already exists`, name);
    }

    const newProduct = await Product.create({
        name,
        description,
        image_url,
        image_alt,
        component_id,
        price,
        rating,
    })

    console.log(newProduct)

    res.status(201).json({
        status: 'success',
        data: { newProduct }
    })
});

exports.readProducts = catchAsync(async (req, res) => {
    const rows = await Product.findAll();

    if (!rows || rows.length === 0) {
        throw new NotFoundError('Products not found.');
    }

    res.status(200).json({
        status: 'success',
        results: rows.length,
        data: rows,
    });
})

exports.readProduct = catchAsync(async (req, res) => {
    const id = req.params.id;
    const component = await Product.findByPk(id);

    if (!component) {
        throw new NotFoundError(`Product not found by id: ${id}`);
    }

    res.status(200).json({
        status: 'success',
        data: component ,
    })

});

exports.updateProduct = catchAsync(async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;

    if (!Number.isInteger(Number(id))) {
        throw new ValidationError([{
            field: 'id',
            message: 'Product ID must be an integer'
        }])
    }

    if (Object.keys(updateData).length === 0) {
        throw new ValidationError([{
            field: 'body',
            message: 'No fields provided for update'
        }])
    }

    const validFields = ['name', 'description', 'image_url', 'image_alt', 'component_id', 'price', 'rating'];
    const invalidFields = Object.keys(updateData).filter(field => !validFields.includes(field));

    if (invalidFields.length > validFields.length) {
        throw new ValidationError(
            invalidFields.map(field => ({
                field: {field},
                message: `Field ${field} is not updatable.`
            })),
        )
    }

    const product = await Product.findByPk(id)
    if (!product) {
        throw new NotFoundError(`Product ${id} not found.`);
    }

    const updatedProduct = await product.update(updateData);

    res.status(200).json({
        status: 'success',
        data: updatedProduct
    })
});

exports.deleteProduct = catchAsync(async (req, res) => {
    const id = req.params.id;

    if (!Number.isInteger(Number(id))) {
        throw new ValidationError([{
            field: 'id',
            message: 'Product ID must be an integer'
        }])
    }

    const product = await Product.findByPk(id)
    if (!product) {
        throw new NotFoundError(`Product ${id} not found.`);
    }

    await product.destroy();

    res.status(200).json({
        status: 'success',
        message: 'Product deleted.',
        data: id
    })
});