import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  console.error(
    "CRITICAL ERROR: ENCRYPTION_KEY is missing from environment variables!",
  );
  process.exit(1);
}

/**
 * Encrypt data using HMAC-SHA256 with the shared secret key.
 * This matches the frontend implementation.
 * @param {string} data - The raw password string
 * @returns {string} - The HMAC-SHA256 hash
 */
export const encryptData = (data) => {
  if (!data) return null;
  const hmac = crypto.createHmac("sha256", ENCRYPTION_KEY);
  hmac.update(data);
  return hmac.digest("hex");
};

/**
 * Decrypt data
 * Note: HMAC is a one-way hash, so "decryption" is effectively just re-hashing
 * However, we keep this named 'decryptData' if existing imports rely on it,
 * OR we can remove it if we update all controllers to just use encryptData for comparison.
 * In the new flow, the Controller receives an ALREADY HASHED password (from FE),
 * but for extra security, we normally hash it again or verify the HMAC.
 *
 * WAITING: The user wants "HMAC and key".
 * Frontend does: HmacSHA256(password, KEY)
 * Backend receives: <hash>
 * Backend should verify this matches the stored hash?
 *
 * CORRECT FLOW based on "User request":
 * The user said "apply generally HMAC and key".
 * IF the frontend sends `HMAC(password, key)`, that is effectively the "hashed password".
 * IF we store that directly in the DB, then anyone with the KEY can generate valid passwords.
 *
 * However, the Plan approved was:
 * "Update register to hash... Update login to hash and compare".
 *
 * Let's implement `encryptData` to be the helper.
 */
