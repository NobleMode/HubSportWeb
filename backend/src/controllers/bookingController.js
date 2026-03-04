import bookingService from "../services/bookingService.js";

class BookingController {
  createBooking = async (req, res, next) => {
    try {
      const { expertId, bookingDate, duration, notes } = req.body;
      const userId = req.user.id;

      if (!expertId || !bookingDate || !duration) {
        return res.status(400).json({
          success: false,
          message: "Please provide expertId, bookingDate, and duration",
        });
      }

      const booking = await bookingService.createBooking({
        userId,
        expertId,
        bookingDate,
        duration,
        notes,
      });

      res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  };

  getMyBookings = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const role = req.user.role; // CUSTOMER, EXPERT, etc.

      const bookings = await bookingService.getUserBookings(userId, role);

      res.status(200).json({
        success: true,
        data: bookings,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new BookingController();
