import express from "express";
import { authMiddleware as protect } from "../middlewares/authMiddleware.js";
import bookingController from "../controllers/bookingController.js";

const router = express.Router();

// Apply auth middleware to all booking routes
router.use(protect);

// Create a new booking
router.post("/", bookingController.createBooking);

// Get bookings for the current user (either as customer or expert)
router.get("/my-bookings", bookingController.getMyBookings);

export default router;
