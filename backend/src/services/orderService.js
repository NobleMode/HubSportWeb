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
    const { items, shippingAddress, billingAddress, notes, paymentMethod, totalAmount, totalDeposit } = orderData;
    const finalTotal = totalAmount + totalDeposit;

    // Start a transaction to ensure data consistency
    return await prisma.$transaction(async (tx) => {
      // 1. If paying by WALLET, check balance and deduct
      if (paymentMethod === 'WALLET') {
         const user = await tx.user.findUnique({ where: { id: userId } });
         if (user.balance < finalTotal) {
             throw new Error("Insufficient wallet balance");
         }

         // Deduct balance
         await tx.user.update({
             where: { id: userId },
             data: { balance: { decrement: finalTotal } }
         });

         // Create Transaction Record
         await tx.transaction.create({
             data: {
                 userId,
                 type: 'PAYMENT',
                 amount: -finalTotal,
                 description: `Payment for Order`,
             }
         });
      }

      // 2. Create the Order record
      const order = await tx.order.create({
        data: {
          userId,
          status: 'PENDING',
          totalAmount,
          totalDeposit,
          paymentMethod,
          shippingAddress,
          billingAddress,
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

      // 3. Update stock for SALE items and Status for RENTAL items
      for (const item of items) {
          if (item.type === 'SALE') {
              await tx.product.update({
                  where: { id: item.productId },
                  data: { stock: { decrement: item.quantity } }
              });
          } else if (item.type === 'RENTAL') {
              // Mark specific ProductItems as RENTING (This is simplified, ideally we pick specific serialNumbers)
              // For now, we assume we just need to track the Product availability broadly or pick available items.
              // To notify "some" items are taken:
              // Find available items
              const availableItems = await tx.productItem.findMany({
                  where: { productId: item.productId, status: 'AVAILABLE' },
                  take: item.quantity
              });

              // Availability check removed to allow orders when stock is insufficient (fulfillment handled later)
              // if (availableItems.length < item.quantity) {
              //     throw new Error(`Not enough available items for rental product: ${item.name}`);
              // }

              // Update them to RENTING
              await tx.productItem.updateMany({
                  where: { id: { in: availableItems.map(i => i.id) } },
                  data: { status: 'RENTING' }
              });
          }
      }

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

  /**
   * Get order by ID with full details
   */
  async getOrderById(orderId) {
    return await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true, 
            address: true
          }
        },
        orderItems: {
          include: {
            product: true,
            productItem: true, // Include specific product item info if assigned
          },
        },
        shipment: true,
        maintenanceLogs: true,
      },
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

    return await prisma.$transaction(async (tx) => {
        // 3. Update status
        const updatedOrder = await tx.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' },
        });

        // 4. Refund logic if paid by WALLET
        if (order.paymentMethod === 'WALLET') {
             const refundAmount = order.totalAmount + order.totalDeposit;
             
             await tx.user.update({
                 where: { id: userId },
                 data: { balance: { increment: refundAmount } }
             });

             await tx.transaction.create({
                 data: {
                     userId,
                     type: 'REFUND',
                     amount: refundAmount,
                     description: `Refund for Cancelled Order #${orderId.slice(0, 8)}`,
                 }
             });
        }
        
        return updatedOrder;
    });
  }

  /**
   * Update rental images for an order item
   * @param {string} orderItemId
   * @param {string} type 'BEFORE' or 'AFTER'
   * @param {string[]} images Array of image URLs
   */
  async updateOrderItemImages(orderItemId, type, images) {
    const field = type === 'BEFORE' ? 'rentalImagesBefore' : 'rentalImagesAfter';
    
    return await prisma.orderItem.update({
      where: { id: orderItemId },
      data: {
        [field]: images
      }
    });
  }

  /**
   * Report issue/damage for an order item
   * @param {string} orderItemId
   * @param {object} data { condition, damageFee, notes }
   */
  async updateOrderItemStatus(orderItemId, data) {
    const { condition, damageFee, notes } = data;
    
    return await prisma.orderItem.update({
      where: { id: orderItemId },
      data: {
        condition,
        damageFee: parseFloat(damageFee),
        notes
      }
    });
  }

  async getOrderItem(id) {
    return await prisma.orderItem.findUnique({
        where: { id },
        include: { product: true }
    });
  }
}

export default new OrderService();
