import test from 'node:test';
import assert from 'node:assert/strict';

import app from '../server/app.js';

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, '127.0.0.1', async () => {
      const port = server.address().port;
      try {
        const response = await fetch(`http://127.0.0.1:${port}${path}`, options);
        let body;
        const text = await response.text();
        try {
          body = JSON.parse(text);
        } catch {
          body = text;
        }
        server.close(() => resolve({ status: response.status, body }));
      } catch (err) {
        server.close(() => reject(err));
      }
    });
  });
}

test('admin authentication with valid and invalid credentials', async () => {
  // Invalid login
  const badLogin = await request('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'wrongpassword' }),
  });
  assert.equal(badLogin.status, 401);
  assert.equal(badLogin.body.ok, false);

  // Valid login
  const goodLogin = await request('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' }),
  });
  assert.equal(goodLogin.status, 200);
  assert.equal(goodLogin.body.ok, true);
  assert.ok(goodLogin.body.token.startsWith('sl-admin-session-'));
  assert.equal(goodLogin.body.user.username, 'admin');

  // Verify protected route with token
  const verify = await request('/api/admin/verify', {
    headers: { Authorization: `Bearer ${goodLogin.body.token}` },
  });
  assert.equal(verify.status, 200);
  assert.equal(verify.body.ok, true);
});

test('student admission, fee collection, fee alerts, and attendance', async () => {
  // Login first
  const login = await request('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' }),
  });
  const token = login.body.token;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // 1. Admit a new student
  const admit = await request('/api/admin/students', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: 'Simran Kaur',
      phone: '98765 11223',
      email: 'simran@example.com',
      course: 'Web Design & Development',
      totalFees: 15000,
      monthlyFee: 2500,
      dueDay: 10,
      startDate: '2026-10-01',
      durationMonths: 6,
    }),
  });
  assert.equal(admit.status, 201);
  assert.equal(admit.body.ok, true);
  assert.equal(admit.body.data.name, 'Simran Kaur');
  assert.ok(admit.body.data.rollNo.startsWith('SL-'));

  const student = admit.body.data;

  // 2. Fetch students list
  const list = await request('/api/admin/students?q=Simran', { headers });
  assert.equal(list.status, 200);
  assert.ok(list.body.data.some((s) => s.id === student.id));

  // 3. Record fee payment
  const feePay = await request('/api/admin/fees/collect', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      studentId: student.id,
      rollNo: student.rollNo,
      amount: 2500,
      paymentMode: 'UPI',
      forMonth: 'October 2026',
      notes: 'Initial admission fee payment',
    }),
  });
  assert.equal(feePay.status, 201);
  assert.equal(feePay.body.ok, true);
  assert.ok(feePay.body.data.receiptNo.startsWith('REC-'));

  // 4. Check fee alerts calculation
  const alerts = await request('/api/admin/fees/alerts', { headers });
  assert.equal(alerts.status, 200);
  assert.equal(alerts.body.ok, true);
  assert.ok(Array.isArray(alerts.body.data.upcoming));
  assert.ok(Array.isArray(alerts.body.data.overdue));

  // 5. Test student self check-in
  const checkIn = await request('/api/attendance/check-in', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: student.rollNo }),
  });
  assert.equal(checkIn.status, 200);
  assert.equal(checkIn.body.ok, true);
  assert.equal(checkIn.body.student.name, 'Simran Kaur');

  // Second check-in should indicate already marked
  const checkInRepeat = await request('/api/attendance/check-in', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: student.phone }),
  });
  assert.equal(checkInRepeat.status, 200);
  assert.equal(checkInRepeat.body.alreadyMarked, true);

  // 6. Test overview stats
  const overview = await request('/api/admin/overview', { headers });
  assert.equal(overview.status, 200);
  assert.ok(overview.body.data.totalStudents > 0);
  assert.ok(overview.body.data.monthlyCollection > 0);

  // 7. Test attendance history and CSV export
  const allAtt = await request('/api/admin/attendance?all=true', { headers });
  assert.equal(allAtt.status, 200);
  assert.ok(Array.isArray(allAtt.body.data));

  const csvExport = await request('/api/admin/attendance/export?date=all', { headers });
  assert.equal(csvExport.status, 200);
  assert.ok(typeof csvExport.body === 'string');
  assert.ok(csvExport.body.includes('Special Learns Institute'));
  assert.ok(csvExport.body.includes('Attendance Status'));
});
