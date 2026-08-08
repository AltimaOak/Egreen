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

const create = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json({ category });
});

const update = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategory(parseInt(req.params.id), req.body);
  res.json({ category });
});

const remove = catchAsync(async (req, res) => {
  await categoryService.deleteCategory(parseInt(req.params.id));
  res.json({ success: true });
});

module.exports = { list, getBySlug, create, update, remove };
