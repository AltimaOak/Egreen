const express = require('express');
const { z } = require('zod');
const multer = require('multer');
const AppError = require('../utils/AppError');
const { protect } = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/requireAdmin');
const validate = require('../middleware/validateMiddleware');
const { upload, remove } = require('../controllers/uploadController');

const router = express.Router();

// Image upload/delete are admin-only operations (product & catalog images).
// Previously open to anyone, which let anonymous users write files to the
// Cloudinary account and delete product images by public_id.
router.use(protect, requireAdmin);

const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new AppError('Only image files are allowed', 400));
    }
  },
});

const publicIdSchema = z.object({ publicId: z.string().min(1) });

router.post('/', uploadMiddleware.single('image'), upload);
router.delete('/:publicId', validate.validateParams(publicIdSchema), remove);

module.exports = router;
