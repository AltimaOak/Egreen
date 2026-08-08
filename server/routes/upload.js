const express = require('express');
const multer = require('multer');
const AppError = require('../utils/AppError');
const { upload, remove } = require('../controllers/uploadController');

const router = express.Router();

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

router.post('/', uploadMiddleware.single('image'), upload);
router.delete('/:publicId', remove);

module.exports = router;
