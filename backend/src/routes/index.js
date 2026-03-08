import express from "express";
import authRoutes from "./authRoutes.js";
import productRoutes from "./productRoutes.js";
import orderRoutes from "./orderRoutes.js";
import userRoutes from "./userRouter.js";
import uploadRoutes from "./uploadRoutes.js";
import shopRoutes from "./shopRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import productItemRoutes from "./productItemRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import couponRoutes from "./couponRoutes.js";

const router = express.Router();

/**
 * Health check endpoint
 */
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EXERCISER API is running",
    timestamp: new Date().toISOString(),
  });
});

/**
 * API Routes
 */
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/product-items", productItemRoutes);
router.use("/orders", orderRoutes);
router.use("/users", userRoutes);
router.use("/upload", uploadRoutes);
router.use("/shops", shopRoutes);
router.use("/transactions", transactionRoutes);
router.use("/bookings", bookingRoutes);
router.use("/coupons", couponRoutes);

export default router;
