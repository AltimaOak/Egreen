const categoryService = require('../services/categoryService');
const catchAsync = require('../utils/catchAsync');

const list = catchAsync(async (req, res) => {
  const categories = await categoryService.listCategories();
  res.json({ categories });
});

const getBySlug = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryBySlug(req.params.slug);
  res.json({ category });
});

module.exports = { list, getBySlug };
