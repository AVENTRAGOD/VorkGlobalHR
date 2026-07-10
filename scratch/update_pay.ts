import { config } from 'dotenv';
config();
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const updates = [
    { username: 'jayaminda', net: 50000, salaryA: 50000 },
    { username: 'nisal', net: 50000, salaryA: 50000 },
    { username: 'janani', net: 50000, salaryA: 50000 },
    { username: 'dinusha', net: 80000, salaryA: 80000 },
  ];

  for (const update of updates) {
    const user = await prisma.user.update({
      where: { username: update.username },
      data: {
        net: update.net,
        salaryA: update.salaryA
      }
    });
    console.log(`Updated ${user.username} to net pay ${user.net}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
