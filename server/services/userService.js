const prisma = require('../utils/prisma');
const AppError = require('../utils/AppError');

const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      companyName: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

const updateProfile = async (userId, data) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      companyName: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
};

// Admin: list customer accounts (with their order totals so the UI can derive
// order count + total spent).
const listUsers = async () => {
  return prisma.user.findMany({
    where: { role: 'customer' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      companyName: true,
      createdAt: true,
      orders: { select: { total: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

module.exports = { getProfile, updateProfile, listUsers };
