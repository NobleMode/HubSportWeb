import express from 'express';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import orderRoutes from './orderRoutes.js';
import userRoutes from './userRouter.js';

const router = express.Router();

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SportHub API is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * API Routes
 */
import productItemRoutes from './productItemRoutes.js';

// ... imports

// ...

/**
 * API Routes
 */
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/product-items', productItemRoutes);
router.use('/orders', orderRoutes);
router.use('/users', userRoutes);

export default router;
