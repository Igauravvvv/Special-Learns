import { useMemo, useState } from 'react';
import { ArrowRight, ChevronDown, Layers, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';

import Icon from './Icon.jsx';
import Reveal from './Reveal.jsx';
import { categories, countByCategory, courses, getCategory } from '../data/programs.js';
import { DoodleStar, DoodleSquiggle } from './illustrations/Deco.jsx';

/**
 * Course Library — the site's full course browser.
 *
 * Everything lives in one glance: search across titles, summaries AND module
 * names, filter by course area, and see how many courses sit in each area
 * before choosing. Deliberately one component so the home page and the
 * programs page can never drift apart.
 *
 * `initialCount` truncates the first render to a short list with a "show all"
 * expander. The full set is only put in the DOM once asked for, which keeps
 * the home page short and light — 6 cards instead of 38 is ~84% fewer nodes.
 */
export default function CourseLibrary({
  eyebrow = 'Course library',
  intro = 'Search by course name or by what you want to learn — modules like Tally, Photoshop or Python are all searchable.',
  compact = false,
  showAreas = true,
  initialCount = null,
}) {
  const [query, setQuery] = useState('');
  const [area, setArea] = useState('all');
  const [expanded, setExpanded] = useState(false);

  const counts = useMemo(() => countByCategory(), []);
  const needle = query.trim().toLowerCase();

  /*
   * A shortlist for the home page. Chosen as the most useful starting points —
   * the fundamentals, the two most popular specialisations, and the diplomas —
   * so a first-time visitor sees a route in rather than a wall of 38.
   */
  const SHORTLIST = [
    'basic-computer',
    'ms-office',
    'tally-erp-prime',
    'professional-excel',
    'python',
    'diploma-web-design-development',
  ];

  const results = useMemo(() => {
    const list = courses.filter((course) => {
      if (area !== 'all' && course.category !== area) return false;
      if (!needle) return true;
      // Search title, summary and every module name, so "tally", "photoshop"
      // and "bootstrap" all find the right course.
      return [course.title, course.summary, course.level, ...course.modules]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });

    // Shortlist order when showing the curated set, otherwise natural order.
    if (!needle && area === 'all' && typeof initialCount === 'number') {
      const order = new Map(SHORTLIST.map((slug, i) => [slug, i]));
      return [...list].sort((a, b) => {
        const ai = order.has(a.slug) ? order.get(a.slug) : 999;
        const bi = order.has(b.slug) ? order.get(b.slug) : 999;
        if (ai !== bi) return ai - bi;
        return 0;
      });
    }

    return list;
  }, [needle, area, initialCount]);

  /*
   * A search or a filter is an explicit request to see what matched, so the
   * truncation is ignored once either is in play.
   */
  const searching = area !== 'all' || needle.length > 0;
  const canTruncate = typeof initialCount === 'number' && !searching;
  const truncated = canTruncate && !expanded && results.length > initialCount;
  const visible = truncated ? results.slice(0, initialCount) : results;

  const clear = () => {
    setQuery('');
    setArea('all');
  };

  return (
    <div className="library">
      {/* ---------- Areas ---------- */}
      {showAreas ? (
        <ul className="library__areas">
          <li>
            <button
              type="button"
              className={`area-tile${area === 'all' ? ' is-active' : ''}`}
              onClick={() => setArea('all')}
              aria-pressed={area === 'all'}
            >
              <span className="area-tile__icon area-tile__icon--all">
                <Layers size={20} aria-hidden="true" />
              </span>
              <span className="area-tile__name">All courses</span>
              <span className="area-tile__count">{courses.length}</span>
            </button>
          </li>

          {/*
            Area tiles are filter buttons, not links. Making them both would
            mean a click navigated away and lost the filter, so the dedicated
            area pages are linked from the "Six course areas" section below.
          */}
          {categories.map((category) => (
            <li key={category.slug}>
              <button
                type="button"
                className={`area-tile${area === category.slug ? ' is-active' : ''}`}
                onClick={() => setArea(category.slug)}
                aria-pressed={area === category.slug}
              >
                <span className={`area-tile__icon area-tile__icon--${category.accent}`}>
                  <Icon name={category.icon} size={20} />
                </span>
                <span className="area-tile__name">{category.title}</span>
                <span className="area-tile__count">{counts.get(category.slug) ?? 0}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {/* ---------- Search ---------- */}
      <div className="library__search">
        <label className="sr-only" htmlFor="library-search">
          Search all courses and modules
        </label>
        <div className="library__search-field">
          <Search size={18} aria-hidden="true" />
          <input
            id="library-search"
            type="search"
            value={query}
            placeholder="Search courses and modules — try Tally, Python, Photoshop…"
            onChange={(event) => setQuery(event.target.value)}
          />
          {query ? (
            <button
              type="button"
              className="library__clear"
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              <X size={16} aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>

      {/* ---------- Results ---------- */}
      <div className="library__status" role="status" aria-live="polite">
        <p>
          <strong>{results.length}</strong>{' '}
          {results.length === 1 ? 'course' : 'courses'}
          {searching ? ' matching' : ' in the library'}
          {area !== 'all' ? ` in ${getCategory(area)?.title}` : ''}
          {truncated ? ` — showing ${visible.length}` : ''}
        </p>
        {searching ? (
          <button type="button" className="library__reset" onClick={clear}>
            Show everything
          </button>
        ) : null}
      </div>

      {visible.length > 0 ? (
        <ul className={`library__grid${compact ? ' library__grid--compact' : ''}`}>
          {visible.map((course, index) => {
            const category = getCategory(course.category);
            return (
              <Reveal as="li" key={course.slug} delay={(index % 6) * 95} variant="pop">
                <Link className="lib-card" to={`/courses/${course.slug}`}>
                  <span className="lib-card__top">
                    <span className={`lib-card__icon lib-card__icon--${category?.accent ?? 'mint'}`}>
                      <Icon name={category?.icon ?? 'sparkles'} size={20} />
                    </span>
                    {course.level ? <span className="pill">{course.level}</span> : null}
                  </span>

                  <span className="lib-card__title">{course.title}</span>
                  <span className="lib-card__text">{course.summary}</span>

                  <span className="lib-card__foot">
                    <span className="lib-card__tags">
                      <span className="lib-card__area">{category?.title}</span>
                      <span className="lib-card__modules">
                        <Layers size={12} aria-hidden="true" />
                        {course.modules.length}{' '}
                        {course.modules.length === 1 ? 'module' : 'modules'}
                      </span>
                    </span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      ) : (
        <div className="library__empty">
          <DoodleStar size={30} color="#FFC72C" />
          <h3>Nothing matches “{query}”</h3>
          <p>
            Try a broader word, or clear the filters. If you want something we do not
            list yet, send us an enquiry and we will tell you honestly whether we can
            help.
          </p>
          <div className="cluster" style={{ justifyContent: 'center', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn--ghost btn--sm" onClick={clear}>
              <X size={15} aria-hidden="true" />
              Clear filters
            </button>
            <Link className="btn btn--indigo btn--sm" to="/contact">
              Ask about a course
            </Link>
          </div>
          <DoodleSquiggle width={90} style={{ marginTop: '1.25rem' }} />
        </div>
      )}

      {/* Expander: the remaining courses are only rendered once asked for. */}
      {canTruncate && results.length > initialCount && !expanded ? (
        <div className="library__more">
          <button
            type="button"
            className="btn btn--indigo"
            onClick={() => setExpanded(true)}
            aria-expanded="false"
          >
            Show all {results.length} courses
            <ChevronDown size={17} aria-hidden="true" />
          </button>
          <p className="library__more-note">
            or <Link to="/programs">browse the full library with search and filters</Link>
          </p>
        </div>
      ) : null}

      {canTruncate && expanded && results.length > initialCount ? (
        <button
          type="button"
          className="library__reset library__reset--block"
          onClick={() => setExpanded(false)}
        >
          Show fewer
        </button>
      ) : null}
    </div>
  );
}
