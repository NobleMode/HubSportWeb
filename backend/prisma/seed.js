import { PrismaClient } from "@prisma/client";
import { encryptData } from "../src/utils/security.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Clean up database
  console.log("🧹 Cleaning up database...");
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.expertProfile.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users
  console.log("👤 Creating users...");
  const password = encryptData("123456");

  const admin = await prisma.user.create({
    data: {
      email: "admin@gmail.com",
      password,
      name: "Admin User",
      role: "ADMIN",
      phone: "0909000001",
      address: "Hanoi, Vietnam",
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: "customer@gmail.com",
      password,
      name: "Nguyen Van A",
      role: "CUSTOMER",
      phone: "0909000002",
      address: "Da Nang, Vietnam",
      balance: 500000,
    },
  });

  const expert = await prisma.user.create({
    data: {
      email: "expert@gmail.com",
      password,
      name: "Coach David",
      role: "EXPERT",
      phone: "0909000003",
      address: "Ho Chi Minh, Vietnam",
    },
  });

  const shipper = await prisma.user.create({
    data: {
      email: "shipper@gmail.com",
      password,
      name: "Shipper One",
      role: "SHIPPER",
      phone: "0909000004",
      address: "Ho Chi Minh, Vietnam",
    },
  });

  console.log("✅ Users created");

  // 3. Create Expert Profile
  console.log("🎓 Creating expert profile...");
  await prisma.expertProfile.create({
    data: {
      userId: expert.id,
      bio: "Professional Tennis Coach with 10 years of experience.",
      specialization: "Tennis",
      hourlyRate: 200000,
      isVerified: true,
      rating: 4.8,
      totalBookings: 15,
      imageUrl:
        "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      gallery: [
        "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=500&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=500&auto=format&fit=crop&q=60",
      ],
    },
  });
  console.log("✅ Expert profile created");

  // 4. Create Products
  console.log("📦 Creating products...");

  // Products Data
  const products = [
    {
      name: "Yonex Astrox 77",
      description:
        "High-performance badminton racket for attacking players. Rent to try before you buy!",
      type: "SALE",
      salePrice: 2500000,
      rentalPrice: 50000, // Hybrid
      depositFee: 1000000,
      category: "Badminton",
      brand: "Yonex",
      stock: 50,
      imageUrl:
        "https://images.unsplash.com/photo-1626224583726-e2c774870364?w=500&auto=format&fit=crop&q=60",
      isActive: true,
    },
    {
      name: "Wilson Pro Staff 97",
      description: "Professional tennis racket available for rent or purchase.",
      type: "RENTAL",
      rentalPrice: 150000,
      salePrice: 4500000, // Hybrid
      depositFee: 2000000,
      category: "Tennis",
      brand: "Wilson",
      stock: 5,
      imageUrl:
        "https://images.unsplash.com/photo-1617083934555-ac7d4fee8909?w=500&auto=format&fit=crop&q=60",
      isActive: true,
    },
    {
      name: "Adidas Al Rihla Pro",
      description: "Official match ball for FIFA World Cup.",
      type: "SALE",
      salePrice: 3200000,
      rentalPrice: 100000, // Hybrid
      depositFee: 1500000,
      category: "Soccer",
      brand: "Adidas",
      stock: 20,
      imageUrl:
        "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=500&auto=format&fit=crop&q=60",
      isActive: true,
    },
    {
      name: "Nike Zoom Mercurial",
      description: "Elite soccer cleats built for speed and control.",
      type: "SALE",
      salePrice: 4200000,
      rentalPrice: 120000,
      depositFee: 2000000,
      category: "Soccer",
      brand: "Nike",
      stock: 15,
      imageUrl:
        "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=500&auto=format&fit=crop&q=60",
      isActive: true,
    },
    {
      name: "Spalding NBA Official Ball",
      description: "The classic official game ball of the NBA.",
      type: "SALE",
      salePrice: 1800000,
      rentalPrice: 60000,
      depositFee: 1000000,
      category: "Basketball",
      brand: "Spalding",
      stock: 30,
      imageUrl:
        "https://images.unsplash.com/photo-1519861531473-920026393112?w=500&auto=format&fit=crop&q=60",
      isActive: true,
    },
    {
      name: "Trek Marlin 7",
      description: "Versatile mountain bike for trail riding.",
      type: "RENTAL",
      rentalPrice: 300000,
      salePrice: 12500000,
      depositFee: 5000000,
      category: "Cycling",
      brand: "Trek",
      stock: 3,
      imageUrl:
        "https://images.unsplash.com/photo-1576435728678-be95e39e565c?w=500&auto=format&fit=crop&q=60",
      isActive: true,
    },
    {
      name: "Bowflex SelectTech 552",
      description: "Adjustable dumbbells for home workout.",
      type: "SALE",
      salePrice: 8900000,
      rentalPrice: 200000,
      depositFee: 4000000,
      category: "Gym",
      brand: "Bowflex",
      stock: 10,
      imageUrl:
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&auto=format&fit=crop&q=60",
      isActive: true,
    },
    {
      name: "Manduka PRO Yoga Mat",
      description: "High-density yoga mat for superior cushioning.",
      type: "SALE",
      salePrice: 3500000,
      rentalPrice: 40000,
      depositFee: 1000000,
      category: "Yoga",
      brand: "Manduka",
      stock: 25,
      imageUrl:
        "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&auto=format&fit=crop&q=60",
      isActive: true,
    },
    {
      name: "Ping G425 Driver",
      description: "Forgiving golf driver for maximum distance.",
      type: "RENTAL",
      rentalPrice: 250000,
      salePrice: 10500000,
      depositFee: 5000000,
      category: "Golf",
      brand: "Ping",
      stock: 4,
      imageUrl:
        "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=500&auto=format&fit=crop&q=60",
      isActive: true,
    },
    {
      name: "Garmin Fenix 7",
      description: "Multisport GPS watch for athletes.",
      type: "SALE",
      salePrice: 15900000,
      rentalPrice: 150000,
      depositFee: 8000000,
      category: "Electronics",
      brand: "Garmin",
      stock: 8,
      imageUrl:
        "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=500&auto=format&fit=crop&q=60",
      isActive: true,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log("✅ Products created");

  // 5. Create Product Items for Rental
  console.log("🔖 Creating product items...");
  // Create Product Items for Rental (using the first product found as an example - simplified for loop)
  const firstRentableProduct = await prisma.product.findFirst({
    where: { category: "Tennis" },
  });
  if (firstRentableProduct) {
    await prisma.productItem.create({
      data: {
        productId: firstRentableProduct.id,
        serialNumber: "WR-001",
        status: "AVAILABLE",
      },
    });
    await prisma.productItem.create({
      data: {
        productId: firstRentableProduct.id,
        serialNumber: "WR-002",
        status: "RENTING",
      },
    });
  }
  console.log("✅ Product items created");

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
