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

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const createBrand = async ({ name, slug, logoUrl }) => {
  const brandSlug = slug || slugify(name);
  const existing = await prisma.brand.findUnique({ where: { slug: brandSlug } });
  if (existing) {
    throw new AppError('A brand with this name already exists', 400);
  }
  return prisma.brand.create({
    data: { name, slug: brandSlug, logoUrl: logoUrl || null },
  });
};

const updateBrand = async (id, { name, slug, logoUrl }) => {
  const brand = await prisma.brand.findUnique({ where: { id } });
  if (!brand) {
    throw new AppError('Brand not found', 404);
  }
  return prisma.brand.update({
    where: { id },
    data: {
      name: name ?? brand.name,
      slug: slug || brand.slug,
      logoUrl: logoUrl !== undefined ? logoUrl : brand.logoUrl,
    },
  });
};

const deleteBrand = async (id) => {
  const brand = await prisma.brand.findUnique({ where: { id } });
  if (!brand) {
    throw new AppError('Brand not found', 404);
  }
  return prisma.brand.delete({ where: { id } });
};

module.exports = {
  listBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
};
