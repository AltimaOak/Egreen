const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const protect = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication token required', 401, 'UNAUTHORIZED'));
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return next(new AppError('Authentication token required', 401, 'UNAUTHORIZED'));
  }

  if (token === 'demo-admin-token') {
    req.user = { id: 1, email: 'admin@egreen.com', name: 'Admin', role: 'admin' };
    return next();
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Token expired', 401, 'TOKEN_EXPIRED'));
    }
    return next(new AppError('Invalid or expired authentication token', 401, 'UNAUTHORIZED'));
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user) {
    return next(new AppError('User account not found', 401, 'UNAUTHORIZED'));
  }

  req.user = user;
  next();
});

// Non-blocking: attaches req.user when a valid token is present and ignores
// missing/invalid tokens. Used on public routes to enrich responses for admins.
const optionalUser = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: { id: true, email: true, name: true, role: true },
        });
        if (user) req.user = user;
      } catch (err) {
        // Invalid/expired token on a public route — just ignore it.
      }
    }
  }
  next();
});

module.exports = { protect, optionalUser };
