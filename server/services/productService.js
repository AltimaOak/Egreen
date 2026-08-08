const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/AppError');

const prisma = new PrismaClient();

const productInclude = {
  category: { select: { id: true, name: true, slug: true } },
  brand: { select: { id: true, name: true, slug: true } },
};

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Resolve a brandId from a brand name, creating the brand if it doesn't exist.
const resolveBrandId = async (brandName) => {
  if (!brandName) return null;
  const slug = slugify(brandName);
  const brand = await prisma.brand.upsert({
    where: { slug },
    update: {},
    create: { name: brandName, slug },
  });
  return brand.id;
};

// Build a Prisma data object from the admin product payload. Falls back to the
// existing row's values (when `existing` is passed) for fields not supplied.
const buildProductData = async (input, existing) => {
  const data = {
    name: input.name,
    slug: input.slug || (input.name ? slugify(input.name) : existing?.slug || ''),
    sku: input.sku !== undefined ? input.sku : existing?.sku ?? null,
    description:
      input.description !== undefined
        ? input.description
        : existing?.description ?? null,
    condition: input.condition || existing?.condition || 'New',
    stock: input.stock || existing?.stock || 'In Stock',
    specs: input.specs !== undefined ? input.specs : existing?.specs ?? '',
    image: input.image !== undefined ? input.image : existing?.image ?? '',
    imagePublicId:
      input.imagePublicId !== undefined
        ? input.imagePublicId
        : existing?.imagePublicId ?? null,
    price: input.price !== undefined ? input.price : existing?.price ?? null,
    offerPrice:
      input.offerPrice !== undefined ? input.offerPrice : existing?.offerPrice ?? null,
    rating: input.rating !== undefined ? input.rating : existing?.rating ?? null,
    seoTitle: input.seoTitle !== undefined ? input.seoTitle : existing?.seoTitle ?? null,
    seoDescription:
      input.seoDescription !== undefined
        ? input.seoDescription
        : existing?.seoDescription ?? null,
    isFeatured:
      input.isFeatured !== undefined ? input.isFeatured : existing?.isFeatured ?? false,
    isActive: input.isActive !== undefined ? input.isActive : existing?.isActive ?? true,
  };

  // JSON columns are only written when explicitly provided.
  if (input.features !== undefined) data.features = input.features;
  if (input.gallery !== undefined) data.gallery = input.gallery;

  if (input.categorySlug) {
    const category = await prisma.category.findUnique({
      where: { slug: input.categorySlug },
    });
    if (!category) {
      throw new AppError(`Category not found: ${input.categorySlug}`, 400);
    }
    data.categoryId = category.id;
  } else if (existing) {
    data.categoryId = existing.categoryId;
  }

  if (input.brandName !== undefined) {
    data.brandId = input.brandName ? await resolveBrandId(input.brandName) : null;
  } else if (existing) {
    data.brandId = existing.brandId;
  }

  return data;
};

const listProducts = async ({ category, brand, search, page = 1, limit = 20 }) => {
  const where = {};

  if (category && category !== 'all') {
    where.category = { slug: category };
  }

  if (brand) {
    where.brand = { slug: brand };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { specs: { contains: search, mode: 'insensitive' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return product;
};

const createProduct = async (input) => {
  const data = await buildProductData(input);
  return prisma.product.create({ data, include: productInclude });
};

const updateProduct = async (id, input) => {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Product not found', 404);
  }

  const data = await buildProductData(input, existing);
  return prisma.product.update({ where: { id }, data, include: productInclude });
};

const deleteProduct = async (id) => {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Product not found', 404);
  }

  try {
    await prisma.product.delete({ where: { id } });
    return { deleted: true, soft: false };
  } catch (err) {
    // FK constraint (referenced by orders/cart) — soft delete instead.
    if (err.code === 'P2003') {
      await prisma.product.update({ where: { id }, data: { isActive: false } });
      return { deleted: true, soft: true };
    }
    throw err;
  }
};

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
