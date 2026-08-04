const express = require('express');
const { z } = require('zod');
const { protect } = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/requireAdmin');
const validate = require('../middleware/validateMiddleware');
const { list, getById, create, update, remove } = require('../controllers/brandController');

const router = express.Router();

const brandSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().optional(),
  logoUrl: z.string().optional().nullable(),
});

// Public routes
router.get('/', list);
router.get('/:id', getById);

// Admin routes
router.post('/', protect, requireAdmin, validate(brandSchema), create);
router.put('/:id', protect, requireAdmin, validate(brandSchema.partial()), update);
router.delete('/:id', protect, requireAdmin, remove);

module.exports = router;
