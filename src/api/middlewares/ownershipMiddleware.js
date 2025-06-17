const catchAsync = require('../../utils/catchAsync');
const ForbiddenError = require('../../errors/errorTypes/ForbiddenError');
const NotFoundError = require('../../errors/errorTypes/NotFoundError');

exports.checkOwnership = (model, options = {}) => catchAsync(async (req, res, next) => {
    const paramName = options.paramName || 'id';
    const resource = await model.findByPk(req.params[paramName]);

    if (!resource) {
        throw new NotFoundError(`${model.name} not found`);
    }

    const roleName = req.user.role?.dataValues?.name;
    if (roleName !== 'admin' && resource.user_id !== req.user.id) {
        throw new ForbiddenError('You do not have permission for this resource');
    }

    req.resource = resource;
    next();
});