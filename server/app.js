import { randomUUID } from 'node:crypto';
import compression from 'compression';
import express from 'express';
import rateLimit from 'express-rate-limit';

import { saveEnquiry, readEnquiries } from './store.js';
import { deliverEnquiry, deliverFeeAlertEmail } from './mailer.js';
import { MAX_BODY_BYTES, validateEnquiry } from './validation.js';
import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getAllFees,
  recordFeePayment,
  getFeeAlerts,
  getAttendance,
  getAllAttendanceRecords,
  saveAttendanceBatch,
  studentSelfCheckIn,
  getDashboardOverview,
} from './studentStore.js';

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(compression());
app.use(express.json({ limit: MAX_BODY_BYTES }));

/* -------------------------------------------------------------------------- */
/* Basic hardening headers                                                     */
/* -------------------------------------------------------------------------- */

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

/* -------------------------------------------------------------------------- */
/* Admin Authentication Middleware                                            */
/* -------------------------------------------------------------------------- */

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123';
const VALID_TOKEN_PREFIX = 'sl-admin-session-';

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : (req.headers['x-admin-token'] || '').trim();

  if (!token || !token.startsWith(VALID_TOKEN_PREFIX)) {
    return res.status(401).json({ ok: false, message: 'Unauthorized. Please log in as admin.' });
  }
  next();
}

/* -------------------------------------------------------------------------- */
/* Admin Auth Endpoints                                                       */
/* -------------------------------------------------------------------------- */

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {};

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = `${VALID_TOKEN_PREFIX}${Date.now()}-${randomUUID().slice(0, 8)}`;
    return res.json({
      ok: true,
      token,
      user: {
        username: ADMIN_USER,
        name: 'Administrator',
        role: 'superadmin',
      },
    });
  }

  return res.status(401).json({
    ok: false,
    message: 'Invalid credentials. User ID is "admin" and password is "admin123".',
  });
});

app.get('/api/admin/verify', requireAdmin, (req, res) => {
  res.json({ ok: true, user: { username: ADMIN_USER, role: 'superadmin' } });
});

/* -------------------------------------------------------------------------- */
/* Admin Dashboard Overview                                                   */
/* -------------------------------------------------------------------------- */

app.get('/api/admin/overview', requireAdmin, async (req, res) => {
  try {
    const overview = await getDashboardOverview();
    res.json({ ok: true, data: overview });
  } catch (err) {
    console.error('[admin] overview error:', err);
    res.status(500).json({ ok: false, message: 'Failed to load dashboard metrics.' });
  }
});

/* -------------------------------------------------------------------------- */
/* Student Admissions (Enrollment) Endpoints                                  */
/* -------------------------------------------------------------------------- */

app.get('/api/admin/students', requireAdmin, async (req, res) => {
  try {
    let students = await getAllStudents();
    const { q, course, status } = req.query;

    if (q) {
      const query = q.toLowerCase();
      students = students.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.rollNo.toLowerCase().includes(query) ||
          (s.phone && s.phone.includes(query)) ||
          (s.course && s.course.toLowerCase().includes(query)),
      );
    }
    if (course && course !== 'all') {
      students = students.filter((s) => s.course === course);
    }
    if (status && status !== 'all') {
      students = students.filter((s) => s.status === status);
    }

    res.json({ ok: true, count: students.length, data: students });
  } catch (err) {
    console.error('[admin] get students error:', err);
    res.status(500).json({ ok: false, message: 'Failed to fetch students.' });
  }
});

app.post('/api/admin/students', requireAdmin, async (req, res) => {
  try {
    const { name, course } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(400).json({ ok: false, message: 'Student name is required.' });
    }

    const student = await createStudent(req.body);
    res.status(201).json({ ok: true, data: student, message: `Student ${student.name} enrolled with Roll No ${student.rollNo}` });
  } catch (err) {
    console.error('[admin] create student error:', err);
    res.status(500).json({ ok: false, message: 'Failed to enroll student.' });
  }
});

app.put('/api/admin/students/:id', requireAdmin, async (req, res) => {
  try {
    const updated = await updateStudent(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ ok: false, message: 'Student not found.' });
    }
    res.json({ ok: true, data: updated, message: 'Student updated successfully.' });
  } catch (err) {
    console.error('[admin] update student error:', err);
    res.status(500).json({ ok: false, message: 'Failed to update student.' });
  }
});

app.delete('/api/admin/students/:id', requireAdmin, async (req, res) => {
  try {
    const deleted = await deleteStudent(req.params.id);
    if (!deleted) {
      return res.status(404).json({ ok: false, message: 'Student not found.' });
    }
    res.json({ ok: true, message: 'Student deleted successfully.' });
  } catch (err) {
    console.error('[admin] delete student error:', err);
    res.status(500).json({ ok: false, message: 'Failed to delete student.' });
  }
});

