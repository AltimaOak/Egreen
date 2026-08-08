const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// Must be used AFTER `protect` (which sets req.user). Restricts a route to
// users with the 'admin' role.
const requireAdmin = catchAsync(async (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return next(new AppError('Admin access required', 403));
  }
  next();
});

module.exports = requireAdmin;
