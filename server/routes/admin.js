const express = require('express');
const { z } = require('zod');
const { protect } = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/requireAdmin');
const validate = require('../middleware/validateMiddleware');
const {
  listOrders,
  updateOrderStatus,
  listUsers,
} = require('../controllers/adminController');

const router = express.Router();

// Every admin route requires an authenticated admin.
router.use(protect, requireAdmin);

const orderStatusSchema = z.object({
  status: z.string().min(1, 'Status is required'),
});

const orderIdSchema = z.object({ id: z.coerce.number().int().positive() });

router.get('/orders', listOrders);
router.patch('/orders/:id/status', validate.validateParams(orderIdSchema), validate(orderStatusSchema), updateOrderStatus);
router.get('/users', listUsers);

module.exports = router;