/* -------------------------------------------------------------------------- */
/* Fees Collection & Alert Endpoints                                          */
/* -------------------------------------------------------------------------- */

app.get('/api/admin/fees', requireAdmin, async (req, res) => {
  try {
    const fees = await getAllFees();
    res.json({ ok: true, count: fees.length, data: fees });
  } catch (err) {
    console.error('[admin] get fees error:', err);
    res.status(500).json({ ok: false, message: 'Failed to fetch fee records.' });
  }
});

app.post('/api/admin/fees/collect', requireAdmin, async (req, res) => {
  try {
    const { amount, studentId, rollNo } = req.body || {};
    if (!amount || (!studentId && !rollNo)) {
      return res.status(400).json({ ok: false, message: 'Student and valid amount are required.' });
    }

    const payment = await recordFeePayment(req.body);
    res.status(201).json({
      ok: true,
      data: payment,
      message: `Fee of ₹${payment.amount} recorded for ${payment.studentName} (Receipt: ${payment.receiptNo})`,
    });
  } catch (err) {
    console.error('[admin] collect fee error:', err);
    res.status(500).json({ ok: false, message: 'Failed to record fee payment.' });
  }
});

app.get('/api/admin/fees/alerts', requireAdmin, async (req, res) => {
  try {
    const alerts = await getFeeAlerts();
    res.json({ ok: true, data: alerts });
  } catch (err) {
    console.error('[admin] fee alerts error:', err);
    res.status(500).json({ ok: false, message: 'Failed to calculate fee alerts.' });
  }
});

app.post('/api/admin/fees/send-reminders', requireAdmin, async (req, res) => {
  try {
    const alerts = await getFeeAlerts();
    const result = await deliverFeeAlertEmail(alerts);

    res.json({
      ok: true,
      delivered: result.delivered,
      transport: result.transport,
      count: result.count,
      upcomingCount: alerts.upcoming.length,
      overdueCount: alerts.overdue.length,
      message: result.delivered
        ? `Fee alert digest emailed for ${alerts.upcoming.length} upcoming and ${alerts.overdue.length} overdue fees.`
        : `Fee digest logged (${alerts.upcoming.length} upcoming, ${alerts.overdue.length} overdue fees).`,
    });
  } catch (err) {
    console.error('[admin] send reminders error:', err);
    res.status(500).json({ ok: false, message: 'Failed to dispatch fee reminder emails.' });
  }
});

/* -------------------------------------------------------------------------- */
/* Attendance Endpoints (Admin Batch & Student Self Check-in)                  */
/* -------------------------------------------------------------------------- */

app.get('/api/admin/attendance', requireAdmin, async (req, res) => {
  try {
    const { date, all, status } = req.query;
    let records;
    if (all === 'true' || date === 'all') {
      records = await getAllAttendanceRecords();
    } else {
      const targetDate = date || new Date().toISOString().slice(0, 10);
      records = await getAttendance(targetDate);
    }

    if (status && status !== 'all') {
      if (status === 'absent_late') {
        records = records.filter((r) => r.status === 'absent' || r.status === 'late');
      } else {
        records = records.filter((r) => r.status === status);
      }
    }

    res.json({ ok: true, count: records.length, data: records });
  } catch (err) {
    console.error('[admin] get attendance error:', err);
    res.status(500).json({ ok: false, message: 'Failed to fetch attendance.' });
  }
});

