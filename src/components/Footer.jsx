import { Link } from 'react-router-dom';

import Icon from './Icon.jsx';
import Logo from './Logo.jsx';
import { brand, contact, copyrightYear, footerNav, legalLinks, socials, SITE_URL } from '../data/site.js';
import { categories } from '../data/programs.js';
import { DecoStar, DecoRing } from './illustrations/Deco';

export default function Footer() {
  const year = copyrightYear;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* ---- Brand ---- */}
          <div className="footer__col-brand">
            <Logo variant="mark" tone="light" className="footer__brand" />
            <p className="footer__about">
              Computer education from Uttam Nagar, New Delhi — 38 computer
              courses across six areas, from Basic Computer to professional
              diplomas in accounting, design and web development.
            </p>
            <div className="footer__social">
              {socials.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${brand.name} on ${social.label} (opens in a new tab)`}
                >
                  <Icon name={social.icon} size={19} />
                </a>
              ))}
            </div>
          </div>

          {/* ---- Main navigation ---- */}
          <nav className="footer__col-nav" aria-labelledby="footer-nav">
            <h2 className="footer__title" id="footer-nav">
              Explore
            </h2>
            <ul className="footer__list">
              {footerNav.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ---- Programs ---- */}
          <nav className="footer__col-programs" aria-labelledby="footer-programs">
            <h2 className="footer__title" id="footer-programs">
              Course areas
            </h2>
            <ul className="footer__list">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link to={`/programs/${category.slug}`}>{category.title}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ---- Contact ---- */}
          <div className="footer__col-contact">
            <h2 className="footer__title">Get in touch</h2>
            <ul className="footer__contact">
              <li>
                <Icon name="map-pin" size={18} />
                <address style={{ fontStyle: 'normal' }}>
                  {contact.address.line1}
                  <br />
                  {contact.address.line2}
                  <br />
                  {contact.address.city} {contact.address.postcode}
                </address>
              </li>
              {contact.phones.map((phone) => (
                <li key={phone.href}>
                  <Icon name="phone" size={18} />
                  <a href={phone.href}>{phone.label}</a>
                </li>
              ))}
              {contact.emails.map((email) => (
                <li key={email.href}>
                  <Icon name="mail" size={18} />
                  <a href={email.href}>{email.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---- Bottom bar ---- */}
        <div className="footer__bar">
          <ul className="footer__legal">
            {legalLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
            <li>
              <a href={`${SITE_URL}/sitemap.xml`}>Sitemap</a>
            </li>
          </ul>
          <p className="footer__copy">
            &copy; {year} {brand.name}. All rights reserved.
          </p>
        </div>
      </div>

      <DecoStar
        size={44}
        style={{ position: 'absolute', top: 40, right: '6%', opacity: 0.16 }}
      />
      <DecoRing
        size={90}
        style={{ position: 'absolute', bottom: 90, left: '4%', opacity: 0.1 }}
      />
    </footer>
  );
}
