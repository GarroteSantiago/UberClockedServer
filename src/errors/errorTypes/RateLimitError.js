const AppError = require('../AppError');

class RateLimitError extends AppError {
    constructor(message = 'Too Many Requests', retryAfter) {
        super(message, 429);
        this.retryAfter = retryAfter; // In seconds
        this.isOperational = true;
    }
}

module.exports = RateLimitError;