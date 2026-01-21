import crypto from 'crypto';
import CryptoJS from 'crypto-js';

const API_URL = 'http://localhost:5000/api';
const ADMIN_EMAIL = 'admin@sporthub.vn';
const ADMIN_PASSWORD_PLAIN = 'admin123';
const ENCRYPTION_KEY = '50de886e0210faa96fa333f435c4ea7e947cb13ed1b001487e2d25a3491be3d2aa97f7c143f366b187ee39d9386bf84dd082a903999aeb65e776808eb5f34db0';

const encryptPassword = (password) => {
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  return CryptoJS.AES.encrypt(hashedPassword, ENCRYPTION_KEY).toString();
};

async function debugToken() {
  try {
    console.log('Logging in...');
    const encryptedPassword = encryptPassword(ADMIN_PASSWORD_PLAIN);
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: encryptedPassword }),
    });
    
    const data = await res.json();
    if (!data.success) {
      console.error('Login Failed:', data);
      return;
    }
    
    console.log('Login Success!');
    const token = data.data.token;
    const parts = token.split('.');
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    console.log('Role:', payload.role);
    console.log('Scopes:', payload.scopes);

    console.log('Attempting Create Product...');
    const productData = {
      name: 'Debug Product',
      type: 'RENTAL',
      rentalPrice: 100,
      stock: 0
    };

    const res2 = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData),
    });

    console.log('Create Status:', res2.status);
    const text = await res2.text();
    console.log('Create Response:', text.substring(0, 200));

  } catch (err) {
    console.error('Error:', err);
  }
}

debugToken();
