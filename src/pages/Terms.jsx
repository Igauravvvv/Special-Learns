import Seo from '../components/Seo.jsx';
import { brand, contact, copyrightYear } from '../data/site.js';

export default function Terms() {
  return (
    <>
      <Seo
        title="Terms of Use — Special Learns Institute"
        description="Terms governing the use of the Special Learns Institute website."
        path="/terms"
      />

      <section className="page-hero">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="crumbs">
              <li>
                <a href="/">Home</a>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">Terms of Use</li>
            </ol>
          </nav>
          <div className="page-hero__inner">
            <h1>Terms of Use</h1>
            <p>Last updated: {copyrightYear}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow prose">
          <p>
            <strong>TODO — review before launch.</strong> These terms cover use of this
            website only. They do not cover enrolment, fees or course delivery, which
            are agreed with the institute directly. They must be reviewed before the
            site goes live.
          </p>

          <h2>About this website</h2>
          <p>
            This website is operated by {brand.name}, {contact.address.line1},{' '}
            {contact.address.line2}, {contact.address.city} {contact.address.postcode}.
          </p>

          <h2>Information on this site</h2>
          <p>
            We work to keep course and subject information accurate and up to date.
            Course content, availability and timings can change, so please confirm
            current details with us before making plans.
          </p>

          <h2>No guarantee of results</h2>
          <p>
            We describe what our courses cover and what you can expect to be able to do
            afterwards. We do not promise specific grades, certificates or employment
            outcomes, and nothing on this site should be read as such a promise.
          </p>

          <h2>Enquiries and content you send</h2>
          <p>
            When you send an enquiry you keep ownership of what you wrote. You give us
            permission to read it and reply to you. Please do not send confidential or
            sensitive information — see our{' '}
            <a href="/privacy-policy">privacy policy</a>.
          </p>

          <h2>Intellectual property</h2>
          <p>
            The design, text and original illustrations on this site belong to{' '}
            {brand.name} or are used with permission. Course logos and product names
            that belong to their respective owners are the property of those owners and
            are used to identify the software taught. Student work shown in the gallery
            is reproduced with the permission of the students who created it.
          </p>

          <h2>Third-party links</h2>
          <p>
            This site links to external websites, including social media profiles. We
            are not responsible for their content or their privacy practices.
          </p>

          <h2>Liability</h2>
          <p>
            We take care to keep this site accurate and available, but we do not
            guarantee that it will always be error-free or uninterrupted. To the extent
            permitted by law, we are not liable for loss arising from reliance on
            information published here.
          </p>

          <h2>Governing law</h2>
          <p>
            These terms are governed by the laws of India, and the courts of{' '}
            {contact.address.city} have jurisdiction.
            <span className="field__hint"> TODO: confirm jurisdiction with legal advice.</span>
          </p>

          <h2>Changes</h2>
          <p>
            We may revise these terms from time to time. The "last updated" date at the
            top reflects the current version.
          </p>

          <p>
            Questions: <a href={contact.emails[0].href}>{contact.emails[0].label}</a>
          </p>
        </div>
      </section>
    </>
  );
}
