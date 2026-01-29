import crypto from 'crypto';
import CryptoJS from 'crypto-js';

const API_URL = 'http://localhost:5000/api';
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASS = '123456';
const CUST_EMAIL = 'customer@gmail.com';
const CUST_PASS = '123456';
const ENCRYPTION_KEY = '50de886e0210faa96fa333f435c4ea7e947cb13ed1b001487e2d25a3491be3d2aa97f7c143f366b187ee39d9386bf84dd082a903999aeb65e776808eb5f34db0';

// Match Frontend Logic: SHA256 -> AES
// Match Frontend Logic: HMAC-SHA256
const encryptPassword = (password) => {
  return crypto.createHmac('sha256', ENCRYPTION_KEY).update(password).digest('hex');
};

async function testLogin(role, email, password) {
  console.log(`\nTesting ${role} Login (${email})...`);
  try {
    const encryptedPassword = encryptPassword(password);
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: encryptedPassword }),
    });

    const data = await res.json();
    if (!data.success) {
      console.error(`❌ ${role} Login Failed:`, data.message);
      return;
    } 
    console.log(`✅ ${role} Login Success!`);
    console.log(`${role} Name from Login:`, data.data.user.name);

    // Test Profile Endpoint (Simulate Refresh)
    const token = data.data.token;
    const profileRes = await fetch(`${API_URL}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const profileData = await profileRes.json();
    if (profileData.success) {
       console.log(`${role} Name from Profile:`, profileData.data.name);
    } else {
       console.error(`❌ ${role} Profile Fetch Failed:`, profileData);
    }
  } catch (err) {
    console.error(`❌ ${role} Error:`, err.message);
  }
}

async function run() {
  await testLogin('ADMIN', ADMIN_EMAIL, ADMIN_PASS);
  await testLogin('CUSTOMER', CUST_EMAIL, CUST_PASS);
}

run();
