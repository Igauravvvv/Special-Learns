/**
 * Special Learns Institute — enquiry API and static server.
 *
 * Run with:  npm run dev:server   (during development)
 *            npm start            (production, after `npm run build`)
 *
 * Environment (see .env.example):
 *   PORT           default 8787
 *   ENQUIRY_FILE   where enquiries are stored
 *   RESEND_API_KEY optional — enables email delivery via Resend
 *   MAIL_TO        optional — where enquiries are emailed
 */

import 'dotenv/config';

import { existsSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import compression from 'compression';
import express from 'express';
import rateLimit from 'express-rate-limit';

import { saveEnquiry } from './store.js';
import { deliverEnquiry, mailerConfigured } from './mailer.js';
import { supabaseConfigured } from './supabase.js';
import { MAX_BODY_BYTES, validateEnquiry } from './validation.js';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const dist = join(root, 'dist');

const app = express();
const PORT = Number(process.env.PORT) || 8787;

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
  // Honeypot: a real person never sees this field. Fail with a neutral
  // response so the bot gets no signal, but never claim a false success.
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
  // The receipt depends on durable storage, never on email provider latency.
  if (saved.created) deliverEnquiry(saved.enquiry).catch(error => console.error('[enquiry] notification failed:', error.message));
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, uptime: Math.round(process.uptime()) });
});

/* -------------------------------------------------------------------------- */
/* Static site (production only)                                              */
/* -------------------------------------------------------------------------- */

if (existsSync(dist)) {
  app.use(
    express.static(dist, {
      maxAge: '1y',
      // Never 301-redirect a bare path onto a directory: a route like
      // /student-work would otherwise be captured by an asset folder of the
      // same name before it reached the SPA fallback.
      redirect: false,
      setHeaders(res, path) {
        // Hashed assets can be cached hard; HTML must always revalidate.
        if (path.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache');
      },
    }),
  );

  // Client-side routing fallback — deep links like /programs/tally must work.
  app.get(/^(?!\/api\/).*/, (req, res) => {
    res.sendFile(join(dist, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.type('text/plain').send(
      'API is running. Start the frontend with `npm run dev:web`, or build first with `npm run build`.',
    );
  });
}

/* -------------------------------------------------------------------------- */

app.use((req, res) => {
  res.status(404).json({ ok: false, message: 'Not found' });
});

// eslint-disable-next-line no-unused-vars
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

const server = app.listen(PORT, () => {
  console.log(`[api] Special Learns enquiry API listening on http://127.0.0.1:${PORT}`);

  if (!supabaseConfigured()) {
    console.log(
      '[api] Supabase storage is OFF — set SUPABASE_URL and SUPABASE_KEY in .env to sync enrolments to Supabase.',
    );
  } else {
    console.log('[api] Supabase storage is ON — enrolments will be synced to Supabase.');
  }

  if (!mailerConfigured()) {
    console.log(
      '[api] Email delivery is OFF — enquiries are stored and printed to this terminal.\n' +
        '       Set RESEND_API_KEY and MAIL_TO in .env to have them emailed as well.',
    );
  } else {
    console.log('[api] Email delivery is ON via Resend.');
  }

  if (!existsSync(dist)) {
    console.log('[api] No dist/ build found — run `npm run build` to serve the site from here.');
  }
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
  });
}
