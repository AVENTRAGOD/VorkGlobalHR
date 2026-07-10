import { config } from 'dotenv';
config();
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const usersToSeed = [
  {
    name: 'Super Admin',
    email: 'superadmin@gmail.com',
    username: 'superadmin',
    password: 'superadmin1234',
    role: 'superadmin',
    joinDate: new Date().toISOString().split('T')[0]
  },
  {
    name: 'Dinusha',
    email: 'dinushapushparajah@gmail.com',
    username: 'dinusha',
    password: 'dinusha123',
    role: 'hr',
    joinDate: new Date().toISOString().split('T')[0]
  },
  {
    name: 'Janani',
    email: 'jananisaijanani9@gmail.com',
    username: 'janani',
    password: 'janani123',
    role: 'employee',
    joinDate: new Date().toISOString().split('T')[0]
  },
  {
    name: 'Nisal',
    email: 'nisalsayuranga0710@gmail.com',
    username: 'nisal',
    password: 'nisal123',
    role: 'employee',
    joinDate: new Date().toISOString().split('T')[0]
  },
  {
    name: 'Jayaminda',
    email: 'msjayaminda@gmail.com',
    username: 'jayaminda',
    password: 'jayaminda123',
    role: 'employee',
    joinDate: new Date().toISOString().split('T')[0]
  }
];

async function main() {
  console.log('Seeding users...');
  for (const u of usersToSeed) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        password: u.password,
        role: u.role
      },
      create: {
        name: u.name,
        email: u.email,
        username: u.username,
        password: u.password,
        role: u.role,
        joinDate: u.joinDate
      }
    });
    console.log(`Upserted user: ${user.username}`);
  }
  console.log('Seeding finished.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
