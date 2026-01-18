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
}

export default new OrderController();
