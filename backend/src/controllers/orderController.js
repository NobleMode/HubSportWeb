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
   * Admin: Update order status manually
   * PATCH /api/orders/:id/status
   */
  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: 'Admin only' });
      }

      const updatedOrder = await orderService.updateOrderStatus(id, status);
      res.status(200).json({ success: true, data: updatedOrder, message: 'Status updated' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Process item return
   * PATCH /api/orders/items/:itemId/return
   */
  async returnItem(req, res, next) {
    try {
      const { itemId } = req.params;
      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: 'Admin only' });
      }

      const returnedItem = await orderService.returnOrderItem(itemId, req.body);
      res.status(200).json({ success: true, data: returnedItem, message: 'Item returned successfully' });
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

  /**
   * Upload payment proof (bill) for QR code payment
   * POST /api/orders/:id/payment-proof
   */
  async uploadPaymentProof(req, res, next) {
    try {
      const userId = req.user.id;
      const { id: orderId } = req.params;
      const paymentProofData = req.body;

      const proof = await orderService.uploadPaymentProof(
        userId,
        orderId,
        paymentProofData
      );

      res.status(201).json({
        success: true,
        message: 'Payment proof uploaded successfully. Waiting for admin approval.',
        data: proof,
      });
    } catch (error) {
      if (error.message.includes('not found') || error.message.includes('Unauthorized')) {
        return res.status(error.message.includes('Unauthorized') ? 403 : 404).json({
          success: false,
          message: error.message,
        });
      }
      next(error);
    }
  }

  /**
   * Get all pending payment proofs (Admin)
   * GET /api/orders/payment-proofs/pending
   */
  async getPendingPaymentProofs(req, res, next) {
    try {
      const proofs = await orderService.getPendingPaymentProofs();

      res.status(200).json({
        success: true,
        count: proofs.length,
        data: proofs,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Approve payment proof (Admin)
   * PATCH /api/orders/payment-proofs/:id/approve
   */
  async approvePaymentProof(req, res, next) {
    try {
      const adminId = req.user.id;
      const { id: proofId } = req.params;

      const proof = await orderService.approvePaymentProof(proofId, adminId);

      res.status(200).json({
        success: true,
        message: 'Payment proof approved. Order status updated to CONFIRMED.',
        data: proof,
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }
      next(error);
    }
  }

  /**
   * Reject payment proof (Admin)
   * PATCH /api/orders/payment-proofs/:id/reject
   */
  async rejectPaymentProof(req, res, next) {
    try {
      const adminId = req.user.id;
      const { id: proofId } = req.params;
      const { reason } = req.body;

      if (!reason) {
        return res.status(400).json({
          success: false,
          message: 'Rejection reason is required',
        });
      }

      const proof = await orderService.rejectPaymentProof(proofId, reason, adminId);

      res.status(200).json({
        success: true,
        message: 'Payment proof rejected',
        data: proof,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController();
