import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAdmin() {
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@sporthub.vn' },
  });
  console.log('Admin User:', admin);
}

checkAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
