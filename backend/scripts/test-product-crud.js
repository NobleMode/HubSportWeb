import crypto from 'crypto';
import CryptoJS from 'crypto-js';

const API_URL = 'http://localhost:5000/api';
const ADMIN_EMAIL = 'admin@sporthub.vn';
const ADMIN_PASSWORD_PLAIN = 'admin123';
const ENCRYPTION_KEY = '50de886e0210faa96fa333f435c4ea7e947cb13ed1b001487e2d25a3491be3d2aa97f7c143f366b187ee39d9386bf84dd082a903999aeb65e776808eb5f34db0';

// Helper to encrypt password (matches Frontend logic)
const encryptPassword = (password) => {
  // 1. Hash with SHA256
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  // 2. Encrypt with AES
  return CryptoJS.AES.encrypt(hashedPassword, ENCRYPTION_KEY).toString();
};

async function testProductCRUD() {
  console.log('🚀 Starting Product CRUD Test...');

  // 1. Login
  console.log('\n1. Logging in as Admin...');
  const encryptedPassword = encryptPassword(ADMIN_PASSWORD_PLAIN);
  
  const loginRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: encryptedPassword }),
  });
  const loginData = await loginRes.json();
  
  if (!loginData.success) {
    console.error('❌ Login failed:', JSON.stringify(loginData, null, 2));
    process.exit(1);
  }
  const token = loginData.token;
  
  // Debug: Decode token (without verifying signature) to check scopes
  const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  console.log('🔍 Token Payload Scopes:', payload.scopes);

  console.log('✅ Login successful. Token obtained.');
  const headers = { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` 
  };

  // 2. Create Product
  console.log('\n2. Creating a specific Rental Product...');
  const productData = {
    name: 'Test Rental Video Camera',
    description: 'High-end camera for sports recording',
    type: 'RENTAL',
    rentalPrice: 500000,
    depositFee: 2000000,
    category: 'Electronics',
    brand: 'Sony',
    stock: 0
  };

  const createRes = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers,
    body: JSON.stringify(productData),
  });
  
  let createData;
  const contentType = createRes.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
      createData = await createRes.json();
  } else {
      const text = await createRes.text();
      console.error(`❌ Create Product failed (Status ${createRes.status}):`, text.substring(0, 500)); // Print first 500 chars
      process.exit(1);
  }
  
  if (!createData.success) {
    console.error('❌ Create Product failed:', JSON.stringify(createData, null, 2));
    process.exit(1);
  }
  const productId = createData.data.id;
  console.log(`✅ Product created: ${productId} (${createData.data.name})`);

  // 3. Create Product Items
  console.log('\n3. Adding Product Items (Inventory)...');
  const items = ['CAM-001', 'CAM-002'];
  
  for (const serial of items) {
    const itemRes = await fetch(`${API_URL}/products/${productId}/items`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        productId,
        serialNumber: serial,
        status: 'AVAILABLE'
      }),
    });
    const itemData = await itemRes.json();
    if (!itemData.success) {
       console.error(`❌ Function to add item ${serial} failed:`, itemData);
    } else {
       console.log(`✅ Item added: ${itemData.data.serialNumber}`);
    }
  }

  // 4. Verify Items via Get Product
  console.log('\n4. Verifying Items via Get Product...');
  const getRes = await fetch(`${API_URL}/products/${productId}`, { headers });
  const getData = await getRes.json();
  
  const fetchedItems = getData.data.productItems;
  console.log(`Found ${fetchedItems.length} items for product.`);
  if (fetchedItems.length !== 2) {
    console.warn('⚠️ Warning: Expected 2 items.');
  } else {
    console.log('✅ Verified items count.');
  }

  // 5. Clean up (Delete Product - should cascade delete items)
  console.log('\n5. Deleting Product...');
  const delRes = await fetch(`${API_URL}/products/${productId}`, {
    method: 'DELETE',
    headers
  });
  
  if (delRes.status === 200) {
    console.log('✅ Product deleted successfully.');
  } else {
    console.error('❌ Delete failed:', await delRes.text());
  }

  console.log('\n🎉 Test Completed Successfully!');
}

testProductCRUD().catch(console.error);
