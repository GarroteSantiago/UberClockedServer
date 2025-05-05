const AppError = require('../AppError');

class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
        this.isOperational = true;
    }
}

module.exports = UnauthorizedError;