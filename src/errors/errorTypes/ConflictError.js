const AppError = require('../AppError');

class ConflictError extends AppError {
    constructor(message = 'Conflict', field) {
        super(message, 409);
        this.field = field; // Optional: which field caused conflict
        this.isOperational = true;
    }

    static duplicate(field, value) {
        return new ConflictError(
            `${field} '${value}' already exists`,
            field
        );
    }
}

module.exports = ConflictError;