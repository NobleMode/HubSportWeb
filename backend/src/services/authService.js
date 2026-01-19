import bcrypt from 'bcrypt';
import prisma from '../config/database.js';
import { generateToken, generateRefreshToken } from '../utils/jwtUtils.js';
import { ROLE_SCOPES } from '../config/permissions.js';

/**
 * Auth Service
 * Handles authentication business logic
 */
class AuthService {
  /**
   * Register a new user
   */
  async register(data) {
    const { email, password, role = 'CUSTOMER', name } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        name,
      },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        balance: true,
        createdAt: true,
      },
    });

    // Get Scopes
    const scopes = ROLE_SCOPES[role] || [];

    // Generate token
    const token = generateToken(user.id, role, scopes);

    return { user, token };
  }

  /**
   * Login user
   */
  async login(email, password) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
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

    if (!refreshTokenRecord || refreshTokenRecord.revoked) {
      // If token is revoked, it might be a theft attempt.
      // In a more advanced implementation, we could revoke all tokens of this user.
      throw new Error('Invalid refresh token');
    }

    if (new Date() > refreshTokenRecord.expiresAt) {
      throw new Error('Refresh token expired');
    }

    // Generate new Access Token
    const user = refreshTokenRecord.user;
    const scopes = ROLE_SCOPES[user.role] || [];
    const accessToken = generateToken(user.id, user.role, scopes);
    
    // Rotate Refresh Token (Optional security measure: replace old RT with new RT)
    const newRefreshToken = generateRefreshToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Transaction: Delete old RT, Create new RT
    // TEMPORARY FIX: Comment out delete to handle React Strict Mode race condition
    await prisma.$transaction([
      // prisma.refreshToken.delete({ where: { token } }), 
      prisma.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: refreshTokenRecord.userId,
          expiresAt,
        }
      })
    ]);

    return { 
      accessToken, 
      refreshToken: newRefreshToken,
      user: refreshTokenRecord.user 
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
      },
    });

    if (!user) {
      throw new Error('User not found');
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
