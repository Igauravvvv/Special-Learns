import { Link } from 'react-router-dom';
import { ArrowRight, Home, Search } from 'lucide-react';

import Seo from '../components/Seo.jsx';
import Button from '../components/Button.jsx';
import { navLinks } from '../data/site.js';
import { DecoStar, DecoSquiggle } from '../components/illustrations/Deco.jsx';

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page not found — Special Learns Institute"
        description="The page you were looking for could not be found."
        path="/404"
      />

      <section className="notfound">
        <div className="container container--narrow">
          <p className="notfound__code" aria-hidden="true">
            404
          </p>
          <h1>We could not find that page</h1>
          <p className="lead" style={{ marginTop: '1rem', maxWidth: '52ch', marginInline: 'auto' }}>
            The link may be out of date, or the page may have moved. Here is where most
            people were heading.
          </p>

          <nav aria-label="Suggested pages" style={{ marginTop: '2.5rem' }}>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                justifyContent: 'center',
              }}
            >
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link className="btn btn--ghost btn--sm" to={link.to}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="notfound__links">
            <Button to="/" variant="primary" size="lg">
              <Home size={18} aria-hidden="true" />
              Back to home
            </Button>
            <Button to="/programs" variant="ghost" size="lg">
              <Search size={18} aria-hidden="true" />
              Browse all courses
            </Button>
          </div>

          <DecoSquiggle style={{ marginTop: '2.5rem', opacity: 0.5 }} />
          <DecoStar style={{ marginTop: '1rem' }} />
        </div>
      </section>
    </>
  );
}
