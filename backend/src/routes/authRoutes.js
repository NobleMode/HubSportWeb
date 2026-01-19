import express from 'express';
import authController from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authController.register.bind(authController));

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', authController.login.bind(authController));

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh Access Token using Cookie
 * @access  Public (Cookie required)
 */
router.post('/refresh-token', authController.refreshToken.bind(authController));

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Public
 */
router.post('/logout', authController.logout.bind(authController));

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authMiddleware, authController.getProfile.bind(authController));

/**
 * @route   PUT /api/auth/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/profile', authMiddleware, authController.updateProfile.bind(authController));

export default router;
