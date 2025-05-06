const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const componentRoutes = require('./api/routes/components');
const { errorHandler } = require('./errors/errorHandler');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*'
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/components', componentRoutes);

// Error handling (must be last!)
app.use((err, req, res, next) => errorHandler(err, req, res, next));

module.exports = app;