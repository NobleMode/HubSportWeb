import CryptoJS from 'crypto-js';

/**
 * Hash password using SHA256 before sending to server
 * This adds an extra layer of security and ensures plaintext passwords
 * are strictly never sent over the network, adhering to specific security requirements.
 * 
 * Note: The backend must expect a SHA256 hash string instead of a plaintext password.
 * 
 * @param {string} password - The plaintext password
 * @returns {string} - The SHA256 hash of the password
 */
export const hashPassword = (password) => {
  if (!password) return '';
  return CryptoJS.SHA256(password).toString();
};
