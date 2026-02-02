import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const item = await prisma.productItem.findUnique({
    where: { serialNumber: '123456789' },
    include: {
      product: true,
    },
  });
  console.log(JSON.stringify(item, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
