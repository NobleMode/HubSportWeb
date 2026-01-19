import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import crypto from 'crypto';

/**
 * Generate JWT Token
 * @param {string} userId - User ID
 * @returns {string} JWT token
 */
export const generateToken = (userId, role, scopes = []) => {
  return jwt.sign({ userId, role, scopes }, config.jwt.secret, {
    expiresIn: config.jwt.expire,
  });
};

/**
 * Verify JWT Token
 * @param {string} token - JWT token
 * @returns {object} Decoded token payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

/**
 * Generate Refresh Token
 * Long lived token for session management
 * @returns {string} Random string
 */
export const generateRefreshToken = () => {
  return crypto.randomUUID();
};

export default { generateToken, verifyToken, generateRefreshToken };
