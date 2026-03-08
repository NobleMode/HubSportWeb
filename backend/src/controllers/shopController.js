import shopService from "../services/shopService.js";
import prisma from "../config/database.js";

/**
 * Shop Controller
 * Handles shop HTTP requests
 */
class ShopController {
  /**
   * Register a new shop
   * POST /api/shops
   */
  async registerShop(req, res, next) {
    try {
      const userId = req.user.id; // From auth middleware
      const shop = await shopService.createShop(userId, req.body);

      res.status(201).json({
        success: true,
        message: "Shop registered successfully",
        data: shop,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user's shop
   * GET /api/shops/my-shop
   */
  async getMyShop(req, res, next) {
    try {
      const userId = req.user.id;
      const shop = await shopService.getShopByUserId(userId);

      if (!shop) {
        return res.status(404).json({
          success: false,
          message: "You don't have a shop yet",
        });
      }

      res.status(200).json({
        success: true,
        data: shop,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get shop by ID (Public profile)
   * GET /api/shops/:id
   */
  async getShopById(req, res, next) {
    try {
      const { id } = req.params;
      const shop = await shopService.getShopById(id);

      res.status(200).json({
        success: true,
        data: shop,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update shop profile
   * PUT /api/shops/my-shop
   */
  async updateMyShop(req, res, next) {
    try {
      const userId = req.user.id;
      const existingShop = await shopService.getShopByUserId(userId);

      if (!existingShop) {
        return res.status(404).json({
          success: false,
          message: "Shop not found",
        });
      }

      const shop = await shopService.updateShop(existingShop.id, req.body);

      res.status(200).json({
        success: true,
        message: "Shop updated successfully",
        data: shop,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all shops
   * GET /api/shops
   */
  async getAllShops(req, res, next) {
    try {
      const shops = await shopService.getAllShops(req.query);

      res.status(200).json({
        success: true,
        count: shops.length,
        data: shops,
      });
    } catch (error) {
      next(error);
    }
  }
  /**
   * Get orders for the current user's shop
   * GET /api/shops/my-orders
   */
  async getMyOrders(req, res, next) {
    try {
      const userId = req.user.id;
      const shop = await shopService.getShopByUserId(userId);

      if (!shop) {
        return res.status(404).json({
          success: false,
          message: "Shop not found",
        });
      }

      const orders = await shopService.getShopOrders(shop.id);

      res.status(200).json({
        success: true,
        count: orders.length,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Settle/Complete a shop order (Credit earnings to seller)
   * PATCH /api/shops/orders/:id/settle
   */
  async settleOrder(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const shop = await shopService.getShopByUserId(userId);
      const shopOrder = await prisma.shopOrder.findUnique({ where: { id } });

      if (!shop || !shopOrder || shopOrder.shopId !== shop.id) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to settle this order",
        });
      }

      const updatedOrder = await shopService.settleShopOrder(id);

      res.status(200).json({
        success: true,
        message: "Order settled and earnings credited to your balance",
        data: updatedOrder,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ShopController();
