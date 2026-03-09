import prisma from "../config/database.js";

/**
 * Shop Service
 * Handles shop business logic
 */
class ShopService {
  /**
   * Create a new shop
   */
  async createShop(userId, shopData) {
    const { name, description, avatarUrl, coverUrl } = shopData;

    return await prisma.$transaction(async (tx) => {
      // 1. Create the shop
      const shop = await tx.shop.create({
        data: {
          userId,
          name,
          description,
          avatarUrl,
          coverUrl,
          isActive: true,
        },
      });

      // 2. Update user role to SELLER
      await tx.user.update({
        where: { id: userId },
        data: { role: "SELLER" },
      });

      return shop;
    });
  }

  /**
   * Get shop by User ID
   */
  async getShopByUserId(userId) {
    return await prisma.shop.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Get shop by ID
   */
  async getShopById(id) {
    return await prisma.shop.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
  }

  /**
   * Update shop
   */
  async updateShop(id, shopData) {
    return await prisma.shop.update({
      where: { id },
      data: shopData,
    });
  }

  /**
   * Get all shops with optional filtering
   */
  async getAllShops(query = {}) {
    const { isActive = true } = query;

    return await prisma.shop.findMany({
      where: {
        isActive: isActive === "true" || isActive === true,
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Get all orders for a specific shop (Seller Dashboard)
   */
  async getShopOrders(shopId) {
    return await prisma.shopOrder.findMany({
      where: { shopId },
      include: {
        order: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Update shop balance (Settle earnings)
   * This should be called when a ShopOrder is DELIVERED/COMPLETED
   */
  async settleShopOrder(shopOrderId) {
    return await prisma.$transaction(async (tx) => {
      const shopOrder = await tx.shopOrder.findUnique({
        where: { id: shopOrderId },
        include: { shop: true },
      });

      if (!shopOrder || shopOrder.status === "DELIVERED") return shopOrder; // Already settled

      // Update shop order status
      const updatedShopOrder = await tx.shopOrder.update({
        where: { id: shopOrderId },
        data: { status: "DELIVERED" },
      });

      // Credit the shop's balance
      await tx.shop.update({
        where: { id: shopOrder.shopId },
        data: {
          balance: {
            increment: shopOrder.sellerEarning,
          },
        },
      });

      return updatedShopOrder;
    });
  }

  /**
   * Request withdrawal
   */
  async requestWithdrawal(shopId, withdrawalData) {
    const { amount, bankName, accountNumber, accountName } = withdrawalData;

    return await prisma.$transaction(async (tx) => {
      // Get shop and check balance
      const shop = await tx.shop.findUnique({ where: { id: shopId } });

      if (!shop) {
        throw new Error("Shop not found");
      }

      if (shop.balance < amount) {
        throw new Error("Insufficient balance");
      }

      if (amount < 50000) {
        throw new Error("Minimum withdrawal amount is 50,000 VND");
      }

      // Create withdrawal request
      const withdrawal = await tx.withdrawal.create({
        data: {
          shopId,
          amount,
          bankName,
          accountNumber,
          accountName,
          status: "PENDING",
        },
      });

      // Deduct from shop balance (reserve funds)
      await tx.shop.update({
        where: { id: shopId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      return withdrawal;
    });
  }

  /**
   * Get withdrawal history for a shop
   */
  async getWithdrawalHistory(shopId) {
    return await prisma.withdrawal.findMany({
      where: { shopId },
      orderBy: { createdAt: "desc" },
    });
  }
}

export default new ShopService();
