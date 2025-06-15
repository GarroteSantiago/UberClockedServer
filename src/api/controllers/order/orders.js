const Order = require('../../../models').Order;
const Invoice = require('../../../models').Invoice;
const Cart = require('../../../models').ShoppingCart;
const catchAsync = require('../../../utils/catchAsync');
const NotFoundError = require("../../../errors/errorTypes/NotFoundError");
const ValidationError = require('../../../errors/errorTypes/ValidationError');
const ConflictError = require('../../../errors/errorTypes/ConflictError');
const multer = require("multer");
const upload = multer()

exports.parseFormData = upload.none();

exports.createOrder = catchAsync(async (req, res) => {
    const user_id = req.user.id;
    const status_id = 1;
    const { cart_id, payment_method } = req.body;

    if (!cart_id || !user_id || !payment_method) {
        throw new ValidationError(
            [
                { field: 'cart', message: 'cart_id is required' },
                { field: 'user', message: 'user_id is required' },
                { field: 'payment method', message: 'payment_method is required' },
            ],
            'Missing required fields'
        );
    }

    const existing = await Order.findOne({ where: { cart_id } });
    if (existing) {
        throw new ConflictError(`Order already exists for cart`, cart_id);
    }

    const cart = await Cart.findByPk(cart_id, {
        include: ['products']
    });

    if (!cart) {
        throw new NotFoundError(`Cart not found`, cart_id);
    }

    const amount = cart.products?.reduce((acc, product) => {
        return acc + parseFloat(product.price || 0);
    }, 0.00) || 0.00;

    const newInvoice = await Invoice.create({
        user_id,
        amount,
        payment_method,
    });

    const newOrder = await Order.create({
        user_id,
        cart_id,
        status_id,
        invoice_id: newInvoice.id,
    });

    res.status(201).json({
        status: 'success',
        data: { order: newOrder }
    });
});

exports.updateOrder = catchAsync(async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;

    if (!Number.isInteger(Number(id))) {
        throw new ValidationError([{
            field: 'id',
            message: 'Order ID must be an integer'
        }]);
    }

    if (Object.keys(updateData).length === 0) {
        throw new ValidationError([{
            field: 'body',
            message: 'No fields provided for update'
        }]);
    }

    const validFields = ['status_id'];
    const invalidFields = Object.keys(updateData).filter(field => !validFields.includes(field));

    if (invalidFields.length > 0) {
        throw new ValidationError(
            invalidFields.map(field => ({
                field,
                message: `Field '${field}' is not updatable. Only 'status_id' can be changed.`
            }))
        );
    }

    const order = await Order.findByPk(id);
    if (!order) {
        throw new NotFoundError(`Order with id ${id} not found.`);
    }

    const updatedOrder = await order.update(updateData);

    res.status(200).json({
        status: 'success',
        data: updatedOrder
    });
});

exports.readOrders = catchAsync(async (req, res) => {
    const orders = await Order.findAll();

    if (!orders || orders.length === 0) {
        throw new NotFoundError('Orders not found.');
    }

    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: orders,
    });
});

exports.readOrdersByUserId = catchAsync(async (req, res) => {
    const user_id = req.user.id;
    const orders = await Order.findAll({
        where: {user_id},
    });

    if (!orders || orders.length === 0) {
        throw new NotFoundError('Orders not found.');
    }

    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: orders,
    });
});

exports.readOrder = catchAsync(async (req, res) => {
    const id = req.params.id;
    const order = await Order.findByPk(id);

    if (!order) {
        throw new NotFoundError(`Order not found by id: ${id}`);
    }

    res.status(200).json({
        status: 'success',
        data: order,
    });
});
