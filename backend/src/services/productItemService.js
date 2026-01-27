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

    return prisma.productItem.create({
      data,
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
    return prisma.productItem.delete({
      where: { id },
    });
  }
}

export default new ProductItemService();
