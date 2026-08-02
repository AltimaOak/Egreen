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

module.exports = { list, getById };
