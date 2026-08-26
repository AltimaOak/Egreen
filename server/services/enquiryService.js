const prisma = require('../utils/prisma');
const AppError = require('../utils/AppError');

// Simple HTML-escaping to reduce XSS risk in user-submitted text
const sanitize = (str) => {
  if (!str) return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

const createEnquiry = async (data, userId) => {
  const { name, email, phone, companyName, productId, message } = data;

  // Validate product exists if productId provided
  if (productId) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new AppError('Product not found', 404);
    }
  }

  const enquiry = await prisma.enquiry.create({
    data: {
      userId: userId || null,
      name: sanitize(name),
      email: sanitize(email),
      phone: phone ? sanitize(phone) : null,
      companyName: companyName ? sanitize(companyName) : null,
      productId: productId || null,
      message: sanitize(message),
    },
    include: {
      product: { select: { id: true, name: true } },
    },
  });

  return enquiry;
};

const getUserEnquiries = async (userId) => {
  return prisma.enquiry.findMany({
    where: { userId },
    include: {
      product: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

module.exports = { createEnquiry, getUserEnquiries };
