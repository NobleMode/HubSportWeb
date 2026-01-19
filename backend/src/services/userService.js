import bcrypt from "bcrypt";
import prisma from "../config/database.js";
import { generateToken, generateRefreshToken } from "../utils/jwtUtils.js";
import { ROLE_SCOPES } from "../config/permissions.js";

/**
 * Auth Service
 * Handles authentication business logic
 */
class UserService {
  async getAllUsers() {
    return prisma.user.findMany();
  }
  async getAllUsersByRole(role) {
    const r = role.toUpperCase();
    return prisma.user.findMany({ where: { role: r } });
  }

  async getUserById(id) {
    return prisma.user.findUnique({ where: { id } });
  }

  async upgradeToExpert(userId, expertData) {
    const { bio, specialization, hourlyRate } = expertData;

    return prisma.$transaction(async (tx) => {
      // 1. Update User Role
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { role: "EXPERT" },
      });

      // 2. Create Expert Profile
      const expertProfile = await tx.expertProfile.create({
        data: {
          userId,
          bio,
          specialization,
          hourlyRate: parseFloat(hourlyRate),
        },
      });

      return { user: updatedUser, expertProfile };
    });
  }

  async updateExpertProfile(userId, data) {
    const { bio, specialization, hourlyRate, videoUrl, gallery, socialLinks } =
      data;

    // Check if profile exists
    const existingProfile = await prisma.expertProfile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      throw new Error("Expert profile not found");
    }

    return prisma.expertProfile.update({
      where: { userId },
      data: {
        bio,
        specialization,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
        videoUrl,
        gallery,
        socialLinks,
      },
    });
  }
}

export default new UserService();
