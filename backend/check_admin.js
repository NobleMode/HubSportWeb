import prisma from "./src/config/database.js";

async function checkAdmin() {
  const admin = await prisma.$queryRaw`SELECT * FROM users WHERE email='admin@gmail.com'`;
  console.log("Admin Row:", admin);
  await prisma.$disconnect();
}
checkAdmin();
