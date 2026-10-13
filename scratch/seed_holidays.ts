import { config } from 'dotenv';
config();
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const holidays = [
  { id: '1', date: '2026-01-01', title: "New Year's Day", type: 'Public' },
  { id: '2', date: '2026-01-14', title: 'Tamil Thai Pongal Day', type: 'Public' },
  { id: '3', date: '2026-02-04', title: 'Independence Day', type: 'Public' },
  { id: '4', date: '2026-04-13', title: 'Sinhala & Tamil New Year Eve', type: 'Public' },
  { id: '5', date: '2026-04-14', title: 'Sinhala & Tamil New Year Day', type: 'Public' },
  { id: '6', date: '2026-05-01', title: 'May Day', type: 'Public' },
  { id: '7', date: '2026-12-25', title: 'Christmas Day', type: 'Public' },
];

async function main() {
  for (const h of holidays) {
    await prisma.holiday.upsert({
      where: { id: h.id },
      update: { date: h.date, title: h.title, type: h.type },
      create: h
    });
  }
  console.log('Holidays seeded successfully!');
}

main().finally(() => prisma.$disconnect());
