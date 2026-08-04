const orderService = require('../services/orderService');
const userService = require('../services/userService');
const catchAsync = require('../utils/catchAsync');

const listOrders = catchAsync(async (req, res) => {
  const orders = await orderService.listAllOrders();
  res.json({ orders });
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderStatus(
    parseInt(req.params.id),
    req.body.status
  );
  res.json({ order });
});

const listUsers = catchAsync(async (req, res) => {
  const users = await userService.listUsers();
  res.json({ users });
});

module.exports = { listOrders, updateOrderStatus, listUsers };
