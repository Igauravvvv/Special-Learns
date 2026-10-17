import { randomUUID } from 'node:crypto';
import compression from 'compression';
import express from 'express';
import rateLimit from 'express-rate-limit';

import { saveEnquiry } from './store.js';
import { deliverEnquiry } from './mailer.js';
import { MAX_BODY_BYTES, validateEnquiry } from './validation.js';

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
