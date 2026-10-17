import { useSearchParams } from 'react-router-dom';
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

import Seo from '../components/Seo.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import ContactForm from '../components/ContactForm.jsx';
import Accordion from '../components/Accordion.jsx';
import { contact } from '../data/site.js';
import { faqs } from '../data/faqs.js';
import { DecoStar, DecoRing } from '../components/illustrations/Deco.jsx';

const ENQUIRY_FAQS = [
  {
    question: 'How quickly will I hear back?',
    answer:
      'Enquiries sent through this form are passed to the institute team. If it is urgent, calling is always faster — we have two numbers listed on this page.',
  },
  {
    question: 'Can I book a trial class through the form?',
    answer:
      'Yes. Open “Add a course or a question”, choose “Ask about a trial class”, and send your details. Our team will confirm availability and a suitable time.',
  },
  {
    question: 'Do I need to write a message?',
    answer:
      'No. Your name and a phone number or email are enough. Course choice and questions are optional — we can help you choose when we reply.',
  },
];

export default function Contact() {
  const [searchParams] = useSearchParams();
  const preselect = searchParams.get('interest') ?? '';

  return (
    <>
      <Seo
        title="Contact & Enquiries — Special Learns Institute"
        description="Contact Special Learns Institute in Uttam Nagar, New Delhi. Call +91 85271 84745 or email info@speciallearns.in, or send an enquiry about a computer course or trial class."
        path="/contact"
      />

      <section className="page-hero">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="crumbs">
              <li>
                <a href="/">Home</a>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">Contact</li>
            </ol>
          </nav>
          <div className="page-hero__inner">
            <h1>Get in touch</h1>
            <p>
              Ask about a course, a trial class, or a visit to the lab. We are in
              Uttam Nagar, New Delhi — call, email, or send an enquiry below.
            </p>
          </div>
        </div>
        <DecoRing size={120} style={{ position: 'absolute', right: '-36px', bottom: -50, opacity: 0.35 }} />
      </section>

      {/* ================= CONTACT DETAILS ================= */}
      <section className="section section--tight" aria-labelledby="details-heading">
        <div className="container">
          <h2 id="details-heading" className="sr-only">
            How to reach us
          </h2>

          <div className="grid grid--2">
            <div className="info-tile">
              <span className="icon-tile icon-tile--mint">
                <Phone size={22} />
              </span>
              <div className="info-tile__body">
                <span className="info-tile__label">Phone</span>
                <p className="info-tile__value">
                  {contact.phones.map((phone, index) => (
                    <span key={phone.href}>
                      {index > 0 ? <br /> : null}
                      <a href={phone.href}>{phone.label}</a>
                    </span>
                  ))}
                </p>
              </div>
            </div>

            <div className="info-tile">
              <span className="icon-tile icon-tile--yellow">
                <Mail size={22} />
              </span>
              <div className="info-tile__body">
                <span className="info-tile__label">Email</span>
                <p className="info-tile__value">
                  {contact.emails.map((email, index) => (
                    <span key={email.href}>
                      {index > 0 ? <br /> : null}
                      <a href={email.href}>{email.label}</a>
                    </span>
                  ))}
                </p>
              </div>
            </div>

            <div className="info-tile">
              <span className="icon-tile icon-tile--cream">
                <MapPin size={22} />
              </span>
              <div className="info-tile__body">
                <span className="info-tile__label">Address</span>
                {/* A <div>, not a <p>: <address> is flow content and may not sit
                    inside a paragraph. */}
                <div className="info-tile__value">
                  <address style={{ fontStyle: 'normal' }}>
                    {contact.address.line1}
                    <br />
                    {contact.address.line2}
                    <br />
                    {contact.address.city} {contact.address.postcode}
                    <br />
                    {contact.address.country}
                  </address>
                  <a
                    href={contact.mapSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.875rem', fontWeight: 700 }}
                  >
                    Open in Maps (opens in a new tab)
                  </a>
                </div>
              </div>
            </div>

            <div className="info-tile">
              <span className="icon-tile icon-tile--mint">
                <Clock size={22} />
              </span>
              <div className="info-tile__body">
                <span className="info-tile__label">Visiting hours</span>
                <p className="info-tile__value">
                  Timings are arranged with each learner based on their availability and
                  the batch they join.
                  <br />
                  <a href="tel:+918527184745" style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                    Call to confirm a time
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FORM ================= */}
      <section id="enquire" className="section section--cream" aria-labelledby="form-heading">
        <div className="container">
          <div className="split split--wide-text">
            <div className="split__body">
              <SectionHeading
                align="left"
                eyebrow="Send an enquiry"
                title="Let’s make getting started simple"
                as="h2"
                id="form-heading"
              >
                <p style={{ marginTop: '1.25rem' }}>
                  Just your name and a way to reach you. Our team will help you choose a course, explain the fees and find a suitable batch. Add a question if you like.
                </p>
              </SectionHeading>

              <ul className="value-list" style={{ gridTemplateColumns: '1fr' }}>
                {[
                  'We only use your details to reply to this enquiry.',
                  'Nothing is shared with third parties.',
                  'Please do not send sensitive personal or medical information.',
                ].map((item) => (
                  <li key={item}>
                    <MessageCircle size={20} aria-hidden="true" />
                    <span style={{ fontSize: '0.9375rem' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="split__media">
              <div className="card card--raised">
                <ContactForm preselect={preselect} source={preselect ? 'course' : 'contact'} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ENQUIRY FAQ ================= */}
      <section className="section" aria-labelledby="enquiry-faq">
        <div className="container">
          <SectionHeading
            eyebrow="Before you send"
            title="About this form"
            id="enquiry-faq"
          />
          <Accordion items={ENQUIRY_FAQS} align="left" />
        </div>
      </section>

      {/* ================= GENERIC FAQ ================= */}
      <section className="section section--alt" aria-labelledby="general-faq">
        <div className="container">
          <SectionHeading
            eyebrow="More answers"
            title="Common questions about the institute"
            id="general-faq"
            actions={
              <a className="link-arrow" href="/faq">
                See all questions
              </a>
            }
          />
          <Accordion items={faqs.slice(2, 8)} align="left" />
          <DecoStar style={{ marginTop: '1.5rem' }} />
        </div>
      </section>
    </>
  );
}
