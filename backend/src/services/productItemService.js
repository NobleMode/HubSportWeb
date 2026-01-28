import prisma from '../config/database.js';

/**
 * Product Item Service
 * Handles inventory item business logic
 */
class ProductItemService {
  /**
   * Get all items for a product
   */
  async getItemsByProductId(productId, status) {
    const where = {
      productId,
      ...(status && { status }),
    };

    return prisma.productItem.findMany({
      where,
      orderBy: { serialNumber: 'asc' },
    });
  }

  /**
   * Get item by ID
   */
  async getItemById(id) {
    const item = await prisma.productItem.findUnique({
      where: { id },
      include: {
        product: {
          select: { name: true, type: true },
        },
      },
    });

    if (!item) {
      throw new Error('Product item not found');
    }

    return item;
  }

  /**
   * Create new product item
   */
  async createItem(data) {
    // Ensure product exists and is of type RENTAL
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new Error('Associated product not found');
    }

    // Uniqueness of serialNumber is handled by DB constraint
    // But we could add a check here if needed

    // Use transaction to create item and increment product stock
    return prisma.$transaction(async (tx) => {
      const item = await tx.productItem.create({
        data,
      });

      await tx.product.update({
        where: { id: data.productId },
        data: { stock: { increment: 1 } },
      });

      return item;
    });
  }

  /**
   * Update item status or details
   */
  async updateItem(id, data) {
    return prisma.productItem.update({
      where: { id },
      data,
    });
  }


  /**
   * Delete item
   */
  async deleteItem(id) {
    const item = await prisma.productItem.findUnique({ where: { id } });
    if (!item) throw new Error('Item not found');

    return prisma.$transaction(async (tx) => {
      await tx.productItem.delete({
        where: { id },
      });

      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: 1 } },
      });
      
      return { success: true };
    });
  }

  /**
   * Log maintenance activity
   */
  async logMaintenance(id, logData) {
    const { type, description, cost, performedBy, status } = logData;

    // Use transaction to update item and create log
    return prisma.$transaction(async (tx) => {
      const item = await tx.productItem.update({
        where: { id },
        data: {
          maintenanceStatus: status || 'COMPLETED',
          lastMaintenanceDate: new Date(),
          maintenanceNotes: description,
        },
      });

      const log = await tx.maintenanceLog.create({
        data: {
          productItemId: id,
          type,
          description,
          cost: parseFloat(cost) || 0,
          performedBy,
          completedAt: new Date(),
        },
      });

      return { item, log };
    });
  }


  /**
   * Liquidate item
   */
  async liquidate(id, reason) {
    const item = await prisma.productItem.findUnique({ where: { id } });
    if (!item) throw new Error('Item not found');

    return prisma.$transaction(async (tx) => {
      const updatedItem = await tx.productItem.update({
        where: { id },
        data: {
          isForLiquidation: true,
          liquidationReason: reason,
          condition: 'DISPOSED',
          disposedAt: new Date(),
          status: 'LOST', 
        },
      });

      // Decrement stock as it's no longer usable
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: 1 } },
      });

      return updatedItem;
    });
  }

  /**
   * Get item history (Maintenance + Rentals)
   */
  async getItemHistory(id) {
    const maintenanceLogs = await prisma.maintenanceLog.findMany({
      where: { productItemId: id },
      orderBy: { createdAt: 'desc' },
    });

    const orderItems = await prisma.orderItem.findMany({
      where: { productItemId: id },
      include: {
        order: {
          select: { id: true, status: true, createdAt: true, user: { select: { name: true, email: true } } }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    // Combine and sort
    const history = [
      ...maintenanceLogs.map(l => ({ ...l, eventType: 'MAINTENANCE', date: l.createdAt })),
      ...orderItems.map(o => ({ ...o, eventType: 'RENTAL', date: o.createdAt }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    return history;
  }
}

export default new ProductItemService();
