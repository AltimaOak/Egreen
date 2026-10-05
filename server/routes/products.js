const express = require('express');
const { z } = require('zod');
const { protect, optionalUser } = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/requireAdmin');
const validate = require('../middleware/validateMiddleware');
const { productListLimiter } = require('../middleware/rateLimiter');
const {
  list,
  getById,
  create,
  update,
  remove,
  listVariants,
  createVariant,
  updateVariant,
  removeVariant,
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
  stock: z.union([z.number().int().nonnegative(), z.string()]).optional().nullable(),
  specs: z.string().optional(),
  image: z.string().optional(),
  imagePublicId: z.string().optional().nullable(),
  price: z.number().nonnegative().optional().nullable(),
  offerPrice: z.number().nonnegative().optional().nullable(),
  rating: z.number().min(0).max(5).optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  // features can be a plain string array OR an object containing __variantGroups
  features: z.any().optional(),
  gallery: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

const variantSchema = z.object({
  ram: z.string().optional().nullable(),
  storage: z.string().optional().nullable(),
  price: z.number().nonnegative().optional().nullable(),
  offerPrice: z.number().nonnegative().optional().nullable(),
  stock: z.number().int().nonnegative().optional(),
  sku: z.string().optional().nullable(),
  isDefault: z.boolean().optional(),
});

const productIdSchema = z.object({ id: z.coerce.number().int().positive() });
const variantParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
  variantId: z.coerce.number().int().positive(),
});

// Public routes with rate limiting to prevent enumeration and scraping.
// Authenticated admins can pass `?includeInactive=true` to see draft/inactive products.
router.get('/', productListLimiter, optionalUser, list);
router.get('/:id', productListLimiter, optionalUser, validate.validateParams(productIdSchema), getById);

// Admin routes
router.post('/', protect, requireAdmin, validate(baseProductSchema), create);
router.put(
  '/:id',
  protect,
  requireAdmin,
  validate.validateParams(productIdSchema),
  validate(baseProductSchema.partial()),
  update
);
router.delete('/:id', protect, requireAdmin, validate.validateParams(productIdSchema), remove);

// Admin variant routes
router.get(
  '/:id/variants',
  protect,
  requireAdmin,
  validate.validateParams(productIdSchema),
  listVariants
);
router.post(
  '/:id/variants',
  protect,
  requireAdmin,
  validate.validateParams(productIdSchema),
  validate(variantSchema),
  createVariant
);
router.put(
  '/:id/variants/:variantId',
  protect,
  requireAdmin,
  validate.validateParams(variantParamsSchema),
  validate(variantSchema.partial()),
  updateVariant
);
router.delete(
  '/:id/variants/:variantId',
  protect,
  requireAdmin,
  validate.validateParams(variantParamsSchema),
  removeVariant
);

module.exports = router;
