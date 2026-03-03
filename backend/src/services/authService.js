// import bcrypt from "bcrypt";
import prisma from "../config/database.js";
import { generateToken, generateRefreshToken } from "../utils/jwtUtils.js";
import { ROLE_SCOPES } from "../config/permissions.js";

/**
 * Auth Service
 * Handles authentication business logic
 */
class AuthService {
  /**
   * Register a new user
   */
  async register(data) {
    const { email, password, role = "CUSTOMER", name } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Password already hashed (HMAC)
    const hashedPassword = password;

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        name,
        otpCode: data.otpCode,
        otpExpires: data.otpExpires,
        isVerified: data.isVerified ?? false,
      },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        isVerified: true,
        createdAt: true,
      },
    });

    return user;
  }

  /**
   * Verify OTP
   */
  async verifyOtp(email, otp) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new Error("User not found");
    if (user.isVerified) throw new Error("User already verified");
    if (user.otpCode !== otp) throw new Error("Invalid OTP code");
    if (new Date() > user.otpExpires) throw new Error("OTP code expired");

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        otpCode: null,
        otpExpires: null,
      },
    });

    // Generate tokens
    const scopes = ROLE_SCOPES[updatedUser.role] || [];
    const accessToken = generateToken(updatedUser.id, updatedUser.role, scopes);
    const refreshToken = generateRefreshToken();

    // Save refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: updatedUser.id,
        expiresAt,
      },
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  /**
   * Update OTP
   */
  async updateOtp(email, otp, expires) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    return await prisma.user.update({
      where: { email },
      data: {
        otpCode: otp,
        otpExpires: expires,
      },
    });
  }

  /**
   * Reset Password
   */
  async resetPassword(email, otp, newPassword) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");
    if (user.otpCode !== otp) throw new Error("Invalid OTP code");
    if (new Date() > user.otpExpires) throw new Error("OTP code expired");

    return await prisma.user.update({
      where: { email },
      data: {
        password: newPassword, // FE sends HMAC hash
        otpCode: null,
        otpExpires: null,
      },
    });
  }

  /**
   * Login user
   */
  async login(email, password) {
    // Clean up old tokens (Lazy Cleanup)
    // Delete tokens that expired more than 30 days ago
    // We do this asynchronously to avoid slowing down login significantly
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Fire and forget (or await if strict consistency needed, but this is maintenance)
    // Using catch to prevent unhandled rejections crashing the process
    prisma.refreshToken
      .deleteMany({
        where: {
          expiresAt: {
            lt: thirtyDaysAgo,
          },
        },
      })
      .catch((err) => console.error("Token cleanup failed:", err));

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password (direct compare because both are HMAC hashes)
    const isPasswordValid = password === user.password;

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    if (!user.isVerified) {
      throw new Error("Account not verified. Please verify your email.");
    }

    // Get Scopes
    const scopes = ROLE_SCOPES[user.role] || [];

    // Generate tokens
    const accessToken = generateToken(user.id, user.role, scopes);
    const refreshToken = generateRefreshToken();

    // Save refresh token to DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Strip password
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  /**
   * Refresh Token
   */
  async refreshToken(token) {
    const refreshTokenRecord = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    // Check if token exists
    if (!refreshTokenRecord) {
      throw new Error("Invalid refresh token");
    }

    // Check Revoked state with Grace Period (10s window)
    if (refreshTokenRecord.revoked) {
      // If revoked, check if it's within the grace period (expiresAt > now)
      // If current time is past the grace expiration (which we set to +10s on rotation), then fail.
      if (new Date() > refreshTokenRecord.expiresAt) {
        throw new Error("Invalid refresh token (Revoked)");
      }
      // If within grace period, we allow it to proceed (Zombie Token)
    } else {
      // Normal check for expiration
      if (new Date() > refreshTokenRecord.expiresAt) {
        throw new Error("Refresh token expired");
      }
    }

    // Generate new Access Token
    const user = refreshTokenRecord.user;
    const scopes = ROLE_SCOPES[user.role] || [];
    const accessToken = generateToken(user.id, user.role, scopes);

    // Rotate Refresh Token (Optional security measure: replace old RT with new RT)
    const newRefreshToken = generateRefreshToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Grace Period Rotation:
    // 1. Create New Token
    // 2. Mark Old Token as Revoked and set Expiration to 10s from now (Grace Window)

    // Operations to perform
    const operations = [
      prisma.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: refreshTokenRecord.userId,
          expiresAt,
        },
      }),
    ];

    // Only update the old token if it wasn't already revoked (prevents resetting grace period)
    if (!refreshTokenRecord.revoked) {
      operations.push(
        prisma.refreshToken.update({
          where: { token },
          data: {
            revoked: true,
            expiresAt: new Date(Date.now() + 10 * 1000), // 10 seconds grace period
          },
        }),
      );
    }

    await prisma.$transaction(operations);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: refreshTokenRecord.user,
    };
  }

  /**
   * Logout (Revoke Refresh Token)
   */
  async logout(token) {
    if (!token) return;
    try {
      await prisma.refreshToken.delete({
        where: { token },
      });
    } catch (error) {
      // Ignore error if token not found
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        phone: true,
        address: true,
        balance: true,
        createdAt: true,
        updatedAt: true,
        expertProfile: true, // Include Expert Profile data
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId, data) {
    const { name, phone, address } = data;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
        address,
      },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        phone: true,
        address: true,
        balance: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }
}

export default new AuthService();
