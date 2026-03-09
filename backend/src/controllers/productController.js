import productService from "../services/productService.js";
import shopService from "../services/shopService.js";

/**
 * Product Controller
 * Handles product HTTP requests
 */
class ProductController {
  /**
   * Get all products
   * GET /api/products
   */
  async getAllProducts(req, res, next) {
    try {
      const { type, category, isActive, isRecommended, search, minPrice, maxPrice, shopId } =
        req.query;

      const products = await productService.getAllProducts({
        type,
        category,
        isActive: isActive === "false" ? false : true,
        ...(isRecommended !== undefined && { isRecommended: isRecommended === "true" }),
        search,
        minPrice,
        maxPrice,
        shopId,
      });

      res.status(200).json({
        success: true,
        count: products.length,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get product by ID
   * GET /api/products/:id
   */
  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new product (Admin only)
   * POST /api/products
   */
  async createProduct(req, res, next) {
    try {
      // If user is SELLER, automatically assign their shopId
      if (req.user.role === "SELLER") {
        const shop = await shopService.getShopByUserId(req.user.id);
        if (!shop) {
          return res.status(403).json({
            success: false,
            message: "You must create a shop before adding products",
          });
        }
        req.body.shopId = shop.id;
      }

      const product = await productService.createProduct(req.body);

      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update product (Admin only)
   * PUT /api/products/:id
   */
  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;

      // Ownership check for SELLER
      if (req.user.role === "SELLER") {
        const product = await productService.getProductById(id);
        const shop = await shopService.getShopByUserId(req.user.id);

        if (!shop || product.shopId !== shop.id) {
          return res.status(403).json({
            success: false,
            message: "You are not authorized to update this product",
          });
        }
      }

      const product = await productService.updateProduct(id, req.body);

      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete product (Admin only)
   * DELETE /api/products/:id
   */
  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;

      // Ownership check for SELLER
      if (req.user.role === "SELLER") {
        const product = await productService.getProductById(id);
        const shop = await shopService.getShopByUserId(req.user.id);

        if (!shop || product.shopId !== shop.id) {
          return res.status(403).json({
            success: false,
            message: "You are not authorized to delete this product",
          });
        }
      }

      await productService.deleteProduct(id);

      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all categories
   * GET /api/products/categories
   */
  async getCategories(req, res, next) {
    try {
      const categories = await productService.getCategories();

      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();
