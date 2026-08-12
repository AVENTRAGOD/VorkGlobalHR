import express from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../../api/utils/prisma.js';
import jwt from 'jsonwebtoken';
import { authenticateToken } from './middleware/auth.js';

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const JWT_SECRET = process.env.JWT_SECRET || 'hr-pulse-secret-key-123';
const JWT_EXPIRES_IN = '8h'; // Token valid for 8 hours (one work day)

// ─────────────────────────────────────────────────────────────
// PUBLIC ROUTES (no auth required)
// ─────────────────────────────────────────────────────────────

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'connected' });
});

// --- Login (Bcrypt + JWT) ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: 'Email/username and password are required' });
    }

    const key = String(emailOrUsername).toLowerCase().trim();

    // Find user by email OR username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: key },
          { username: key },
        ],
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email/username or password' });
    }

    // Verify password with bcrypt
    if (!user.password) {
      return res.status(401).json({ error: 'Account not set up — contact administrator' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email/username or password' });
    }

    // Sign JWT
    const token = jwt.sign(
      { uid: user.uid, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return token + user profile (strip the hashed password)
    const { password: _pw, ...safeUser } = user;
    return res.json({ token, user: safeUser });

  } catch (err: any) {
    console.error('Login error:', err?.message);
    return res.status(500).json({ error: 'Login failed', details: err?.message });
  }
});

// ─────────────────────────────────────────────────────────────
// PROTECTED ROUTES — all routes below require a valid JWT
// ─────────────────────────────────────────────────────────────
app.use('/api', authenticateToken);

// --- Users ---
app.get('/api/users', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    const users = await prisma.user.findMany({ orderBy: { sortOrder: 'asc' } });
    // Strip password hashes before sending to the client
    const safeUsers = users.map(({ password: _pw, ...u }) => u);
    res.json(safeUsers);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch users', details: err.message || String(err) });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const data = { ...req.body };
    // Hash password if provided in plain text
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const user = await prisma.user.create({ data });
    const { password: _pw, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.put('/api/users/:uid', async (req, res) => {
  try {
    const b = req.body;

    // Only pick fields that actually exist in the Prisma User model
    const updateData: any = {};
    const fields = [
      'name','role','branch','department','phone','photoUrl','status','joinDate',
      'salaryA','salaryB','epf','advances','cover','intensive','travelling','net',
      'performanceScore','leaveQuotas','usedLeaves','sortOrder','bankName',
      'bankBranch','accountNo','accountHolderName','nic','address','nickname',
      'extraDays','employmentHistory','skills','techEquipment',
    ];
    for (const field of fields) {
      if (b[field] !== undefined) {
        updateData[field] = b[field];
      }
    }

    // If a new plain-text password is being set, hash it
    if (b.password && !b.password.startsWith('$2')) {
      updateData.password = await bcrypt.hash(b.password, 10);
    }

    const user = await prisma.user.update({
      where: { uid: req.params.uid },
      data: updateData,
    });
    const { password: _pw, ...safeUser } = user;
    res.json(safeUser);
  } catch (err: any) {
    console.error('Error updating user:', err?.message);
    res.status(500).json({ error: 'Failed to update user', details: err?.message });
  }
});

// --- Attendance ---
app.get('/api/attendance', async (req, res) => {
  try {
    const { userId } = req.query;
    const records = await prisma.attendanceRecord.findMany({
      where: userId ? { userId: String(userId) } : undefined,
      orderBy: { date: 'desc' }
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

app.post('/api/attendance', async (req, res) => {
  try {
    const record = await prisma.attendanceRecord.create({ data: req.body });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create attendance' });
  }
});

app.put('/api/attendance/:id', async (req, res) => {
  try {
    const record = await prisma.attendanceRecord.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update attendance' });
  }
});

// --- Leaves ---
app.get('/api/leaves', async (req, res) => {
  try {
    const { userId } = req.query;
    const leaves = await prisma.leaveRequest.findMany({
      where: userId ? { userId: String(userId) } : undefined,
      orderBy: { createdAt: 'desc' }
    });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaves' });
  }
});

app.post('/api/leaves', async (req, res) => {
  try {
    const leave = await prisma.leaveRequest.create({ data: req.body });
    res.json(leave);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create leave' });
  }
});

app.put('/api/leaves/:id', async (req, res) => {
  try {
    const leave = await prisma.leaveRequest.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(leave);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update leave' });
  }
});

app.delete('/api/leaves/:id', async (req, res) => {
  try {
    await prisma.leaveRequest.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete leave' });
  }
});

// --- Payroll ---
app.get('/api/payroll', async (req, res) => {
  try {
    const { userId } = req.query;
    const payrolls = await prisma.payrollRecord.findMany({
      where: userId ? { userId: String(userId) } : undefined,
      orderBy: { sortOrder: 'asc' }
    });
    res.json(payrolls);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payroll' });
  }
});

app.post('/api/payroll', async (req, res) => {
  try {
    const payroll = await prisma.payrollRecord.create({ data: req.body });
    res.json(payroll);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create payroll' });
  }
});

app.put('/api/payroll/:id', async (req, res) => {
  try {
    const payroll = await prisma.payrollRecord.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(payroll);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update payroll' });
  }
});

// --- Support Tickets ---
app.get('/api/support', async (req, res) => {
  try {
    const { userId } = req.query;
    const reqs = await prisma.attendanceSupportRequest.findMany({
      where: userId ? { userId: String(userId) } : undefined,
      orderBy: { createdAt: 'desc' }
    });
    res.json(reqs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch support requests' });
  }
});

app.post('/api/support', async (req, res) => {
  try {
    const reqData = await prisma.attendanceSupportRequest.create({ data: req.body });
    res.json(reqData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create support request' });
  }
});

app.put('/api/support/:id', async (req, res) => {
  try {
    const reqData = await prisma.attendanceSupportRequest.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(reqData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update support request' });
  }
});

// --- Tasks ---
app.get('/api/tasks', async (req, res) => {
  try {
    const { userId } = req.query;
    const tasks = await prisma.task.findMany({
      where: userId ? { assignedTo: String(userId) } : undefined,
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const task = await prisma.task.create({ data: req.body });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// --- Courses ---
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const course = await prisma.course.create({ data: req.body });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

app.put('/api/courses/:id', async (req, res) => {
  try {
    const course = await prisma.course.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update course' });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    await prisma.course.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// --- Advances ---
app.get('/api/advances', async (req, res) => {
  try {
    const { userId } = req.query;
    const advances = await prisma.advanceRequest.findMany({
      where: userId ? { userId: String(userId) } : undefined,
      orderBy: { createdAt: 'desc' }
    });
    res.json(advances);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch advances' });
  }
});

app.post('/api/advances', async (req, res) => {
  try {
    const advance = await prisma.advanceRequest.create({ data: req.body });
    res.json(advance);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create advance' });
  }
});

app.put('/api/advances/:id', async (req, res) => {
  try {
    const advance = await prisma.advanceRequest.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(advance);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update advance' });
  }
});

app.delete('/api/advances/:id', async (req, res) => {
  try {
    await prisma.advanceRequest.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete advance' });
  }
});

// --- Performance ---
app.get('/api/performance', async (req, res) => {
  try {
    const { userId } = req.query;
    const records = await prisma.performanceRecord.findMany({
      where: userId ? { userId: String(userId) } : undefined,
      orderBy: { createdAt: 'desc' }
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch performance' });
  }
});

app.post('/api/performance', async (req, res) => {
  try {
    const record = await prisma.performanceRecord.create({ data: req.body });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create performance' });
  }
});

app.put('/api/performance/:id', async (req, res) => {
  try {
    const record = await prisma.performanceRecord.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update performance' });
  }
});

app.delete('/api/performance/:id', async (req, res) => {
  try {
    await prisma.performanceRecord.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete performance' });
  }
});

export default app;
