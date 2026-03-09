import express from 'express';
import shopEarningsController from '../controllers/shopEarningsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import { SCOPES } from '../config/permissions.js';

const router = express.Router();

// Protected routes (require login)
router.use(authMiddleware);

/**
 * @route   GET /api/shop-earnings/:shopId
 * @desc    Get shop earnings summary
 * @access  Private (Shop Owner)
 */
router.get('/:shopId', shopEarningsController.getShopEarnings.bind(shopEarningsController));

/**
 * @route   POST /api/shop-earnings/:shopId/withdrawal
 * @desc    Request withdrawal of earnings
 * @access  Private (Shop Owner)
 */
router.post(
  '/:shopId/withdrawal',
  shopEarningsController.requestWithdrawal.bind(shopEarningsController)
);

/**
 * @route   GET /api/shop-earnings/:shopId/withdrawal-history
 * @desc    Get withdrawal history for a shop
 * @access  Private (Shop Owner)
 */
router.get(
  '/:shopId/withdrawal-history',
  shopEarningsController.getWithdrawalHistory.bind(shopEarningsController)
);

/**
 * @route   GET /api/shop-earnings/admin/withdrawals
 * @desc    Get all withdrawal requests (Admin)
 * @access  Private (Admin)
 */
router.get(
  '/admin/withdrawals',
  authorize(SCOPES.MANAGE_ORDERS),
  shopEarningsController.getAllWithdrawals.bind(shopEarningsController)
);

/**
 * @route   PATCH /api/shop-earnings/admin/withdrawal/:withdrawalId/approve
 * @desc    Approve withdrawal request (Admin)
 * @access  Private (Admin)
 */
router.patch(
  '/admin/withdrawal/:withdrawalId/approve',
  authorize(SCOPES.MANAGE_ORDERS),
  shopEarningsController.approveWithdrawal.bind(shopEarningsController)
);

/**
 * @route   PATCH /api/shop-earnings/admin/withdrawal/:withdrawalId/complete
 * @desc    Complete withdrawal (mark as transferred)
 * @access  Private (Admin)
 */
router.patch(
  '/admin/withdrawal/:withdrawalId/complete',
  authorize(SCOPES.MANAGE_ORDERS),
  shopEarningsController.completeWithdrawal.bind(shopEarningsController)
);

/**
 * @route   PATCH /api/shop-earnings/admin/withdrawal/:withdrawalId/reject
 * @desc    Reject withdrawal request (Admin)
 * @access  Private (Admin)
 */
router.patch(
  '/admin/withdrawal/:withdrawalId/reject',
  authorize(SCOPES.MANAGE_ORDERS),
  shopEarningsController.rejectWithdrawal.bind(shopEarningsController)
);

/**
 * @route   GET /api/shop-earnings/admin/statistics
 * @desc    Get platform earnings statistics (Admin)
 * @access  Private (Admin)
 */
router.get(
  '/admin/statistics',
  authorize(SCOPES.MANAGE_ORDERS),
  shopEarningsController.getPlatformStatistics.bind(shopEarningsController)
);

export default router;
