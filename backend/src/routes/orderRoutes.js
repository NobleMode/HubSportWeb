import express from 'express';
import orderController from '../controllers/orderController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protected routes (require login)
router.use(authMiddleware);

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Private
 */
router.post('/', orderController.createOrder.bind(orderController));

/**
 * @route   GET /api/orders/my-orders
 * @desc    Get logged-in user's orders
 * @access  Private
 */
// Get logged-in user's orders (Private)
router.get('/my-orders', orderController.getMyOrders.bind(orderController));

/**
 * @route   PATCH /api/orders/:id/cancel
 * @desc    Cancel an order
 * @access  Private
 */
router.patch('/:id/cancel', orderController.cancelOrder.bind(orderController));

export default router;
