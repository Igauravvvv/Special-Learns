import { useEffect, useId, useRef, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, ChevronDown, Loader2, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Button.jsx';
import { contact } from '../data/site.js';
import { categories, courses } from '../data/programs.js';
import { validateEnquiry, LIMITS } from '../../shared/enquiry.js';

const EMPTY = { name: '', phone: '', email: '', interest: 'Not sure yet', message: '', consent: false, sl_company_url: '' };
const options = new Set(['Not sure yet', 'Trial class', 'Institute visit', 'Something else', ...categories.map(c => c.title), ...courses.map(c => c.title)]);

export default function ContactForm({ compact = false, preselect = '', source = 'contact' }) {
  const uid = useId();
  const [values, setValues] = useState({ ...EMPTY, interest: options.has(preselect) ? preselect : EMPTY.interest });
  const [mode, setMode] = useState('phone');
  const [details, setDetails] = useState(Boolean(preselect));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [feedback, setFeedback] = useState('');
  const [receipt, setReceipt] = useState(null);
  const form = useRef(null);
  const result = useRef(null);
  const busy = useRef(false);
  const request = useRef(null);
  const id = name => `${uid}-${name}`;

  useEffect(() => {
    if (options.has(preselect)) {
      setValues(v => ({ ...v, interest: preselect }));
      setDetails(true);
      request.current = null;
    }
  }, [preselect]);
  useEffect(() => { if (status === 'success') result.current?.focus(); }, [status]);

  function change(name, value) {
    setValues(v => ({ ...v, [name]: value }));
    setErrors(e => ({ ...e, [name]: undefined, ...(name === 'phone' || name === 'email' ? { contact: undefined } : {}) }));
    request.current = null;
    if (status === 'error') { setStatus('idle'); setFeedback(''); }
  }

  async function submit(event) {
    event.preventDefault();
    if (busy.current) return;
    const payload = { ...values, source };
    const validation = validateEnquiry(payload);
    if (!validation.ok) {
      setErrors(validation.errors);
      const first = Object.keys(validation.errors)[0];
      if (['interest', 'message'].includes(first)) setDetails(true);
      requestAnimationFrame(() => form.current?.querySelector(`[name="${first === 'contact' ? mode : first}"]`)?.focus());
      return;
    }
    if (values.sl_company_url) { setStatus('error'); setFeedback('We could not send this request. Please call us instead.'); return; }
    busy.current = true;
    setStatus('submitting'); setFeedback(''); setErrors({});
    request.current ??= crypto.randomUUID();
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'Idempotency-Key': request.current },
        body: JSON.stringify(payload), signal: AbortSignal.timeout(12000),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.ok !== true || !data.id) {
        if (data.errors) setErrors(data.errors);
        if (response.status === 409) request.current = null;
        throw new Error(data.message || 'Please try again in a moment.');
      }
      setReceipt({ id: data.id, name: values.name.trim().split(/\s+/)[0], channel: mode === 'phone' ? values.phone : values.email });
      setStatus('success'); setValues({ ...EMPTY });
    } catch (error) {
      setStatus('error');
      setFeedback(error.name === 'TimeoutError' || error.name === 'AbortError'
        ? 'The connection took too long. Try again — retries won’t create a second enquiry.'
        : error instanceof TypeError ? 'We couldn’t connect. Your details are still here; please try again or call us.' : error.message);
    } finally { busy.current = false; }
  }

  const control = name => ({
    id: id(name), name, value: values[name], maxLength: LIMITS[name],
    onChange: e => change(name, e.target.value),
    'aria-invalid': Boolean(errors[name] || (name === mode && errors.contact)),
    'aria-describedby': errors[name] || (name === mode && errors.contact) ? id(`${name}-error`) : undefined,
    className: `field__control${errors[name] || (name === mode && errors.contact) ? ' is-invalid' : ''}`,
  });
  const fieldError = name => {
    const message = errors[name] || (name === mode && errors.contact);
    return message ? <span className="field__error" id={id(`${name}-error`)}><AlertCircle size={14} aria-hidden="true" />{message}</span> : null;
  };

  return <div className={`enquiry-form${compact ? ' enquiry-form--compact' : ''}`}>
    {status === 'success' ? <div ref={result} className="enquiry-receipt" tabIndex={-1} role="status">
      <CheckCircle2 size={38} aria-hidden="true" />
      <h3>You’re one step closer, {receipt.name}.</h3>
      <p>Your enquiry is saved. Our team will contact you at <strong>{receipt.channel}</strong> to discuss fees, timings and the right batch.</p>
      <p className="enquiry-receipt__reference">Your reference <code>{receipt.id}</code></p>
      <p>Enrollment is confirmed with the institute after you’ve discussed the details.</p>
      <Button variant="ghost" onClick={() => { setStatus('idle'); setReceipt(null); request.current = null; }}>Send another enquiry</Button>
    </div> : <form ref={form} onSubmit={submit} className="form" noValidate aria-label="Course enquiry">
      <fieldset disabled={status === 'submitting'} className="enquiry-form__fields">
        <legend className="sr-only">Your details</legend>
        <div className="hp-field" aria-hidden="true"><label htmlFor={id('sl_company_url')}>Company URL</label><input id={id('sl_company_url')} name="sl_company_url" tabIndex={-1} autoComplete="off" value={values.sl_company_url} onChange={e => change('sl_company_url', e.target.value)} /></div>
        <div className="field"><label className="field__label" htmlFor={id('name')}>Your name</label><input {...control('name')} autoComplete="name" placeholder="What should we call you?" required />{fieldError('name')}</div>
        <div className="field">
          <div className="enquiry-form__label"><label className="field__label" htmlFor={id(mode)}>{mode === 'phone' ? 'Phone number' : 'Email address'}</label><button type="button" className="enquiry-form__switch" onClick={() => { const next = mode === 'phone' ? 'email' : 'phone'; change(mode, ''); setMode(next); }}>{mode === 'phone' ? 'Use email instead' : 'Use phone instead'}</button></div>
          <input {...control(mode)} type={mode === 'phone' ? 'tel' : 'email'} autoComplete={mode === 'phone' ? 'tel' : 'email'} inputMode={mode === 'phone' ? 'tel' : 'email'} placeholder={mode === 'phone' ? 'e.g. 98765 43210' : 'you@example.com'} required />{fieldError(mode)}
          <span className="field__hint">{mode === 'phone' ? 'We’ll call to help you choose your next step.' : 'We’ll reply with the details you need.'}</span>
        </div>
        <button type="button" className="enquiry-form__details" aria-expanded={details} aria-controls={id('details')} onClick={() => setDetails(v => !v)}>{values.interest !== 'Not sure yet' ? values.interest : 'Add a course or a question'} <span>(optional)</span><ChevronDown size={15} style={{ transform: details ? 'rotate(180deg)' : undefined }} aria-hidden="true" /></button>
        <div id={id('details')} hidden={!details}>
          <div className="field"><label className="field__label" htmlFor={id('interest')}>Course or enquiry type</label><select {...control('interest')}>
            <option value="Not sure yet">Help me choose a course</option>
            <optgroup label="Plan a visit"><option value="Trial class">Ask about a trial class</option><option value="Institute visit">Visit the institute</option><option value="Something else">Something else</option></optgroup>
            <optgroup label="Course areas">{categories.map(c => <option key={c.slug} value={c.title}>{c.title}</option>)}</optgroup>
            <optgroup label="Specific courses">{courses.map(c => <option key={c.slug} value={c.title}>{c.title}</option>)}</optgroup>
          </select>{fieldError('interest')}</div>
          <div className="field" style={{ marginTop: 14 }}><label className="field__label" htmlFor={id('message')}>Anything you’d like to ask? <span className="field__optional">(optional)</span></label><textarea {...control('message')} rows={3} placeholder="Ask about fees, timings, or tell us your learning goal." />{fieldError('message')}</div>
        </div>
        <div className="field"><label className="checkbox" htmlFor={id('consent')}><input id={id('consent')} name="consent" type="checkbox" checked={values.consent} onChange={e => change('consent', e.target.checked)} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? id('consent-error') : undefined} required /><span className="checkbox__text">You can contact me about this enquiry. <Link to="/privacy-policy">Privacy policy</Link></span></label>{fieldError('consent')}</div>
        <Button type="submit" variant="primary" block size="lg" disabled={status === 'submitting'}>{status === 'submitting' ? <><Loader2 size={17} className="spin" aria-hidden="true" />Saving your request…</> : <>{mode === 'phone' ? 'Request a callback' : 'Send my enquiry'}<ArrowRight size={17} aria-hidden="true" /></>}</Button>
        <p className="enquiry-form__note">No payment needed to enquire. Choose your course with our team.</p>
      </fieldset>
      <div aria-live="polite" aria-atomic="true">{feedback && <div className="alert alert--error"><AlertCircle size={20} aria-hidden="true" /><div><strong className="alert__title">Your enquiry hasn’t been confirmed</strong><span>{feedback}</span><a href={contact.phones[0].href}>Call {contact.phones[0].label}</a></div></div>}</div>
    </form>}
    <a className="enquiry-form__call" href={contact.phones[0].href}><Phone size={14} aria-hidden="true" />Prefer to talk? {contact.phones[0].label}</a>
  </div>;
}
