import prisma from '../config/database.js';

const PLATFORM_FEE_RATE = 0.10; // 10% platform fee

/**
 * Calculate and update shop earnings when order is confirmed/completed
 * @param {string} shopOrderId - Shop order ID
 */
export const calculateShopEarnings = async (shopOrderId) => {
  return await prisma.$transaction(async (tx) => {
    // Fetch shop order with related data
    const shopOrder = await tx.shopOrder.findUnique({
      where: { id: shopOrderId },
      include: {
        shop: true,
        orderItems: true,
      },
    });

    if (!shopOrder) {
      throw new Error('Shop order not found');
    }

    // Calculate total amount (excluding deposits during sale, including for rental return calculations)
    let totalAmount = shopOrder.totalAmount;

    // Calculate platform fee (10% of total amount)
    const platformFee = parseFloat((totalAmount * PLATFORM_FEE_RATE).toFixed(2));

    // Calculate seller earning (total - platform fee)
    const sellerEarning = parseFloat((totalAmount - platformFee).toFixed(2));

    // Update shop order with calculated fees
    const updatedShopOrder = await tx.shopOrder.update({
      where: { id: shopOrderId },
      data: {
        commissionRate: PLATFORM_FEE_RATE * 100, // 10%
        commissionFee: platformFee,
        sellerEarning: sellerEarning,
      },
    });

    // Update shop balance (add seller earning)
    await tx.shop.update({
      where: { id: shopOrder.shopId },
      data: {
        balance: {
          increment: sellerEarning,
        },
      },
    });

    return {
      shopOrder: updatedShopOrder,
      totalAmount,
      platformFee,
      sellerEarning,
    };
  });
};

/**
 * Get shop earnings summary
 * @param {string} shopId - Shop ID
 */
export const getShopEarningsSummary = async (shopId) => {
  const shop = await prisma.shop.findUnique({
    where: { id: shopId },
    include: {
      shopOrders: {
        where: { status: 'CONFIRMED' },
      },
      withdrawals: {
        where: { status: { in: ['PENDING', 'APPROVED', 'COMPLETED'] } },
      },
    },
  });

  if (!shop) {
    throw new Error('Shop not found');
  }

  // Calculate total earnings from confirmed orders
  const totalEarnings = shop.shopOrders.reduce((sum, order) => sum + (order.sellerEarning || 0), 0);

  // Calculate total platform fees collected
  const totalPlatformFees = shop.shopOrders.reduce((sum, order) => sum + (order.commissionFee || 0), 0);

  // Calculate pending withdrawals
  const pendingWithdrawals = shop.withdrawals.reduce((sum, w) => {
    if (w.status === 'PENDING') return sum + w.amount;
    return sum;
  }, 0);

  // Calculate completed withdrawals
  const completedWithdrawals = shop.withdrawals.reduce((sum, w) => {
    if (w.status === 'COMPLETED') return sum + w.amount;
    return sum;
  }, 0);

  // Available balance = current balance - pending withdrawals
  const availableBalance = Math.max(0, shop.balance - pendingWithdrawals);

  return {
    shopId: shop.id,
    shopName: shop.name,
    currentBalance: shop.balance,
    availableBalance,
    totalEarnings,
    totalPlatformFees,
    totalWithdrawn: completedWithdrawals,
    pendingWithdrawals,
    withdrawalHistory: shop.withdrawals,
  };
};

/**
 * Request withdrawal from shop
 * @param {string} shopId - Shop ID
 * @param {object} withdrawalData - Withdrawal request data
 */
export const requestWithdrawal = async (shopId, withdrawalData) => {
  const { amount, bankName, accountNumber, accountName } = withdrawalData;

  return await prisma.$transaction(async (tx) => {
    // Fetch shop
    const shop = await tx.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      throw new Error('Shop not found');
    }

    // Get pending withdrawals amount
    const pendingWithdrawals = await tx.withdrawal.aggregate({
      where: { shopId, status: 'PENDING' },
      _sum: { amount: true },
    });

    const totalPending = pendingWithdrawals._sum.amount || 0;
    const availableBalance = shop.balance - totalPending;

    // Validate amount
    if (amount <= 0) {
      throw new Error('Withdrawal amount must be greater than 0');
    }

    if (amount > availableBalance) {
      throw new Error(
        `Insufficient balance. Available: ${availableBalance}đ, Requested: ${amount}đ`
      );
    }

    // Create withdrawal request
    const withdrawal = await tx.withdrawal.create({
      data: {
        shopId,
        amount,
        bankName,
        accountNumber,
        accountName,
        status: 'PENDING',
      },
    });

    return withdrawal;
  });
};

