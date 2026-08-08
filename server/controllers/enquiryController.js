const enquiryService = require('../services/enquiryService');
const catchAsync = require('../utils/catchAsync');

const create = catchAsync(async (req, res) => {
  const enquiry = await enquiryService.createEnquiry(req.body, req.user?.id);
  res.status(201).json({ enquiry });
});

const listMine = catchAsync(async (req, res) => {
  const enquiries = await enquiryService.getUserEnquiries(req.user.id);
  res.json({ enquiries });
});

module.exports = { create, listMine };
