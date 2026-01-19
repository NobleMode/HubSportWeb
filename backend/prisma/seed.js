import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Helper to match Frontend's SHA256 hashing
const hashInitial = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create Admin User
  // Note: We hash the SHA256 string, not the plaintext, to match Frontend's new logic
  const hashedPassword = await bcrypt.hash(hashInitial('admin123'), 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sporthub.vn' },
    update: {
      password: hashedPassword, // Update password if user exists
    },
    create: {
      email: 'admin@sporthub.vn',
      password: hashedPassword,
      role: 'ADMIN',
      name: 'Admin User',
      balance: 0,
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create Sample Customer
  const customerPassword = await bcrypt.hash(hashInitial('customer123'), 10);
  
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: customerPassword,
      role: 'CUSTOMER',
      name: 'John Customer',
      balance: 1000000,
    },
  });

  console.log('✅ Created customer user:', customer.email);

  // Create Sample Products
  const products = [
    {
      name: 'Nike Football',
      description: 'Professional quality football for training and matches',
      type: 'SALE',
      salePrice: 500000,
      category: 'Football',
      brand: 'Nike',
      stock: 10,
    },
    {
      name: 'Adidas Running Shoes',
      description: 'Comfortable running shoes for all terrains',
      type: 'SALE',
      salePrice: 1500000,
      category: 'Footwear',
      brand: 'Adidas',
      stock: 15,
    },
    {
      name: 'Mountain Bike',
      description: 'Professional mountain bike for rent',
      type: 'RENTAL',
      rentalPrice: 200000,
      depositFee: 5000000,
      category: 'Bicycle',
      brand: 'Giant',
      stock: 5,
    },
    {
      name: 'Tennis Racket',
      description: 'High-quality tennis racket available for rent or purchase',
      type: 'RENTAL',
      rentalPrice: 50000,
      depositFee: 1000000,
      category: 'Tennis',
      brand: 'Wilson',
      stock: 8,
    },
  ];

  for (const productData of products) {
    const product = await prisma.product.create({
      data: productData,
    });
    console.log('✅ Created product:', product.name);

    // Create product items for rental products
    if (product.type === 'RENTAL') {
      for (let i = 1; i <= 3; i++) {
        await prisma.productItem.create({
          data: {
            serialNumber: `${product.name.replace(/\s+/g, '-').toUpperCase()}-${i}`,
            productId: product.id,
            status: 'AVAILABLE',
          },
        });
      }
      console.log(`   → Created 3 product items for ${product.name}`);
    }
  }

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
