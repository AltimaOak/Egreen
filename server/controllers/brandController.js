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

module.exports = { list, getById };
