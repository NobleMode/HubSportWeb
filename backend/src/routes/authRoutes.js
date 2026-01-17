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
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authMiddleware, authController.getProfile.bind(authController));

/**
 * @route   GET /api/auth/users
 * @desc    Get all users
 * @access  Public
 */
router.get('/users', authController.getAllUsers.bind(authController));

/**
 * @route   GET /api/auth/users/:id
 * @desc    Get user by ID
 * @access  Public
 */
router.get('/users/:id', authController.getUserById.bind(authController));

export default router;
