const logger = require('../utils/logger');

/**
 * Centralized Express 4-argument error-handling middleware.
 * Ensures consistent JSON response: { error: { message, code } }
 * Server-side error/stack logging without leaking internals to clients.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code || (statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : 'BAD_REQUEST');
  let details = err.details || undefined;

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      statusCode = 409;
      code = 'RECORD_ALREADY_EXISTS';
      message = 'A record with this value already exists';
    } else if (err.code === 'P2025') {
      statusCode = 404;
      code = 'NOT_FOUND';
      message = 'Record not found';
    } else if (err.code === 'P2003') {
      statusCode = 400;
      code = 'FOREIGN_KEY_VIOLATION';
      message = 'Operation violates database constraints';
    } else {
      statusCode = 400;
      code = 'DATABASE_ERROR';
      message = 'A database error occurred';
    }
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    code = 'TOKEN_EXPIRED';
    message = 'Token expired';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = 'UNAUTHORIZED';
    message = 'Invalid authentication token';
  } else if (err.name === 'ZodError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Validation error';
    details = err.issues?.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    })) || [{ message: err.message }];
  }

  // Server-side logging only: full stack trace
  logger.error(err, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    statusCode,
    code,
  });

  const errorResponse = {
    message,
    code,
  };

  if (details) {
    errorResponse.details = details;
  }

  // Never leak internal stack traces to the client in production
  if (process.env.NODE_ENV === 'development' && statusCode >= 500) {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json({ error: errorResponse });
};

module.exports = errorHandler;
