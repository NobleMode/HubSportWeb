import prisma from '../config/database.js';
import couponService from './couponService.js';

/**
 * Order Service
 * Handles order processing business logic
 */
class OrderService {
  /**
   * Create a new order
   */
  async createOrder(userId, orderData) {
    const { items, shippingAddress, billingAddress, notes, paymentMethod, totalAmount, totalDeposit, couponCode } = orderData;
    let finalTotal = totalAmount + totalDeposit;
    let discountAmount = 0;

    // Validate Coupon if provided
    if (couponCode) {
        // We need to import CouponService dynamically or at the top. I'll use dynamic import to avoid circular dep if any, or just import at top if safe.
        // Assuming OrderService is a singleton instance.
        // Better to import at the top, I will add the import in a separate edit or assume it's added.
        // For now, I will assume `couponService` is imported as `couponService` from `./couponService.js`
        const validation = await couponService.validateCoupon(couponCode, userId, finalTotal);
        discountAmount = validation.discountAmount;
        // recalculate final total
        finalTotal = validation.finalTotal; 
    }

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
          couponCode,
          discountAmount,
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
        
      if (couponCode) {
          // Record usage
          // We can't use the external service here easily because we are in a transaction $transaction(async (tx) ...
          // So we should replicate logic or pass tx to service. 
          // For simplicity, let's just do the DB update here manually or make sure we handle it.
          // The couponService.recordUsage uses a transaction internally too, which might conflict or need to be part of this one.
          // Let's implement record usage logic here directly using `tx`.
          
          const coupon = await tx.coupon.findUnique({ where: { code: couponCode } });
          await tx.couponUsage.create({
              data: {
                  couponId: coupon.id,
                  userId,
                  orderId: order.id
              }
          });
          await tx.coupon.update({
             where: { id: coupon.id },
             data: { usageCount: { increment: 1 } }
          });
      }

      // 3. Update stock for SALE items and Status for RENTAL items
      for (const item of items) {
          // ... (existing logic) -> I will invoke a separate edit because this block is too large to replace safely if I want to keep the rest
      }
      // Re-adding the loop for now to be safe with the ReplacementContent
      for (const item of items) {
          if (item.type === 'SALE') {
              await tx.product.update({
                  where: { id: item.productId },
                  data: { stock: { decrement: item.quantity } }
              });
          } else if (item.type === 'RENTAL') {
              const availableItems = await tx.productItem.findMany({
                  where: { productId: item.productId, status: 'AVAILABLE' },
                  take: item.quantity
              });

              if (availableItems.length < item.quantity) {
                  throw new Error(`Not enough available items for rental product: ${item.name}`);
              }

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
}

export default new OrderService();
