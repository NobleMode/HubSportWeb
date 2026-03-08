import { PrismaClient } from "@prisma/client";
import { encryptData } from "../src/utils/security.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Clean up database
  console.log("🧹 Cleaning up database...");
  await prisma.transaction.deleteMany();
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
      isVerified: true,
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
      isVerified: true,
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
      isVerified: true,
    },
  });

  console.log("✅ Admin, Customer, Options created");

  console.log("👥 Generating 39 fake users...");
  const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'Chris', 'Sarah', 'David', 'Jessica', 'Daniel', 'Ashley', 'Matthew', 'Amanda', 'Andrew', 'Melissa', 'Joshua', 'Brittany', 'Kevin', 'Megan', 'Brian', 'Rachel', 'Justin', 'Hannah', 'Jason', 'Lauren', 'Eric', 'Stephanie', 'Scott', 'Courtney', 'Ryan', 'Nicole', 'Nicholas', 'Rebecca', 'Jeffrey', 'Elizabeth'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King'];
  const cities = ['Hanoi', 'Ho Chi Minh', 'Da Nang', 'Hai Phong', 'Can Tho', 'Hue', 'Nha Trang', 'Vung Tau', 'Quy Nhon'];

  for (let i = 0; i < 39; i++) {
    const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = randomFirst + ' ' + randomLast;
    const email = randomFirst.toLowerCase() + '.' + randomLast.toLowerCase() + i + '@gmail.com';
    const phone = '09' + Math.floor(10000000 + Math.random() * 90000000).toString();
    const city = cities[Math.floor(Math.random() * cities.length)];

    await prisma.user.create({
      data: {
        email,
        password,
        name,
        role: "CUSTOMER",
        phone,
        address: city + ", Vietnam",
        balance: Math.floor(Math.random() * 50) * 100000 + 100000,
        isVerified: true,
      }
    });
  }
  console.log("✅ 39 Fake users created");

  // 3. Create Expert Profiles
  console.log("🎓 Creating expert profiles...");
  
  const expertData = [
    {
      email: "expert@gmail.com",
      name: "Coach David",
      phone: "0909000003",
      address: "Ho Chi Minh, Vietnam",
      bio: "Professional Tennis Coach with 10 years of experience.",
      specialization: "Tennis",
      level: "Professional",
      hourlyRate: 200000,
      imageUrl: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=500&auto=format&fit=crop&q=60",
    },
    {
      email: "sarah.yoga@gmail.com",
      name: "Sarah Jenkins",
      phone: "0909000005",
      address: "Hanoi, Vietnam",
      bio: "Certified Vinyasa Yoga instructor focusing on mindfulness and strength.",
      specialization: "Yoga",
      level: "Advanced",
      hourlyRate: 150000,
      imageUrl: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=500&auto=format&fit=crop&q=60",
    },
    {
      email: "mike.hoops@gmail.com",
      name: "Mike Johnson",
      phone: "0909000006",
      address: "Da Nang, Vietnam",
      bio: "Former college basketball player turned skills trainer.",
      specialization: "Basketball",
      level: "Intermediate",
      hourlyRate: 180000,
      imageUrl: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=500&auto=format&fit=crop&q=60",
    },
    {
      email: "elena.swim@gmail.com",
      name: "Elena Rodriguez",
      phone: "0909000007",
      address: "Nha Trang, Vietnam",
      bio: "Competitive swimmer offering lessons for all ages.",
      specialization: "Swimming",
      level: "Beginner",
      hourlyRate: 120000,
      imageUrl: "https://images.unsplash.com/photo-1560965839-a9310d65ff98?w=500&auto=format&fit=crop&q=60",
    },
    {
      email: "alex.pt@gmail.com",
      name: "Alex Tran",
      phone: "0909000008",
      address: "Ho Chi Minh, Vietnam",
      bio: "Personal trainer specializing in sports conditioning and weight loss.",
      specialization: "Personal Training",
      level: "Professional",
      hourlyRate: 250000,
      imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&auto=format&fit=crop&q=60",
    }
  ];

  for (const exp of expertData) {
    const user = await prisma.user.create({
      data: {
        email: exp.email,
        password,
        name: exp.name,
        role: "EXPERT",
        phone: exp.phone,
        address: exp.address,
        isVerified: true,
      },
    });

    await prisma.expertProfile.create({
      data: {
        userId: user.id,
        bio: exp.bio,
        specialization: exp.specialization,
        level: exp.level,
        hourlyRate: exp.hourlyRate,
        isVerified: true,
        rating: 4.5 + Math.random() * 0.5,
        totalBookings: Math.floor(Math.random() * 50),
        imageUrl: exp.imageUrl,
        gallery: [],
      },
    });
  }
  console.log("✅ Expert profiles created");

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

  // 6. Create Orders and Revenue Data
  console.log("🛍️ Generating Orders & Revenue Data...");

  const allCustomers = await prisma.user.findMany({ where: { role: 'CUSTOMER' } });
  const allProducts = await prisma.product.findMany();
  const allExperts = await prisma.expertProfile.findMany();
  
  // Create a default shop or use existing for these fake orders
  let mainShop = await prisma.shop.findFirst();
  if (!mainShop) {
    const sellerUser = await prisma.user.create({
      data: {
        email: "official.shop@gmail.com",
        password,
        name: "EXERCISER Official Store",
        role: "SELLER",
        isVerified: true,
      }
    });

    mainShop = await prisma.shop.create({
      data: {
        userId: sellerUser.id,
        name: "EXERCISER Official",
        description: "The official store for EXERCISER",
        isActive: true,
        commissionRate: 5.0
      }
    });
  }

  if (allCustomers.length > 0 && allProducts.length > 0) {
    for (let i = 0; i < 50; i++) {
      const randomCustomer = allCustomers[Math.floor(Math.random() * allCustomers.length)];
      const randomProduct = allProducts[Math.floor(Math.random() * allProducts.length)];
      
      // Determine if it's a rental (if the product supports rental)
      const isRental = Math.random() > 0.5 && randomProduct.rentalPrice !== null;
      
      // Assume a default sale price if missing, or use rental price
      const price = isRental ? randomProduct.rentalPrice : (randomProduct.salePrice || 100000);
      const quantity = Math.floor(Math.random() * 3) + 1; // 1 to 3 items
      const totalAmount = price * quantity;
      
      const order = await prisma.order.create({
        data: {
          userId: randomCustomer.id,
          status: ['PENDING', 'CONFIRMED', 'DELIVERED', 'RETURNED', 'CANCELLED'][Math.floor(Math.random() * 5)],
          totalAmount: totalAmount,
          paymentMethod: 'CREDIT_CARD',
          shippingAddress: randomCustomer.address,
        }
      });
      
      const shopOrder = await prisma.shopOrder.create({
        data: {
          orderId: order.id,
          shopId: mainShop.id, // Fixed: use valid Shop ID
          status: order.status,
          totalAmount: totalAmount,
          sellerEarning: totalAmount * 0.95,
          commissionFee: totalAmount * 0.05
        }
      });
      
      await prisma.orderItem.create({
         data: {
           shopOrderId: shopOrder.id,
           productId: randomProduct.id,
           quantity: quantity,
           price: price,
           isRental: isRental,
           rentalDays: isRental ? Math.floor(Math.random() * 5) + 1 : null
         }
      });
      
      await prisma.transaction.create({
        data: {
          userId: randomCustomer.id,
          type: 'PAYMENT',
          amount: totalAmount,
          description: 'Payment for order ' + order.id
        }
      });
      
      // Randomly backdate orders for charts (up to 30 days ago)
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 30));
      await prisma.$executeRaw`UPDATE "orders" SET "createdAt" = ${pastDate} WHERE id = ${order.id}`;
      await prisma.$executeRaw`UPDATE "shop_orders" SET "createdAt" = ${pastDate} WHERE id = ${shopOrder.id}`;
      await prisma.$executeRaw`UPDATE "transactions" SET "createdAt" = ${pastDate} WHERE "userId" = ${randomCustomer.id} AND amount = ${totalAmount}`;
    }
    console.log("✅ Generated 50 Orders and Transactions");
  }

  // 7. Create Expert Bookings
  console.log("📅 Generating Expert Bookings...");
  if (allCustomers.length > 0 && allExperts.length > 0) {
     for (let i = 0; i < 20; i++) {
        const randomCustomer = allCustomers[Math.floor(Math.random() * allCustomers.length)];
        const randomExpert = allExperts[Math.floor(Math.random() * allExperts.length)];
        
        // Random date in the next 10 days
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 10));
        
        const duration = Math.floor(Math.random() * 2) + 1; // 1 or 2 hours

        await prisma.booking.create({
           data: {
              userId: randomCustomer.id,
              expertId: randomExpert.id,
              status: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'][Math.floor(Math.random() * 4)],
              bookingDate: futureDate,
              duration: duration,
              totalAmount: randomExpert.hourlyRate * duration,
              notes: 'Looking forward to the session!'
           }
        });
     }
     console.log("✅ Generated 20 Expert Bookings");
  }

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
