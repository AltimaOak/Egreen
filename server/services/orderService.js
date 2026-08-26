const prisma = require('../utils/prisma');
const AppError = require('../utils/AppError');

const placeOrder = async (userId, notes) => {
  // Fetch the user's cart with items
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty', 400);
  }

  // Calculate total and validate stock
  let total = 0;
  for (const item of cart.items) {
    const price = item.product.price || 0;
    total += Number(price) * item.quantity;
  }

  // Execute everything as a transaction
  const order = await prisma.$transaction(async (tx) => {
    // Decrement stock for each product
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: 'Low Stock' },
      });
    }

    // Create order with items
    const newOrder = await tx.order.create({
      data: {
        userId,
        total,
        notes,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price || 0,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, image: true, specs: true },
            },
          },
        },
      },
    });

    // Clear the cart
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    // Create invoice skeleton
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(newOrder.id).padStart(4, '0')}`;
    await tx.invoice.create({
      data: {
        invoiceNumber,
        orderId: newOrder.id,
        total,
        status: 'draft',
      },
    });

    return newOrder;
  });

  return order;
};

const getUserOrders = async (userId) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, image: true, specs: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

const getOrderById = async (userId, orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, image: true, specs: true },
          },
        },
      },
    },
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.userId !== userId) {
    throw new AppError('Unauthorized', 403);
  }

  return order;
};

// Admin: all orders with customer info and item/brand details.
const listAllOrders = async () => {
  return prisma.order.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true, phone: true, companyName: true },
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              image: true,
              specs: true,
              brand: { select: { name: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

// Admin: update an order's status.
const updateOrderStatus = async (orderId, status) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    throw new AppError('Order not found', 404);
  }
  return prisma.order.update({ where: { id: orderId }, data: { status } });
};

module.exports = {
  placeOrder,
  getUserOrders,
  getOrderById,
  listAllOrders,
  updateOrderStatus,
};
