const AppError = require('../AppError');

class ServerError extends AppError {
    constructor(error, context = 'server operation') {
        super(`Internal server error during ${context}`, 500);
        this.originalError = error;
        this.isOperational = false;
    }
}

module.exports = ServerError;