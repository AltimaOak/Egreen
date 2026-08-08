const userService = require('../services/userService');
const catchAsync = require('../utils/catchAsync');

const getProfile = catchAsync(async (req, res) => {
  const user = await userService.getProfile(req.user.id);
  res.json({ user });
});

const updateProfile = catchAsync(async (req, res) => {
  const allowedFields = ['name', 'phone', 'companyName'];
  const data = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      data[field] = req.body[field];
    }
  }

  const user = await userService.updateProfile(req.user.id, data);
  res.json({ user });
});

module.exports = { getProfile, updateProfile };
