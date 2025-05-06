const ShoppingCart = require('../../models').ShoppingCart;
const Product = require('../../models').Product;
const catchAsync = require('../../utils/catchAsync');
const NotFoundError = require("../../errors/errorTypes/NotFoundError");
const ValidationError = require('../../errors/errorTypes/ValidationError');
const ConflictError = require('../../errors/errorTypes/ConflictError');
const multer = require("multer");
const upload = multer()

exports.parseFormData = upload.none();

exports.createShoppingCart = catchAsync(async (req, res) => {
    const { name } = req.body;
    const userId = req.user.id;

    if (!name) {
        throw new ValidationError(
            [
                {field: 'name', message: 'Name is required'},
                {field: 'user_id', message: 'User is required'},
            ],
            'Missing required fields'
        );
    }

    const existing = await ShoppingCart.findOne({
        where: { name, user_id: userId }
    })

    if (existing) {
        throw new ConflictError(`Shopping cart with that name of that user already exists`, name);
    }

    const newShoppingCart = await ShoppingCart.create({
        name,
        user_id: userId,
    })

    res.status(201).json({
        status: 'success',
        data: { newShoppingCart }
    })
});

exports.createProductInShoppingCart = catchAsync(async (req, res) => {
    const { product_id, quantity } = req.body;
    const shoppingCart = req.resource;

    if (!product_id || !quantity) {
        throw new ValidationError(
            [
                {field: 'product_id', message: 'Product is required'},
                {field: 'quantity', message: 'Quantity is required'},
            ],
            'Missing required fields'
        );
    }

    if (quantity <= 0) {
        throw new ValidationError(
            [
                {field: 'quantity', message: 'Quantity must be greater than 0'}
            ],
            'Invalid quantity'
        );
    }

    const product = await Product.findByPk(product_id)
    if (!product) {
        throw new NotFoundError('Product not found');
    }

    const products = await shoppingCart.getProducts(
        {
            where: {id: product.id},
            through: {attributes: ['quantity']},
        });

    if (products.length > 0) {
        const existingQuantity = products[0].CartProduct.quantity;
        const newQuantity = existingQuantity + quantity;

        await shoppingCart.addProduct(product, {
            through: { quantity: newQuantity }
        });

        return res.status(201).json({
            status: 'success',
            message: 'Product quantity updated in cart',
            data: null
        })
    } else {
        await shoppingCart.addProduct(product, {
            through: { quantity: quantity }
        });

        return res.status(201).json({
            status: 'success',
            message: 'Product added to cart successfully',
            data: null
        });
    }
});

exports.readShoppingCarts = catchAsync(async (req, res) => {
    const userId = req.user.id;

    const rows = await ShoppingCart.findAll({
            where:
                {
                    user_id: userId,
                }
    });

    if (!rows || rows.length === 0) {
        throw new NotFoundError('Shopping carts not found.');
    }

    res.status(200).json({
        status: 'success',
        results: rows.length,
        data: rows,
    });
})

exports.readShoppingCart = catchAsync(async (req, res) => {
    res.status(200).json({
        status: 'success',
        data: req.resource ,
    })

});

exports.readShoppingCartProducts = catchAsync(async (req, res) => {
    res.status(200).json({
        status: 'success',
        data: req.resource.getProducts(),
    })
});

exports.updateShoppingCart = catchAsync(async (req, res) => {
    const updateData = req.body;

    if (Object.keys(updateData).length === 0) {
        throw new ValidationError([{
            field: 'body',
            message: 'No fields provided for update'
        }])
    }

    const validFields = ['name'];
    const invalidFields = Object.keys(updateData).filter(field => !validFields.includes(field));

    if (invalidFields.length > 0) {
        throw new ValidationError(
            invalidFields.map(field => ({
                field,
                message: `Field ${field} is not updatable.`
            })),
        )
    }

    const updatedShoppingCart = await req.resource.update(updateData);

    res.status(200).json({
        status: 'success',
        data: updatedShoppingCart
    })
});

exports.deleteShoppingCart = catchAsync(async (req, res) => {
    await req.resource.destroy();

    res.status(200).json({
        status: 'success',
        message: 'Shopping cart deleted.',
        data: req.params.id
    })
});

exports.deleteProductFromCart = catchAsync(async (req, res) => {
    const { productId } = req.params;
    const shoppingCart = req.resource;

    if (!productId) {
        throw new ValidationError(
            [
                { field: 'productId', message: 'Product ID is required' },
            ],
            'Missing required field'
        );
    }

    const product = await Product.findByPk(productId);
    if (!product) {
        throw new NotFoundError('Product not found');
    }

    await shoppingCart.removeProduct(product);

    return res.status(200).json({
        status: 'success',
        message: 'Product removed from cart successfully',
        data: null
    });
});