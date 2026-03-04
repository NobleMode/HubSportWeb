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
  async getAllUsersByRole(role, queryParams = {}) {
    const r = role.toUpperCase();
    const whereClause = { role: r };

    if (r === "EXPERT") {
      const expertProfileWhere = {};
      
      if (queryParams.specialization) {
        expertProfileWhere.specialization = {
          contains: queryParams.specialization,
          mode: "insensitive"
        };
      }
      
      if (queryParams.level) {
        expertProfileWhere.level = queryParams.level;
      }
      
      if (Object.keys(expertProfileWhere).length > 0) {
        whereClause.expertProfile = {
          is: expertProfileWhere
        };
      }
    }

    if (queryParams.city) {
      whereClause.address = {
        contains: queryParams.city,
        mode: "insensitive"
      };
    }

    return prisma.user.findMany({ 
      where: whereClause,
      include: {
        expertProfile: true
      }
    });
  }

  async getUserById(id) {
    return prisma.user.findUnique({ 
      where: { id },
      include: { expertProfile: true }
    });
  }

  async upgradeToExpert(userId, expertData) {
    const { bio, specialization, hourlyRate, videoUrl, socialLinks, imageUrl } = expertData;

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
          videoUrl,
          socialLinks,
          imageUrl, // Assuming 'avatar' maps to this
        },
      });

      return { user: updatedUser, expertProfile };
    });
  }

  async updateExpertProfile(userId, data) {
    const { bio, specialization, level, hourlyRate, videoUrl, gallery, socialLinks, isAvailable } =
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
        level,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
        videoUrl,
        gallery,
        socialLinks,
        isAvailable,
      },
    });
  }

  async updateUserRole(userId, role) {
    return prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }
}

export default new UserService();
