import productItemService from '../services/productItemService.js';

/**
 * Product Item Controller
 * Handles product item HTTP requests
 */
class ProductItemController {
  /**
   * Get all items for a product
   * GET /api/products/:productId/items
   */
  async getItemsByProductId(req, res, next) {
    try {
      const { productId } = req.params;
      const { status } = req.query;

      const items = await productItemService.getItemsByProductId(productId, status);

      res.status(200).json({
        success: true,
        count: items.length,
        data: items,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get item by ID
   * GET /api/product-items/:id
   */
  async getItemById(req, res, next) {
    try {
      const { id } = req.params;
      const item = await productItemService.getItemById(id);

      res.status(200).json({
        success: true,
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new product item
   * POST /api/product-items
   */
  async createItem(req, res, next) {
    try {
      const item = await productItemService.createItem(req.body);

      res.status(201).json({
        success: true,
        message: 'Product item created successfully',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update item
   * PUT /api/product-items/:id
   */
  async updateItem(req, res, next) {
    try {
      const { id } = req.params;
      const item = await productItemService.updateItem(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Product item updated successfully',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete item
   * DELETE /api/product-items/:id
   */
  async deleteItem(req, res, next) {
    try {
      const { id } = req.params;
      await productItemService.deleteItem(id);

      res.status(200).json({
        success: true,
        message: 'Product item deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
  /**
   * Log maintenance
   * POST /api/product-items/:id/maintenance
   */
  async logMaintenance(req, res, next) {
    try {
      const { id } = req.params;
      const result = await productItemService.logMaintenance(id, req.body);

      res.status(201).json({
        success: true,
        message: 'Maintenance logged successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Liquidate item
   * POST /api/product-items/:id/liquidate
   */
  async liquidate(req, res, next) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const item = await productItemService.liquidate(id, reason);

      res.status(200).json({
        success: true,
        message: 'Product item liquidated successfully',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get item history
   * GET /api/product-items/:id/history
   */
  async getItemHistory(req, res, next) {
    try {
      const { id } = req.params;
      const history = await productItemService.getItemHistory(id);

      res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductItemController();
