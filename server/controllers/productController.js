const productService = require('../services/productService');
const catchAsync = require('../utils/catchAsync');

const list = catchAsync(async (req, res) => {
  const { category, brand, search, page, limit, includeInactive } = req.query;
  const result = await productService.listProducts({
    category,
    brand,
    search,
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    // Only admins can see inactive/draft products; the public feed is active-only.
    includeInactive: includeInactive === 'true' && req.user?.role === 'admin',
  });

  res.json(result);
});

const getById = catchAsync(async (req, res) => {
  const includeInactive =
    req.query.includeInactive === 'true' && req.user?.role === 'admin';
  const product = await productService.getProductById(
    parseInt(req.params.id),
    includeInactive
  );
  res.json({ product });
});

const create = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json({ product });
});

const update = catchAsync(async (req, res) => {
  const product = await productService.updateProduct(parseInt(req.params.id), req.body);
  res.json({ product });
});

const remove = catchAsync(async (req, res) => {
  const result = await productService.deleteProduct(parseInt(req.params.id));
  res.json(result);
});

const listVariants = catchAsync(async (req, res) => {
  const variants = await productService.getVariantsByProductId(
    parseInt(req.params.id, 10)
  );
  res.json({ variants });
});

const createVariant = catchAsync(async (req, res) => {
  const variant = await productService.createVariant(
    parseInt(req.params.id, 10),
    req.body
  );
  res.status(201).json({ variant });
});

const updateVariant = catchAsync(async (req, res) => {
  const variant = await productService.updateVariant(
    parseInt(req.params.id, 10),
    parseInt(req.params.variantId, 10),
    req.body
  );
  res.json({ variant });
});

const removeVariant = catchAsync(async (req, res) => {
  const result = await productService.deleteVariant(
    parseInt(req.params.id, 10),
    parseInt(req.params.variantId, 10)
  );
  res.json(result);
});

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  listVariants,
  createVariant,
  updateVariant,
  removeVariant,
};
