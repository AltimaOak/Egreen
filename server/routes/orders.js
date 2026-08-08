const express = require('express');
const { z } = require('zod');
const validate = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { placeOrder, listOrders, getOrder } = require('../controllers/orderController');

const router = express.Router();

const placeOrderSchema = z.object({
  notes: z.string().optional(),
});

router.use(protect);

router.post('/', validate(placeOrderSchema), placeOrder);
router.get('/', listOrders);
router.get('/:id', getOrder);

module.exports = router;
