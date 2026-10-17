/** Rules used by both the browser and API. No user data or configuration lives here. */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
export const LIMITS = { name: 80, email: 160, phone: 40, interest: 120, message: 2000 };
export const MAX_BODY_BYTES = 16 * 1024;
const clean = value => typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim() : '';

export function validateEnquiry(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { ok: false, errors: { form: 'Invalid request body.' } };
  const value = {
    name: clean(body.name), email: clean(body.email), phone: clean(body.phone),
    interest: clean(body.interest) || 'Not sure yet',
    message: typeof body.message === 'string' ? body.message.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim() : '',
    consent: body.consent === true,
    source: ['hero', 'course', 'contact'].includes(body.source) ? body.source : 'contact',
  };
  const errors = {};
  if (value.name.length < 2) errors.name = 'Please enter your name (at least 2 characters).';
  else if (value.name.length > LIMITS.name) errors.name = 'Please keep your name under 80 characters.';
  if (!value.email && !value.phone) errors.contact = 'Add a phone number or email so we can get back to you.';
  if (value.email && (!EMAIL_RE.test(value.email) || value.email.length > LIMITS.email)) errors.email = 'Please enter a valid email address.';
  if (value.phone && (!/^[+\d\s().-]+$/.test(value.phone) || value.phone.replace(/\D/g, '').length < 10 || value.phone.replace(/\D/g, '').length > 15 || value.phone.length > LIMITS.phone)) errors.phone = 'Please enter a valid phone number with 10–15 digits.';
  if (value.interest.length > LIMITS.interest) errors.interest = 'Please keep the course name under 120 characters.';
  if (value.message.length > LIMITS.message) errors.message = 'Please keep your message under 2000 characters.';
  if (!value.consent) errors.consent = 'Please confirm we can contact you about your enquiry.';
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value };
}