/**
 * Approve withdrawal request (Admin)
 * @param {string} withdrawalId - Withdrawal ID
 * @param {string} adminId - Admin user ID
 */
export const approveWithdrawal = async (withdrawalId, adminId) => {
  return await prisma.$transaction(async (tx) => {
    const withdrawal = await tx.withdrawal.findUnique({
      where: { id: withdrawalId },
      include: { shop: true },
    });

    if (!withdrawal) {
      throw new Error('Withdrawal request not found');
    }

    if (withdrawal.status !== 'PENDING') {
      throw new Error(`Cannot approve withdrawal with status: ${withdrawal.status}`);
    }

    // Update withdrawal status
    const updatedWithdrawal = await tx.withdrawal.update({
      where: { id: withdrawalId },
      data: {
        status: 'APPROVED',
        processedAt: new Date(),
      },
    });

    return updatedWithdrawal;
  });
};

/**
 * Complete withdrawal (Admin - mark as completed after bank transfer)
 * @param {string} withdrawalId - Withdrawal ID
 * @param {string} adminId - Admin user ID
 */
export const completeWithdrawal = async (withdrawalId, adminId) => {
  return await prisma.$transaction(async (tx) => {
    const withdrawal = await tx.withdrawal.findUnique({
      where: { id: withdrawalId },
      include: { shop: true },
    });

    if (!withdrawal) {
      throw new Error('Withdrawal request not found');
    }

    if (withdrawal.status !== 'APPROVED') {
      throw new Error(
        `Withdrawal must be APPROVED before completing. Current status: ${withdrawal.status}`
      );
    }

    // Update withdrawal status
    const updatedWithdrawal = await tx.withdrawal.update({
      where: { id: withdrawalId },
      data: {
        status: 'COMPLETED',
        processedAt: new Date(),
      },
    });

    // Deduct from shop balance
    await tx.shop.update({
      where: { id: withdrawal.shopId },
      data: {
        balance: {
          decrement: withdrawal.amount,
        },
      },
    });

    return updatedWithdrawal;
  });
};

/**
 * Reject withdrawal request (Admin)
 * @param {string} withdrawalId - Withdrawal ID
 * @param {string} reason - Rejection reason
 */
export const rejectWithdrawal = async (withdrawalId, reason) => {
  return await prisma.$transaction(async (tx) => {
    const withdrawal = await tx.withdrawal.findUnique({
      where: { id: withdrawalId },
    });

    if (!withdrawal) {
      throw new Error('Withdrawal request not found');
    }

    if (withdrawal.status !== 'PENDING') {
      throw new Error(`Cannot reject withdrawal with status: ${withdrawal.status}`);
    }

    // Update withdrawal status
    const updatedWithdrawal = await tx.withdrawal.update({
      where: { id: withdrawalId },
      data: {
        status: 'REJECTED',
        notes: reason,
        processedAt: new Date(),
      },
    });

    return updatedWithdrawal;
  });
};

/**
 * Get all withdrawal requests (Admin)
 * @param {object} options - Query options (status, page, limit)
 */
export const getAllWithdrawals = async (options = {}) => {
  const { status = null, page = 1, limit = 20, shopId = null } = options;

  const where = {};
  if (status) where.status = status;
  if (shopId) where.shopId = shopId;

  const skip = (page - 1) * limit;

  const [withdrawals, total] = await Promise.all([
    prisma.withdrawal.findMany({
      where,
      include: {
        shop: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.withdrawal.count({ where }),
  ]);

  return {
    data: withdrawals,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get platform statistics (Admin)
 */
export const getPlatformStatistics = async () => {
  const [shops, allOrders, allWithdrawals] = await Promise.all([
    prisma.shop.findMany(),
    prisma.shopOrder.findMany({
      where: { status: 'CONFIRMED' },
    }),
    prisma.withdrawal.findMany({
      where: { status: 'COMPLETED' },
    }),
  ]);

  const totalPlatformFees = allOrders.reduce((sum, order) => sum + (order.commissionFee || 0), 0);
  const totalShopEarnings = allOrders.reduce((sum, order) => sum + (order.sellerEarning || 0), 0);
  const totalWithdrawn = allWithdrawals.reduce((sum, w) => sum + w.amount, 0);
  const totalShopBalance = shops.reduce((sum, shop) => sum + shop.balance, 0);

  return {
    totalShops: shops.length,
    totalOrders: allOrders.length,
    totalPlatformFees,
    totalShopEarnings,
    totalWithdrawn,
    outstandingBalance: totalShopBalance - totalWithdrawn,
  };
};
