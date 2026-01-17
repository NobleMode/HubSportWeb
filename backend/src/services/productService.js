import prisma from '../config/database.js';

/**
 * Product Service
 * Handles product business logic
 */
class ProductService {
  /**
   * Get all products
   */
  async getAllProducts(filters = {}) {
    const { type, category, isActive = true } = filters;

    const where = {
      isActive,
      ...(type && { type }),
      ...(category && { category }),
    };

    const products = await prisma.product.findMany({
      where,
      include: {
        productItems: {
          where: { status: 'AVAILABLE' },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    // Calculate average rating for each product
    const productsWithRating = products.map((product) => {
      const avgRating =
        product.reviews.length > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
          : 0;

      return {
        ...product,
        averageRating: avgRating,
        availableStock: product.productItems.length,
        reviews: undefined, // Remove reviews array from response
      };
    });

    return productsWithRating;
  }

  /**
   * Get product by ID
   */
  async getProductById(id) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        productItems: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  /**
   * Create new product
   */
  async createProduct(data) {
    const product = await prisma.product.create({
      data,
    });

    return product;
  }

  /**
   * Update product
   */
  async updateProduct(id, data) {
    const product = await prisma.product.update({
      where: { id },
      data,
    });

    return product;
  }

  /**
   * Delete product
   */
  async deleteProduct(id) {
    await prisma.product.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully' };
  }
}

export default new ProductService();
