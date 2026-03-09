import express from "express";
import shopController from "../controllers/shopController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import { SCOPES } from "../config/permissions.js";

const router = express.Router();

/**
 * @route   GET /api/shops
 * @desc    Get all active shops
 * @access  Public
 */
router.get("/", shopController.getAllShops.bind(shopController));

/**
 * @route   GET /api/shops/my-shop
 * @desc    Get current user's shop profile
 * @access  Private
 */
router.get(
  "/my-shop",
  authMiddleware,
  shopController.getMyShop.bind(shopController),
);

/**
 * @route   GET /api/shops/:id
 * @desc    Get shop by ID
 * @access  Public
 */
router.get("/:id", shopController.getShopById.bind(shopController));

/**
 * @route   POST /api/shops
 * @desc    Register a new shop
 * @access  Private
 */
router.post(
  "/",
  authMiddleware,
  shopController.registerShop.bind(shopController),
);

/**
 * @route   PUT /api/shops/my-shop
 * @desc    Update current user's shop profile
 * @access  Private (Seller/Admin)
 */
router.put(
  "/my-shop",
  authMiddleware,
  authorize(SCOPES.MANAGE_SHOP),
  shopController.updateMyShop.bind(shopController),
);

/**
 * @route   GET /api/shops/my-orders
 * @desc    Get orders for the current user's shop
 * @access  Private (Seller)
 */
router.get(
  "/my-orders",
  authMiddleware,
  authorize(SCOPES.MANAGE_SHOP),
  shopController.getMyOrders.bind(shopController),
);

/**
 * @route   PATCH /api/shops/orders/:id/settle
 * @desc    Settle a shop order and credit earnings
 * @access  Private (Seller)
 */
router.patch(
  "/orders/:id/settle",
  authMiddleware,
  authorize(SCOPES.MANAGE_SHOP),
  shopController.settleOrder.bind(shopController),
);

/**
 * @route   POST /api/shops/withdraw
 * @desc    Request withdrawal from shop balance
 * @access  Private (Seller)
 */
router.post(
  "/withdraw",
  authMiddleware,
  authorize(SCOPES.MANAGE_SHOP),
  shopController.requestWithdrawal.bind(shopController),
);

/**
 * @route   GET /api/shops/withdrawals
 * @desc    Get withdrawal history
 * @access  Private (Seller)
 */
router.get(
  "/withdrawals",
  authMiddleware,
  authorize(SCOPES.MANAGE_SHOP),
  shopController.getWithdrawalHistory.bind(shopController),
);

export default router;
