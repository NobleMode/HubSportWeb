import CryptoJS from "crypto-js";

const KEY = import.meta.env.VITE_ENCRYPTION_KEY;

export const encryptData = (data) => {
  if (!data) return data;
  if (!KEY) {
    console.warn("Encryption key is missing!");
    return data;
  }
  // Hash with HMAC-SHA256
  return CryptoJS.HmacSHA256(data, KEY).toString();
};
