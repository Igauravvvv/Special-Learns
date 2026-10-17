import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validateEnquiry } from '../shared/enquiry.js';

const base = { name: 'Test Learner', phone: '98765 43210', consent: true };
test('minimal phone enquiry defaults optional fields and requires consent', () => {
  const result = validateEnquiry(base);
  assert.equal(result.ok, true);
  assert.equal(result.value.interest, 'Not sure yet');
  assert.equal(result.value.message, '');
  assert.equal(result.value.source, 'contact');
  assert.equal(validateEnquiry({ ...base, consent: false }).errors.consent.length > 0, true);
});
test('email can replace phone; invalid contact information never passes', () => {
  assert.equal(validateEnquiry({ name: 'Test Learner', email: 'learner@example.test', consent: true }).ok, true);
  for (const phone of ['1234', 'abcdefghij', '1234567890123456', '']) {
    assert.equal(validateEnquiry({ ...base, phone }).ok, false);
  }
  assert.equal(validateEnquiry({ ...base, email: 'invalid' }).ok, false);
  assert.equal(validateEnquiry([]).ok, false);
  assert.equal(validateEnquiry(null).ok, false);
});
test('specific courses and paragraph breaks survive normalization; lengths are bounded', () => {
  const result = validateEnquiry({ ...base, interest: 'Python', source: 'course', message: 'One question.\nAnother question.' });
  assert.equal(result.value.interest, 'Python');
  assert.match(result.value.message, /\n/);
  assert.equal(result.value.source, 'course');
  for (const [field, length] of [['name', 81], ['interest', 121], ['message', 2001]]) assert.equal(validateEnquiry({ ...base, [field]: 'x'.repeat(length) }).ok, false);
});
test('concurrent retries save one durable record; changed details conflict', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'special-learns-store-'));
  process.env.ENQUIRY_FILE = join(dir, 'enquiries.ndjson');
  const { saveEnquiry, readEnquiries } = await import('../server/store.js');
  const record = { id: 'SL-TEST', receivedAt: new Date().toISOString(), requestKey: 'test-request-key-0001', status: 'new', ...validateEnquiry(base).value };
  try {
    const results = await Promise.all(Array.from({ length: 5 }, () => saveEnquiry(record)));
    assert.equal(results.filter(r => r.created).length, 1);
    assert.equal((await readEnquiries()).length, 1);
    assert.equal(JSON.parse((await readFile(process.env.ENQUIRY_FILE, 'utf8')).trim()).id, 'SL-TEST');
    await assert.rejects(saveEnquiry({ ...record, name: 'Different Learner' }), { code: 'IDEMPOTENCY_CONFLICT' });
    assert.equal((await readEnquiries()).length, 1);
    await saveEnquiry({ ...record, id: 'SL-SECOND', requestKey: 'test-request-key-0002' });
    assert.equal((await readEnquiries()).length, 2);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('API validates, receipts and deduplicates requests, rejects spam, and rate-limits', async () => {
  const { spawn } = await import('node:child_process');
  const { createServer } = await import('node:net');
  const dir = await mkdtemp(join(tmpdir(), 'special-learns-api-'));
  const reservation = createServer();
  await new Promise(resolve => reservation.listen(0, '127.0.0.1', resolve));
  const port = reservation.address().port;
  await new Promise(resolve => reservation.close(resolve));
  const child = spawn(process.execPath, ['server/index.js'], {
    env: { ...process.env, PORT: String(port), ENQUIRY_FILE: join(dir, 'inbox.ndjson'), RESEND_API_KEY: '', MAIL_TO: '' },
    stdio: 'ignore',
  });
  const url = `http://127.0.0.1:${port}`;
  try {
    let ready = false;
    for (let i = 0; i < 100; i++) {
      try { ready = (await fetch(`${url}/api/health`)).ok; if (ready) break; } catch {}
      await new Promise(resolve => setTimeout(resolve, 25));
    }
    assert.equal(ready, true);
    const post = (body, key = 'integration-request-key-001') => fetch(`${url}/api/enquiries`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key }, body: typeof body === 'string' ? body : JSON.stringify(body),
    });
    const first = await post(base);
    assert.equal(first.status, 201);
    const receipt = await first.json();
    assert.match(receipt.id, /^SL-/);
    const retry = await post(base);
    assert.equal(retry.status, 200);
    assert.equal((await retry.json()).id, receipt.id);
    assert.equal((await post({ ...base, name: 'Changed' })).status, 409);
    assert.equal((await post('{bad json')).status, 400);
    assert.equal((await post({ ...base, sl_company_url: 'spam' })).status, 400);
    // JSON parse failures happen before the limiter, so this is the fifth counted request.
    assert.equal((await post({ ...base, consent: false }, 'integration-request-key-002')).status, 400);
    assert.equal((await post(base, 'integration-request-key-003')).status, 429);
    const rows = (await readFile(join(dir, 'inbox.ndjson'), 'utf8')).trim().split('\n').map(JSON.parse);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].id, receipt.id);
  } finally {
    const closed = new Promise(resolve => child.once('exit', resolve));
    child.kill('SIGTERM');
    await closed;
    await rm(dir, { recursive: true, force: true });
  }
});
