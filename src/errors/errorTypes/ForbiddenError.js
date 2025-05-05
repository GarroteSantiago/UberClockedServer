const AppError = require('../AppError');

class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403);
        this.isOperational = true;
    }
}

module.exports = ForbiddenError;