const express = require('express');
const { z } = require('zod');
const validate = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { enquiryLimiter } = require('../middleware/rateLimiter');
const { create, listMine } = require('../controllers/enquiryController');

const router = express.Router();

const createEnquirySchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  productId: z.number().int().positive().optional(),
  message: z.string().min(1, 'Message is required').max(5000),
});

router.post('/', enquiryLimiter, validate(createEnquirySchema), create);
router.get('/mine', protect, listMine);

module.exports = router;
