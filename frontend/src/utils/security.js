import CryptoJS from 'crypto-js';

const KEY = import.meta.env.VITE_ENCRYPTION_KEY;

export const encryptData = (data) => {
  if (!data) return data;
  if (!KEY) {
    console.warn('Encryption key is missing!');
    return data;
  }
  return CryptoJS.AES.encrypt(data, KEY).toString();
};
