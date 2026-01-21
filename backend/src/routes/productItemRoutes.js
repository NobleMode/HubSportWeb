import express from 'express';
import productItemController from '../controllers/productItemController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import { SCOPES } from '../config/permissions.js';

const router = express.Router({ mergeParams: true });

// Note: We might access this via /api/products/:productId/items OR /api/product-items
// For now, let's treat this as /api/product-items, but enable mergeParams just in case we nest it later.

/**
 * @route   GET /api/product-items/:id
 * @desc    Get product item by ID
 * @access  Public
 */
router.get('/:id', productItemController.getItemById.bind(productItemController));

/**
 * @route   POST /api/product-items
 * @desc    Create new product item
 * @access  Private/Admin
 */
router.post('/', authMiddleware, authorize(SCOPES.MANAGE_PRODUCTS), productItemController.createItem.bind(productItemController));

/**
 * @route   PUT /api/product-items/:id
 * @desc    Update product item
 * @access  Private/Admin
 */
router.put('/:id', authMiddleware, authorize(SCOPES.MANAGE_PRODUCTS), productItemController.updateItem.bind(productItemController));

/**
 * @route   DELETE /api/product-items/:id
 * @desc    Delete product item
 * @access  Private/Admin
 */
router.delete('/:id', authMiddleware, authorize(SCOPES.MANAGE_PRODUCTS), productItemController.deleteItem.bind(productItemController));

export default router;
