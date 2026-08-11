import { PrismaClient } from '@prisma/client';
import { addMinutes, subMinutes, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, format } from 'date-fns';

const prisma = new PrismaClient();

const employeesData = [
  {
    email: 'dinushapushparajah@gmail.com',
    username: 'dinusha',
    name: 'Dinusha Pushparajah',
    role: 'super',
    password: 'dinusha123',
    branch: 'rajagiriya',
    bankName: 'hnb',
    accountNo: '007020110442',
    salaryA: 80000,
    epf: 0,
    net: 80000,
    baseStart: '10:00',
    baseEnd: '19:00' // 7 PM
  },
  {
    email: 'jananisaijanani9@gmail.com',
    username: 'janani',
    name: 'Sai Janani',
    role: 'employee',
    password: 'janani123',
    branch: 'rajagiriya',
    bankName: 'hnb',
    accountNo: '102003085136',
    salaryA: 50000,
    epf: 0,
    net: 50000,
    baseStart: '10:00',
    baseEnd: '18:00' // 6 PM
  },
  {
    email: 'msjayaminda@gmail.com',
    username: 'jayaminda',
    name: 'Sasindu Jayaminda',
    role: 'employee',
    password: 'jayaminda123',
    branch: 'rajagiriya',
    bankName: 'hnb',
    accountNo: '0093091330',
    salaryA: 50000,
    epf: 0,
    net: 50000,
    baseStart: '09:00',
    baseEnd: '17:00' // 5 PM
  },
  {
    email: 'nisalsayuranga0710@gmail.com',
    username: 'nisal',
    name: 'Nisal Sayuranga',
    role: 'employee',
    password: 'nisal123',
    branch: 'rajagiriya',
    bankName: 'hnb',
    accountNo: '0093092721',
    salaryA: 50000,
    epf: 0,
    net: 50000,
    baseStart: '09:00',
    baseEnd: '17:00' // 5 PM
  }
];

function getRandomOffsetMinutes(maxMinutes: number) {
  const sign = Math.random() < 0.5 ? -1 : 1;
  return Math.floor(Math.random() * maxMinutes) * sign;
}

function generateTimeWithOffset(baseTimeStr: string, maxOffsetMinutes: number) {
  const [hours, minutes] = baseTimeStr.split(':').map(Number);
  const baseDate = new Date();
  baseDate.setHours(hours, minutes, 0, 0);
  
  const offset = getRandomOffsetMinutes(maxOffsetMinutes);
  const newDate = new Date(baseDate.getTime() + offset * 60000);
  return format(newDate, 'HH:mm');
}

async function main() {
  console.log('Starting DB update...');

  // Update or Create Profiles
  for (const emp of employeesData) {
    // try to find by email or username
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emp.email },
          { username: emp.username }
        ]
      }
    });

    if (user) {
      user = await prisma.user.update({
        where: { uid: user.uid },
        data: {
          name: emp.name,
          username: emp.username,
          email: emp.email,
          role: emp.role,
          password: emp.password,
          branch: emp.branch,
          bankName: emp.bankName,
          accountNo: emp.accountNo,
          salaryA: emp.salaryA,
          epf: emp.epf,
          net: emp.net
        }
      });
      console.log(`Updated user: ${user.name}`);
    } else {
      user = await prisma.user.create({
        data: {
          name: emp.name,
          username: emp.username,
          email: emp.email,
          role: emp.role,
          password: emp.password,
          branch: emp.branch,
          bankName: emp.bankName,
          accountNo: emp.accountNo,
          salaryA: emp.salaryA,
          epf: emp.epf,
          net: emp.net,
          joinDate: '2026-05-01'
        }
      });
      console.log(`Created user: ${user.name}`);
    }

    // Generate Attendance for May, June, July
    const months = [4, 5, 6]; // May (4), June (5), July (6) in JS Dates (0-indexed)
    
    for (const monthIdx of months) {
      const year = 2026;
      const start = new Date(year, monthIdx, 1);
      const end = endOfMonth(start);
      
      const days = eachDayOfInterval({ start, end });
      
      for (const day of days) {
        if (!isWeekend(day)) {
          const dateStr = format(day, 'yyyy-MM-dd');
          
          // Check if record exists
          const existing = await prisma.attendanceRecord.findFirst({
            where: {
              userId: user.uid,
              date: dateStr
            }
          });

          if (!existing) {
            const checkIn = generateTimeWithOffset(emp.baseStart, 10);
            const checkOut = generateTimeWithOffset(emp.baseEnd, 10);
            
            await prisma.attendanceRecord.create({
              data: {
                userId: user.uid,
                userName: user.name,
                date: dateStr,
                checkIn,
                checkOut,
                status: 'Present'
              }
            });
          }
        }
      }
      console.log(`Generated attendance for ${user.name} for month index ${monthIdx}`);
      
      // Generate Payroll for July (month 7 in UI representation, but JS Date uses 6)
      // The DB uses 1-indexed months typically, so let's use 7 for July.
      if (monthIdx === 6) {
        const existingPayroll = await prisma.payrollRecord.findFirst({
          where: {
            userId: user.uid,
            month: 7,
            year: 2026
          }
        });

        if (!existingPayroll) {
          await prisma.payrollRecord.create({
            data: {
              userId: user.uid,
              userName: user.name,
              month: 7,
              year: 2026,
              salaryA: emp.salaryA,
              epf: emp.epf,
              netSalary: emp.net,
              branch: emp.branch,
              status: 'Paid',
              createdAt: new Date().toISOString()
            }
          });
          console.log(`Generated July payroll for ${user.name}`);
        } else {
           await prisma.payrollRecord.update({
            where: { id: existingPayroll.id },
            data: {
              salaryA: emp.salaryA,
              epf: emp.epf,
              netSalary: emp.net,
              branch: emp.branch,
              status: 'Paid'
            }
          });
          console.log(`Updated July payroll for ${user.name}`);
        }
      }
    }
  }

  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
