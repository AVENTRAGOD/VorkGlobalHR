import { config } from 'dotenv';
config();
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  const payrollItems = [
    { username: 'dinusha', month: 3, year: 2026, status: 'Paid' },
    { username: 'janani', month: 3, year: 2026, status: 'Paid' },
    { username: 'nisal', month: 3, year: 2026, status: 'Paid' },
    { username: 'jayaminda', month: 3, year: 2026, status: 'Paid' },
  ];

  for (const item of payrollItems) {
    const user = users.find(u => u.username === item.username);
    if (!user) continue;

    const netSalary = (user.salaryA || 0) + (user.intensive || 0) + (user.travelling || 0) - (user.epf || 0) - (user.advances || 0) - (user.cover || 0);

    const existing = await prisma.payrollRecord.findFirst({
      where: { userId: user.uid, month: item.month, year: item.year }
    });

    if (!existing) {
      await prisma.payrollRecord.create({
        data: {
          userId: user.uid,
          userName: user.name,
          month: item.month,
          year: item.year,
          salaryA: user.salaryA,
          salaryB: user.salaryB,
          epf: user.epf,
          advances: user.advances,
          cover: user.cover,
          intensive: user.intensive,
          travelling: user.travelling,
          netSalary,
          status: item.status,
          branch: user.branch,
          sortOrder: user.sortOrder,
          createdAt: new Date().toISOString()
        }
      });
      console.log(`Created payroll record for ${user.name}`);
    }
  }
}

main().finally(() => prisma.$disconnect());
