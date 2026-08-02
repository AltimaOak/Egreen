const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/AppError');

const prisma = new PrismaClient();

const getCart = async (userId) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: { select: { id: true, name: true, slug: true } },
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: { select: { id: true, name: true, slug: true } },
              },
            },
          },
        },
      },
    });
  }

  return cart;
};

const addItem = async (userId, productId, quantity) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Get or create cart
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  // Check if item already exists in cart
  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  if (existingItem) {
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
      include: {
        product: {
          include: {
            category: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });
  }

  return prisma.cartItem.create({
    data: { cartId: cart.id, productId, quantity },
    include: {
      product: {
        include: {
          category: { select: { id: true, name: true, slug: true } },
        },
      },
    },
  });
};

const updateItemQuantity = async (userId, itemId, quantity) => {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });

  if (!cartItem) {
    throw new AppError('Cart item not found', 404);
  }

  if (cartItem.cart.userId !== userId) {
    throw new AppError('Unauthorized', 403);
  }

  if (quantity < 1) {
    throw new AppError('Quantity must be at least 1', 400);
  }

  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
    include: {
      product: {
        include: {
          category: { select: { id: true, name: true, slug: true } },
        },
      },
    },
  });
};

const removeItem = async (userId, itemId) => {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });

  if (!cartItem) {
    throw new AppError('Cart item not found', 404);
  }

  if (cartItem.cart.userId !== userId) {
    throw new AppError('Unauthorized', 403);
  }

  await prisma.cartItem.delete({ where: { id: itemId } });
  return { message: 'Item removed from cart' };
};

module.exports = { getCart, addItem, updateItemQuantity, removeItem };
