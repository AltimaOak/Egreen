const express = require('express');
const { z } = require('zod');
const validate = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { getCart, addItem, updateItem, removeItem } = require('../controllers/cartController');

const router = express.Router();

const addItemSchema = z.object({
  productId: z.number().int().positive('Product ID is required'),
  quantity: z.number().int().positive().optional().default(1),
});

const updateItemSchema = z.object({
  quantity: z.number().int().positive('Quantity must be at least 1'),
});

router.use(protect);

router.get('/', getCart);
router.post('/', validate(addItemSchema), addItem);
router.put('/:itemId', validate(updateItemSchema), updateItem);
router.delete('/:itemId', removeItem);

module.exports = router;
