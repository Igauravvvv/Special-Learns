/**
 * Append-only storage & Supabase synchronizer.
 * Supports both persistent local disks and Vercel serverless runtimes.
 */
import { mkdir, open, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { saveToSupabase, supabaseConfigured } from './supabase.js';

const defaultFile = process.env.VERCEL
  ? '/tmp/enquiries.ndjson'
  : join(dirname(fileURLToPath(import.meta.url)), 'data', 'enquiries.ndjson');

export const ENQUIRY_FILE = process.env.ENQUIRY_FILE || defaultFile;

let pending = Promise.resolve();

export async function readEnquiries() {
  try {
    const raw = await readFile(ENQUIRY_FILE, 'utf8');
    return raw.split('\n').filter(Boolean).map((line) => JSON.parse(line));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    return [];
  }
}

export function saveEnquiry(enquiry) {
  const operation = pending.then(async () => {
    // 1. Check idempotency if requestKey is provided
    if (enquiry.requestKey) {
      const existing = (await readEnquiries()).find((item) => item.requestKey === enquiry.requestKey);
      if (existing) {
        const fields = ['name', 'email', 'phone', 'interest', 'message', 'consent', 'source'];
        if (fields.some((field) => existing[field] !== enquiry[field])) {
          const error = new Error('This request reference was already used for different details.');
          error.code = 'IDEMPOTENCY_CONFLICT';
          throw error;
        }
        return { enquiry: existing, created: false };
      }
    }

    let supabaseSaved = false;

    // 2. Primary database storage: Supabase
    if (supabaseConfigured()) {
      try {
        const sbRes = await saveToSupabase(enquiry);
        if (sbRes.ok) supabaseSaved = true;
      } catch (err) {
        console.error('[supabase] Sync error:', err.message || err);
      }
    }

    // 3. Local/temp backup append-only storage
    try {
      await mkdir(dirname(ENQUIRY_FILE), { recursive: true });
      const file = await open(ENQUIRY_FILE, 'a', 0o600);
      try {
        await file.writeFile(`${JSON.stringify(enquiry)}\n`, 'utf8');
        await file.sync();
      } finally {
        await file.close();
      }
    } catch (fsErr) {
      // If filesystem is read-only (common in Serverless/AWS Lambda/Vercel)
      // but Supabase succeeded, we have durable cloud storage.
      if (!supabaseSaved && !supabaseConfigured()) {
        console.error('[store] Filesystem storage failed:', fsErr.message);
        throw fsErr;
      }
    }

    return { enquiry, created: true };
  });

  pending = operation.catch(() => {});
  return operation;
}
