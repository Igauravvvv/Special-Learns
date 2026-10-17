/**
 * Enquiry delivery.
 *
 * Storage always happens first (server/store.js). This module handles getting
 * the enquiry in front of a human on top of that.
 *
 * Two transports, both optional:
 *   - Resend (HTTP API) — enabled by setting RESEND_API_KEY
 *   - stdout             — always on, so `npm start` in a terminal shows
 *                           enquiries even with no provider configured
 *
 * Delivery is fire-and-forget: a failed email never fails the request, because
 * the enquiry is already safely stored and the visitor has been told it was
 * received.
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

export function mailerConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.MAIL_TO);
}

/** Builds the plain-text body for an enquiry email. */
function formatBody(enquiry) {
  return [
    `Name:     ${enquiry.name}`,
    `Email:    ${enquiry.email || '—'}`,
    `Phone:    ${enquiry.phone || '—'}`,
    `Interest: ${enquiry.interest}`,
    `Received: ${enquiry.receivedAt}`,
    '',
    'Message:',
    enquiry.message || 'Please contact this learner about getting started.',
    '',
    `Reference: ${enquiry.id}`,
  ].join('\n');
}

function formatHtml(enquiry) {
  const escape = (value) =>
    String(value).replace(/[&<>"']/g, (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[char],
    );

  return `<h2>New website enquiry</h2>
<table cellpadding="6" style="font-family:system-ui,sans-serif;font-size:14px">
  <tr><td><strong>Name</strong></td><td>${escape(enquiry.name)}</td></tr>
  <tr><td><strong>Email</strong></td><td>${enquiry.email ? `<a href="mailto:${escape(enquiry.email)}">${escape(enquiry.email)}</a>` : '—'}</td></tr>
  <tr><td><strong>Phone</strong></td><td>${enquiry.phone ? `<a href="tel:${escape(enquiry.phone.replace(/[^+\d]/g, ''))}">${escape(enquiry.phone)}</a>` : '—'}</td></tr>
  <tr><td><strong>Interest</strong></td><td>${escape(enquiry.interest)}</td></tr>
  <tr><td><strong>Received</strong></td><td>${escape(enquiry.receivedAt)}</td></tr>
</table>
<h3>Message</h3>
<p style="font-family:system-ui,sans-serif;font-size:14px;white-space:pre-wrap">${escape(enquiry.message || 'Please contact this learner about getting started.')}</p>
<p style="font-family:system-ui,sans-serif;font-size:12px;color:#666">Reference ${escape(enquiry.id)}</p>`;
}

/**
 * Attempts to deliver an enquiry.
 *
 * @returns {Promise<{ delivered: boolean, transport: string, error?: string }>}
 */
export async function deliverEnquiry(enquiry) {
  // Always echo to the log: cheap, and the only delivery path when no
  // provider is configured.
  console.info(
    `\n[enquiry] ${enquiry.name} <${enquiry.email}> — ${enquiry.interest}\n${' '.repeat(9)}${enquiry.message}\n`,
  );

  if (!mailerConfigured()) {
    return { delivered: false, transport: 'log' };
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || `onboarding@resend.dev`,
        to: [process.env.MAIL_TO],
        ...(enquiry.email ? { reply_to: enquiry.email } : {}),
        subject: `Website enquiry — ${enquiry.name} (${enquiry.interest})`,
        text: formatBody(enquiry),
        html: formatHtml(enquiry),
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(`Resend ${response.status}: ${detail.slice(0, 200)}`);
    }

    return { delivered: true, transport: 'resend' };
  } catch (error) {
    // Never surface provider internals to the visitor.
    console.error('[enquiry] email delivery failed:', error.message);
    return { delivered: false, transport: 'log', error: error.message };
  }
}
