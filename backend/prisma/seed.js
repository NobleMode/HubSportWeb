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
  const firstNames = [
    "John",
    "Jane",
    "Michael",
    "Emily",
    "Chris",
    "Sarah",
    "David",
    "Jessica",
    "Daniel",
    "Ashley",
    "Matthew",
    "Amanda",
    "Andrew",
    "Melissa",
    "Joshua",
    "Brittany",
    "Kevin",
    "Megan",
    "Brian",
    "Rachel",
    "Justin",
    "Hannah",
    "Jason",
    "Lauren",
    "Eric",
    "Stephanie",
    "Scott",
    "Courtney",
    "Ryan",
    "Nicole",
    "Nicholas",
    "Rebecca",
    "Jeffrey",
    "Elizabeth",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
    "Martin",
    "Lee",
    "Perez",
    "Thompson",
    "White",
    "Harris",
    "Sanchez",
    "Clark",
    "Ramirez",
    "Lewis",
    "Robinson",
    "Walker",
    "Young",
    "Allen",
    "King",
  ];
  const cities = [
    "Hanoi",
    "Ho Chi Minh",
    "Da Nang",
    "Hai Phong",
    "Can Tho",
    "Hue",
    "Nha Trang",
    "Vung Tau",
    "Quy Nhon",
  ];

  for (let i = 0; i < 39; i++) {
    const randomFirst =
      firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = randomFirst + " " + randomLast;
    const email =
      randomFirst.toLowerCase() +
      "." +
      randomLast.toLowerCase() +
      i +
      "@gmail.com";
    const phone =
      "09" + Math.floor(10000000 + Math.random() * 90000000).toString();
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
      },
    });
  }
  console.log("✅ 39 Fake users created");

  // 2.5. Create 10 Shops with Products
  console.log("🏪 Creating 10 shops with products...");

  const shopData = [
    {
      shopName: "ProSport Equipment",
      email: "prosport@gmail.com",
      ownerName: "Tran Van Hung",
      phone: "0901234567",
      address: "Hoa Lac Hi-tech Park, km 29, Đại lộ, Thăng Long, Hà Nội",
      latitude: 21.013200 + (Math.random() - 0.5) * 0.01,
      longitude: 105.526200 + (Math.random() - 0.5) * 0.01,
      description:
        "Premium sports equipment for professionals and enthusiasts. We offer both sales and rentals.",
      avatarUrl:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&auto=format&fit=crop&q=60",
      coverUrl:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=60",
    },
    {
      shopName: "Tennis World Vietnam",
      email: "tennisworld@gmail.com",
      ownerName: "Nguyen Thi Mai",
      phone: "0902345678",
      address: "Hoa Lac Hi-tech Park, km 29, Đại lộ, Thăng Long, Hà Nội",
      latitude: 21.013200 + (Math.random() - 0.5) * 0.01,
      longitude: 105.526200 + (Math.random() - 0.5) * 0.01,
      description:
        "Your one-stop shop for all tennis gear. Rackets, balls, apparel and more!",
      avatarUrl:
        "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=200&auto=format&fit=crop&q=60",
      coverUrl:
        "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&auto=format&fit=crop&q=60",
    },
    {
      shopName: "Football Galaxy",
      email: "footballgalaxy@gmail.com",
      ownerName: "Le Minh Duc",
      phone: "0903456789",
      address: "Hoa Lac Hi-tech Park, km 29, Đại lộ, Thăng Long, Hà Nội",
      latitude: 21.013200 + (Math.random() - 0.5) * 0.01,
      longitude: 105.526200 + (Math.random() - 0.5) * 0.01,
      description:
        "Everything for football lovers. From boots to jerseys, balls to accessories.",
      avatarUrl:
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&auto=format&fit=crop&q=60",
      coverUrl:
        "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&auto=format&fit=crop&q=60",
    },
    {
      shopName: "Gym Pro Store",
      email: "gympro@gmail.com",
      ownerName: "Pham Quoc Anh",
      phone: "0904567890",
      address: "Hoa Lac Hi-tech Park, km 29, Đại lộ, Thăng Long, Hà Nội",
      latitude: 21.013200 + (Math.random() - 0.5) * 0.01,
      longitude: 105.526200 + (Math.random() - 0.5) * 0.01,
      description:
        "Professional gym equipment for home and commercial use. Quality guaranteed!",
      avatarUrl:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&auto=format&fit=crop&q=60",
      coverUrl:
        "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=60",
    },
    {
      shopName: "Cycling Hub",
      email: "cyclinghub@gmail.com",
      ownerName: "Hoang Van Tuan",
      phone: "0905678901",
      address: "Hoa Lac Hi-tech Park, km 29, Đại lộ, Thăng Long, Hà Nội",
      latitude: 21.013200 + (Math.random() - 0.5) * 0.01,
      longitude: 105.526200 + (Math.random() - 0.5) * 0.01,
      description:
        "Premium bikes and cycling accessories. Rent or buy your dream bike today!",
      avatarUrl:
        "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=200&auto=format&fit=crop&q=60",
      coverUrl:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop&q=60",
    },
    {
      shopName: "Yoga & Wellness Center",
      email: "yogawellness@gmail.com",
      ownerName: "Vu Thi Lan",
      phone: "0906789012",
      address: "Hoa Lac Hi-tech Park, km 29, Đại lộ, Thăng Long, Hà Nội",
      latitude: 21.013200 + (Math.random() - 0.5) * 0.01,
      longitude: 105.526200 + (Math.random() - 0.5) * 0.01,
      description:
        "Yoga mats, blocks, straps and wellness products for your mindful journey.",
      avatarUrl:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&auto=format&fit=crop&q=60",
      coverUrl:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=60",
    },
    {
      shopName: "Badminton Pro Shop",
      email: "badmintonpro@gmail.com",
      ownerName: "Do Thanh Son",
      phone: "0907890123",
      address: "Hoa Lac Hi-tech Park, km 29, Đại lộ, Thăng Long, Hà Nội",
      latitude: 21.013200 + (Math.random() - 0.5) * 0.01,
      longitude: 105.526200 + (Math.random() - 0.5) * 0.01,
      description:
        "Top-quality badminton rackets, shuttlecocks, and accessories from leading brands.",
      avatarUrl:
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=200&auto=format&fit=crop&q=60",
      coverUrl:
        "https://images.unsplash.com/photo-1613918431703-aa50889e3be6?w=800&auto=format&fit=crop&q=60",
    },
    {
      shopName: "Swimming Gear VN",
      email: "swimminggear@gmail.com",
      ownerName: "Bui Thi Hoa",
      phone: "0908901234",
      address: "Hoa Lac Hi-tech Park, km 29, Đại lộ, Thăng Long, Hà Nội",
      latitude: 21.013200 + (Math.random() - 0.5) * 0.01,
      longitude: 105.526200 + (Math.random() - 0.5) * 0.01,
      description:
        "Complete swimming gear including goggles, caps, swimsuits and pool accessories.",
      avatarUrl:
        "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=200&auto=format&fit=crop&q=60",
      coverUrl:
        "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&auto=format&fit=crop&q=60",
    },
    {
      shopName: "Golf Paradise",
      email: "golfparadise@gmail.com",
      ownerName: "Nguyen Hoang Long",
      phone: "0909012345",
      address: "Hoa Lac Hi-tech Park, km 29, Đại lộ, Thăng Long, Hà Nội",
      latitude: 21.013200 + (Math.random() - 0.5) * 0.01,
      longitude: 105.526200 + (Math.random() - 0.5) * 0.01,
      description:
        "Premium golf clubs, balls, bags and apparel for the discerning golfer.",
      avatarUrl:
        "https://images.unsplash.com/photo-1535132011086-b8818f016104?w=200&auto=format&fit=crop&q=60",
      coverUrl:
        "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&auto=format&fit=crop&q=60",
    },
    {
      shopName: "Running & Outdoor",
      email: "runningoutdoor@gmail.com",
      ownerName: "Tran Thi Ngoc",
      phone: "0900123456",
      address: "Hoa Lac Hi-tech Park, km 29, Đại lộ, Thăng Long, Hà Nội",
      latitude: 21.013200 + (Math.random() - 0.5) * 0.01,
      longitude: 105.526200 + (Math.random() - 0.5) * 0.01,
      description:
        "Running shoes, outdoor gear, camping equipment and adventure accessories.",
      avatarUrl:
        "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=200&auto=format&fit=crop&q=60",
      coverUrl:
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&auto=format&fit=crop&q=60",
    },
  ];

  // Product templates for each shop category
  const productTemplates = {
    "ProSport Equipment": [
      {
        name: "Yonex Astrox 99",
        type: "SALE",
        salePrice: 3500000,
        rentalPrice: 70000,
        depositFee: 1500000,
        category: "Badminton",
        brand: "Yonex",
        imageUrl:
          "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500",
      },
      {
        name: "Wilson Blade 98",
        type: "RENTAL",
        salePrice: 4200000,
        rentalPrice: 120000,
        depositFee: 2000000,
        category: "Tennis",
        brand: "Wilson",
        imageUrl:
          "https://images.unsplash.com/photo-1617083934555-ac7d4fee8909?w=500",
      },
      {
        name: "Nike Mercurial Vapor 15",
        type: "SALE",
        salePrice: 5500000,
        rentalPrice: 150000,
        depositFee: 2500000,
        category: "Soccer",
        brand: "Nike",
        imageUrl:
          "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=500",
      },
      {
        name: "Adidas Predator Edge",
        type: "SALE",
        salePrice: 4800000,
        rentalPrice: 130000,
        depositFee: 2000000,
        category: "Soccer",
        brand: "Adidas",
        imageUrl:
          "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=500",
      },
      {
        name: "Spalding TF-1000",
        type: "SALE",
        salePrice: 2200000,
        rentalPrice: 50000,
        depositFee: 800000,
        category: "Basketball",
        brand: "Spalding",
        imageUrl:
          "https://images.unsplash.com/photo-1519861531473-920026393112?w=500",
      },
      {
        name: "Molten X5000",
        type: "RENTAL",
        salePrice: 1800000,
        rentalPrice: 40000,
        depositFee: 600000,
        category: "Volleyball",
        brand: "Molten",
        imageUrl:
          "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=500",
      },
      {
        name: "Head Speed Pro",
        type: "SALE",
        salePrice: 4500000,
        rentalPrice: 100000,
        depositFee: 2000000,
        category: "Tennis",
        brand: "Head",
        imageUrl:
          "https://images.unsplash.com/photo-1617083934555-ac7d4fee8909?w=500",
      },
      {
        name: "Li-Ning N90 IV",
        type: "RENTAL",
        salePrice: 2800000,
        rentalPrice: 60000,
        depositFee: 1200000,
        category: "Badminton",
        brand: "Li-Ning",
        imageUrl:
          "https://images.unsplash.com/photo-1626224583726-e2c774870364?w=500",
      },
      {
        name: "Mizuno Wave Lightning",
        type: "SALE",
        salePrice: 3200000,
        rentalPrice: 80000,
        depositFee: 1500000,
        category: "Volleyball",
        brand: "Mizuno",
        imageUrl:
          "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500",
      },
      {
        name: "Asics Gel-Resolution 8",
        type: "SALE",
        salePrice: 3800000,
        rentalPrice: 90000,
        depositFee: 1800000,
        category: "Tennis",
        brand: "Asics",
        imageUrl:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      },
    ],
    "Tennis World Vietnam": [
      {
        name: "Wilson Pro Staff RF97",
        type: "SALE",
        salePrice: 5800000,
        rentalPrice: 180000,
        depositFee: 3000000,
        category: "Tennis",
        brand: "Wilson",
        imageUrl:
          "https://images.unsplash.com/photo-1617083934555-ac7d4fee8909?w=500",
      },
      {
        name: "Babolat Pure Aero",
        type: "RENTAL",
        salePrice: 4500000,
        rentalPrice: 140000,
        depositFee: 2500000,
        category: "Tennis",
        brand: "Babolat",
        imageUrl:
          "https://images.unsplash.com/photo-1617083934555-ac7d4fee8909?w=500",
      },
      {
        name: "Head Radical Pro",
        type: "SALE",
        salePrice: 4200000,
        rentalPrice: 120000,
        depositFee: 2000000,
        category: "Tennis",
        brand: "Head",
        imageUrl:
          "https://images.unsplash.com/photo-1617083934555-ac7d4fee8909?w=500",
      },
      {
        name: "Yonex EZONE 98",
        type: "RENTAL",
        salePrice: 4800000,
        rentalPrice: 150000,
        depositFee: 2500000,
        category: "Tennis",
        brand: "Yonex",
        imageUrl:
          "https://images.unsplash.com/photo-1617083934555-ac7d4fee8909?w=500",
      },
      {
        name: "Wilson Tennis Balls (4 pack)",
        type: "SALE",
        salePrice: 250000,
        rentalPrice: null,
        depositFee: null,
        category: "Tennis",
        brand: "Wilson",
        imageUrl:
          "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=500",
      },
      {
        name: "Tennis Net Professional",
        type: "RENTAL",
        salePrice: 3500000,
        rentalPrice: 200000,
        depositFee: 1500000,
        category: "Tennis",
        brand: "Generic",
        imageUrl:
          "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=500",
      },
      {
        name: "Tennis Racket Bag Pro",
        type: "SALE",
        salePrice: 1500000,
        rentalPrice: null,
        depositFee: null,
        category: "Tennis",
        brand: "Wilson",
        imageUrl:
          "https://images.unsplash.com/photo-1617083934555-ac7d4fee8909?w=500",
      },
      {
        name: "Tennis Shoes Court FF",
        type: "SALE",
        salePrice: 3200000,
        rentalPrice: 80000,
        depositFee: 1500000,
        category: "Tennis",
        brand: "Asics",
        imageUrl:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      },
    ],
    "Football Galaxy": [
      {
        name: "Nike Phantom GX Elite",
        type: "SALE",
        salePrice: 6500000,
        rentalPrice: 200000,
        depositFee: 3000000,
        category: "Soccer",
        brand: "Nike",
        imageUrl:
          "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=500",
      },
      {
        name: "Adidas X Speedportal",
        type: "SALE",
        salePrice: 5800000,
        rentalPrice: 180000,
        depositFee: 2800000,
        category: "Soccer",
        brand: "Adidas",
        imageUrl:
          "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=500",
      },
      {
        name: "Puma Future Z 1.3",
        type: "RENTAL",
        salePrice: 4500000,
        rentalPrice: 140000,
        depositFee: 2000000,
        category: "Soccer",
        brand: "Puma",
        imageUrl:
          "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=500",
      },
      {
        name: "Nike Flight Official Ball",
        type: "SALE",
        salePrice: 3200000,
        rentalPrice: 80000,
        depositFee: 1500000,
        category: "Soccer",
        brand: "Nike",
        imageUrl:
          "https://images.unsplash.com/photo-1552318965-6e6be7484ada?w=500",
      },
      {
        name: "Adidas UCL Pro Ball",
        type: "SALE",
        salePrice: 2800000,
        rentalPrice: 70000,
        depositFee: 1200000,
        category: "Soccer",
        brand: "Adidas",
        imageUrl:
          "https://images.unsplash.com/photo-1552318965-6e6be7484ada?w=500",
      },
      {
        name: "Football Goal Post Set",
        type: "RENTAL",
        salePrice: 8500000,
        rentalPrice: 500000,
        depositFee: 4000000,
        category: "Soccer",
        brand: "Generic",
        imageUrl:
          "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=500",
      },
      {
        name: "Goalkeeper Gloves Pro",
        type: "SALE",
        salePrice: 1500000,
        rentalPrice: 50000,
        depositFee: 800000,
        category: "Soccer",
        brand: "Nike",
        imageUrl:
          "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500",
      },
      {
        name: "Shin Guards Elite",
        type: "SALE",
        salePrice: 800000,
        rentalPrice: null,
        depositFee: null,
        category: "Soccer",
        brand: "Adidas",
        imageUrl:
          "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500",
      },
      {
        name: "Football Training Cones Set",
        type: "SALE",
        salePrice: 350000,
        rentalPrice: 30000,
        depositFee: 150000,
        category: "Soccer",
        brand: "Generic",
        imageUrl:
          "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=500",
      },
      {
        name: "Team Jersey Set (11 pcs)",
        type: "RENTAL",
        salePrice: 4500000,
        rentalPrice: 300000,
        depositFee: 2000000,
        category: "Soccer",
        brand: "Generic",
        imageUrl:
          "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500",
      },
      {
        name: "Nike Mercurial Superfly 9",
        type: "SALE",
        salePrice: 7200000,
        rentalPrice: 220000,
        depositFee: 3500000,
        category: "Soccer",
        brand: "Nike",
        imageUrl:
          "https://images.unsplash.com/photo-1511886929837-354d827aae26?w=500",
      },
      {
        name: "Adidas Copa Pure",
        type: "SALE",
        salePrice: 3800000,
        rentalPrice: 100000,
        depositFee: 1800000,
        category: "Soccer",
        brand: "Adidas",
        imageUrl:
          "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=500",
      },
    ],
    "Gym Pro Store": [
      {
        name: "Bowflex SelectTech 1090",
        type: "SALE",
        salePrice: 12500000,
        rentalPrice: 350000,
        depositFee: 6000000,
        category: "Gym",
        brand: "Bowflex",
        imageUrl:
          "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500",
      },
      {
        name: "Power Rack Pro",
        type: "RENTAL",
        salePrice: 25000000,
        rentalPrice: 800000,
        depositFee: 12000000,
        category: "Gym",
        brand: "Rogue",
        imageUrl:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500",
      },
      {
        name: "Olympic Barbell 20kg",
        type: "SALE",
        salePrice: 3500000,
        rentalPrice: 100000,
        depositFee: 1500000,
        category: "Gym",
        brand: "Rogue",
        imageUrl:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500",
      },
      {
        name: "Weight Plates Set (100kg)",
        type: "SALE",
        salePrice: 8500000,
        rentalPrice: 250000,
        depositFee: 4000000,
        category: "Gym",
        brand: "Generic",
        imageUrl:
          "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500",
      },
      {
        name: "Adjustable Bench Press",
        type: "RENTAL",
        salePrice: 5500000,
        rentalPrice: 180000,
        depositFee: 2500000,
        category: "Gym",
        brand: "Bowflex",
        imageUrl:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500",
      },
      {
        name: "Treadmill Pro Series",
        type: "RENTAL",
        salePrice: 35000000,
        rentalPrice: 1200000,
        depositFee: 15000000,
        category: "Gym",
        brand: "NordicTrack",
        imageUrl:
          "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=500",
      },
      {
        name: "Kettlebell Set (5-25kg)",
        type: "SALE",
        salePrice: 4500000,
        rentalPrice: 150000,
        depositFee: 2000000,
        category: "Gym",
        brand: "Rogue",
        imageUrl:
          "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500",
      },
      {
        name: "Resistance Bands Pro Kit",
        type: "SALE",
        salePrice: 850000,
        rentalPrice: null,
        depositFee: null,
        category: "Gym",
        brand: "Generic",
        imageUrl:
          "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500",
      },
      {
        name: "Pull Up Bar Door Frame",
        type: "SALE",
        salePrice: 650000,
        rentalPrice: null,
        depositFee: null,
        category: "Gym",
        brand: "Generic",
        imageUrl:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500",
      },
      {
        name: "Exercise Ball 65cm",
        type: "SALE",
        salePrice: 350000,
        rentalPrice: 20000,
        depositFee: 100000,
        category: "Gym",
        brand: "Generic",
        imageUrl:
          "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500",
      },
      {
        name: "Foam Roller Premium",
        type: "SALE",
        salePrice: 450000,
        rentalPrice: null,
        depositFee: null,
        category: "Gym",
        brand: "Generic",
        imageUrl:
          "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500",
      },
      {
        name: "Cable Machine System",
        type: "RENTAL",
        salePrice: 45000000,
        rentalPrice: 1500000,
        depositFee: 20000000,
        category: "Gym",
        brand: "Life Fitness",
        imageUrl:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500",
      },
    ],
    "Cycling Hub": [
      {
        name: "Trek Domane SL 6",
        type: "RENTAL",
        salePrice: 85000000,
        rentalPrice: 800000,
        depositFee: 40000000,
        category: "Cycling",
        brand: "Trek",
        imageUrl:
          "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500",
      },
      {
        name: "Giant TCR Advanced",
        type: "RENTAL",
        salePrice: 65000000,
        rentalPrice: 600000,
        depositFee: 30000000,
        category: "Cycling",
        brand: "Giant",
        imageUrl:
          "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500",
      },
      {
        name: "Specialized Roubaix",
        type: "SALE",
        salePrice: 75000000,
        rentalPrice: 700000,
        depositFee: 35000000,
        category: "Cycling",
        brand: "Specialized",
        imageUrl:
          "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500",
      },
      {
        name: "Trek Marlin 8 MTB",
        type: "RENTAL",
        salePrice: 25000000,
        rentalPrice: 350000,
        depositFee: 12000000,
        category: "Cycling",
        brand: "Trek",
        imageUrl:
          "https://images.unsplash.com/photo-1576435728678-be95e39e565c?w=500",
      },
      {
        name: "Cycling Helmet Giro",
        type: "SALE",
        salePrice: 2500000,
        rentalPrice: 50000,
        depositFee: 1000000,
        category: "Cycling",
        brand: "Giro",
        imageUrl:
          "https://images.unsplash.com/photo-1557803175-2f8c4e8de9c3?w=500",
      },
      {
        name: "Cycling Shoes Shimano",
        type: "SALE",
        salePrice: 3200000,
        rentalPrice: 80000,
        depositFee: 1500000,
        category: "Cycling",
        brand: "Shimano",
        imageUrl:
          "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500",
      },
      {
        name: "Bike Computer Garmin Edge",
        type: "SALE",
        salePrice: 8500000,
        rentalPrice: 150000,
        depositFee: 4000000,
        category: "Cycling",
        brand: "Garmin",
        imageUrl:
          "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=500",
      },
      {
        name: "Cycling Jersey Pro Kit",
        type: "SALE",
        salePrice: 1800000,
        rentalPrice: null,
        depositFee: null,
        category: "Cycling",
        brand: "Rapha",
        imageUrl:
          "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500",
      },
      {
        name: "Bike Pump Floor Pro",
        type: "SALE",
        salePrice: 550000,
        rentalPrice: null,
        depositFee: null,
        category: "Cycling",
        brand: "Lezyne",
        imageUrl:
          "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500",
      },
      {
        name: "Bike Lock Kryptonite",
        type: "SALE",
        salePrice: 1200000,
        rentalPrice: null,
        depositFee: null,
        category: "Cycling",
        brand: "Kryptonite",
        imageUrl:
          "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500",
      },
    ],
    "Yoga & Wellness Center": [
      {
        name: "Manduka PRO Mat 6mm",
        type: "SALE",
        salePrice: 3800000,
        rentalPrice: 50000,
        depositFee: 1500000,
        category: "Yoga",
        brand: "Manduka",
        imageUrl:
          "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500",
      },
      {
        name: "Liforme Yoga Mat",
        type: "RENTAL",
        salePrice: 4500000,
        rentalPrice: 60000,
        depositFee: 2000000,
        category: "Yoga",
        brand: "Liforme",
        imageUrl:
          "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500",
      },
      {
        name: "Yoga Block Cork Set",
        type: "SALE",
        salePrice: 550000,
        rentalPrice: null,
        depositFee: null,
        category: "Yoga",
        brand: "Generic",
        imageUrl:
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500",
      },
      {
        name: "Yoga Strap Cotton",
        type: "SALE",
        salePrice: 180000,
        rentalPrice: null,
        depositFee: null,
        category: "Yoga",
        brand: "Generic",
        imageUrl:
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500",
      },
      {
        name: "Meditation Cushion Zafu",
        type: "SALE",
        salePrice: 850000,
        rentalPrice: 30000,
        depositFee: 400000,
        category: "Yoga",
        brand: "Generic",
        imageUrl:
          "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500",
      },
      {
        name: "Yoga Wheel Premium",
        type: "SALE",
        salePrice: 650000,
        rentalPrice: 25000,
        depositFee: 300000,
        category: "Yoga",
        brand: "Generic",
        imageUrl:
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500",
      },
      {
        name: "Bolster Yoga Pillow",
        type: "SALE",
        salePrice: 750000,
        rentalPrice: null,
        depositFee: null,
        category: "Yoga",
        brand: "Generic",
        imageUrl:
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500",
      },
    ],
    "Badminton Pro Shop": [
      {
        name: "Yonex Nanoflare 800",
        type: "SALE",
        salePrice: 4200000,
        rentalPrice: 100000,
        depositFee: 2000000,
        category: "Badminton",
        brand: "Yonex",
        imageUrl:
          "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500",
      },
      {
        name: "Victor Thruster K 9900",
        type: "RENTAL",
        salePrice: 3800000,
        rentalPrice: 90000,
        depositFee: 1800000,
        category: "Badminton",
        brand: "Victor",
        imageUrl:
          "https://images.unsplash.com/photo-1626224583726-e2c774870364?w=500",
      },
      {
        name: "Li-Ning Axforce 80",
        type: "SALE",
        salePrice: 3500000,
        rentalPrice: 80000,
        depositFee: 1500000,
        category: "Badminton",
        brand: "Li-Ning",
        imageUrl:
          "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500",
      },
      {
        name: "Yonex Aerosensa 50",
        type: "SALE",
        salePrice: 450000,
        rentalPrice: null,
        depositFee: null,
        category: "Badminton",
        brand: "Yonex",
        imageUrl:
          "https://images.unsplash.com/photo-1626224583726-e2c774870364?w=500",
      },
      {
        name: "Badminton Net Pro",
        type: "RENTAL",
        salePrice: 2500000,
        rentalPrice: 150000,
        depositFee: 1000000,
        category: "Badminton",
        brand: "Generic",
        imageUrl:
          "https://images.unsplash.com/photo-1613918431703-aa50889e3be6?w=500",
      },
      {
        name: "Badminton Shoes Yonex",
        type: "SALE",
        salePrice: 2800000,
        rentalPrice: 60000,
        depositFee: 1200000,
        category: "Badminton",
        brand: "Yonex",
        imageUrl:
          "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500",
      },
      {
        name: "Racket Bag 6-Pack",
        type: "SALE",
        salePrice: 1500000,
        rentalPrice: null,
        depositFee: null,
        category: "Badminton",
        brand: "Yonex",
        imageUrl:
          "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500",
      },
      {
        name: "Grip Tape Roll (10m)",
        type: "SALE",
        salePrice: 150000,
        rentalPrice: null,
        depositFee: null,
        category: "Badminton",
        brand: "Yonex",
        imageUrl:
          "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500",
      },
      {
        name: "Portable Badminton Set",
        type: "RENTAL",
        salePrice: 3500000,
        rentalPrice: 200000,
        depositFee: 1500000,
        category: "Badminton",
        brand: "Generic",
        imageUrl:
          "https://images.unsplash.com/photo-1613918431703-aa50889e3be6?w=500",
      },
    ],
    "Swimming Gear VN": [
      {
        name: "Speedo Fastskin Elite",
        type: "SALE",
        salePrice: 8500000,
        rentalPrice: 200000,
        depositFee: 4000000,
        category: "Swimming",
        brand: "Speedo",
        imageUrl:
          "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500",
      },
      {
        name: "Arena Powerskin Carbon",
        type: "RENTAL",
        salePrice: 7500000,
        rentalPrice: 180000,
        depositFee: 3500000,
        category: "Swimming",
        brand: "Arena",
        imageUrl:
          "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500",
      },
      {
        name: "Speedo Vanquisher Goggles",
        type: "SALE",
        salePrice: 550000,
        rentalPrice: 20000,
        depositFee: 200000,
        category: "Swimming",
        brand: "Speedo",
        imageUrl:
          "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=500",
      },
      {
        name: "Swim Cap Silicone Pro",
        type: "SALE",
        salePrice: 180000,
        rentalPrice: null,
        depositFee: null,
        category: "Swimming",
        brand: "Speedo",
        imageUrl:
          "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500",
      },
      {
        name: "Kickboard Training",
        type: "SALE",
        salePrice: 350000,
        rentalPrice: 15000,
        depositFee: 150000,
        category: "Swimming",
        brand: "Arena",
        imageUrl:
          "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=500",
      },
      {
        name: "Pull Buoy Pro",
        type: "SALE",
        salePrice: 280000,
        rentalPrice: null,
        depositFee: null,
        category: "Swimming",
        brand: "Arena",
        imageUrl:
          "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=500",
      },
      {
        name: "Swim Fins Training",
        type: "RENTAL",
        salePrice: 850000,
        rentalPrice: 40000,
        depositFee: 400000,
        category: "Swimming",
        brand: "Arena",
        imageUrl:
          "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=500",
      },
      {
        name: "Waterproof MP3 Player",
        type: "SALE",
        salePrice: 2500000,
        rentalPrice: 80000,
        depositFee: 1200000,
        category: "Swimming",
        brand: "Sony",
        imageUrl:
          "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500",
      },
      {
        name: "Swim Training Paddles",
        type: "SALE",
        salePrice: 450000,
        rentalPrice: 20000,
        depositFee: 200000,
        category: "Swimming",
        brand: "Speedo",
        imageUrl:
          "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=500",
      },
      {
        name: "Pool Lane Divider Set",
        type: "RENTAL",
        salePrice: 15000000,
        rentalPrice: 800000,
        depositFee: 7000000,
        category: "Swimming",
        brand: "Generic",
        imageUrl:
          "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=500",
      },
    ],
    "Golf Paradise": [
      {
        name: "Callaway Paradym Driver",
        type: "RENTAL",
        salePrice: 18500000,
        rentalPrice: 450000,
        depositFee: 9000000,
        category: "Golf",
        brand: "Callaway",
        imageUrl:
          "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=500",
      },
      {
        name: "TaylorMade Stealth 2",
        type: "SALE",
        salePrice: 16500000,
        rentalPrice: 400000,
        depositFee: 8000000,
        category: "Golf",
        brand: "TaylorMade",
        imageUrl:
          "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=500",
      },
      {
        name: "Titleist TSR3 Driver",
        type: "RENTAL",
        salePrice: 19500000,
        rentalPrice: 500000,
        depositFee: 9500000,
        category: "Golf",
        brand: "Titleist",
        imageUrl:
          "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=500",
      },
      {
        name: "Ping G430 Iron Set",
        type: "SALE",
        salePrice: 35000000,
        rentalPrice: 800000,
        depositFee: 17000000,
        category: "Golf",
        brand: "Ping",
        imageUrl:
          "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=500",
      },
      {
        name: "Callaway Chrome Soft Balls",
        type: "SALE",
        salePrice: 1500000,
        rentalPrice: null,
        depositFee: null,
        category: "Golf",
        brand: "Callaway",
        imageUrl:
          "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=500",
      },
      {
        name: "Golf Bag Stand Premium",
        type: "SALE",
        salePrice: 5500000,
        rentalPrice: 150000,
        depositFee: 2500000,
        category: "Golf",
        brand: "Titleist",
        imageUrl:
          "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=500",
      },
      {
        name: "Golf Cart Electric",
        type: "RENTAL",
        salePrice: 85000000,
        rentalPrice: 1500000,
        depositFee: 40000000,
        category: "Golf",
        brand: "Club Car",
        imageUrl:
          "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=500",
      },
      {
        name: "Golf Glove Premium Leather",
        type: "SALE",
        salePrice: 850000,
        rentalPrice: null,
        depositFee: null,
        category: "Golf",
        brand: "FootJoy",
        imageUrl:
          "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=500",
      },
      {
        name: "Putting Mat Indoor",
        type: "SALE",
        salePrice: 2500000,
        rentalPrice: 100000,
        depositFee: 1200000,
        category: "Golf",
        brand: "Generic",
        imageUrl:
          "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=500",
      },
      {
        name: "Golf Rangefinder Bushnell",
        type: "SALE",
        salePrice: 8500000,
        rentalPrice: 200000,
        depositFee: 4000000,
        category: "Golf",
        brand: "Bushnell",
        imageUrl:
          "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=500",
      },
      {
        name: "Golf Umbrella UV Protection",
        type: "SALE",
        salePrice: 650000,
        rentalPrice: null,
        depositFee: null,
        category: "Golf",
        brand: "Generic",
        imageUrl:
          "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=500",
      },
    ],
    "Running & Outdoor": [
      {
        name: "Nike ZoomX Vaporfly",
        type: "SALE",
        salePrice: 6500000,
        rentalPrice: 180000,
        depositFee: 3000000,
        category: "Running",
        brand: "Nike",
        imageUrl:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      },
      {
        name: "Adidas Adizero Adios Pro",
        type: "SALE",
        salePrice: 5800000,
        rentalPrice: 160000,
        depositFee: 2800000,
        category: "Running",
        brand: "Adidas",
        imageUrl:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      },
      {
        name: "Hoka Clifton 9",
        type: "RENTAL",
        salePrice: 4200000,
        rentalPrice: 120000,
        depositFee: 2000000,
        category: "Running",
        brand: "Hoka",
        imageUrl:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      },
      {
        name: "Garmin Forerunner 965",
        type: "SALE",
        salePrice: 15500000,
        rentalPrice: 300000,
        depositFee: 7500000,
        category: "Running",
        brand: "Garmin",
        imageUrl:
          "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=500",
      },
      {
        name: "Hydration Vest Trail",
        type: "SALE",
        salePrice: 2500000,
        rentalPrice: 80000,
        depositFee: 1200000,
        category: "Running",
        brand: "Salomon",
        imageUrl:
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500",
      },
      {
        name: "Camping Tent 4-Person",
        type: "RENTAL",
        salePrice: 8500000,
        rentalPrice: 400000,
        depositFee: 4000000,
        category: "Outdoor",
        brand: "The North Face",
        imageUrl:
          "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500",
      },
      {
        name: "Sleeping Bag -10C",
        type: "RENTAL",
        salePrice: 3500000,
        rentalPrice: 150000,
        depositFee: 1500000,
        category: "Outdoor",
        brand: "Marmot",
        imageUrl:
          "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500",
      },
      {
        name: "Hiking Backpack 65L",
        type: "SALE",
        salePrice: 4500000,
        rentalPrice: 180000,
        depositFee: 2000000,
        category: "Outdoor",
        brand: "Osprey",
        imageUrl:
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500",
      },
      {
        name: "Trekking Poles Carbon",
        type: "SALE",
        salePrice: 1800000,
        rentalPrice: 60000,
        depositFee: 800000,
        category: "Outdoor",
        brand: "Black Diamond",
        imageUrl:
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500",
      },
      {
        name: "Headlamp Rechargeable",
        type: "SALE",
        salePrice: 850000,
        rentalPrice: null,
        depositFee: null,
        category: "Outdoor",
        brand: "Petzl",
        imageUrl:
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500",
      },
      {
        name: "Portable Stove Camping",
        type: "RENTAL",
        salePrice: 1500000,
        rentalPrice: 80000,
        depositFee: 700000,
        category: "Outdoor",
        brand: "MSR",
        imageUrl:
          "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500",
      },
      {
        name: "Compression Socks Pro",
        type: "SALE",
        salePrice: 550000,
        rentalPrice: null,
        depositFee: null,
        category: "Running",
        brand: "CEP",
        imageUrl:
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500",
      },
    ],
  };

  const createdShops = [];
  for (const shop of shopData) {
    // Create seller user
    const sellerUser = await prisma.user.create({
      data: {
        email: shop.email,
        password,
        name: shop.ownerName,
        role: "SELLER",
        phone: shop.phone,
        address: shop.address,
        isVerified: true,
        balance: Math.floor(Math.random() * 10) * 1000000 + 5000000,
      },
    });

    // Create shop
    const newShop = await prisma.shop.create({
      data: {
        userId: sellerUser.id,
        name: shop.shopName,
        description: shop.description,
        avatarUrl: shop.avatarUrl,
        coverUrl: shop.coverUrl,
        isActive: true,
        commissionRate: 5.0,
        balance: Math.floor(Math.random() * 20) * 1000000,
      },
    });

    createdShops.push({ shop: newShop, shopName: shop.shopName });

    // Create products for this shop (5-15 products)
    const products = productTemplates[shop.shopName] || [];
    const numProducts = Math.min(
      products.length,
      Math.floor(Math.random() * 11) + 5,
    ); // 5-15 products
    const selectedProducts = products.slice(0, numProducts);

    for (const prod of selectedProducts) {
      const product = await prisma.product.create({
        data: {
          name: prod.name,
          description: `${prod.name} - High quality ${prod.category.toLowerCase()} equipment from ${prod.brand}. Available at ${shop.shopName}.`,
          type: prod.type,
          salePrice: prod.salePrice,
          rentalPrice: prod.rentalPrice,
          depositFee: prod.depositFee,
          category: prod.category,
          brand: prod.brand,
          imageUrl: prod.imageUrl,
          images: [prod.imageUrl],
          stock: Math.floor(Math.random() * 20) + 5,
          isActive: true,
          isRecommended: Math.random() > 0.7,
          shopId: newShop.id,
        },
      });

      // Create product items for rental products
      if (prod.type === "RENTAL" && prod.rentalPrice) {
        const numItems = Math.floor(Math.random() * 3) + 2; // 2-4 items
        for (let i = 0; i < numItems; i++) {
          await prisma.productItem.create({
            data: {
              productId: product.id,
              serialNumber: `${prod.brand.substring(0, 3).toUpperCase()}-${product.id.substring(0, 6)}-${String(i + 1).padStart(3, "0")}`,
              status: Math.random() > 0.3 ? "AVAILABLE" : "RENTING",
              condition: ["NEW", "LIKE_NEW", "GOOD"][
                Math.floor(Math.random() * 3)
              ],
            },
          });
        }
      }
    }
  }

  console.log(`✅ Created ${createdShops.length} shops with products`);
  console.log("📋 Shop credentials (password: 123456):");
  for (const shop of shopData) {
    console.log(`   - ${shop.shopName}: ${shop.email}`);
  }

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
      imageUrl:
        "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=500&auto=format&fit=crop&q=60",
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
      imageUrl:
        "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=500&auto=format&fit=crop&q=60",
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
      imageUrl:
        "https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=500&auto=format&fit=crop&q=60",
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
      imageUrl:
        "https://images.unsplash.com/photo-1560965839-a9310d65ff98?w=500&auto=format&fit=crop&q=60",
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
      imageUrl:
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&auto=format&fit=crop&q=60",
    },
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
    {
      name: "Selkirk Amped Epic",
      description: "Professional pickleball paddle with polymer core for power and control.",
      type: "SALE",
      salePrice: 3200000,
      rentalPrice: 80000,
      depositFee: 1500000,
      category: "Pickleball",
      brand: "Selkirk",
      stock: 20,
      imageUrl:
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&auto=format&fit=crop&q=60",
      isActive: true,
    },
    {
      name: "Franklin X-40 Pickleball Set",
      description: "Official outdoor pickleballs - pack of 12 for tournaments and practice.",
      type: "SALE",
      salePrice: 850000,
      rentalPrice: null,
      depositFee: null,
      category: "Pickleball",
      brand: "Franklin",
      stock: 50,
      imageUrl:
        "https://images.unsplash.com/photo-1626224583726-e2c774870364?w=500&auto=format&fit=crop&q=60",
      isActive: true,
    },
    {
      name: "Engage Pursuit Pro",
      description: "Lightweight pickleball paddle designed for quick reactions and spin.",
      type: "RENTAL",
      salePrice: 4500000,
      rentalPrice: 100000,
      depositFee: 2000000,
      category: "Pickleball",
      brand: "Engage",
      stock: 10,
      imageUrl:
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&auto=format&fit=crop&q=60",
      isActive: true,
    },
    {
      name: "Onix Z5 Graphite Paddle",
      description: "Bestselling pickleball paddle with widebody shape for larger sweet spot.",
      type: "SALE",
      salePrice: 2800000,
      rentalPrice: 70000,
      depositFee: 1200000,
      category: "Pickleball",
      brand: "Onix",
      stock: 15,
      imageUrl:
        "https://images.unsplash.com/photo-1626224583726-e2c774870364?w=500&auto=format&fit=crop&q=60",
      isActive: true,
    },
    {
      name: "Portable Pickleball Net System",
      description: "Regulation height portable net perfect for setting up courts anywhere.",
      type: "RENTAL",
      salePrice: 5500000,
      rentalPrice: 250000,
      depositFee: 2500000,
      category: "Pickleball",
      brand: "Onix",
      stock: 8,
      imageUrl:
        "https://images.unsplash.com/photo-1613918431703-aa50889e3be6?w=500&auto=format&fit=crop&q=60",
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

  const allCustomers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
  });
  const allProducts = await prisma.product.findMany();
  const allExperts = await prisma.expertProfile.findMany();
  const allShops = await prisma.shop.findMany();

  if (
    allCustomers.length > 0 &&
    allProducts.length > 0 &&
    allShops.length > 0
  ) {
    for (let i = 0; i < 50; i++) {
      const randomCustomer =
        allCustomers[Math.floor(Math.random() * allCustomers.length)];
      const randomProduct =
        allProducts[Math.floor(Math.random() * allProducts.length)];
      const randomShop = randomProduct.shopId
        ? allShops.find((s) => s.id === randomProduct.shopId) ||
          allShops[Math.floor(Math.random() * allShops.length)]
        : allShops[Math.floor(Math.random() * allShops.length)];

      // Determine if it's a rental (if the product supports rental)
      const isRental =
        Math.random() > 0.5 && randomProduct.rentalPrice !== null;

      // Assume a default sale price if missing, or use rental price
      const price = isRental
        ? randomProduct.rentalPrice
        : randomProduct.salePrice || 100000;
      const quantity = Math.floor(Math.random() * 3) + 1; // 1 to 3 items
      const totalAmount = price * quantity;

      const order = await prisma.order.create({
        data: {
          userId: randomCustomer.id,
          status: [
            "PENDING",
            "CONFIRMED",
            "DELIVERED",
            "RETURNED",
            "CANCELLED",
          ][Math.floor(Math.random() * 5)],
          totalAmount: totalAmount,
          paymentMethod: "CREDIT_CARD",
          shippingAddress: randomCustomer.address,
        },
      });

      const shopOrder = await prisma.shopOrder.create({
        data: {
          orderId: order.id,
          shopId: randomShop.id,
          status: order.status,
          totalAmount: totalAmount,
          sellerEarning: totalAmount * 0.95,
          commissionFee: totalAmount * 0.05,
        },
      });

      await prisma.orderItem.create({
        data: {
          shopOrderId: shopOrder.id,
          productId: randomProduct.id,
          quantity: quantity,
          price: price,
          isRental: isRental,
          rentalDays: isRental ? Math.floor(Math.random() * 5) + 1 : null,
        },
      });

      await prisma.transaction.create({
        data: {
          userId: randomCustomer.id,
          type: "PAYMENT",
          amount: totalAmount,
          description: "Payment for order " + order.id,
        },
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
      const randomCustomer =
        allCustomers[Math.floor(Math.random() * allCustomers.length)];
      const randomExpert =
        allExperts[Math.floor(Math.random() * allExperts.length)];

      // Random date in the next 10 days
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 10));

      const duration = Math.floor(Math.random() * 2) + 1; // 1 or 2 hours

      await prisma.booking.create({
        data: {
          userId: randomCustomer.id,
          expertId: randomExpert.id,
          status: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"][
            Math.floor(Math.random() * 4)
          ],
          bookingDate: futureDate,
          duration: duration,
          totalAmount: randomExpert.hourlyRate * duration,
          notes: "Looking forward to the session!",
        },
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
