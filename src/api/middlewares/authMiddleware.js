const { jwtVerify } = require('jose');
const UnauthorizedError = require('../../errors/errorTypes/UnauthorizedError');
const catchAsync = require('../../utils/catchAsync');

const verifyJWT = catchAsync(async (req, res, next) => {
    // Get token from headers
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1]; // Optional chaining

    // Verify token is not empty
    if (!token) {
        throw new UnauthorizedError('No token provided');
    }

    // Encode and Verify token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Attach user to request
    req.user = payload;
    next();
});

// Role-based access control
const restrictTo = (...roles) => {
    return (req, res, next) => {
        const role = req.user.role;
        if (!roles.includes(role)) {
            throw new UnauthorizedError('You do not have permission to perform this action');
        }
        next();
    };
};

module.exports = {
    verifyJWT,
    restrictTo
};