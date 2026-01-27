import CryptoJS from 'crypto-js';

const KEY = import.meta.env.VITE_ENCRYPTION_KEY;

export const encryptData = (data) => {
  if (!data) return data;
  if (!KEY) {
    console.warn('Encryption key is missing!');
    return data;
  }
  // Hash with SHA256 first
  const hashedData = CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
  // Then Encrypt with AES
  return CryptoJS.AES.encrypt(hashedData, KEY).toString();
};
