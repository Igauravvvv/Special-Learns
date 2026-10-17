import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_KEY ||
  process.env.SUPABASE_ANON_KEY;

let client = null;

export function supabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

export function getSupabase() {
  if (!supabaseConfigured()) return null;
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return client;
}

/**
 * Saves a student/client enrolment to Supabase.
 * Tries the 'enrolments' table first, falling back to 'enquiries'.
 *
 * @param {object} enquiry The validated enquiry/enrolment object.
 * @returns {Promise<{ ok: boolean, data?: object, error?: string }>}
 */
export async function saveToSupabase(enquiry) {
  const supabase = getSupabase();
  if (!supabase) {
    return { ok: false, error: 'SUPABASE_URL or SUPABASE_KEY is not configured in .env' };
  }

  const record = {
    id: enquiry.id,
    name: enquiry.name,
    email: enquiry.email || null,
    phone: enquiry.phone || null,
    interest: enquiry.interest || null,
    course: enquiry.interest || null,
    message: enquiry.message || null,
    source: enquiry.source || 'website',
    status: enquiry.status || 'new',
    created_at: enquiry.receivedAt || new Date().toISOString(),
    raw_data: enquiry,
  };

  // 1. Try 'enrolments' table
  try {
    const { data, error } = await supabase
      .from('enrolments')
      .upsert(record, { onConflict: 'id' })
      .select();

    if (!error) {
      console.log(`[supabase] Enrolment ${enquiry.id} saved to 'enrolments' table`);
      return { ok: true, data };
    }

    // If 'enrolments' table does not exist (code 42P01), try 'enquiries'
    if (error.code === '42P01' || error.message?.includes('enrolments')) {
      const fallback = await supabase
        .from('enquiries')
        .upsert(record, { onConflict: 'id' })
        .select();

      if (!fallback.error) {
        console.log(`[supabase] Enrolment ${enquiry.id} saved to 'enquiries' table`);
        return { ok: true, data: fallback.data };
      }
      throw fallback.error;
    }

    throw error;
  } catch (err) {
    console.error('[supabase] Failed to save enrolment to Supabase:', err.message || err);
    return { ok: false, error: err.message || String(err) };
  }
}
