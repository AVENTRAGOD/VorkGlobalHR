import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Checking database tables and data...");
  
  const userCount = await prisma.user.count();
  console.log(`\nUsers table count: ${userCount}`);
  
  const users = await prisma.user.findMany({
    select: { name: true, email: true, role: true }
  });
  console.table(users);

  const attendanceCount = await prisma.attendanceRecord.count();
  console.log(`\nAttendanceRecord table count: ${attendanceCount}`);

  const payrollCount = await prisma.payrollRecord.count();
  console.log(`\nPayrollRecord table count: ${payrollCount}`);
  
  if (payrollCount > 0) {
    const payrolls = await prisma.payrollRecord.findMany({
      select: { userName: true, month: true, year: true, netSalary: true, status: true }
    });
    console.table(payrolls);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
