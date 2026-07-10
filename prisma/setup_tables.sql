-- CreateTable
CREATE TABLE "User" (
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'employee',
    "branch" TEXT NOT NULL DEFAULT 'General',
    "department" TEXT,
    "phone" TEXT,
    "photoUrl" TEXT,
    "status" TEXT DEFAULT 'Available',
    "joinDate" TEXT NOT NULL,
    "salaryA" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "salaryB" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "epf" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "advances" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cover" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "intensive" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "travelling" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "net" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "performanceScore" DOUBLE PRECISION,
    "leaveQuotas" JSONB NOT NULL DEFAULT '{"annual": 14, "sick": 7, "casual": 7, "short": 8}',
    "usedLeaves" JSONB NOT NULL DEFAULT '{"annual": 0, "sick": 0, "casual": 0, "short": 0}',
    "sortOrder" INTEGER NOT NULL DEFAULT 999,
    "bankName" TEXT,
    "bankBranch" TEXT,
    "accountNo" TEXT,
    "accountHolderName" TEXT,
    "nic" TEXT,
    "address" TEXT,
    "nickname" TEXT,
    "extraDays" DOUBLE PRECISION DEFAULT 0,
    "employmentHistory" JSONB,
    "skills" JSONB,
    "techEquipment" JSONB,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "AttendanceRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "checkIn" TEXT NOT NULL,
    "checkOut" TEXT,
    "breakStart" TEXT,
    "breakEnd" TEXT,
    "isLate" BOOLEAN NOT NULL DEFAULT false,
    "isEarlyOut" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT,

    CONSTRAINT "AttendanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceSupportRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "AttendanceSupportRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaveRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userRole" TEXT NOT NULL,
    "leaveType" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "approvedBy" TEXT,
    "createdAt" TEXT NOT NULL,
    "isQuotaExceeded" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT,
    "userPhoto" TEXT,

    CONSTRAINT "LeaveRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Holiday" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Holiday_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "assignedTo" TEXT NOT NULL,
    "assignedToName" TEXT,
    "assignedBy" TEXT NOT NULL,
    "assignedByName" TEXT,
    "priority" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "deadline" TEXT NOT NULL,
    "estimatedHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "progressPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Not Started',
    "category" TEXT,
    "attachments" JSONB,
    "comments" JSONB,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "durationHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "deadline" TEXT NOT NULL,
    "assignedTo" TEXT NOT NULL,
    "assignedBy" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Not Started',
    "progressPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "proofUrl" TEXT,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayrollRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "salaryA" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "salaryB" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "epf" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "advances" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cover" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "intensive" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "travelling" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "extraDays" DOUBLE PRECISION DEFAULT 0,
    "netSalary" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "sortOrder" INTEGER DEFAULT 999,
    "incentives" DOUBLE PRECISION,
    "bonus" DOUBLE PRECISION,

    CONSTRAINT "PayrollRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "metrics" JSONB,
    "evaluator" TEXT NOT NULL,
    "comments" TEXT,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "PerformanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdvanceRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT,
    "userRole" TEXT,
    "userPhoto" TEXT,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "approvedBy" TEXT,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT,

    CONSTRAINT "AdvanceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

