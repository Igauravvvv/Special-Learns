import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, Layers, Target } from 'lucide-react';

import Seo from '../components/Seo.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Button from '../components/Button.jsx';
import Icon from '../components/Icon.jsx';
import Reveal from '../components/Reveal.jsx';
import CtaBand from '../components/CtaBand.jsx';
import { CourseCard } from '../components/CourseCards.jsx';
import { DecoStar, DecoBurst } from '../components/illustrations/Deco.jsx';

import { getCategory, getCourse, getRelatedCourses } from '../data/programs.js';
import { categories } from '../data/programs.js';
import { contact } from '../data/site.js';

export default function CourseDetail() {
  const { slug } = useParams();
  const course = getCourse(slug);

  if (!course) return <Navigate to="/programs" replace />;

  const category = getCategory(course.category);
  const related = getRelatedCourses(course, 3);

  return (
    <>
      <Seo
        title={`${course.title} — Special Learns Institute`}
        description={course.summary}
        path={`/courses/${course.slug}`}
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
              {category ? (
                <>
                  <li>
                    <Link to={`/programs/${category.slug}`}>{category.title}</Link>
                  </li>
                  <li aria-hidden="true">/</li>
                </>
              ) : null}
              <li aria-current="page">{course.title}</li>
            </ol>
          </nav>

          <div className="page-hero__inner">
            <h1>{course.title}</h1>
            <p>{course.summary}</p>
            <div className="cluster" style={{ marginTop: '1.5rem' }}>
              {course.level ? <span className="pill">{course.level}</span> : null}
              <span className="pill pill--plain">
                <Layers size={12} aria-hidden="true" />
                {course.modules.length}{' '}
                {course.modules.length === 1 ? 'module' : 'modules'}
              </span>
              {category ? (
                <Link className="chip" to={`/programs/${category.slug}`}>
                  {category.title}
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <DecoBurst size={44} style={{ position: 'absolute', bottom: 28, right: '8%', opacity: 0.5 }} />
      </section>

      {/* ================= SYLLABUS ================= */}
      <section className="section" aria-labelledby="syllabus-heading">
        <div className="container">
          <div className="split split--wide-text">
            <div className="split__body">
              <SectionHeading
                align="left"
                eyebrow="Syllabus"
                title="What this course covers"
                as="h2"
                id="syllabus-heading"
              >
                <p style={{ marginTop: '1.25rem' }}>
                  {course.modules.length === 1
                    ? 'This is a focused single-module course, taught as a hands-on session in the lab.'
                    : `This course is taught across ${course.modules.length} modules, in order, so each one builds on the last.`}
                </p>
              </SectionHeading>

              <ol className="stack stack--sm" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {course.modules.map((module, index) => (
                  <li
                    key={module}
                    style={{
                      display: 'flex',
                      gap: '0.9rem',
                      alignItems: 'flex-start',
                      padding: '0.9rem 1.1rem',
                      background: index % 2 === 0 ? 'var(--sl-cream-300)' : 'var(--sl-mint-100)',
                      borderRadius: 'var(--sl-r-md)',
                      border: '1px solid var(--sl-line)',
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 28,
                        height: 28,
                        flexShrink: 0,
                        borderRadius: '50%',
                        background: 'var(--sl-indigo-600)',
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                      }}
                    >
                      {index + 1}
                    </span>
                    <span style={{ fontWeight: 600, lineHeight: 1.55, paddingTop: 3 }}>
                      {module}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="split__media">
              <div className="card card--raised">
                <span className="icon-tile icon-tile--lg icon-tile--mint">
                  <Icon name={category?.icon ?? 'sparkles'} size={30} />
                </span>
                <h3 style={{ marginTop: '1rem' }}>Enquire about this course</h3>
                <p className="card__text" style={{ marginTop: '0.6rem' }}>
                  Fees, batch dates and timings are confirmed with you directly, so you
                  get accurate information for the course you want.
                </p>
                <div className="stack stack--sm" style={{ marginTop: '1.25rem' }}>
                  <Button to={`/contact?interest=${encodeURIComponent(course.title)}#enquire`} variant="primary" block>
                    Enquire about {course.title}
                  </Button>
                  <Button href={contact.phones[0].href} variant="ghost" block>
                    Call {contact.phones[0].label}
                  </Button>
                </div>
              </div>

              {category ? (
                <div className="card card--cream" style={{ marginTop: '1rem' }}>
                  <p className="pill pill--plain">Course area</p>
                  <h3 style={{ marginTop: '0.75rem' }}>{category.title}</h3>
                  <p className="card__text" style={{ marginTop: '0.5rem' }}>
                    {category.description}
                  </p>
                  <Link
                    className="link-arrow"
                    to={`/programs/${category.slug}`}
                    style={{ marginTop: '0.75rem' }}
                  >
                    About this area
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              ) : null}

              <div className="card" style={{ marginTop: '1rem' }}>
                <p style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                  <Target size={19} aria-hidden="true" style={{ color: 'var(--sl-indigo-600)', flexShrink: 0, marginTop: 2 }} />
                  <span>
                    New to computers? Start with{' '}
                    <Link to="/courses/basic-computer">Basic Computer</Link> first — it
                    covers the Windows and office foundations every other course builds on.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="section section--mint" aria-labelledby="works-heading">
        <div className="container container--narrow">
          <SectionHeading
            eyebrow="In the lab"
            title="How a session works"
            id="works-heading"
          >
            Every course is taught the same way — on the machines, with feedback as you go.
          </SectionHeading>

          <div className="grid grid--3">
            {[
              {
                icon: 'book-open',
                title: 'Short regular sessions',
                text: 'Consistent practice across the week is what makes a skill stick.',
              },
              {
                icon: 'hammer',
                title: 'Work on real files',
                text: 'You practise on the same kind of documents, images and code you will use outside.',
              },
              {
                icon: 'message-circle',
                title: 'Feedback as you go',
                text: 'Faculty correct mistakes early, while they are still small.',
              },
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 70}>
                <div className="card" style={{ height: '100%' }}>
                  <span className="icon-tile">
                    <Icon name={item.icon} size={22} />
                  </span>
                  <h3 className="card__title">{item.title}</h3>
                  <p className="card__text">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= RELATED ================= */}
      {related.length > 0 ? (
        <section className="section" aria-labelledby="related-heading">
          <div className="container">
            <SectionHeading
              align="left"
              eyebrow="You might also like"
              title="Related courses"
              id="related-heading"
            />
            <div className="grid grid--3">
              {related.map((item, index) => (
                <Reveal key={item.slug} delay={index * 60}>
                  <CourseCard course={item} />
                </Reveal>
              ))}
            </div>

            <div className="cluster" style={{ marginTop: '2rem' }}>
              <Link className="link-arrow" to="/programs">
                Browse all {categories.length} course areas
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <DecoStar style={{ marginTop: '1.25rem' }} />
          </div>
        </section>
      ) : null}

      <CtaBand
        eyebrow={course.title}
        title="Ask us about this course"
        text={`Tell us where you are starting from and what you want to be able to do. We will tell you honestly whether ${course.title} is the right next step.`}
      />
    </>
  );
}
