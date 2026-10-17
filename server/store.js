/** Append-only storage. Serialize writes and retries so one request creates one record. */
import { mkdir, open, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ENQUIRY_FILE = process.env.ENQUIRY_FILE || join(dirname(fileURLToPath(import.meta.url)), 'data', 'enquiries.ndjson');
let pending = Promise.resolve();

export async function readEnquiries() {
  try {
    const raw = await readFile(ENQUIRY_FILE, 'utf8');
    return raw.split('\n').filter(Boolean).map(line => JSON.parse(line));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

export function saveEnquiry(enquiry) {
  const operation = pending.then(async () => {
    if (enquiry.requestKey) {
      const existing = (await readEnquiries()).find(item => item.requestKey === enquiry.requestKey);
      if (existing) {
        const fields = ['name', 'email', 'phone', 'interest', 'message', 'consent', 'source'];
        if (fields.some(field => existing[field] !== enquiry[field])) {
          const error = new Error('This request reference was already used for different details.');
          error.code = 'IDEMPOTENCY_CONFLICT';
          throw error;
        }
        return { enquiry: existing, created: false };
      }
    }
    await mkdir(dirname(ENQUIRY_FILE), { recursive: true });
    const file = await open(ENQUIRY_FILE, 'a', 0o600);
    try { await file.writeFile(`${JSON.stringify(enquiry)}\n`, 'utf8'); await file.sync(); }
    finally { await file.close(); }
    return { enquiry, created: true };
  });
  pending = operation.catch(() => {});
  return operation;
}
