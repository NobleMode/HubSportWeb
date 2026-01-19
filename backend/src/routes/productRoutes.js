import express from 'express';
import productController from '../controllers/productController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';
import { SCOPES } from '../config/permissions.js';

const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Public
 */
router.get('/', productController.getAllProducts.bind(productController));

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get('/:id', productController.getProductById.bind(productController));

/**
 * @route   POST /api/products
 * @desc    Create new product
 * @access  Private/Admin
 */
router.post('/', authMiddleware, authorize(SCOPES.MANAGE_PRODUCTS), productController.createProduct.bind(productController));

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Private/Admin
 */
router.put('/:id', authMiddleware, authorize(SCOPES.MANAGE_PRODUCTS), productController.updateProduct.bind(productController));

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Private/Admin
 */
router.delete('/:id', authMiddleware, authorize(SCOPES.MANAGE_PRODUCTS), productController.deleteProduct.bind(productController));

export default router;
