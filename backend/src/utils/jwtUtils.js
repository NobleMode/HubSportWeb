import jwt from 'jsonwebtoken';
import config from '../config/config.js';

/**
 * Generate JWT Token
 * @param {string} userId - User ID
 * @returns {string} JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwt.secret, {
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

export default { generateToken, verifyToken };
