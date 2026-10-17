import { Layers, Search } from 'lucide-react';

import Seo from '../components/Seo.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Button from '../components/Button.jsx';
import Reveal from '../components/Reveal.jsx';
import CtaBand from '../components/CtaBand.jsx';
import Accordion from '../components/Accordion.jsx';
import CourseLibrary from '../components/CourseLibrary.jsx';
import { DeskWorkerArt } from '../components/illustrations/CourseArt.jsx';
import { DoodleStar } from '../components/illustrations/Deco.jsx';

import { categories, courses } from '../data/programs.js';
import { faqs } from '../data/faqs.js';

export default function Programs() {
  return (
    <>
      <Seo
        title="Computer Courses — 38 courses in 6 areas"
        description="Browse all 38 computer courses at Special Learns Institute, New Delhi: computer fundamentals, accounting and Tally, graphic design and VFX, web design and development, programming, and digital marketing."
        path="/programs"
      />

      <section className="page-hero">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="crumbs">
              <li>
                <a href="/">Home</a>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">Computer Courses</li>
            </ol>
          </nav>
          <div className="page-hero__inner">
            <p className="eyebrow" style={{ marginBottom: '1rem' }}>
              <span className="eyebrow__dot" aria-hidden="true" />
              {courses.length} courses · {categories.length} areas
            </p>
            <h1>Computer courses</h1>
            <p>
              Everything we teach, in one place. Search by course name or by what you
              want to learn, filter by area, and open any course to see its full
              syllabus.
            </p>
          </div>
        </div>
      </section>

      {/* ================= COURSE LIBRARY (the corner) ================= */}
      <section className="section" aria-labelledby="library-heading">
        <div className="container">
          <div className="library-intro">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Course library"
                title="Browse every course"
                id="library-heading"
                underline={false}
              >
                <p style={{ marginTop: '1.25rem' }}>
                  Search by course name, or by a tool you want to learn — module names
                  are searchable too, so “Tally”, “Photoshop” and “Python” all find the
                  right course.
                </p>
              </SectionHeading>
            </div>

            <div className="library-intro__art">
              <DeskWorkerArt />
            </div>
          </div>

          <CourseLibrary />

          <div className="cluster" style={{ marginTop: '2.5rem' }}>
            <Button to="/contact" variant="indigo">
              Not sure which course?
            </Button>
            <Button href="#library-heading" variant="ghost">
              <Search size={16} aria-hidden="true" />
              Search again
            </Button>
          </div>

          <DoodleStar
            size={26}
            style={{ marginTop: '1.5rem', opacity: 0.6 }}
          />
        </div>
      </section>

      {/* ================= AREAS EXPLAINED ================= */}
      <section className="section section--cream" aria-labelledby="areas-heading">
        <div className="container">
          <SectionHeading
            eyebrow="Start here"
            title="Six course areas"
            id="areas-heading"
            underline={false}
          >
            Every course sits in one of six areas. Open an area to see what it covers
            and what you could do afterwards.
          </SectionHeading>

          <div className="grid grid--3">
            {categories.map((category, index) => (
              <Reveal key={category.slug} delay={index * 95} variant="pop">
                <a className="line-card" href={`/programs/${category.slug}`}>
                  <span className="line-card__icon">
                    <AreaGlyph name={category.icon} />
                  </span>
                  <h3 className="line-card__title">{category.title}</h3>
                  <p className="line-card__text">{category.description}</p>
                  <span className="link-arrow card__foot">
                    Open this area
                    <Layers size={15} aria-hidden="true" />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= COURSE FAQ ================= */}
      <section className="section" aria-labelledby="course-faq-heading">
        <div className="container">
          <SectionHeading
            eyebrow="Before you enrol"
            title="Common questions about courses"
            id="course-faq-heading"
          >
            Fees, timings and batch dates are confirmed when you get in touch, so that
            you get accurate information for the course you actually want.
          </SectionHeading>
          <Accordion items={faqs.slice(0, 7)} />
          <p className="center" style={{ marginTop: '2rem' }}>
            <a className="link-arrow" href="/faq">
              Read all questions
            </a>
          </p>
        </div>
      </section>

      <CtaBand
        eyebrow="Not sure which course?"
        title="Tell us what you want to do and we will point you to the right course"
        text="You do not need to know which course you want — only what you want to be able to do afterwards. We will take it from there."
      />
    </>
  );
}

/** Small inline glyph so the area cards do not depend on the icon registry. */
function AreaGlyph({ name }) {
  const paths = {
    monitor: 'M4 5h16v11H4zM9 20h6M12 16v4',
    calculator: 'M6 3h12v18H6zM9 7h6M9 12h2M13 12h2M9 16h2M13 16h2',
    palette: 'M12 3a9 9 0 1 0 0 18c1 0 1.6-.7 1.6-1.5 0-1.3-1.2-1.6-1.2-2.7 0-.8.7-1.3 1.6-1.3H16a5 5 0 0 0 5-5c0-4-4-7.5-9-7.5ZM7.5 13a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6ZM10 8.5a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6ZM14.5 8.5a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Z',
    code: 'm8 8-4 4 4 4m8-8 4 4-4 4M14 5l-4 14',
    terminal: 'M4 5h16v14H4zM8 10l2.5 2L8 14m5 0h4',
    megaphone: 'M4 10v4h3l7 4V6l-7 4H4m13-1a3 3 0 0 1 0 6',
  };
  const d = paths[name] ?? paths.monitor;

  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} />
    </svg>
  );
}
