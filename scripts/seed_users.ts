import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

// Role mapping from display name → Prisma DB role value
// Schema allows: 'super' | 'owner' | 'hr' | 'employee'
const usersToSeed = [
  {
    name: 'Super Admin',
    username: 'superadmin',
    email: 'superadmin@gmail.com',
    password: 'superadmin1234',
    role: 'super',           // Super Admin → 'super'
    branch: 'Rajagiriya',
    sortOrder: 1,
    salaryA: 0,
    epf: 0,
    net: 0,
    joinDate: '2026-01-01',
  },
  {
    name: 'Dinusha Pushparajah',
    username: 'dinusha',
    email: 'dinushapushparajah@gmail.com',
    password: 'dinusha123',
    role: 'hr',              // HR/Admin → 'hr'
    branch: 'Rajagiriya',
    sortOrder: 2,
    salaryA: 80000,
    epf: 0,
    net: 80000,
    joinDate: '2026-03-01',
    bankName: 'HNB',
    accountNo: '007020110442',
  },
  {
    name: 'Sai Janani',
    username: 'janani',
    email: 'jananisaijanani9@gmail.com',
    password: 'janani123',
    role: 'employee',
    branch: 'Rajagiriya',
    sortOrder: 3,
    salaryA: 50000,
    epf: 0,
    net: 50000,
    joinDate: '2026-05-01',
    bankName: 'HNB',
    accountNo: '102003085136',
  },
  {
    name: 'Nisal Sayuranga',
    username: 'nisal',
    email: 'nisalsayuranga0710@gmail.com',
    password: 'nisal123',
    role: 'employee',
    branch: 'Rajagiriya',
    sortOrder: 4,
    salaryA: 50000,
    epf: 0,
    net: 50000,
    joinDate: '2026-05-01',
    bankName: 'HNB',
    accountNo: '0093092721',
  },
  {
    name: 'Sasindu Jayaminda',
    username: 'jayaminda',
    email: 'msjayaminda@gmail.com',
    password: 'jayaminda123',
    role: 'employee',
    branch: 'Rajagiriya',
    sortOrder: 5,
    salaryA: 50000,
    epf: 0,
    net: 50000,
    joinDate: '2026-05-01',
    bankName: 'HNB',
    accountNo: '0093091330',
  },
];

async function main() {
  console.log('Starting user seed...\n');

  for (const userData of usersToSeed) {
    // Look for existing user by email or username
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userData.email },
          { username: userData.username },
        ],
      },
    });

    if (existing) {
      // Update the user to make sure all fields are correct
      const updated = await prisma.user.update({
        where: { uid: existing.uid },
        data: {
          name: userData.name,
          username: userData.username,
          email: userData.email,
          password: userData.password,
          role: userData.role,
          branch: userData.branch,
          sortOrder: userData.sortOrder,
          salaryA: userData.salaryA,
          epf: userData.epf,
          net: userData.net,
          ...(userData.bankName  && { bankName: userData.bankName }),
          ...(userData.accountNo && { accountNo: userData.accountNo }),
        },
      });
      console.log(`Updated  [${updated.role}] ${updated.name} <${updated.email}>`);
    } else {
      // Create new user
      const created = await prisma.user.create({
        data: {
          name: userData.name,
          username: userData.username,
          email: userData.email,
          password: userData.password,
          role: userData.role,
          branch: userData.branch,
          sortOrder: userData.sortOrder,
          salaryA: userData.salaryA,
          epf: userData.epf,
          net: userData.net,
          joinDate: userData.joinDate,
          ...(userData.bankName  && { bankName: userData.bankName }),
          ...(userData.accountNo && { accountNo: userData.accountNo }),
        },
      });
      console.log(`Created  [${created.role}] ${created.name} <${created.email}>`);
    }
  }

  console.log('\n--- Final user list ---');
  const allUsers = await prisma.user.findMany({
    select: { name: true, username: true, email: true, role: true, password: true },
    orderBy: { sortOrder: 'asc' },
  });
  console.table(allUsers);

  console.log('\nSeed complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
