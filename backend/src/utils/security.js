import CryptoJS from 'crypto-js';

const KEY = process.env.ENCRYPTION_KEY;

export const decryptData = (ciphertext) => {
  if (!ciphertext) return ciphertext;
  if (!KEY) {
    throw new Error('Encryption key is missing in backend!');
  }
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText) {
        // Fallback: maybe it wasn't encrypted? or wrong key
        // For safety, return null or throw error.
        // But to be user friendly, if we assume user MIGHT send plain text (during transition), we might handle it.
        // However, user requirement is explicit.
        throw new Error('Decryption failed: Invalid ciphertext');
    }
    return originalText;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Invalid encrypted data');
  }
};
