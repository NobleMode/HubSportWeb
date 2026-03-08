import express from "express";
import couponController from "../controllers/couponController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Public / User routes
router.post("/validate", authMiddleware, couponController.validateCoupon);

// Admin only routes
router.use(authMiddleware, authorize("ADMIN"));

router.get("/", couponController.getAllCoupons);
router.post("/", couponController.createCoupon);
router.get("/:id", couponController.getCouponById);
router.put("/:id", couponController.updateCoupon);
router.delete("/:id", couponController.deleteCoupon);

export default router;
