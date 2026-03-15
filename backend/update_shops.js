import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const shops = await prisma.shop.findMany({
    where: {
      OR: [
        { latitude: null },
        { longitude: null }
      ]
    }
  });

  console.log(`Found ${shops.length} shops without location. Updating...`);

  for (const shop of shops) {
    await prisma.shop.update({
      where: { id: shop.id },
      data: {
        address: "Hoa Lac Hi-tech Park, km 29, Đại lộ, Thăng Long, Hà Nội",
        latitude: 21.013200 + (Math.random() - 0.5) * 0.01,
        longitude: 105.526200 + (Math.random() - 0.5) * 0.01,
      }
    });
  }
  console.log("Done updating shops!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
