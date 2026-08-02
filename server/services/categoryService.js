const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/AppError');

const prisma = new PrismaClient();

const listCategories = async () => {
  return prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
      children: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { name: 'asc' },
  });
};

const getCategoryBySlug = async (slug) => {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        include: {
          brand: { select: { id: true, name: true, slug: true } },
        },
      },
      children: { select: { id: true, name: true, slug: true } },
      parent: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  return category;
};

module.exports = { listCategories, getCategoryBySlug };
