import * as shopEarningsService from '../services/shopEarningsService.js';
import prisma from '../config/database.js';

/**
 * Get shop earnings summary (Shop owner)
 */
export const getShopEarnings = async (req, res, next) => {
  try {
    const shopId = req.params.shopId;
    const userId = req.user.id;

    // Verify shop ownership
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found',
      });
    }

    if (shop.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this shop',
      });
    }

    const summary = await shopEarningsService.getShopEarningsSummary(shopId);

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Request withdrawal (Shop owner)
 */
export const requestWithdrawal = async (req, res, next) => {
  try {
    const shopId = req.params.shopId;
    const userId = req.user.id;
    const { amount, bankName, accountNumber, accountName } = req.body;

    // Validate required fields
    if (!amount || !bankName || !accountNumber || !accountName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: amount, bankName, accountNumber, accountName',
      });
    }

    // Verify shop ownership
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found',
      });
    }

    if (shop.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this shop',
      });
    }

    const withdrawal = await shopEarningsService.requestWithdrawal(shopId, {
      amount: parseFloat(amount),
      bankName,
      accountNumber,
      accountName,
    });

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      data: withdrawal,
    });
  } catch (err) {
    if (err.message.includes('Insufficient balance') || err.message.includes('Withdrawal amount')) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    next(err);
  }
};

/**
 * Get withdrawal history (Shop owner)
 */
export const getWithdrawalHistory = async (req, res, next) => {
  try {
    const shopId = req.params.shopId;
    const userId = req.user.id;

    // Verify shop ownership
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found',
      });
    }

    if (shop.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this shop',
      });
    }

    const history = await shopEarningsService.getAllWithdrawals({
      shopId,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
    });

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all withdrawal requests (Admin)
 */
export const getAllWithdrawals = async (req, res, next) => {
  try {
    const status = req.query.status || null;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await shopEarningsService.getAllWithdrawals({
      status,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Approve withdrawal request (Admin)
 */
export const approveWithdrawal = async (req, res, next) => {
  try {
    const withdrawalId = req.params.withdrawalId;
    const adminId = req.user.id;

    const withdrawal = await shopEarningsService.approveWithdrawal(withdrawalId, adminId);

    res.status(200).json({
      success: true,
      message: 'Withdrawal request approved',
      data: withdrawal,
    });
  } catch (err) {
    if (err.message.includes('not found') || err.message.includes('Cannot approve')) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    next(err);
  }
};

/**
 * Complete withdrawal (Admin - mark as transferred)
 */
export const completeWithdrawal = async (req, res, next) => {
  try {
    const withdrawalId = req.params.withdrawalId;
    const adminId = req.user.id;

    const withdrawal = await shopEarningsService.completeWithdrawal(withdrawalId, adminId);

    res.status(200).json({
      success: true,
      message: 'Withdrawal completed successfully',
      data: withdrawal,
    });
  } catch (err) {
    if (err.message.includes('not found') || err.message.includes('must be APPROVED')) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    next(err);
  }
};

/**
 * Reject withdrawal request (Admin)
 */
export const rejectWithdrawal = async (req, res, next) => {
  try {
    const withdrawalId = req.params.withdrawalId;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required',
      });
    }

    const withdrawal = await shopEarningsService.rejectWithdrawal(withdrawalId, reason);

    res.status(200).json({
      success: true,
      message: 'Withdrawal request rejected',
      data: withdrawal,
    });
  } catch (err) {
    if (err.message.includes('not found') || err.message.includes('Cannot reject')) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    next(err);
  }
};

/**
 * Get platform statistics (Admin)
 */
export const getPlatformStatistics = async (req, res, next) => {
  try {
    const stats = await shopEarningsService.getPlatformStatistics();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  getShopEarnings,
  requestWithdrawal,
  getWithdrawalHistory,
  getAllWithdrawals,
  approveWithdrawal,
  completeWithdrawal,
  rejectWithdrawal,
  getPlatformStatistics,
};
