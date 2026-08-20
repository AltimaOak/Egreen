const prisma = require('../utils/prisma');
const AppError = require('../utils/AppError');

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

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const createCategory = async ({ name, slug, parentId }) => {
  const categorySlug = slug || slugify(name);
  const existing = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (existing) {
    throw new AppError('A category with this name already exists', 400);
  }
  return prisma.category.create({
    data: { name, slug: categorySlug, parentId: parentId ?? null },
  });
};

const updateCategory = async (id, { name, slug, parentId }) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new AppError('Category not found', 404);
  }
  return prisma.category.update({
    where: { id },
    data: {
      name: name ?? category.name,
      slug: slug || category.slug,
      parentId: parentId !== undefined ? parentId : category.parentId,
    },
  });
};

const deleteCategory = async (id) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new AppError('Category not found', 404);
  }
  try {
    return await prisma.category.delete({ where: { id } });
  } catch (err) {
    if (err.code === 'P2003') {
      throw new AppError('Cannot delete category that still has products', 400);
    }
    throw err;
  }
};

module.exports = {
  listCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
