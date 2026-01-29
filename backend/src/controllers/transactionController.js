import prisma from '../config/database.js';

/**
 * Transaction Controller
 */
class TransactionController {
  /**
   * Get my transactions
   * GET /api/transactions
   */
  async getMyTransactions(req, res, next) {
    try {
      const userId = req.user.id;
      
      const transactions = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      res.status(200).json({
        success: true,
        data: transactions,
      });
    } catch (error) {
        next(error);
    }
  }
}

export default new TransactionController();
