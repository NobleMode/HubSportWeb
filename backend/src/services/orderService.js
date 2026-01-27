import prisma from '../config/database.js';

/**
 * Order Service
 * Handles order processing business logic
 */
class OrderService {
  /**
   * Create a new order
   */
  async createOrder(userId, orderData) {
    const { items, shippingAddress, notes, paymentMethod, totalAmount, totalDeposit } = orderData;

    // Start a transaction to ensure data consistency
    return await prisma.$transaction(async (tx) => {
      // 1. Create the Order record
      const order = await tx.order.create({
        data: {
          userId,
          status: 'PENDING',
          totalAmount,
          totalDeposit,
          paymentMethod,
          shippingAddress,
          notes,
          orderItems: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              depositFee: item.depositFee || 0,
              isRental: item.type === 'RENTAL',
              rentalDays: item.rentalDays,
            })),
          },
        },
        include: {
          orderItems: true,
        },
      });

      // 2. Update stock for SALE items (Optional: depending on business rules)
      // We will skip strict stock management for now to avoid complexity, 
      // but ideally we should decrement stock here.

      return order;
    });
  }

  /**
   * Get all orders for a user
   */
  async getUserOrders(userId) {
    return await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get all orders (Admin)
   */
  async getAllOrders() {
    return await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async cancelOrder(orderId, userId) {
    // 1. Check if order exists and belongs to user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.userId !== userId) {
      throw new Error('Unauthorized to cancel this order');
    }

    // 2. Check if order is pending
    if (order.status !== 'PENDING') {
        throw new Error('Only pending orders can be cancelled');
    }

    // 3. Update status
    return prisma.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
    });
  }
}

export default new OrderService();
