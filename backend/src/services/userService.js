import bcrypt from 'bcrypt';
import prisma from '../config/database.js';
import { generateToken, generateRefreshToken } from '../utils/jwtUtils.js';
import { ROLE_SCOPES } from '../config/permissions.js';

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
}

export default new UserService();
