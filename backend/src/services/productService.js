import prisma from "../config/database.js";

/**
 * Product Service
 * Handles product business logic
 */
class ProductService {
  /**
   * Get all products
   */
  async getAllProducts(filters = {}) {
    const {
      type,
      category,
      isActive = true,
      search,
      minPrice,
      maxPrice,
      shopId,
    } = filters;

    const where = {
      isActive,
      ...(type && { type }),
      ...(category && { category }),
      ...(shopId && { shopId }),
    };

    // Search filter (name or description)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Price filter
    // Checks if either salePrice or rentalPrice falls within the range
    if (minPrice || maxPrice) {
      const priceConditions = [];
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Number.MAX_SAFE_INTEGER;

      // Condition for Sale Price
      priceConditions.push({
        salePrice: {
          gte: min,
          lte: max,
        },
      });

      // Condition for Rental Price
      priceConditions.push({
        rentalPrice: {
          gte: min,
          lte: max,
        },
      });

      // Combine with existing OR or create new AND
      if (where.OR) {
        where.AND = [
          { OR: where.OR }, // Preserve Search OR
          { OR: priceConditions }, // Price OR
        ];
        delete where.OR;
      } else {
        where.OR = priceConditions;
      }
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        shop: {
          select: {
            id: true,
            name: true,
          },
        },
        productItems: {
          where: { status: "AVAILABLE" },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate average rating for each product
    const productsWithRating = products.map((product) => {
      const avgRating =
        product.reviews.length > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
            product.reviews.length
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
        shop: true,
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
      throw new Error("Product not found");
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

    return { message: "Product deleted successfully" };
  }
}

export default new ProductService();
