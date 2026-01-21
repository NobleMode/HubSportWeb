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

async function verifyLogic() {
  console.log('🤖 Simulating Frontend Logic...');
  
  // 1. Initial Login to get a valid Refresh Cookie
  console.log('\n[1] Pre-requisite: Login to get Cookie');
  const encryptedPassword = encryptPassword(ADMIN_PASS);
  const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: encryptedPassword }),
  });
  const cookie = loginRes.headers.get('set-cookie');
  if (!cookie) throw new Error('No cookie received');
  console.log('✅ Cookie obtained');

  // 2. Simulate Page Reload / Initial Load (No Token)
  console.log('\n[2] Initial Profile Fetch (No Token)');
  const profileRes1 = await fetch(`${API_URL}/auth/profile`);
  console.log(`Response: ${profileRes1.status} ${profileRes1.statusText}`);
  if (profileRes1.status === 401) {
      console.log('✅ Correctly received 401 Unauthorized');
  } else {
      console.error('❌ Unexpected status:', profileRes1.status);
  }

  // 3. Simulate BaseQueryWithReauth: Call Refresh Token
  console.log('\n[3] Handling 401: Calling Refresh Token');
  const refreshRes = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Cookie': cookie }
  });
  const refreshData = await refreshRes.json();
  
  if (!refreshData.success) {
      console.error('❌ Refresh Failed:', refreshData);
      return;
  }
  
  const newToken = refreshData.data.token;
  const user = refreshData.data.user;

  console.log('✅ Refresh Success');
  console.log('Token acquired:', newToken ? 'Yes' : 'No');
  
  if (user && user.name) {
      console.log(`✅ User obtained from Refresh: "${user.name}"`);
  } else {
      console.error('❌ User MISSING in Refresh Response:', user);
  }

  // 4. Simulate BaseQueryWithReauth: Retry Profile
  console.log('\n[4] Retrying Profile Fetch (With New Token)');
  const profileRes2 = await fetch(`${API_URL}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${newToken}` }
  });
  const profileData = await profileRes2.json();

  if (profileData.success) {
      console.log(`✅ Profile Retry Success`);
      console.log(`User Name from Profile: "${profileData.data.name}"`);
  } else {
      console.error('❌ Profile Retry Failed:', profileData);
  }
}

verifyLogic();
