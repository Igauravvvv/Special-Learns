/**
 * Special Learns Institute — local and production static runner.
 *
 * Run with:  npm run dev:server   (during development)
 *            npm start            (production, after `npm run build`)
 */

import 'dotenv/config';

import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

import app from './app.js';
import { mailerConfigured } from './mailer.js';
import { supabaseConfigured } from './supabase.js';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const dist = join(root, 'dist');

const PORT = Number(process.env.PORT) || 8787;

/* -------------------------------------------------------------------------- */
/* Static site (production standalone)                                        */
/* -------------------------------------------------------------------------- */

if (existsSync(dist)) {
  app.use(
    express.static(dist, {
      maxAge: '1y',
      redirect: false,
      setHeaders(res, path) {
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

app.use((req, res) => {
  res.status(404).json({ ok: false, message: 'Not found' });
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
