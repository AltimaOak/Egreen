const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/AppError');

const prisma = new PrismaClient();

const listBrands = async () => {
  return prisma.brand.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });
};

const getBrandById = async (id) => {
  const brand = await prisma.brand.findUnique({
    where: { id },
    include: {
      products: {
        include: {
          category: { select: { id: true, name: true, slug: true } },
        },
      },
    },
  });

  if (!brand) {
    throw new AppError('Brand not found', 404);
  }

  return brand;
};

module.exports = { listBrands, getBrandById };
