const prisma = require('../utils/prisma');
const AppError = require('../utils/AppError');

const productInclude = {
  category: { select: { id: true, name: true, slug: true } },
  brand: { select: { id: true, name: true, slug: true } },
  variants: true,
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
    stock: input.stock !== undefined ? (parseInt(input.stock, 10) || 0) : existing?.stock ?? 10,
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
    const categoryName = input.categorySlug
      .split('-')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');
    const category = await prisma.category.upsert({
      where: { slug: input.categorySlug },
      update: {},
      create: { name: categoryName, slug: input.categorySlug },
    });
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

const listProducts = async ({ category, brand, search, page = 1, limit = 20, includeInactive = false }) => {
  const where = {};

  // Public feed only shows active products. `includeInactive` is only ever
  // true for authenticated admins (set by the controller).
  if (!includeInactive) {
    where.isActive = true;
  }

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

  const [productsRaw, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  const products = productsRaw.map((p) => ({
    ...p,
    stock: typeof p.stock === 'number' ? p.stock : (parseInt(p.stock, 10) || 0),
  }));

  return {
    products,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

const getProductById = async (id, includeInactive = false) => {
  const product = await prisma.product.findFirst({
    where: includeInactive ? { id } : { id, isActive: true },
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

const createVariant = async (productId, input) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (input.isDefault) {
    await prisma.productVariant.updateMany({
      where: { productId },
      data: { isDefault: false },
    });
  }

  return prisma.productVariant.create({
    data: {
      productId,
      ram: input.ram !== undefined ? input.ram : null,
      storage: input.storage !== undefined ? input.storage : null,
      price: input.price !== undefined ? input.price : null,
      offerPrice: input.offerPrice !== undefined ? input.offerPrice : null,
      stock: input.stock !== undefined ? (parseInt(input.stock, 10) || 0) : 0,
      sku: input.sku !== undefined ? input.sku : null,
      isDefault: input.isDefault ?? false,
    },
  });
};

const updateVariant = async (productId, variantId, input) => {
  const existing = await prisma.productVariant.findFirst({
    where: { id: variantId, productId },
  });
  if (!existing) {
    throw new AppError('Product variant not found', 404);
  }

  if (input.isDefault) {
    await prisma.productVariant.updateMany({
      where: { productId, id: { not: variantId } },
      data: { isDefault: false },
    });
  }

  const data = {};
  if (input.ram !== undefined) data.ram = input.ram;
  if (input.storage !== undefined) data.storage = input.storage;
  if (input.price !== undefined) data.price = input.price;
  if (input.offerPrice !== undefined) data.offerPrice = input.offerPrice;
  if (input.stock !== undefined) data.stock = parseInt(input.stock, 10) || 0;
  if (input.sku !== undefined) data.sku = input.sku;
  if (input.isDefault !== undefined) data.isDefault = input.isDefault;

  return prisma.productVariant.update({
    where: { id: variantId },
    data,
  });
};

const deleteVariant = async (productId, variantId) => {
  const existing = await prisma.productVariant.findFirst({
    where: { id: variantId, productId },
  });
  if (!existing) {
    throw new AppError('Product variant not found', 404);
  }

  await prisma.productVariant.delete({
    where: { id: variantId },
  });

  return { deleted: true };
};

const getVariantsByProductId = async (productId) => {
  return prisma.productVariant.findMany({
    where: { productId },
    orderBy: { id: 'asc' },
  });
};

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getVariantsByProductId,
  createVariant,
  updateVariant,
  deleteVariant,
};
