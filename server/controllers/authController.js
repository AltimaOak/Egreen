const authService = require('../services/authService');
const generateToken = require('../utils/generateToken');
const catchAsync = require('../utils/catchAsync');

const register = catchAsync(async (req, res) => {
  const user = await authService.registerUser(req.body);
  const token = generateToken(user);

  res.status(201).json({
    token,
    user,
  });
});

const login = catchAsync(async (req, res) => {
  const user = await authService.loginUser(req.body);
  const token = generateToken(user);

  res.json({
    token,
    user,
  });
});

const getMe = catchAsync(async (req, res) => {
  const user = await authService.getUserById(req.user.id);
  res.json({ user });
});

module.exports = { register, login, getMe };
