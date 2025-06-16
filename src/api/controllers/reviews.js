const Review = require('../../models').Review;
const Product = require('../../models').Product;
const catchAsync = require('../../utils/catchAsync');
const NotFoundError = require("../../errors/errorTypes/NotFoundError");
const ValidationError = require('../../errors/errorTypes/ValidationError');
const ConflictError = require('../../errors/errorTypes/ConflictError');
const ForbiddenError = require("../../errors/errorTypes/ForbiddenError");
const multer = require("multer");
const upload = multer();

exports.parseFormData = upload.none();

exports.createReview = catchAsync(async (req, res) => {
    const { product_id, rating, comment } = req.body;
    const user_id = req.user.id;

    if (!product_id || rating === undefined) {
        throw new ValidationError([
            { field: 'product_id', message: 'Product is required' },
            { field: 'rating', message: 'Rating is required' },
        ], 'Missing required fields');
    }

    const existingReview = await Review.findOne({
        where: { product_id, user_id }
    });

    if (existingReview) {
        throw new ConflictError('You have already reviewed this product');
    }

    const review = await Review.create({
        product_id,
        user_id,
        rating,
        comment
    });

    res.status(201).json({
        status: 'success',
        data: review
    });
});

exports.readReviews = catchAsync(async (req, res) => {
    const reviews = await Review.findAll();
    if (!reviews || reviews.length === 0) {
        throw new NotFoundError('No reviews found');
    }
    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: reviews
    });
});

exports.getReviewsByProductId = catchAsync(async (req, res) => {
    const { product_id } = req.params;

    if (!product_id) {
        throw new ValidationError([
            { field: 'product_id', message: 'Product ID is required' }
        ]);
    }

    const reviews = await Review.findAll({
        where: { product_id },
        include: [
            {
                model: require('../../models').User,
                attributes: ['id', 'name_tag']
            }
        ],
        order: [['created_at', 'DESC']]
    });

    if (!reviews || reviews.length === 0) {
        throw new NotFoundError(`No reviews found for product ID ${product_id}`);
    }

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: reviews
    });
});

exports.readMyReviews = catchAsync(async (req, res) => {
    const user_id = req.user.id;
    const reviews = await Review.findAll({ where: { user_id } });

    if (!reviews || reviews.length === 0) {
        throw new NotFoundError('You have no reviews');
    }

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: reviews
    });
});

exports.readReview = catchAsync(async (req, res) => {
    const { id } = req.params;
    const review = await Review.findByPk(id);

    if (!review) {
        throw new NotFoundError(`Review with ID ${id} not found`);
    }

    res.status(200).json({
        status: 'success',
        data: review
    });
});

exports.readMyReview = catchAsync(async (req, res) => {
    const user_id = req.user.id;
    const { product_id } = req.params;

    const review = await Review.findOne({ where: { user_id, product_id } });

    if (!review) {
        throw new NotFoundError('You have not reviewed this product');
    }

    res.status(200).json({
        status: 'success',
        data: review
    });
});

exports.updateReview = catchAsync(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const user_id = req.user.id;

    const review = await Review.findByPk(id);

    if (!review) {
        throw new NotFoundError(`Review with ID ${id} not found`);
    }

    if (review.user_id !== user_id && req.user.role.dataValues.name !== 'admin') {
        throw new ForbiddenError('You can only update your own reviews');
    }

    const validFields = ['rating', 'comment'];
    const invalidFields = Object.keys(updateData).filter(field => !validFields.includes(field));

    if (invalidFields.length > 0) {
        throw new ValidationError(invalidFields.map(field => ({
            field,
            message: `Field ${field} is not updatable.`
        })));
    }

    const updated = await review.update(updateData);

    res.status(200).json({
        status: 'success',
        data: updated
    });
});

exports.deleteReview = catchAsync(async (req, res) => {
    const { id } = req.params;
    const review = await Review.findByPk(id);

    if (!review) {
        throw new NotFoundError(`Review with ID ${id} not found`);
    }

    await review.destroy();

    res.status(200).json({
        status: 'success',
        message: 'Review deleted',
        data: id
    });
});

exports.deleteMyReview = catchAsync(async (req, res) => {
    const user_id = req.user.id;
    const { product_id } = req.params;

    const review = await Review.findOne({ where: { user_id, product_id } });

    if (!review) {
        throw new NotFoundError('You have not reviewed this product');
    }

    await review.destroy();

    res.status(200).json({
        status: 'success',
        message: 'Your review was deleted',
        data: product_id
    });
});
