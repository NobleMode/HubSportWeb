import express from 'express';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';

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
router.use('/auth', authRoutes);
router.use('/products', productRoutes);

export default router;
