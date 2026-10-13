import { config } from 'dotenv';
config();
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const usersToSeed = [
  {
    branch: 'Headquarters',
    name: 'Super Admin',
    email: 'superadmin@gmail.com',
    username: 'superadmin',
    password: 'superadmin1234',
    role: 'super',
    salaryA: 0,
    salaryB: 0,
    epf: 0,
    advances: 0,
    cover: 0,
    intensive: 0,
    travelling: 0,
    net: 0,
    joinDate: '2026-01-01',
    sortOrder: 1
  },
  {
    branch: 'Colombo',
    name: 'Dinusha Pushparajah',
    email: 'dinushapushparajah@gmail.com',
    username: 'dinusha',
    password: 'dinusha123',
    role: 'super',
    salaryA: 80000,
    salaryB: 0,
    epf: 6400,
    advances: 0,
    cover: 0,
    intensive: 0,
    travelling: 0,
    net: 73600,
    joinDate: '2026-02-15',
    bankName: 'HNB bank',
    accountNo: '007020110442',
    bankBranch: 'pettah',
    accountHolderName: 'P Dinusha',
    sortOrder: 2
  },
  {
    branch: 'Kandy',
    name: 'Janani Saijanani',
    email: 'jananisaijanani9@gmail.com',
    username: 'janani',
    password: 'janani123',
    role: 'employee',
    salaryA: 50000,
    salaryB: 0,
    epf: 4000,
    advances: 0,
    cover: 0,
    intensive: 0,
    travelling: 0,
    net: 46000,
    joinDate: '2026-03-10',
    bankName: 'DFCC Bank',
    accountNo: '102003085136',
    bankBranch: 'Kegalle - 049',
    accountHolderName: 'K S Janani',
    sortOrder: 3
  },
  {
    branch: 'Galle',
    name: 'F P N S DIAS(nisal)',
    email: 'nisalsayuranga0710@gmail.com',
    username: 'nisal',
    password: 'nisal123',
    role: 'employee',
    salaryA: 50000,
    salaryB: 0,
    epf: 4000,
    advances: 0,
    cover: 0,
    intensive: 0,
    travelling: 0,
    net: 46000,
    joinDate: '2026-04-01',
    bankName: 'COMMERCIAL BANK',
    accountNo: '8010517853',
    bankBranch: 'WADDUWA',
    accountHolderName: 'F P N S DIAS',
    sortOrder: 4
  },
  {
    branch: 'Headquarters',
    name: 'Sasindu Jayaminda Mohotti',
    email: 'msjayaminda@gmail.com',
    username: 'jayaminda',
    password: 'jayaminda123',
    role: 'employee',
    salaryA: 50000,
    salaryB: 0,
    epf: 4000,
    advances: 0,
    cover: 0,
    intensive: 0,
    travelling: 0,
    net: 46000,
    joinDate: '2026-01-20',
    address: '"Sasindu"Galagama,North, Nakulugamuwa.',
    nic: '200132803902',
    sortOrder: 5
  }
];

async function main() {
  console.log('Seeding full user profiles...');
  for (const u of usersToSeed) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { ...u },
      create: { ...u }
    });
    console.log(`Upserted: ${user.name} (${user.username})`);
  }
  console.log('User seeding completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
