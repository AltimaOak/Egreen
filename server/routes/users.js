const express = require('express');
const { z } = require('zod');
const validate = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/userController');

const router = express.Router();

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().optional(),
  companyName: z.string().optional(),
});

router.use(protect);

router.get('/me', getProfile);
router.put('/me', validate(updateProfileSchema), updateProfile);

module.exports = router;
