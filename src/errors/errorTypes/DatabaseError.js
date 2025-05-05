const AppError = require('../AppError');

class DatabaseError extends AppError {
    constructor(error, operation = 'database operation') {
        super(`Database error during ${operation}`, 500);
        this.originalError = error;
        this.isOperational = false; // Not operational - needs investigation
    }
}

module.exports = DatabaseError;