/**
 * Re-seeds all user passwords as bcrypt hashes.
 * Run this after deploying the bcrypt login fix to convert
 * the existing plain-text passwords to secure hashes.
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

const users = [
  { username: 'superadmin', password: 'superadmin1234' },
  { username: 'dinusha',    password: 'dinusha123'     },
  { username: 'janani',     password: 'janani123'      },
  { username: 'nisal',      password: 'nisal123'       },
  { username: 'jayaminda',  password: 'jayaminda123'   },
];

async function main() {
  console.log('Hashing passwords with bcrypt...\n');

  for (const u of users) {
    const existing = await prisma.user.findFirst({ where: { username: u.username } });
    if (!existing) {
      console.log(`  SKIP: ${u.username} not found in DB`);
      continue;
    }

    // Skip if already hashed (bcrypt hashes start with $2b$ or $2a$)
    if (existing.password?.startsWith('$2')) {
      console.log(`  SKIP: ${u.username} — already hashed`);
      continue;
    }

    const hashed = await bcrypt.hash(u.password, SALT_ROUNDS);
    await prisma.user.update({
      where: { uid: existing.uid },
      data:  { password: hashed },
    });
    console.log(`  OK: ${u.username} — password hashed`);
  }

  console.log('\nVerification — checking login for each user:');
  for (const u of users) {
    const user = await prisma.user.findFirst({ where: { username: u.username } });
    if (user?.password) {
      const valid = await bcrypt.compare(u.password, user.password);
      console.log(`  ${valid ? 'PASS' : 'FAIL'}: ${u.username}`);
    }
  }

  console.log('\nDone! All passwords are now bcrypt-hashed.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
