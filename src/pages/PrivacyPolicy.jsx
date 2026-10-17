import { Link } from 'react-router-dom';

import Seo from '../components/Seo.jsx';
import { contact, brand } from '../data/site.js';
import { copyrightYear } from '../data/site.js';

export default function PrivacyPolicy() {
  return (
    <>
      <Seo
        title="Privacy Policy — Special Learns Institute"
        description="How Special Learns Institute collects, uses and protects the personal information you provide through this website and when you contact the institute."
        path="/privacy-policy"
      />

      <section className="page-hero">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="crumbs">
              <li>
                <a href="/">Home</a>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">Privacy Policy</li>
            </ol>
          </nav>
          <div className="page-hero__inner">
            <h1>Privacy Policy</h1>
            <p>Last updated: {copyrightYear}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow prose">
          <p>
            <strong>TODO — review before launch.</strong> This policy describes how
            the website handles information. It has been written to match what the
            site actually does, but it must be reviewed by whoever is responsible for
            the institute's data protection obligations before it is published as
            final. In particular, sections covering retention periods and any
            analytics or advertising tools added later need to be completed.
          </p>

          <h2>Who we are</h2>
          <p>
            {brand.name} is a computer training institute at{' '}
            {contact.address.line1}, {contact.address.line2}, {contact.address.city}{' '}
            {contact.address.postcode}. For any question about this policy or your data,
            contact us at <a href={contact.emails[0].href}>{contact.emails[0].label}</a>{' '}
            or on <a href={contact.phones[0].href}>{contact.phones[0].label}</a>.
          </p>

          <h2>What we collect</h2>
          <p>When you send an enquiry through this website, we collect:</p>
          <ul>
            <li>Your name</li>
            <li>Your phone number or email address, whichever you choose</li>
            <li>Your course interest and message, if you add them</li>
            <li>Your consent to be contacted and an enquiry reference</li>
          </ul>
          <p>
            Please do not include sensitive personal, health or medical information in
            your message. We do not need it to answer an enquiry about a course.
          </p>

          <h2>Why we use it</h2>
          <p>
            We use these details for one purpose: to reply to your enquiry about a
            course or a trial class. We do not use your details for marketing, and we do
            not sell or share them with third parties.
          </p>

          <h2>How long we keep it</h2>
          <p>
            Enquiry details are kept only for as long as needed to respond to you and
            to follow up on your course or admission enquiry. After that, they are
            deleted.
            <span className="field__hint"> TODO: state a specific retention period.</span>
          </p>

          <h2>Cookies and analytics</h2>
          <p>
            This website does not use advertising cookies and does not embed advertising
            or social media tracking pixels.
            <span className="field__hint">
              {' '}
              TODO: if analytics are added, name the provider here and explain what is
              measured.
            </span>
          </p>

          <h2>Your rights</h2>
          <p>
            You can ask us at any time what information we hold about you, ask for it to
            be corrected, or ask for it to be deleted. Contact us using the email address
            or phone number above and we will action your request.
          </p>

          <h2>Security</h2>
          <p>
            Enquiries submitted through this website are transmitted over an encrypted
            connection and stored on the institute's own server. Access to stored
            enquiries is limited to the people who need it to reply to you.
          </p>

          <h2>Children's information</h2>
          <p>
            Some of our learners are school-age students. We only collect information a
            parent or guardian provides on their behalf, and we do not ask children to
            submit information themselves.
          </p>

          <h2>External links</h2>
          <p>
            This site links to Google Maps, Facebook, Instagram and X. Those services
            have their own privacy policies, which we do not control. Following such a
            link takes you to a site governed by that provider's terms.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We will update this page when our practices change. The "last updated" date
            at the top always reflects the current version.
          </p>

          <p>
            <Link className="link-arrow" to="/contact">
              Contact us about your data
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
