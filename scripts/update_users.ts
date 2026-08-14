import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

const userUpdates = [
  { 
    username: 'superadmin', 
    email: 'superadmin@gmail.com', 
    password: 'superadmin1234', 
    role: 'super' 
  },
  { 
    username: 'dinusha',    
    email: 'dinushapushparajah@gmail.com', 
    password: 'dinusha123',     
    role: 'hr' 
  },
  { 
    username: 'janani',     
    email: 'jananisaijanani9@gmail.com', 
    password: 'janani123',      
    role: 'employee' 
  },
  { 
    username: 'nisal',      
    email: 'nisalsayuranga0710@gmail.com', 
    password: 'nisal123',       
    role: 'employee' 
  },
  { 
    username: 'jayaminda',  
    email: 'msjayaminda@gmail.com', 
    password: 'jayaminda123',   
    role: 'employee' 
  },
];

async function main() {
  console.log('Updating users with specific emails, passwords, and roles...\n');

  for (const u of userUpdates) {
    const existing = await prisma.user.findFirst({ where: { username: u.username } });
    if (!existing) {
      console.log(`  SKIP: ${u.username} not found in DB`);
      continue;
    }

    const hashed = await bcrypt.hash(u.password, SALT_ROUNDS);
    await prisma.user.update({
      where: { uid: existing.uid },
      data:  { 
        email: u.email,
        password: hashed,
        role: u.role
      },
    });
    console.log(`  OK: ${u.username} updated (email: ${u.email}, role: ${u.role})`);
  }

  console.log('\nVerification:');
  for (const u of userUpdates) {
    const user = await prisma.user.findFirst({ where: { username: u.username } });
    if (user?.password) {
      const valid = await bcrypt.compare(u.password, user.password);
      console.log(`  ${valid ? 'PASS' : 'FAIL'}: ${u.username} | Role: ${user.role} | Email: ${user.email}`);
    }
  }

  console.log('\nDone! Users updated successfully.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
