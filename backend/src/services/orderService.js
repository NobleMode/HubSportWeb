import prisma from "../config/database.js";

/**
 * Order Service
 * Handles order processing business logic
 */
class OrderService {
  /**
   * Create a new order
   */
  async createOrder(userId, orderData) {
    const {
      items,
      shippingAddress,
      notes,
      paymentMethod,
      totalAmount,
      totalDeposit,
    } = orderData;

    // Start a transaction to ensure data consistency
    return await prisma.$transaction(async (tx) => {
      // 1. Group items by shopId to create ShopOrders
      const itemsByShop = items.reduce((acc, item) => {
        const shopId = item.shopId || null; // Use null if no shopId (meaning admin/hub product)
        const key = shopId || "admin";
        if (!acc[key]) acc[key] = { shopId, items: [] };
        acc[key].items.push(item);
        return acc;
      }, {});

      // 2. Prepare ShopOrders data
      const shopOrdersData = Object.values(itemsByShop).map((shopGroup) => {
        const shopItems = shopGroup.items;
        const shopTotalAmount = shopItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
        const shopTotalDeposit = shopItems.reduce(
          (sum, item) => sum + (item.depositFee || 0) * item.quantity,
          0,
        );

        // Calculate Commission (Default 5% or from Shop model)
        const commissionRate = shopGroup.shopId ? 5.0 : 0; // No commission for admin
        const commissionFee = (shopTotalAmount * commissionRate) / 100;
        const sellerEarning = shopTotalAmount - commissionFee;

        return {
          shopId: shopGroup.shopId,
          status: "PENDING",
          totalAmount: shopTotalAmount,
          totalDeposit: shopTotalDeposit,
          commissionRate,
          commissionFee,
          sellerEarning,
          orderItems: {
            create: shopItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              depositFee: item.depositFee || 0,
              isRental: item.type === "RENTAL",
              rentalDays: item.rentalDays,
            })),
          },
        };
      });

      // 3. Create the Main Order record with nested ShopOrders
      const order = await tx.order.create({
        data: {
          userId,
          status: "PENDING",
          totalAmount,
          totalDeposit,
          paymentMethod,
          shippingAddress,
          billingAddress,
          notes,
          shopOrders: {
            create: shopOrdersData,
          },
        },
        include: {
          shopOrders: {
            include: {
              orderItems: true,
            },
          },
        },
      });

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
        shopOrders: {
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
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
          },
        },
        shopOrders: {
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
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
        shopOrders: {
          include: {
            orderItems: {
              include: {
                product: true,
                productItem: true, // Include specific product item info if assigned
              },
            },
            shipment: true,
          },
        },
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
      throw new Error("Order not found");
    }

    if (order.userId !== userId) {
      throw new Error("Unauthorized to cancel this order");
    }

    // 2. Check if order is pending
    if (order.status !== "PENDING") {
      throw new Error("Only pending orders can be cancelled");
    }

    // 3. Start transaction to cancel main order, shop orders, and update items
    return await prisma.$transaction(async (tx) => {
      // 3a. Update Main Order
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
      });

      // 3b. Update all ShopOrders
      await tx.shopOrder.updateMany({
        where: { orderId: orderId },
        data: { status: "CANCELLED" },
      });

      // 3c. If there were physical product items tied to the order (e.g. rentals), revert their status to AVAILABLE
      const orderItems = await tx.orderItem.findMany({
        where: { shopOrder: { orderId: orderId } },
        select: { productItemId: true },
      });

      const productItemIds = orderItems
        .map((i) => i.productItemId)
        .filter((id) => id !== null);

      if (productItemIds.length > 0) {
        await tx.productItem.updateMany({
          where: { id: { in: productItemIds } },
          data: { status: "AVAILABLE" },
        });
      }

    });
  }

  /**
   * Admin: Update order status manually
   */
  async updateOrderStatus(orderId, status) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error("Order not found");

    return await prisma.$transaction(async (tx) => {
      // Update Main Order
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status },
      });

      // Update nested ShopOrders
      await tx.shopOrder.updateMany({
        where: { orderId },
        data: { status },
      });

      // Handle specific status effects (e.g., RETURNED, CANCELLED)
      if (status === "RETURNED" || status === "CANCELLED") {
        const orderItems = await tx.orderItem.findMany({
          where: { shopOrder: { orderId } },
          select: { productItemId: true },
        });

        const productItemIds = orderItems
          .map((i) => i.productItemId)
          .filter((id) => id !== null);

        if (productItemIds.length > 0) {
          await tx.productItem.updateMany({
            where: { id: { in: productItemIds } },
            data: { status: "AVAILABLE" },
          });
        }
      }

      return updatedOrder;
    });
  }

  /**
   * Admin: Process a return for a specific rental item
   */
  async returnOrderItem(itemId, returnData) {
    const { condition, lateFee, notes, imagesAfter } = returnData;

    return await prisma.$transaction(async (tx) => {
      // 1. Update OrderItem
      const item = await tx.orderItem.update({
        where: { id: itemId },
        data: {
          returnedAt: new Date(),
          condition,
          lateFee: lateFee ? parseFloat(lateFee) : 0,
          notes,
          rentalImagesAfter: imagesAfter || [],
        },
      });

      // 2. Free up the physical product item
      if (item.productItemId) {
        await tx.productItem.update({
          where: { id: item.productItemId },
          data: { status: condition === "DAMAGED" || condition === "LOST" ? "MAINTENANCE" : "AVAILABLE" },
        });
      }

      return item;
    });
  }

  /**
   * Admin: Report damage or issue for a rental item
   */
  async reportOrderItemDamage(itemId, reportData) {
    const { condition, damageFee, notes } = reportData;

    return await prisma.$transaction(async (tx) => {
      // 1. Update OrderItem
      const item = await tx.orderItem.update({
        where: { id: itemId },
        data: {
          condition,
          damageFee: damageFee ? parseFloat(damageFee) : 0,
          notes,
        },
      });

      // 2. Put product item into maintenance
      if (item.productItemId) {
        await tx.productItem.update({
          where: { id: item.productItemId },
          data: { status: "MAINTENANCE" },
        });

        // Optional: Auto-create maintenance log
        await tx.maintenanceLog.create({
          data: {
            productItemId: item.productItemId,
            type: "Damage Report",
            description: notes || `Reported as ${condition}`,
            cost: damageFee ? parseFloat(damageFee) : 0,
          }
        });
      }

      return item;
    });
  }
}

export default new OrderService();
