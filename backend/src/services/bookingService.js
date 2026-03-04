import prisma from "../config/database.js";

class BookingService {
  async createBooking(data) {
    const { userId, expertId, bookingDate, duration, notes } = data;

    // 1. Fetch User and ExpertProfile
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const expertProfile = await prisma.expertProfile.findUnique({
      where: { id: expertId },
      include: { user: true },
    });

    if (!expertProfile) {
      const error = new Error("Expert not found");
      error.statusCode = 404;
      throw error;
    }

    if (!expertProfile.isAvailable) {
      const error = new Error("Expert is currently unavailable for bookings");
      error.statusCode = 400;
      throw error;
    }

    if (expertProfile.userId === userId) {
      const error = new Error("You cannot book yourself");
      error.statusCode = 400;
      throw error;
    }

    // 2. Calculate Costs and Commissions
    const hourlyRate = expertProfile.hourlyRate;
    const totalAmount = hourlyRate * duration;

    if (user.balance < totalAmount) {
      const error = new Error(`Insufficient balance. Booking requires ${totalAmount} VND, but your balance is ${user.balance} VND.`);
      error.statusCode = 400;
      throw error;
    }

    const commissionRate = 0.10; // 10% platform fee
    const commissionFee = totalAmount * commissionRate;
    const expertEarning = totalAmount - commissionFee;

    // 3. Execute Transaction
    return await prisma.$transaction(async (tx) => {
      // Deduct from User
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: totalAmount } },
      });

      // Add to Expert
      const updatedExpertUser = await tx.user.update({
        where: { id: expertProfile.userId },
        data: { balance: { increment: expertEarning } },
      });

      // Create Booking
      const booking = await tx.booking.create({
        data: {
          userId,
          expertId,
          bookingDate: new Date(bookingDate),
          duration,
          totalAmount,
          notes,
          status: "CONFIRMED", // Auto-confirming since payment is deducted upfront
        },
      });

      // Create Payment Transaction for User
      await tx.transaction.create({
        data: {
          userId,
          type: "PAYMENT",
          amount: -totalAmount,
          description: `Payment for booking expert ${updatedExpertUser.name || 'Expert'} for ${duration} hours`,
        },
      });

      // Create Income Transaction for Expert
      await tx.transaction.create({
        data: {
          userId: expertProfile.userId,
          type: "INCOME",
          amount: expertEarning,
          description: `Income from booking by user ${user.name || user.email} for ${duration} hours (after 10% fee)`,
        },
      });

      // Update Expert Stats
      await tx.expertProfile.update({
        where: { id: expertId },
        data: {
          totalBookings: { increment: 1 },
        },
      });

      return booking;
    });
  }

  async getUserBookings(userId, role) {
    if (role === "EXPERT") {
      // Find based on ExpertProfile id
      const expertProfile = await prisma.expertProfile.findUnique({
        where: { userId },
      });
      
      if (expertProfile) {
        return prisma.booking.findMany({
          where: { expertId: expertProfile.id },
          include: {
            user: { select: { id: true, name: true, email: true, phone: true } },
          },
          orderBy: { createdAt: 'desc' },
        });
      }
    }

    // Default to getting bookings user has made
    return prisma.booking.findMany({
      where: { userId },
      include: {
        expert: { 
          include: { 
            user: { select: { id: true, name: true, email: true, phone: true } }
          }
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export default new BookingService();
