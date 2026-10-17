import { ArrowUpRight, Globe, Plus } from 'lucide-react';

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
 * Showcase of websites built by students.
 *
 * Entirely data-driven from src/data/studentWebsites.js — adding an entry
 * there is the only step needed to publish a project. Renders an honest empty
 * state until entries exist, rather than inventing any.
 */
export default function StudentWebsites({ limit }) {
  const all = studentWebsites
    .map((site) => ({ ...site, href: safeUrl(site.url) }))
    .filter((site) => site.href);

  const items = limit ? all.slice(0, limit) : all;
  const hasEntries = items.length > 0;

  return (
    <section className="section section--mint-soft" aria-labelledby="showcase-heading">
      <div className="container">
        <div className="showcase__head">
          <div>
            <p className="eyebrow" style={{ marginBottom: '1.15rem' }}>
              <span className="eyebrow__dot" aria-hidden="true" />
              Built by our learners
            </p>
            <h2 id="showcase-heading" className="showcase__title">
              Websites our students <Highlight tone="green">have built</Highlight>
            </h2>
          </div>

          <div className="showcase__intro">
            <p>
              Every project below was designed and coded in our lab as part of a web
              development or programming course. They open in a new tab.
            </p>
            <Button to="/contact" variant="ghost" size="sm">
              Want to build one too?
              <ArrowUpRight size={15} aria-hidden="true" />
            </Button>
          </div>
        </div>

        {hasEntries ? (
          <ul className="showcase__grid">
            {items.map((site, index) => (
              <Reveal as="li" key={site.href} delay={index * 70} variant="scale">
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
              See all {all.length} projects
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
      >
        <span className="sr-only">
          Open {site.title}
          {host ? `, ${host}` : ''} (opens in a new tab)
        </span>

        {/* Thumbnail: real screenshot when supplied, otherwise a generated tile. */}
        {site.screenshot ? (
          <span className="site-card__shot">
            <img
              src={site.screenshot}
              alt={`Screenshot of ${site.title}`}
              width="600"
              height="375"
              loading="lazy"
              decoding="async"
            />
          </span>
        ) : (
          <span className="site-card__shot site-card__shot--placeholder" aria-hidden="true">
            <span className="site-card__monogram">{monogram}</span>
          </span>
        )}

        <span className="site-card__body">
          {site.course ? <span className="pill">{site.course}</span> : null}

          <span className="site-card__title">
            {site.title}
            <ArrowUpRight size={18} aria-hidden="true" />
          </span>

          {site.blurb ? <span className="site-card__blurb">{site.blurb}</span> : null}

          <span className="site-card__foot">
            <span className="site-card__host">
              <Globe size={13} aria-hidden="true" />
              {host || site.url}
            </span>
            {site.student ? <span className="site-card__by">by {site.student}</span> : null}
          </span>
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
