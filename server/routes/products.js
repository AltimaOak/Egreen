const express = require('express');
const { z } = require('zod');
const { protect } = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/requireAdmin');
const validate = require('../middleware/validateMiddleware');
const {
  list,
  getById,
  create,
  update,
  remove,
} = require('../controllers/productController');

const router = express.Router();

const baseProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  slug: z.string().optional(),
  sku: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  categorySlug: z.string().min(1, 'Category is required'),
  brandName: z.string().optional().nullable(),
  condition: z.string().optional(),
  stock: z.string().optional(),
  specs: z.string().optional(),
  image: z.string().optional(),
  imagePublicId: z.string().optional().nullable(),
  price: z.number().nonnegative().optional().nullable(),
  offerPrice: z.number().nonnegative().optional().nullable(),
  rating: z.number().min(0).max(5).optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  features: z.array(z.string()).optional(),
  gallery: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

// Public routes
router.get('/', list);
router.get('/:id', getById);

// Admin routes
router.post('/', protect, requireAdmin, validate(baseProductSchema), create);
router.put(
  '/:id',
  protect,
  requireAdmin,
  validate(baseProductSchema.partial()),
  update
);
router.delete('/:id', protect, requireAdmin, remove);

module.exports = router;
