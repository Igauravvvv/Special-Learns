import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, Phone, X, ChevronRight } from 'lucide-react';

import Button from './Button.jsx';
import Logo from './Logo.jsx';
import ScrollProgress from './ScrollProgress.jsx';
import { contact, navLinks } from '../data/site.js';

/** True when the page is scrolled past a small threshold. */
function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > threshold));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [threshold]);

  return scrolled;
}

/**
 * Locks body scroll while the mobile drawer is open, without letting the page
 * shift as the scrollbar disappears.
 */
function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return undefined;

    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, [locked]);
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();
  const location = useLocation();
  const closeButtonRef = useRef(null);
  const drawerRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useScrollLock(open);

  // Move focus into the drawer when it opens.
  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
  }, [open]);

  // Escape closes the drawer; Tab is trapped inside it while open.
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusables = drawerRef.current?.querySelectorAll(
        'a[href], button:not([disabled])',
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <>
      <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
        <div className="container nav__inner">
          <Logo />

          <nav className="nav__links" aria-label="Main">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={() => `nav__link${isActive(link.to) ? ' is-active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="nav__actions">
            <a className="nav__phone" href={contact.phones[0].href}>
              <Phone size={16} aria-hidden="true" />
              {contact.phones[0].label}
            </a>

            <Button to="/contact#enquire" variant="primary" size="sm" className="nav__cta">
              Enquire now
            </Button>

            <button
              type="button"
              className="nav__toggle"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen(true)}
            >
              <Menu size={22} aria-hidden="true" />
            </button>
          </div>
        </div>

        <ScrollProgress />
      </header>

      {open ? (
        <div
          className="mobile-menu"
          id="mobile-menu"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className="mobile-menu__top">
            <Logo onClick={close} />
            <button
              type="button"
              className="mobile-menu__close"
              onClick={close}
              ref={closeButtonRef}
              aria-label="Close menu"
            >
              <X size={22} aria-hidden="true" />
            </button>
          </div>

          <div className="mobile-menu__body">
            <nav className="mobile-menu__nav" aria-label="Mobile">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={close}
                  className={() =>
                    `mobile-menu__link${isActive(link.to) ? ' is-active' : ''}`
                  }
                >
                  {link.label}
                  <ChevronRight className="mobile-menu__chev" size={20} aria-hidden="true" />
                </NavLink>
              ))}
            </nav>

            <div className="mobile-menu__foot">
              <Button to="/contact#enquire" variant="primary" block onClick={close}>
                Enquire about a course
              </Button>
              <a className="btn btn--ghost btn--block" href={contact.phones[0].href}>
                <Phone size={17} aria-hidden="true" />
                {contact.phones[0].label}
              </a>
              <p className="mobile-menu__note">
                {contact.address.line1}, {contact.address.line2}, {contact.address.city}{' '}
                {contact.address.postcode}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
