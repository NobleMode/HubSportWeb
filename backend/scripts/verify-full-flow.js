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

async function verifyFullFlow() {
  try {
    // 1. Login
    console.log('Logging in...');
    const encryptedPassword = encryptPassword(ADMIN_PASSWORD_PLAIN);
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: encryptedPassword }),
    });
    
    const loginData = await loginRes.json();
    if (!loginData.success) {
      console.error('Login Failed:', loginData);
      process.exit(1);
    }
    console.log('✅ Login Success!');
    const token = loginData.data.token;

    // 2. Create Product
    console.log('Creating Product...');
    const productData = {
      name: 'Verified Rental Camera',
      type: 'RENTAL',
      rentalPrice: 500000,
      stock: 0
    };

    const createRes = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData),
    });

    if (createRes.status !== 201) {
       console.error('❌ Create Product Failed:', createRes.status, await createRes.text());
       process.exit(1);
    }

    const createData = await createRes.json();
    const productId = createData.data.id;
    console.log('✅ Product Created:', productId);

    // 3. Add Items
    console.log('Adding Items...');
    const items = ['VRC-001', 'VRC-002'];
    for (const serial of items) {
       const itemRes = await fetch(`${API_URL}/products/${productId}/items`, {
         method: 'POST',
         headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
         body: JSON.stringify({ productId, serialNumber: serial, status: 'AVAILABLE' }),
       });
       
       if (itemRes.status === 201) {
         console.log(`✅ Item Added: ${serial}`);
       } else {
         console.error(`❌ Add Item Failed ${serial}:`, itemRes.status, await itemRes.text());
       }
    }
    
    console.log('🎉 Full Verification Complete!');

  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

verifyFullFlow();
