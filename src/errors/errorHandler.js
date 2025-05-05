const {
    BadRequestError,
    ValidationError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    RateLimitError,
    DatabaseError,
    ServerError
} = require('./errorTypes/');

module.exports = (err, req, res, next) => {
    // Set default values if not set
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Handle MySQL/SQL-specific errors
    if (err.code === 'ER_DUP_ENTRY') {
        const matches = err.message.match(/Duplicate entry '(.+)' for key '(.+)'/);
        const value = matches ? matches[1] : 'unknown';
        const field = matches ? matches[2].replace(/^.+\./, '') : 'field';
        err = new ConflictError(`Duplicate entry: ${field} '${value}' already exists`, field);
    } else if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        const matches = err.message.match(/CONSTRAINT `(.+)` FOREIGN KEY/);
        const constraint = matches ? matches[1] : 'constraint';
        err = new BadRequestError(`Invalid reference: ${constraint} constraint fails`);
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
        const field = err.message.match(/Column '(.+)'/)[1];
        err = new ValidationError([{ field, message: 'This field cannot be null' }]);
    } else if (err.code === 'ER_DATA_TOO_LONG') {
        const field = err.message.match(/column '(.+)'/)[1];
        err = new ValidationError([{ field, message: 'Data too long for column' }]);
    } else if (err.code === 'ER_NO_SUCH_TABLE') {
        err = new NotFoundError('Database table'); // Modified to use NotFoundError
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
        err = new ForbiddenError('Database access denied'); // Modified to use ForbiddenError
    } else if (err.name === 'SequelizeValidationError') {
        const errors = err.errors.map(e => ({
            field: e.path,
            message: e.message
        }));
        err = new ValidationError(errors);
    } else if (err.name === 'JsonWebTokenError') {
        err = new UnauthorizedError('Invalid token. Please log in again!');
    } else if (err.name === 'TokenExpiredError') {
        err = new UnauthorizedError('Your token has expired! Please log in again.');
    }

    // Enhanced handling for custom error classes
    if (err instanceof ValidationError) {
        err.message = `Validation failed: ${err.errors.map(e => e.message || e).join(', ')}`;
    } else if (err instanceof NotFoundError) {
        // Log missing resources for debugging
        console.warn(`Not Found: ${err.message}`, {
            resource: err.resourceType,
            id: err.resourceId,
            url: req.originalUrl
        });
    } else if (err instanceof ForbiddenError) {
        // Security logging for forbidden attempts
        console.warn(`Forbidden Access: ${err.message}`, {
            user: req.user?.id,
            resource: err.resourceType,
            action: req.method,
            ip: req.ip
        });
    } else if (err instanceof RateLimitError) {
        if (err.retryAfter) {
            res.set('Retry-After', err.retryAfter.toString());
        }
    } else if (err instanceof DatabaseError || err instanceof ServerError) {
        console.error('DATABASE ERROR:', err.originalError || err);
        if (process.env.NODE_ENV !== 'development') {
            err.message = 'Database operation failed';
        }
    }

    // Prepare response
    const response = {
        status: err.status,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            ...(err.errors && { errors: err.errors }),
            ...(err.sql && { sql: err.sql }),
            ...(err.originalError && { originalError: err.originalError.toString() }),
            ...(err instanceof NotFoundError && {
                resourceType: err.resourceType,
                resourceId: err.resourceId
            }),
            ...(err instanceof ForbiddenError && {
                requiredRole: err.requiredRole
            })
        }),
        ...(process.env.NODE_ENV !== 'development' && err.errors && { errors: err.errors })
    };

    // Special case: Include resource info in 404 responses in production
    if (err instanceof NotFoundError && process.env.NODE_ENV !== 'development') {
        response.resourceType = err.resourceType;
        if (err.resourceId) {
            response.resourceId = err.resourceId;
        }
    }

    if (process.env.NODE_ENV !== 'development' && !err.isOperational) {
        response.message = 'Something went wrong!';
        delete response.errors;
        delete response.stack;
        delete response.originalError;
    }

    res.status(err.statusCode).json(response);
};