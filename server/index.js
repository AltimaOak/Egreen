const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const validateEnv = require('./utils/validateEnv');
validateEnv();

const logger = require('./utils/logger');
const AppError = require('./utils/AppError');
const asyncHandler = require('./utils/catchAsync');
const errorHandler = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const brandRoutes = require('./routes/brands');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const enquiryRoutes = require('./routes/enquiries');
const uploadRoutes = require('./routes/upload');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust reverse proxy (Vercel) for rate limiting and IP resolution
app.set('trust proxy', 1);

// Security headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS — support local dev, configured CLIENT_URL, and Vercel deployments
const isDev = process.env.NODE_ENV !== 'production';

const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://egreen-technology.vercel.app',
  'https://www.egreentechnology.co.in',
  'https://egreentechnology.co.in',
].filter(Boolean);

// Accept any Vercel preview deployment for this project
const isVercelPreview = (origin) =>
  /^https:\/\/egreen(-technology)?(-[\w-]+)?\.vercel\.app$/.test(origin);

// In development, Vite picks a new port when 5173 is busy. Accept any
// localhost or 127.0.0.1 origin with any port.
const isLocalhostOrigin = (origin) =>
  /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (isVercelPreview(origin)) return callback(null, true);
    if (isDev && isLocalhostOrigin(origin)) return callback(null, true);
    return callback(new Error(`CORS: origin not allowed: ${origin}`));
  },
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(morgan('dev'));

// Global rate limit
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      message: 'Too many requests, please try again later',
      code: 'TOO_MANY_REQUESTS',
    },
  },
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// Root & Health check
app.get('/', asyncHandler(async (req, res) => {
  res.json({ status: 'ok', message: 'Egreen Technology API Server', version: '1.0.0' });
}));

app.get('/api/health', asyncHandler(async (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
}));

// 404 handler passes AppError to centralized errorHandler
app.use((req, res, next) => {
  next(new AppError('Route not found', 404, 'NOT_FOUND'));
});

// Centralized error handler
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

module.exports = app;
