const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      message: 'Too many authentication attempts, please try again later',
      code: 'TOO_MANY_REQUESTS',
    },
  },
});

const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      message: 'Too many enquiries submitted, please try again later',
      code: 'TOO_MANY_REQUESTS',
    },
  },
});

const productListLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 120, // 120 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      message: 'Too many product requests, please try again later',
      code: 'TOO_MANY_REQUESTS',
    },
  },
});

module.exports = { authLimiter, enquiryLimiter, productListLimiter };
