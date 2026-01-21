import crypto from 'crypto';
import CryptoJS from 'crypto-js';

const API_URL = 'http://localhost:5000/api';
const ADMIN_EMAIL = 'admin@sporthub.vn';
const ADMIN_PASS = 'admin123';
const ENCRYPTION_KEY = '50de886e0210faa96fa333f435c4ea7e947cb13ed1b001487e2d25a3491be3d2aa97f7c143f366b187ee39d9386bf84dd082a903999aeb65e776808eb5f34db0';

const encryptPassword = (password) => {
  const hashedData = crypto.createHash('sha256').update(password).digest('hex');
  return CryptoJS.AES.encrypt(hashedData, ENCRYPTION_KEY).toString();
};

async function testRefresh() {
  console.log('Testing Refresh Token Flow...');
  try {
    // 1. Login to get cookies
    const encryptedPassword = encryptPassword(ADMIN_PASS);
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: encryptedPassword }),
    });
    
    // Extract cookies from response headers
    const cookie = loginRes.headers.get('set-cookie');
    if (!cookie) {
        console.error('❌ No cookies received from login');
        return;
    }

    console.log('✅ Login successful. Got cookie.');

    // 2. Call Refresh Token
    const refreshRes = await fetch(`${API_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 
            'Cookie': cookie // Send back the refresh token cookie
        }
    });

    const refreshData = await refreshRes.json();
    if (refreshData.success) {
        console.log('✅ Refresh successful!');
        if (refreshData.data.user) {
            console.log('✅ User Object Present:', refreshData.data.user.name);
        } else {
            console.error('❌ User Object MISSING in Refresh Response!');
        }
    } else {
        console.error('❌ Refresh Failed:', refreshData);
    }

  } catch (err) {
    console.error('❌ Error:', err);
  }
}

testRefresh();
