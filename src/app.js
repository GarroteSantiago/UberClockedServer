const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./api/routes/authentication');
const localityRoutes = require('./api/routes/ubication/localities');
const provinceRoutes = require('./api/routes/ubication/provinces');
const countryRoutes = require('./api/routes/ubication/countries');
const ubicationRoutes = require('./api/routes/ubication/ubications');
const roleRoutes = require('./api/routes/user/roles');
const userRoutes = require('./api/routes/user/users');
const componentRoutes = require('./api/routes/components');
const productRoutes = require('./api/routes/products');
const shoppingCartRoutes = require('./api/routes/shoppingCarts');
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
app.use('/api/auth', authRoutes)
app.use('/api/localities', localityRoutes)
app.use('/api/provinces', provinceRoutes)
app.use('/api/countries', countryRoutes)
app.use('/api/ubications', ubicationRoutes)
app.use('/api/components', componentRoutes);
app.use('/api/products', productRoutes)
app.use('/api/roles', roleRoutes)
app.use('/api/users', userRoutes)
app.use('/api/shoppingCart', shoppingCartRoutes)

// Error handling (must be last!)
app.use((err, req, res, next) => errorHandler(err, req, res, next));

module.exports = app;