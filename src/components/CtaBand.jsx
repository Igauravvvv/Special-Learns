import { ArrowRight, MessageCircle, Phone } from 'lucide-react';

import Button from './Button.jsx';
import { contact } from '../data/site.js';
import { DecoSparkle, DecoRing } from './illustrations/Deco';

/**
 * Closing conversion band. Repeated near the end of long pages and on the
 * home page, with different copy per context.
 */
export default function CtaBand({
  eyebrow = 'Next step',
  title = 'Come and see how we teach',
  text = 'Tell us what you want to learn and we will help you choose the right course or subject. If you are still deciding, ask for a trial class.',
  primaryLabel = 'Enquire now',
  secondaryLabel = 'Explore all courses',
}) {
  return (
    <section className="section" aria-labelledby="cta-heading">
      <div className="container">
        <div className="cta-band">
          <div className="cta-band__inner">
            <div>
              <p className="eyebrow" style={{ marginBottom: '1rem' }}>
                <span className="eyebrow__dot" aria-hidden="true" />
                {eyebrow}
              </p>
              <h2 id="cta-heading">{title}</h2>
              <p className="lead" style={{ marginTop: '1rem', maxWidth: '52ch' }}>
                {text}
              </p>
            </div>

            <div className="cta-band__actions">
              <Button to="/contact#enquire" variant="primary" size="lg">
                <MessageCircle size={18} aria-hidden="true" />
                {primaryLabel}
              </Button>
              <Button to="/programs" variant="ghost" size="lg">
                {secondaryLabel}
                <ArrowRight size={17} aria-hidden="true" />
              </Button>
              <a className="btn btn--on-dark btn--sm" href={contact.phones[0].href} style={{ alignSelf: 'center' }}>
                <Phone size={15} aria-hidden="true" />
                {contact.phones[0].label}
              </a>
            </div>
          </div>

          <DecoSparkle
            size={40}
            style={{ position: 'absolute', top: 28, right: 30, opacity: 0.5 }}
          />
          <DecoRing
            size={120}
            style={{ position: 'absolute', bottom: -50, left: 44, opacity: 0.35 }}
          />
        </div>
      </div>
    </section>
  );
}
