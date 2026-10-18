import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { getSupabase } from './supabase.js';

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, 'data');

if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const STUDENTS_FILE = join(dataDir, 'students.json');
const FEES_FILE = join(dataDir, 'fees.json');
const ATTENDANCE_FILE = join(dataDir, 'attendance.json');

/* -------------------------------------------------------------------------- */
/* Initial Seed Data for Instant Usability                                    */
/* -------------------------------------------------------------------------- */

const SEED_STUDENTS = [
  {
    id: 'STU-1001',
    rollNo: 'SL-2026-001',
    name: 'Aarav Sharma',
    phone: '98101 23456',
    email: 'aarav.sharma@example.com',
    course: 'Web Design & Development',
    totalFees: 18000,
    monthlyFee: 3000,
    dueDay: 10,
    startDate: '2026-08-01',
    durationMonths: 6,
    endDate: '2027-01-31',
    address: 'Uttam Nagar East, New Delhi',
    status: 'active',
    createdAt: new Date(Date.now() - 75 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'STU-1002',
    rollNo: 'SL-2026-002',
    name: 'Priya Verma',
    phone: '98712 34567',
    email: 'priya.verma@example.com',
    course: 'Graphic Design, Publishing & VFX',
    totalFees: 15000,
    monthlyFee: 2500,
    dueDay: 12,
    startDate: '2026-09-01',
    durationMonths: 6,
    endDate: '2027-02-28',
    address: 'Janakpuri, New Delhi',
    status: 'active',
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'STU-1003',
    rollNo: 'SL-2026-003',
    name: 'Rohan Mehra',
    phone: '99112 87654',
    email: 'rohan.mehra@example.com',
    course: 'Tally Prime, GST & Advanced Excel',
    totalFees: 12000,
    monthlyFee: 3000,
    dueDay: 7,
    startDate: '2026-09-15',
    durationMonths: 4,
    endDate: '2027-01-15',
    address: 'Dwarka Mor, New Delhi',
    status: 'active',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'STU-1004',
    rollNo: 'SL-2026-004',
    name: 'Sneha Patel',
    phone: '98234 56789',
    email: 'sneha.patel@example.com',
    course: 'Python Programming & Data Essentials',
    totalFees: 16000,
    monthlyFee: 4000,
    dueDay: 20,
    startDate: '2026-10-01',
    durationMonths: 4,
    endDate: '2027-01-31',
    address: 'Mohan Garden, New Delhi',
    status: 'active',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const SEED_FEES = [
  {
    id: 'FEE-2001',
    studentId: 'STU-1001',
    rollNo: 'SL-2026-001',
    studentName: 'Aarav Sharma',
    amount: 3000,
    paymentDate: '2026-10-09',
    forMonth: 'October 2026',
    paymentMode: 'UPI',
    receiptNo: 'REC-2026-001',
    notes: 'October monthly fee received via PhonePe',
    recordedAt: '2026-10-09T11:20:00.000Z',
  },
  {
    id: 'FEE-2002',
    studentId: 'STU-1003',
    rollNo: 'SL-2026-003',
    studentName: 'Rohan Mehra',
    amount: 3000,
    paymentDate: '2026-10-05',
    forMonth: 'October 2026',
    paymentMode: 'Cash',
    receiptNo: 'REC-2026-002',
    notes: 'October monthly fee paid in cash at reception',
    recordedAt: '2026-10-05T14:15:00.000Z',
  },
];

/* -------------------------------------------------------------------------- */
/* Low-level File Helpers                                                     */
/* -------------------------------------------------------------------------- */

function readJsonFile(filePath, defaultData) {
  try {
    if (!existsSync(filePath)) {
      writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf8');
      return defaultData;
    }
    const raw = readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[studentStore] Error reading ${filePath}:`, err.message);
    return defaultData;
  }
}

function writeJsonFile(filePath, data) {
  try {
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`[studentStore] Error writing ${filePath}:`, err.message);
    return false;
  }
}

/* -------------------------------------------------------------------------- */
/* Supabase Cloud Sync Helpers                                                */
/* -------------------------------------------------------------------------- */

async function syncToSupabase(id, source, name, data) {
  const supabase = getSupabase();
  if (!supabase) return;

  try {
    const record = {
      id,
      name: name || data.studentName || 'Student Record',
      phone: data.phone || null,
      email: data.email || null,
      course: data.course || null,
      source,
      status: data.status || 'active',
      created_at: data.createdAt || data.paymentDate || new Date().toISOString(),
      raw_data: data,
    };

    await supabase.from('enrolments').upsert(record, { onConflict: 'id' });
  } catch (err) {
    // Non-blocking log
    console.warn(`[studentStore] Supabase sync notice (${source}):`, err.message);
  }
}

async function loadFromSupabaseIfEmpty(source) {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('enrolments')
      .select('*')
      .eq('source', source);

    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map((row) => row.raw_data || row);
    }
  } catch (err) {
    console.warn(`[studentStore] Supabase fetch error (${source}):`, err.message);
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/* Students Management                                                        */
/* -------------------------------------------------------------------------- */

export async function getAllStudents() {
  let students = readJsonFile(STUDENTS_FILE, SEED_STUDENTS);

  // If local file has seed or is empty and Supabase has data, merge/load
  const remote = await loadFromSupabaseIfEmpty('student_admission');
  if (remote && remote.length > 0) {
    const map = new Map();
    for (const s of students) map.set(s.id, s);
    for (const r of remote) {
      if (r && r.id) map.set(r.id, r);
    }
    students = [...map.values()];
    writeJsonFile(STUDENTS_FILE, students);
  }

  return students;
}

export async function getStudentById(id) {
  const students = await getAllStudents();
  return students.find((s) => s.id === id || s.rollNo === id) || null;
}

export async function createStudent(data) {
  const students = await getAllStudents();

  // Auto-generate next roll number if not specified
  let rollNo = (data.rollNo || '').trim();
  if (!rollNo) {
    const year = new Date().getFullYear();
    const count = students.length + 1;
    rollNo = `SL-${year}-${String(count).padStart(3, '0')}`;
  }

  // Calculate End Date from Duration if needed
  const durationMonths = Number(data.durationMonths) || 3;
  let startDate = data.startDate || new Date().toISOString().slice(0, 10);
  let endDate = data.endDate;

  if (!endDate && startDate) {
    const d = new Date(startDate);
    d.setMonth(d.getMonth() + durationMonths);
    endDate = d.toISOString().slice(0, 10);
  }

  const student = {
    id: `STU-${randomUUID().slice(0, 8)}`,
    rollNo,
    name: (data.name || '').trim(),
    phone: (data.phone || '').trim(),
    email: (data.email || '').trim(),
    course: (data.course || 'Computer Course').trim(),
    totalFees: Number(data.totalFees) || 0,
    monthlyFee: Number(data.monthlyFee) || Math.round((Number(data.totalFees) || 0) / durationMonths),
    dueDay: Number(data.dueDay) || 10,
    startDate,
    durationMonths,
    endDate: endDate || '',
    address: (data.address || '').trim(),
    guardianName: (data.guardianName || '').trim(),
    status: data.status || 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  students.unshift(student);
  writeJsonFile(STUDENTS_FILE, students);

  // Sync to Supabase
  await syncToSupabase(student.id, 'student_admission', student.name, student);

  return student;
}

export async function updateStudent(id, updates) {
  const students = await getAllStudents();
  const index = students.findIndex((s) => s.id === id || s.rollNo === id);
  if (index === -1) return null;

  const updated = {
    ...students[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  students[index] = updated;
  writeJsonFile(STUDENTS_FILE, students);

  await syncToSupabase(updated.id, 'student_admission', updated.name, updated);
  return updated;
}

export async function deleteStudent(id) {
  const students = await getAllStudents();
  const filtered = students.filter((s) => s.id !== id && s.rollNo !== id);
  if (filtered.length === students.length) return false;

  writeJsonFile(STUDENTS_FILE, filtered);

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('enrolments').delete().eq('id', id);
    } catch (_) {}
  }
  return true;
}

/* -------------------------------------------------------------------------- */
/* Fees Collection & History                                                  */
/* -------------------------------------------------------------------------- */

export async function getAllFees() {
  let fees = readJsonFile(FEES_FILE, SEED_FEES);

  const remote = await loadFromSupabaseIfEmpty('fee_payment');
  if (remote && remote.length > 0) {
    const map = new Map();
    for (const f of fees) map.set(f.id, f);
    for (const r of remote) {
      if (r && r.id) map.set(r.id, r);
    }
    fees = [...map.values()];
    writeJsonFile(FEES_FILE, fees);
  }

  // Sort descending by payment date
  return fees.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));
}

export async function recordFeePayment(data) {
  const students = await getAllStudents();
  const student = students.find((s) => s.id === data.studentId || s.rollNo === data.rollNo);

  const fees = await getAllFees();
  const receiptNo = data.receiptNo || `REC-${new Date().getFullYear()}-${String(fees.length + 1).padStart(3, '0')}`;

  const payment = {
    id: `FEE-${randomUUID().slice(0, 8)}`,
    studentId: student ? student.id : data.studentId || '',
    rollNo: student ? student.rollNo : data.rollNo || '',
    studentName: student ? student.name : data.studentName || 'Student',
    course: student ? student.course : data.course || '',
    amount: Number(data.amount) || 0,
    paymentDate: data.paymentDate || new Date().toISOString().slice(0, 10),
    forMonth: data.forMonth || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    paymentMode: data.paymentMode || 'Cash',
    receiptNo,
    notes: (data.notes || '').trim(),
    recordedAt: new Date().toISOString(),
  };

  fees.unshift(payment);
  writeJsonFile(FEES_FILE, fees);

  await syncToSupabase(payment.id, 'fee_payment', payment.studentName, payment);

  return payment;
}

/* -------------------------------------------------------------------------- */
/* Fee Alerts Calculation (Upcoming in 3 Days & Overdue)                      */
/* -------------------------------------------------------------------------- */

export async function getFeeAlerts() {
  const students = await getAllStudents();
  const fees = await getAllFees();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed
  const currentMonthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const todayDateNum = now.getDate();

  const activeStudents = students.filter((s) => s.status === 'active');
  const alerts = [];

  for (const student of activeStudents) {
    const dueDay = student.dueDay || 10;
    const dueDate = new Date(currentYear, currentMonth, dueDay);

    // Check if this student already paid for this current month
    const paidForCurrentMonth = fees.some((f) => {
      if (f.studentId !== student.id && f.rollNo !== student.rollNo) return false;
      // Match month name or date range
      if (f.forMonth && f.forMonth.toLowerCase().includes(now.toLocaleDateString('en-US', { month: 'long' }).toLowerCase())) {
        return true;
      }
      const pDate = new Date(f.paymentDate);
      return pDate.getFullYear() === currentYear && pDate.getMonth() === currentMonth;
    });

    const daysDiff = dueDay - todayDateNum; // >0: in future; 0: today; <0: overdue

    let status = 'paid';
    let alertType = 'none';
    let message = 'Paid for this month';

    if (paidForCurrentMonth) {
      status = 'paid';
    } else if (daysDiff < 0) {
      status = 'overdue';
      alertType = 'overdue';
      const daysOverdue = Math.abs(daysDiff);
      message = `Overdue by ${daysOverdue} day${daysOverdue > 1 ? 's' : ''} (Due on ${dueDay} ${now.toLocaleString('default', { month: 'short' })})`;
    } else if (daysDiff <= 3) {
      status = 'upcoming';
      alertType = 'upcoming';
      message = daysDiff === 0
        ? `Fee due TODAY (${dueDay} ${now.toLocaleString('default', { month: 'short' })})`
        : `Fee due in ${daysDiff} day${daysDiff > 1 ? 's' : ''} (on ${dueDay} ${now.toLocaleString('default', { month: 'short' })})`;
    } else {
      status = 'pending';
      message = `Due on ${dueDay} ${now.toLocaleString('default', { month: 'short' })}`;
    }

    alerts.push({
      studentId: student.id,
      rollNo: student.rollNo,
      name: student.name,
      course: student.course,
      phone: student.phone,
      email: student.email,
      monthlyFee: student.monthlyFee || 0,
      totalFees: student.totalFees || 0,
      dueDay,
      dueDate: dueDate.toISOString().slice(0, 10),
      status,
      alertType,
      message,
      daysDiff,
      currentMonth: currentMonthName,
    });
  }

  // Summary counts
  const upcoming = alerts.filter((a) => a.status === 'upcoming');
  const overdue = alerts.filter((a) => a.status === 'overdue');
  const pending = alerts.filter((a) => a.status === 'pending');
  const paid = alerts.filter((a) => a.status === 'paid');

  return {
    all: alerts,
    upcoming,
    overdue,
    pending,
    paid,
    summary: {
      totalActive: activeStudents.length,
      upcomingCount: upcoming.length,
      overdueCount: overdue.length,
      paidCount: paid.length,
      pendingCount: pending.length,
      totalDueAmount: [...upcoming, ...overdue, ...pending].reduce((sum, a) => sum + (a.monthlyFee || 0), 0),
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Attendance Management & Student Self Check-in                              */
/* -------------------------------------------------------------------------- */

export async function getAttendance(date = new Date().toISOString().slice(0, 10)) {
  let attendance = readJsonFile(ATTENDANCE_FILE, []);

  const remote = await loadFromSupabaseIfEmpty('attendance');
  if (remote && remote.length > 0) {
    const map = new Map();
    for (const a of attendance) map.set(a.id, a);
    for (const r of remote) {
      if (r && r.id) map.set(r.id, r);
    }
    attendance = [...map.values()];
    writeJsonFile(ATTENDANCE_FILE, attendance);
  }

  return attendance.filter((a) => a.date === date);
}

export async function getAllAttendanceRecords() {
  return readJsonFile(ATTENDANCE_FILE, []);
}

export async function saveAttendanceBatch(date, records) {
  let all = readJsonFile(ATTENDANCE_FILE, []);

  // Remove existing records for this date to avoid duplicate entries
  all = all.filter((a) => a.date !== date);

  const newRecords = records.map((r) => ({
    id: `ATT-${randomUUID().slice(0, 8)}`,
    studentId: r.studentId,
    rollNo: r.rollNo,
    studentName: r.studentName,
    date,
    status: r.status, // 'present' | 'absent' | 'late'
    source: r.source || 'admin',
    timestamp: new Date().toISOString(),
  }));

  all.push(...newRecords);
  writeJsonFile(ATTENDANCE_FILE, all);

  // Sync non-blocking
  for (const rec of newRecords) {
    syncToSupabase(rec.id, 'attendance', rec.studentName, rec).catch(() => {});
  }

  return newRecords;
}

export async function studentSelfCheckIn(identifier) {
  const students = await getAllStudents();
  const cleanId = String(identifier || '').trim().toLowerCase();

  const student = students.find(
    (s) =>
      s.rollNo.toLowerCase() === cleanId ||
      s.phone.replace(/[^0-9]/g, '').endsWith(cleanId.replace(/[^0-9]/g, '')) ||
      (s.email && s.email.toLowerCase() === cleanId),
  );

  if (!student) {
    return { ok: false, message: 'Student roll number or phone not found. Please contact the front desk.' };
  }

  const today = new Date().toISOString().slice(0, 10);
  let all = readJsonFile(ATTENDANCE_FILE, []);

  // Check if already checked in today
  const existing = all.find((a) => (a.studentId === student.id || a.rollNo === student.rollNo) && a.date === today);

  if (existing) {
    return {
      ok: true,
      alreadyMarked: true,
      student,
      record: existing,
      message: `You are already marked present for today (${today}) at ${new Date(existing.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}!`,
    };
  }

  const newRecord = {
    id: `ATT-${randomUUID().slice(0, 8)}`,
    studentId: student.id,
    rollNo: student.rollNo,
    studentName: student.name,
    date: today,
    status: 'present',
    source: 'self_checkin',
    timestamp: new Date().toISOString(),
  };

  all.push(newRecord);
  writeJsonFile(ATTENDANCE_FILE, all);

  await syncToSupabase(newRecord.id, 'attendance', student.name, newRecord);

  return {
    ok: true,
    alreadyMarked: false,
    student,
    record: newRecord,
    message: `Attendance marked successfully! Welcome, ${student.name}.`,
  };
}

/* -------------------------------------------------------------------------- */
/* Dashboard Overview Stats                                                   */
/* -------------------------------------------------------------------------- */

export async function getDashboardOverview() {
  const students = await getAllStudents();
  const fees = await getAllFees();
  const today = new Date().toISOString().slice(0, 10);
  const todayAttendance = await getAttendance(today);
  const feeAlerts = await getFeeAlerts();

  const now = new Date();
  const currentMonthNum = now.getMonth();
  const currentYearNum = now.getFullYear();

  // Monthly collection this calendar month
  const monthlyCollection = fees
    .filter((f) => {
      const d = new Date(f.paymentDate);
      return d.getMonth() === currentMonthNum && d.getFullYear() === currentYearNum;
    })
    .reduce((sum, f) => sum + (f.amount || 0), 0);

  const activeStudents = students.filter((s) => s.status === 'active');
  const presentTodayCount = todayAttendance.filter((a) => a.status === 'present').length;
  const attendanceRate = activeStudents.length > 0 ? Math.round((presentTodayCount / activeStudents.length) * 100) : 0;

  return {
    totalStudents: activeStudents.length,
    totalAllTime: students.length,
    monthlyCollection,
    attendanceRate,
    todayPresentCount: presentTodayCount,
    todayTotalCount: activeStudents.length,
    feeAlerts: feeAlerts.summary,
    upcomingAlerts: feeAlerts.upcoming,
    overdueAlerts: feeAlerts.overdue,
    recentStudents: students.slice(0, 5),
    recentFees: fees.slice(0, 5),
  };
}
