/**
 * Student Enrolment & Enquiry Delivery.
 *
 * Storage always happens first (server/store.js & server/supabase.js).
 * This module delivers instant notifications to institute staff via email.
 *
 * Transports:
 *   - Resend (HTTP API) — enabled by setting RESEND_API_KEY & MAIL_TO in .env
 *   - stdout console    — always active so terminal shows every submission
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

export function mailerConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.MAIL_TO);
}

/** Builds the plain-text body for an enquiry email. */
function formatBody(enquiry) {
  const cleanPhone = (enquiry.phone || '').replace(/[^+\d]/g, '');
  return [
    '==================================================',
    '🎓 NEW STUDENT ENROLMENT — SPECIAL LEARNS INSTITUTE',
    '==================================================',
    '',
    `Student Name: ${enquiry.name}`,
    `Course / Area: ${enquiry.interest || 'Not sure yet'}`,
    `Phone Number:  ${enquiry.phone || '—'}`,
    `Email Address: ${enquiry.email || '—'}`,
    `Enrolled At:   ${enquiry.receivedAt || new Date().toISOString()}`,
    `Reference ID:  ${enquiry.id}`,
    '',
    'Student Message / Notes:',
    enquiry.message || 'Learner submitted details to discuss courses, fees & batches.',
    '',
    cleanPhone ? `Direct Call: tel:${cleanPhone}` : '',
    cleanPhone ? `WhatsApp:    https://wa.me/${cleanPhone.replace('+', '')}` : '',
    enquiry.email ? `Reply Email: mailto:${enquiry.email}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function formatHtml(enquiry) {
  const escape = (value) =>
    String(value || '').replace(/[&<>"']/g, (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[char],
    );

  const cleanPhone = (enquiry.phone || '').replace(/[^+\d]/g, '');
  const waPhone = cleanPhone.replace(/^\+/, '');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Student Enrolment</title>
</head>
<body style="margin:0;padding:24px;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,0.06);border:1px solid #e2e8f0;">
    <!-- Header -->
    <tr>
      <td style="background:#3b56f5;padding:24px 28px;color:#ffffff;">
        <span style="display:inline-block;background:rgba(255,255,255,0.2);padding:4px 10px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;">
          Special Learns Institute
        </span>
        <h1 style="margin:10px 0 0;font-size:22px;font-weight:800;color:#ffffff;line-height:1.3;">
          🎓 New Student Enrolment
        </h1>
        <p style="margin:4px 0 0;font-size:14px;color:#e0e7ff;">
          A student has enrolled through the website enquiry form.
        </p>
      </td>
    </tr>

    <!-- Body Details -->
    <tr>
      <td style="padding:28px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#64748b;width:130px;font-weight:600;">Student Name:</td>
            <td style="padding:8px 0;color:#0f172a;font-weight:700;font-size:16px;">${escape(enquiry.name)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;font-weight:600;">Course / Interest:</td>
            <td style="padding:8px 0;">
              <span style="display:inline-block;background:#eff6ff;color:#1d4ed8;font-weight:700;padding:3px 10px;border-radius:6px;border:1px solid #bfdbfe;">
                ${escape(enquiry.interest || 'General Enquiry')}
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;font-weight:600;">Phone:</td>
            <td style="padding:8px 0;">
              ${enquiry.phone ? `<a href="tel:${escape(cleanPhone)}" style="color:#2563eb;text-decoration:none;font-weight:600;">${escape(enquiry.phone)}</a>` : '<span style="color:#94a3b8;">Not provided</span>'}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;font-weight:600;">Email:</td>
            <td style="padding:8px 0;">
              ${enquiry.email ? `<a href="mailto:${escape(enquiry.email)}" style="color:#2563eb;text-decoration:none;font-weight:600;">${escape(enquiry.email)}</a>` : '<span style="color:#94a3b8;">Not provided</span>'}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;font-weight:600;">Submitted:</td>
            <td style="padding:8px 0;color:#475569;">${escape(enquiry.receivedAt || new Date().toLocaleString())}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;font-weight:600;">Reference:</td>
            <td style="padding:8px 0;"><code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;color:#334155;font-size:12px;">${escape(enquiry.id)}</code></td>
          </tr>
        </table>

        <!-- Message Box -->
        <div style="margin-top:20px;padding:16px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;">
          <div style="font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">
            Student Note / Message:
          </div>
          <div style="font-size:14px;color:#1e293b;line-height:1.5;white-space:pre-wrap;">
            ${escape(enquiry.message || 'No additional note. Ready to discuss fees, batch timings & course overview.')}
          </div>
        </div>

        <!-- Direct Actions -->
        <div style="margin-top:24px;padding-top:20px;border-top:1px solid #f1f5f9;display:flex;gap:10px;">
          ${cleanPhone ? `<a href="tel:${escape(cleanPhone)}" style="display:inline-block;padding:10px 18px;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:700;font-size:13px;border-radius:8px;margin-right:8px;">📞 Call Student</a>` : ''}
          ${cleanPhone ? `<a href="https://wa.me/${escape(waPhone)}" style="display:inline-block;padding:10px 18px;background:#16a34a;color:#ffffff;text-decoration:none;font-weight:700;font-size:13px;border-radius:8px;margin-right:8px;">💬 WhatsApp</a>` : ''}
          ${enquiry.email ? `<a href="mailto:${escape(enquiry.email)}" style="display:inline-block;padding:10px 18px;background:#475569;color:#ffffff;text-decoration:none;font-weight:700;font-size:13px;border-radius:8px;">✉️ Reply Email</a>` : ''}
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#f8fafc;padding:16px 28px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;text-align:center;">
        Special Learns Institute · K-3, Mohan Garden, 40 Feet Road, Uttam Nagar, New Delhi 110059
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Delivers an enquiry notification to configured email recipients.
 *
 * @param {object} enquiry The validated enquiry/enrolment.
 * @returns {Promise<{ delivered: boolean, transport: string, error?: string }>}
 */
export async function deliverEnquiry(enquiry) {
  // Always log to server stdout
  console.info(
    `\n[enrolment] 🎓 New Enrolment: ${enquiry.name} (${enquiry.phone || enquiry.email}) — ${enquiry.interest}\n${' '.repeat(12)}${enquiry.message || '(no message)'}\n`,
  );

  if (!mailerConfigured()) {
    return { delivered: false, transport: 'log' };
  }

  // Support multiple comma-separated emails in MAIL_TO
  const toRecipients = process.env.MAIL_TO.split(',')
    .map((e) => e.trim())
    .filter(Boolean);

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || `Special Learns <onboarding@resend.dev>`,
        to: toRecipients,
        ...(enquiry.email ? { reply_to: enquiry.email } : {}),
        subject: `🎓 New Student Enrolment: ${enquiry.name} — ${enquiry.interest || 'Course Enrolment'}`,
        text: formatBody(enquiry),
        html: formatHtml(enquiry),
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(`Resend ${response.status}: ${detail.slice(0, 200)}`);
    }

    console.log(`[enrolment] Notification email dispatched to ${toRecipients.join(', ')}`);
    return { delivered: true, transport: 'resend' };
  } catch (error) {
    console.error('[enrolment] Email delivery failed:', error.message);
    return { delivered: false, transport: 'log', error: error.message };
  }
}

/* -------------------------------------------------------------------------- */
/* Fee Alert & Overdue Reminder Delivery                                      */
/* -------------------------------------------------------------------------- */

export async function deliverFeeAlertEmail(alerts) {
  const upcoming = alerts.upcoming || [];
  const overdue = alerts.overdue || [];
  const totalCount = upcoming.length + overdue.length;

  console.info(
    `\n[fee-alerts] 🔔 Student Fee Digest: ${upcoming.length} upcoming fees due within 3 days, ${overdue.length} overdue fees.`,
  );
  for (const s of [...upcoming, ...overdue]) {
    console.info(`   - [${s.status.toUpperCase()}] ${s.name} (${s.rollNo}) — ₹${s.monthlyFee} due ${s.dueDate} | Phone: ${s.phone}`);
  }

  if (!mailerConfigured()) {
    return { delivered: false, transport: 'log', count: totalCount };
  }

  const toRecipients = process.env.MAIL_TO.split(',')
    .map((e) => e.trim())
    .filter(Boolean);

  const escape = (val) => String(val || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  const rows = [...upcoming, ...overdue].map((s) => `
    <tr style="border-bottom:1px solid #e2e8f0;">
      <td style="padding:10px;font-weight:700;color:#0f172a;">${escape(s.name)}<br><small style="color:#64748b;">${escape(s.rollNo)}</small></td>
      <td style="padding:10px;color:#334155;">${escape(s.course)}</td>
      <td style="padding:10px;font-weight:700;color:#0f172a;">₹${s.monthlyFee}</td>
      <td style="padding:10px;color:#334155;">${escape(s.dueDate)}</td>
      <td style="padding:10px;">
        <span style="display:inline-block;padding:3px 8px;border-radius:6px;font-size:12px;font-weight:700;background:${s.status === 'overdue' ? '#fee2e2;color:#b91c1c;' : '#fef3c7;color:#b45309;'}">
          ${s.status === 'overdue' ? '⚠️ Overdue' : '🔔 Due Soon'}
        </span>
      </td>
      <td style="padding:10px;"><a href="tel:${escape(s.phone)}" style="color:#2563eb;text-decoration:none;font-weight:600;">${escape(s.phone)}</a></td>
    </tr>
  `).join('');

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Student Fee Alerts</title></head>
<body style="margin:0;padding:24px;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,0.06);border:1px solid #e2e8f0;">
    <tr>
      <td style="background:#1e293b;padding:24px 28px;color:#ffffff;">
        <span style="display:inline-block;background:rgba(255,255,255,0.2);padding:4px 10px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;">
          Special Learns Admin Alert
        </span>
        <h1 style="margin:10px 0 0;font-size:22px;font-weight:800;color:#ffffff;line-height:1.3;">
          🔔 Student Fee Due & Overdue Digest
        </h1>
        <p style="margin:4px 0 0;font-size:14px;color:#cbd5e1;">
          Notification for fees upcoming within 3 days and pending student dues.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:24px;">
        <div style="display:flex;gap:16px;margin-bottom:20px;">
          <div style="background:#fef3c7;border:1px solid #fde68a;padding:12px 18px;border-radius:8px;">
            <div style="font-size:20px;font-weight:800;color:#b45309;">${upcoming.length}</div>
            <div style="font-size:12px;color:#92400e;font-weight:600;">Due in &le;3 Days</div>
          </div>
          <div style="background:#fee2e2;border:1px solid #fecaca;padding:12px 18px;border-radius:8px;">
            <div style="font-size:20px;font-weight:800;color:#b91c1c;">${overdue.length}</div>
            <div style="font-size:12px;color:#991b1b;font-weight:600;">Overdue Accounts</div>
          </div>
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
          <thead>
            <tr style="background:#f1f5f9;text-align:left;color:#475569;font-weight:700;">
              <th style="padding:10px;">Student</th>
              <th style="padding:10px;">Course</th>
              <th style="padding:10px;">Amount</th>
              <th style="padding:10px;">Due Date</th>
              <th style="padding:10px;">Status</th>
              <th style="padding:10px;">Contact</th>
            </tr>
          </thead>
          <tbody>
            ${rows || '<tr><td colspan="6" style="padding:16px;text-align:center;color:#64748b;">No fees due soon or overdue! All clear.</td></tr>'}
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background:#f8fafc;padding:14px 28px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;text-align:center;">
        Special Learns Institute · Admin Panel Fee Alert System
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || `Special Learns <onboarding@resend.dev>`,
        to: toRecipients,
        subject: `🔔 Fee Alert: ${upcoming.length} Upcoming & ${overdue.length} Overdue Student Fees — Special Learns`,
        text: `Special Learns Fee Digest: ${upcoming.length} upcoming, ${overdue.length} overdue. Total pending: ₹${alerts.summary?.totalDueAmount || 0}`,
        html,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new Error(`Resend ${response.status}: ${detail.slice(0, 200)}`);
    }

    console.log(`[fee-alerts] Notification email dispatched to ${toRecipients.join(', ')}`);
    return { delivered: true, transport: 'resend', count: totalCount };
  } catch (error) {
    console.error('[fee-alerts] Email delivery error:', error.message);
    return { delivered: false, transport: 'log', error: error.message, count: totalCount };
  }
}

