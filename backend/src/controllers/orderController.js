import orderService from '../services/orderService.js';

/**
 * Order Controller
 * Handles HTTP requests for orders
 */
class OrderController {
  /**
   * Create a new order
   * POST /api/orders
   */
  async createOrder(req, res, next) {
    try {
      const userId = req.user.id; // From authMiddleware
      const orderData = req.body;

      // Basic validation could be improved (e.g., using express-validator)
      if (!orderData.items || orderData.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Order must contain items',
        });
      }

      const order = await orderService.createOrder(userId, orderData);

      res.status(201).json({
        success: true,
        data: order,
        message: 'Order placed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user's orders
   * GET /api/orders/my-orders
   */
  async getMyOrders(req, res, next) {
    try {
      const userId = req.user.id;
      const orders = await orderService.getUserOrders(userId);

      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all orders (Admin)
   * GET /api/orders
   */
  async getAllOrders(req, res, next) {
    try {
      // Check if user is admin (Assuming middleware checks this, or we check here)
      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin only.',
        });
      }

      const orders = await orderService.getAllOrders();

      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cancel an order
   * PATCH /api/orders/:id/cancel
   */
  async cancelOrder(req, res, next) {
      try {
          const userId = req.user.id;
          const orderId = req.params.id;

          const order = await orderService.cancelOrder(orderId, userId);

          res.status(200).json({
              success: true,
              data: order,
              message: 'Order cancelled successfully'
          });
      } catch (error) {
          next(error);
      }
  }

  /**
   * Update rental images
   * PATCH /api/orders/items/:itemId/images
   */
  async updateOrderItemImages(req, res, next) {
      try {
          const { itemId } = req.params;
          const { type, images } = req.body; // type: 'BEFORE' | 'AFTER'

          const updatedItem = await orderService.updateOrderItemImages(itemId, type, images);

          res.status(200).json({
              success: true,
              data: updatedItem,
              message: 'Images updated successfully'
          });
      } catch (error) {
          next(error);
      }
  }

  /**
   * Report item issue
   * PATCH /api/orders/items/:itemId/report
   */
  async reportOrderItemIssue(req, res, next) {
      try {
          const { itemId } = req.params;
          const { condition, damageFee, notes } = req.body;

          const updatedItem = await orderService.updateOrderItemStatus(itemId, { condition, damageFee, notes });

          res.status(200).json({
              success: true,
              data: updatedItem,
              message: 'Item reported successfully'
          });
      } catch (error) {
          next(error);
      }
  }

  /**
   * Get order details by ID
   * GET /api/orders/:id
   */
  async getOrderDetails(req, res, next) {
      try {
          const orderId = req.params.id;
          const order = await orderService.getOrderById(orderId);

          if (!order) {
              return res.status(404).json({
                  success: false,
                  message: 'Order not found'
              });
          }

          res.status(200).json({
              success: true,
              data: order
          });
      } catch (error) {
          next(error);
      }
  }
}

export default new OrderController();