app.get('/api/admin/attendance/export', requireAdmin, async (req, res) => {
  try {
    const { date, all, status } = req.query;
    let records;
    if (all === 'true' || date === 'all') {
      records = await getAllAttendanceRecords();
    } else {
      const targetDate = date || new Date().toISOString().slice(0, 10);
      records = await getAttendance(targetDate);
    }

    if (status && status !== 'all') {
      if (status === 'absent_late') {
        records = records.filter((r) => r.status === 'absent' || r.status === 'late');
      } else {
        records = records.filter((r) => r.status === status);
      }
    }

    const students = await getAllStudents();
    const studentMap = new Map();
    for (const s of students) {
      studentMap.set(s.id, s);
      studentMap.set(s.rollNo, s);
    }

    const escapeCsv = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = [
      `# Special Learns Institute — Attendance Export`,
      `# Date: ${date || 'All Dates'} | Status Filter: ${(status || 'All').toUpperCase()} | Total Records: ${records.length}`,
      ``,
      [
        escapeCsv('Date'),
        escapeCsv('Roll Number'),
        escapeCsv('Student Name'),
        escapeCsv('Course'),
        escapeCsv('Attendance Status'),
        escapeCsv('Marked Source'),
        escapeCsv('Timestamp'),
      ].join(','),
    ];

    for (const r of records) {
      const stu = studentMap.get(r.studentId) || studentMap.get(r.rollNo);
      lines.push([
        escapeCsv(r.date || ''),
        escapeCsv(r.rollNo || stu?.rollNo || ''),
        escapeCsv(r.studentName || stu?.name || ''),
        escapeCsv(stu?.course || ''),
        escapeCsv((r.status || 'present').toUpperCase()),
        escapeCsv(r.source === 'student' ? 'Student Kiosk' : 'Admin Register'),
        escapeCsv(r.timestamp || ''),
      ].join(','));
    }

    const filename = `SpecialLearns_Attendance_${date || 'all'}_${status || 'all'}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\uFEFF' + lines.join('\r\n'));
  } catch (err) {
    console.error('[admin] export attendance error:', err);
    res.status(500).json({ ok: false, message: 'Failed to export attendance CSV.' });
  }
});

app.post('/api/admin/attendance/batch', requireAdmin, async (req, res) => {
  try {
    const { date, records } = req.body || {};
    if (!date || !Array.isArray(records)) {
      return res.status(400).json({ ok: false, message: 'Date and records array are required.' });
    }

    const saved = await saveAttendanceBatch(date, records);
    res.json({ ok: true, date, count: saved.length, message: `Attendance saved for ${saved.length} students.` });
  } catch (err) {
    console.error('[admin] save attendance error:', err);
    res.status(500).json({ ok: false, message: 'Failed to save attendance.' });
  }
});

// Student Self Check-in (Public)
app.post('/api/attendance/check-in', async (req, res) => {
  try {
    const { identifier } = req.body || {};
    if (!identifier || !String(identifier).trim()) {
      return res.status(400).json({ ok: false, message: 'Please enter your Roll Number or Registered Phone Number.' });
    }

    const result = await studentSelfCheckIn(identifier);
    if (!result.ok) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (err) {
    console.error('[check-in] error:', err);
    res.status(500).json({ ok: false, message: 'Check-in failed. Please try again.' });
  }
});

/* -------------------------------------------------------------------------- */
/* Website Enquiries Admin Viewer                                             */
/* -------------------------------------------------------------------------- */

app.get('/api/admin/enquiries', requireAdmin, async (req, res) => {
  try {
    const enquiries = await readEnquiries();
    res.json({ ok: true, count: enquiries.length, data: enquiries.reverse() });
  } catch (err) {
    console.error('[admin] get enquiries error:', err);
    res.status(500).json({ ok: false, message: 'Failed to fetch enquiries.' });
  }
});

/* -------------------------------------------------------------------------- */
/* Enquiry endpoint                                                           */
/* -------------------------------------------------------------------------- */

const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    ok: false,
    message: 'Too many enquiries sent. Please call us instead, or try again shortly.',
  },
});

app.post('/api/enquiries', enquiryLimiter, async (req, res) => {
  // Honeypot check
  if (typeof req.body?.sl_company_url === 'string' && req.body.sl_company_url !== '') {
    return res.status(400).json({
      ok: false,
      message: 'We could not process that submission. Please call or email us instead.',
    });
  }

  const result = validateEnquiry(req.body);

  if (!result.ok) {
    return res.status(400).json({
      ok: false,
      message: 'Some fields need your attention before we can send this.',
      errors: result.errors,
    });
  }

  const requestKey = req.get('Idempotency-Key');
  if (requestKey && !/^[a-zA-Z0-9-]{16,80}$/.test(requestKey)) {
    return res.status(400).json({ ok: false, message: 'Invalid request reference.' });
  }

  const enquiry = {
    id: `SL-${randomUUID()}`,
    receivedAt: new Date().toISOString(),
    status: 'new',
    ...result.value,
    ...(requestKey ? { requestKey } : {}),
  };

  let saved;
  try {
    saved = await saveEnquiry(enquiry);
  } catch (error) {
    if (error.code === 'IDEMPOTENCY_CONFLICT') {
      return res.status(409).json({ ok: false, message: 'Your details changed. Please try sending again.' });
    }
    console.error('[enquiry] failed to store enquiry:', error.message);
    return res.status(500).json({ ok: false, message: 'We could not save your enquiry. Please try again or call us.' });
  }

  res.status(saved.created ? 201 : 200).json({
    ok: true,
    id: saved.enquiry.id,
    message: 'Your request is saved. Our team will contact you to discuss the course, fees and a suitable batch.',
  });

  if (saved.created) {
    deliverEnquiry(saved.enquiry).catch((error) =>
      console.error('[enquiry] notification failed:', error.message),
    );
  }
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, uptime: Math.round(process.uptime()) });
});

// JSON error handlers for API
app.use((error, req, res, next) => {
  if (error?.type === 'entity.too.large') {
    return res
      .status(413)
      .json({ ok: false, message: 'That message is too long to send. Please shorten it.' });
  }
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({ ok: false, message: 'Invalid request body.' });
  }

  console.error('[server] unhandled error:', error);
  res.status(500).json({ ok: false, message: 'Something went wrong on our side.' });
});

export default app;
