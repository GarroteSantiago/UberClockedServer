const AppError = require('../AppError');

class ValidationError extends AppError {
    constructor(errors, message = 'Validation Error') {
        super(message, 400);
        this.errors = errors;
        this.isOperational = true;
    }

    // Format for Express-Validator errors
    static fromExpressValidator(errors) {
        const formattedErrors = errors.array().map(err => ({
            field: err.path,
            message: err.msg
        }));
        return new ValidationError(formattedErrors);
    }
}

module.exports = ValidationError;