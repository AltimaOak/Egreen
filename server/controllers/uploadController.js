const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { uploadImage, deleteImage } = require('../utils/cloudinary');

// Verify the file's magic bytes so a spoofed `Content-Type` (e.g. an HTML or
// executable labelled image/png) can't be uploaded to the Cloudinary CDN.
const isImageBuffer = (buf) => {
  if (!buf || buf.length < 12) return false;
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true;
  // PNG: 89 50 4E 47
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return true;
  // GIF: "GIF8"
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return true;
  // WebP: "RIFF"...."WEBP"
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return true;
  return false;
};

const upload = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError('No image file provided', 400);
  }

  if (!isImageBuffer(req.file.buffer)) {
    throw new AppError('Uploaded file is not a valid image', 400);
  }

  // TODO: Offload image upload, compression, and Cloudinary streaming to a background job queue (e.g. BullMQ/Redis)
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
