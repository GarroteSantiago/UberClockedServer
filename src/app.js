const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
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
const orders = require('./api/routes/order/orders');
const invoices = require('./api/routes/order/invoices');
const statuses = require('./api/routes/order/statuses');
const reviews = require('./api/routes/reviews');
const boards = require('./api/routes/boards');
const { errorHandler } = require('./errors/errorHandler');
const cookieParser = require("cookie-parser");

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:5173', // Frontend Vite URL
    credentials: true // If you're sending cookies or auth headers
}));

// Body parsing
app.use(express.json({ limit: '10kb' }));

app.use(cookieParser());

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
app.use('/api/orders', orders)
app.use('/api/invoices', invoices)
app.use('/api/statuses', statuses)
app.use('/api/reviews', reviews)
app.use('/api/boards', boards)

// Error handling (must be last!)
app.use((err, req, res, next) => errorHandler(err, req, res, next));

module.exports = app;