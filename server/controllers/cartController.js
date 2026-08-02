const cartService = require('../services/cartService');
const catchAsync = require('../utils/catchAsync');

const getCart = catchAsync(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);
  res.json({ cart });
});

const addItem = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  const cartItem = await cartService.addItem(req.user.id, productId, quantity || 1);
  res.status(201).json({ cartItem });
});

const updateItem = catchAsync(async (req, res) => {
  const { quantity } = req.body;
  const cartItem = await cartService.updateItemQuantity(req.user.id, parseInt(req.params.itemId), quantity);
  res.json({ cartItem });
});

const removeItem = catchAsync(async (req, res) => {
  const result = await cartService.removeItem(req.user.id, parseInt(req.params.itemId));
  res.json(result);
});

module.exports = { getCart, addItem, updateItem, removeItem };
