const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { uploadImage, deleteImage } = require('../utils/cloudinary');

const upload = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError('No image file provided', 400);
  }

  const { url, publicId } = await uploadImage(req.file.buffer);
  res.status(201).json({ url, publicId });
});

const remove = catchAsync(async (req, res) => {
  const { publicId } = req.params;
  if (!publicId) {
    throw new AppError('publicId is required', 400);
  }

  await deleteImage(publicId);
  res.json({ success: true });
});

module.exports = { upload, remove };
