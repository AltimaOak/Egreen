const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    'postgresql://neondb_owner:npg_t7Cm6JRiSobr@ep-frosty-night-az3rhr5l.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET =
    '5df98f7e33176fa69a142e624da31a5473bb5402e10da967e3e534c99da33ecb';
}
if (!process.env.JWT_EXPIRES_IN) {
  process.env.JWT_EXPIRES_IN = '1d';
}

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
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true);
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
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
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
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Egreen Technology API Server', version: '1.0.0' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
