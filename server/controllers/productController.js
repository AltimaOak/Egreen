const productService = require('../services/productService');
const catchAsync = require('../utils/catchAsync');

const list = catchAsync(async (req, res) => {
  const { category, brand, search, page, limit } = req.query;
  const result = await productService.listProducts({
    category,
    brand,
    search,
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
  });

  res.json(result);
});

const getById = catchAsync(async (req, res) => {
  const product = await productService.getProductById(parseInt(req.params.id));
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

module.exports = { list, getById, create, update, remove };
