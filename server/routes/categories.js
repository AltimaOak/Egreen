const express = require('express');
const { z } = require('zod');
const { protect } = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/requireAdmin');
const validate = require('../middleware/validateMiddleware');
const {
  list,
  getBySlug,
  create,
  update,
  remove,
} = require('../controllers/categoryController');

const router = express.Router();

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().optional(),
  parentId: z.number().int().positive().optional().nullable(),
});

// Public routes
router.get('/', list);
router.get('/:slug', getBySlug);

// Admin routes
router.post('/', protect, requireAdmin, validate(categorySchema), create);
router.put('/:id', protect, requireAdmin, validate(categorySchema.partial()), update);
router.delete('/:id', protect, requireAdmin, remove);

module.exports = router;
