import { ArrowUpRight, Globe, Plus, Sparkles, ExternalLink, Award } from 'lucide-react';

import Button from './Button.jsx';
import Reveal from './Reveal.jsx';
import SectionHeading from './SectionHeading.jsx';
import Highlight from './Highlight.jsx';
import { DoodlePlane, DoodleStar, DoodleBurst } from './illustrations/Deco.jsx';

import {
  hostOf,
  initials,
  safeUrl,
  studentWebsites,
} from '../data/studentWebsites.js';

/**
 * Showcase of live websites built by students & alumni.
 *
 * Highlights real client and brand storefronts created by institute alumni
 * like Gaurav Bhatt, linking directly to each live website so visitors can
 * explore the artwork, layouts, and responsive development.
 */
export default function StudentWebsites({ limit, showSpotlight = true }) {
  const all = studentWebsites
    .map((site) => ({ ...site, href: safeUrl(site.url) }))
    .filter((site) => site.href);

  const items = limit ? all.slice(0, limit) : all;
  const hasEntries = items.length > 0;

  return (
    <section className="section section--mint-soft student-showcase-section" aria-labelledby="showcase-heading">
      <div className="container">
        <div className="showcase__head">
          <div>
            <p className="eyebrow" style={{ marginBottom: '1.15rem' }}>
              <span className="eyebrow__dot" aria-hidden="true" />
              Alumni Spotlight & Live Websites
            </p>
            <h2 id="showcase-heading" className="showcase__title">
              Websites our students & alumni <Highlight tone="green">have built</Highlight>
            </h2>
          </div>

          <div className="showcase__intro">
            <p>
              Explore real-world production websites designed and developed by our learners and alumni,
              including featured alumnus <strong>Gaurav Bhatt</strong>. Tap any project to visit the live site
              and see the artwork, branding, and full interactive design.
            </p>
            <Button to="/contact" variant="ghost" size="sm">
              Want to build one too?
              <ArrowUpRight size={15} aria-hidden="true" />
            </Button>
          </div>
        </div>

        {showSpotlight && (
          <Reveal variant="fade" delay={40}>
            <div className="showcase__spotlight-banner">
              <div className="showcase__spotlight-badge">
                <Award size={18} aria-hidden="true" />
                <span>Featured Alumni Profile</span>
              </div>
              <div className="showcase__spotlight-content">
                <h3 className="showcase__spotlight-name">Gaurav Bhatt</h3>
                <p className="showcase__spotlight-desc">
                  Alumnus of Special Learns Institute (Web Design & Development). Gaurav has designed and deployed
                  commercial e-commerce stores, real-estate corporate portals, and lifestyle apparel brand websites.
                </p>
              </div>
              <div className="showcase__spotlight-meta">
                <span className="showcase__spotlight-count">
                  <strong>3</strong> Live Websites
                </span>
                <span className="showcase__spotlight-inst">Trained in Lab</span>
              </div>
            </div>
          </Reveal>
        )}

        {hasEntries ? (
          <ul className="showcase__grid" style={{ marginTop: '2rem' }}>
            {items.map((site, index) => (
              <Reveal as="li" key={site.href} delay={index * 80} variant="scale">
                <SiteCard site={site} />
              </Reveal>
            ))}
          </ul>
        ) : (
          <EmptyShowcase />
        )}

        {hasEntries && all.length > items.length ? (
          <p className="center" style={{ marginTop: '2.5rem' }}>
            <Button to="/student-work" variant="indigo">
              See all student work & websites
              <ArrowUpRight size={16} aria-hidden="true" />
            </Button>
          </p>
        ) : null}
      </div>

      <DoodlePlane
        size={44}
        color="#4747D7"
        style={{ position: 'absolute', top: 40, right: '5%', opacity: 0.5 }}
      />
      <DoodleBurst
        size={40}
        style={{ position: 'absolute', bottom: 40, left: '4%', opacity: 0.45 }}
      />
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function SiteCard({ site }) {
  const host = hostOf(site.url);
  const monogram = initials(site.title);

  return (
    <article className="site-card">
      <a
        className="site-card__link"
        href={site.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${site.title} live website at ${host || site.url} (opens in a new tab)`}
      >
        {/* Thumbnail: real screenshot when supplied, otherwise a generated tile. */}
        {site.screenshot ? (
          <span className="site-card__shot">
            <img
              src={site.screenshot}
              alt={`Live website screenshot of ${site.title}`}
              width="600"
              height="375"
              loading="lazy"
              decoding="async"
            />
            <span className="site-card__badge-live">
              <span className="site-card__live-dot" aria-hidden="true" />
              Live Site
            </span>
            <span className="site-card__shot-cta" aria-hidden="true">
              <span>Visit live site</span>
              <ArrowUpRight size={14} />
            </span>
          </span>
        ) : (
          <span className="site-card__shot site-card__shot--placeholder" aria-hidden="true">
            <span className="site-card__monogram">{monogram}</span>
          </span>
        )}

        <span className="site-card__body">
          <div className="site-card__tags">
            {site.category ? <span className="pill pill--sm">{site.category}</span> : null}
            {site.alumni ? <span className="site-card__alumni-pill">Alumnus Work</span> : null}
          </div>

          <span className="site-card__title">
            <span>{site.title}</span>
            <ArrowUpRight size={18} aria-hidden="true" className="site-card__title-arrow" />
          </span>

          {site.blurb ? <span className="site-card__blurb">{site.blurb}</span> : null}

          {site.tags && site.tags.length > 0 ? (
            <div className="site-card__feature-chips" aria-hidden="true">
              {site.tags.map((tag) => (
                <span key={tag} className="site-card__feature-chip">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <span className="site-card__foot">
            <span className="site-card__host">
              <Globe size={13} aria-hidden="true" />
              {host || site.url}
            </span>
            <span className="site-card__author">
              by <strong>{site.student}</strong>
            </span>
          </span>

          <div className="site-card__button-cta" aria-hidden="true">
            <span>Open {host || 'Website'}</span>
            <ExternalLink size={14} />
          </div>
        </span>
      </a>
    </article>
  );
}

/**
 * Shown until the first project is added. Deliberately framed as "how this
 * works" rather than filler cards — nothing here claims a project exists.
 */
function EmptyShowcase() {
  return (
    <div className="showcase__empty">
      <div className="showcase__empty-art" aria-hidden="true">
        <DoodleStar size={26} color="#FFC72C" />
        <DoodleStar size={18} color="#FF8A65" style={{ marginLeft: -8 }} />
        <DoodleStar size={22} color="#93DFC7" style={{ marginLeft: -6 }} />
      </div>

      <h3 className="showcase__empty-title">
        The first projects are on their way
      </h3>
      <p className="showcase__empty-text">
        Learners on our web development and programming courses finish with a real,
        working site. We add them here as soon as we have the student&rsquo;s
        permission to publish them.
      </p>

      <ul className="showcase__steps">
        {[
          'Every site is built and hosted by the student, not by us.',
          'We publish only with the student’s consent.',
          'Each entry links straight to the live site.',
        ].map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ul>

      <div className="cluster" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
        <Button to="/programs/web-design-development" variant="indigo">
          <Plus size={16} aria-hidden="true" />
          See the web development courses
        </Button>
        <Button to="/contact" variant="ghost">
          Ask about joining
        </Button>
      </div>

      <p className="showcase__note">
        If you built a site with us and would like it listed, tell us and we will add
        it.
      </p>
    </div>
  );
}
