const orderService = require('../services/orderService');
const catchAsync = require('../utils/catchAsync');

const placeOrder = catchAsync(async (req, res) => {
  const { notes } = req.body;
  const order = await orderService.placeOrder(req.user.id, notes);
  res.status(201).json({ order });
});

const listOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getUserOrders(req.user.id);
  res.json({ orders });
});

const getOrder = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.user.id, parseInt(req.params.id));
  res.json({ order });
});

module.exports = { placeOrder, listOrders, getOrder };
