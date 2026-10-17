import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Layers } from 'lucide-react';

import Seo from '../components/Seo.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Button from '../components/Button.jsx';
import Icon from '../components/Icon.jsx';
import Reveal from '../components/Reveal.jsx';
import CtaBand from '../components/CtaBand.jsx';
import { CourseCard } from '../components/CourseCards.jsx';
import { DecoStar, DecoRing } from '../components/illustrations/Deco.jsx';

import { categories, getCategory, getCoursesByCategory, courses } from '../data/programs.js';

/**
 * Two kinds of detail page share this route:
 *   /programs/:slug  → a course area (e.g. web-design-development)
 *   /courses/:slug   → a single course (e.g. python)
 */
export default function ProgramCategory() {
  const { slug } = useParams();

  const category = getCategory(slug);
  const list = category ? getCoursesByCategory(slug) : [];

  if (!category) return <Navigate to="/programs" replace />;

  const siblings = categories.filter((other) => other.slug !== category.slug).slice(0, 5);
  const first = list[0];

  return (
    <>
      <Seo
        title={`${category.title} — Special Learns Institute`}
        description={category.description}
        path={`/programs/${category.slug}`}
      />

      {/* ================= PAGE HERO ================= */}
      <section className="page-hero">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="crumbs">
              <li>
                <a href="/">Home</a>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <a href="/programs">Computer Courses</a>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{category.title}</li>
            </ol>
          </nav>

          <div className="page-hero__inner">
            <p className="eyebrow" style={{ marginBottom: '1rem' }}>
              <span className="eyebrow__dot" aria-hidden="true" />
              {category.tagline}
            </p>
            <h1>{category.title}</h1>
            <p>{category.description}</p>
            <div className="cluster" style={{ marginTop: '1.5rem' }}>
              <span className="pill">
                <Layers size={12} aria-hidden="true" />
                {list.length} {list.length === 1 ? 'course' : 'courses'}
              </span>
              <Button to={`/contact?interest=${encodeURIComponent(category.title)}#enquire`} variant="primary">
                Enquire about this area
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>

        <DecoRing size={130} style={{ position: 'absolute', right: '-40px', top: -50, opacity: 0.4 }} />
      </section>

      {/* ================= WHAT YOU WILL LEARN ================= */}
      <section className="section" aria-labelledby="outcomes-heading">
        <div className="container">
          <div className="split split--wide-text">
            <div className="split__body">
              <SectionHeading
                align="left"
                eyebrow="Outcomes"
                title="What this area is for"
                as="h2"
                id="outcomes-heading"
              >
                <p style={{ marginTop: '1.25rem' }}>
                  Across these courses you will work on the skills below. Which ones you
                  focus on depends on the course you choose and how far you want to take
                  it.
                </p>
              </SectionHeading>

              <ul className="stack stack--sm" style={{ listStyle: 'none', padding: 0 }}>
                {category.outcomes.map((outcome) => (
                  <li key={outcome} style={{ display: 'flex', gap: '0.7rem', alignItems: 'flex-start' }}>
                    <CheckCircle2
                      size={19}
                      aria-hidden="true"
                      style={{ color: 'var(--sl-indigo-600)', flexShrink: 0, marginTop: 3 }}
                    />
                    <span style={{ lineHeight: 1.6 }}>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="split__media">
              <div className="card card--raised">
                <span className="icon-tile icon-tile--lg icon-tile--mint">
                  <Icon name={category.icon} size={30} />
                </span>
                <h3 style={{ marginTop: '1rem' }}>Not sure where to start?</h3>
                <p className="card__text" style={{ marginTop: '0.6rem' }}>
                  If you are new to computers, we usually start with{' '}
                  <strong>Basic Computer</strong> before moving into a specialisation. If
                  you already know the basics, tell us what you want to make and we will
                  suggest the right course.
                </p>
                <div className="cluster" style={{ marginTop: '1.25rem' }}>
                  <Button to="/courses/basic-computer" variant="indigo">
                    See Basic Computer
                    <ArrowRight size={16} aria-hidden="true" />
                  </Button>
                  <Button to="/contact" variant="ghost">
                    Ask us
                  </Button>
                </div>
              </div>

              {first ? (
                <div className="card card--cream" style={{ marginTop: '1rem' }}>
                  <p className="pill pill--plain">Good starting point</p>
                  <h3 style={{ marginTop: '0.75rem' }}>{first.title}</h3>
                  <p className="card__text" style={{ marginTop: '0.5rem' }}>
                    {first.summary}
                  </p>
                  <Link
                    className="link-arrow"
                    to={`/courses/${first.slug}`}
                    style={{ marginTop: '0.75rem' }}
                  >
                    View course
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* ================= COURSES IN THIS AREA ================= */}
      <section className="section section--cream" aria-labelledby="courses-heading">
        <div className="container">
          <SectionHeading
            eyebrow={`${list.length} ${list.length === 1 ? 'course' : 'courses'}`}
            title={`Everything in ${category.title}`}
            id="courses-heading"
            underline={false}
          >
            Each course lists the modules it covers. Open one to see the full syllabus.
          </SectionHeading>

          <div className="grid grid--3">
            {list.map((course, index) => (
              <Reveal key={course.slug} delay={(index % 6) * 95} variant="pop">
                <CourseCard course={course} />
              </Reveal>
            ))}
          </div>

          {courses.length > list.length ? (
            <p className="center" style={{ marginTop: '2.25rem' }}>
              <Link className="link-arrow" to="/programs">
                View all {courses.length} courses
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </p>
          ) : null}
        </div>
      </section>

      {/* ================= OTHER AREAS ================= */}
      <section className="section" aria-labelledby="other-areas-heading">
        <div className="container">
          <SectionHeading
            align="left"
            eyebrow="Keep looking"
            title="Other course areas"
            id="other-areas-heading"
          />
          <ul className="chips">
            {siblings.map((other) => (
              <li key={other.slug}>
                <Link className="chip" to={`/programs/${other.slug}`}>
                  {other.title}
                </Link>
              </li>
            ))}
          </ul>
          <DecoStar style={{ marginTop: '1.5rem', opacity: 0.7 }} />
        </div>
      </section>

      <CtaBand
        eyebrow={`${category.title}`}
        title={`Ready to start with ${category.title.toLowerCase()}?`}
        text="Send us an enquiry with what you want to learn, or call the institute and we will talk it through with you."
      />
    </>
  );
}
