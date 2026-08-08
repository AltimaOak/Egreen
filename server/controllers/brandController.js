const brandService = require('../services/brandService');
const catchAsync = require('../utils/catchAsync');

const list = catchAsync(async (req, res) => {
  const brands = await brandService.listBrands();
  res.json({ brands });
});

const getById = catchAsync(async (req, res) => {
  const brand = await brandService.getBrandById(parseInt(req.params.id));
  res.json({ brand });
});

const create = catchAsync(async (req, res) => {
  const brand = await brandService.createBrand(req.body);
  res.status(201).json({ brand });
});

const update = catchAsync(async (req, res) => {
  const brand = await brandService.updateBrand(parseInt(req.params.id), req.body);
  res.json({ brand });
});

const remove = catchAsync(async (req, res) => {
  await brandService.deleteBrand(parseInt(req.params.id));
  res.json({ success: true });
});

module.exports = { list, getById, create, update, remove };
