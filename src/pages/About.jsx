import { Quote, CheckCircle2, ArrowRight } from 'lucide-react';

import Seo from '../components/Seo.jsx';
import LearningDetails from '../components/LearningDetails.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Button from '../components/Button.jsx';
import Icon from '../components/Icon.jsx';
import Reveal from '../components/Reveal.jsx';
import CtaBand from '../components/CtaBand.jsx';
import ClassroomIllustration from '../components/illustrations/ClassroomIllustration.jsx';
import { DecoStar, DecoBurst } from '../components/illustrations/Deco.jsx';

import { brand, contact, facts, vision } from '../data/site.js';
import { aboutApproach, aboutStory, founderQuote, stats } from '../data/content.js';
import { categories } from '../data/programs.js';

export default function About() {
  return (
    <>
      <Seo
        title="About Special Learns Institute"
        description="Special Learns Institute is a computer training institute in Uttam Nagar, New Delhi, founded by Saurabh Shukla to give learners practical, confidence-building education."
        path="/about"
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
              <li aria-current="page">About</li>
            </ol>
          </nav>
          <div className="page-hero__inner">
            <h1>An institute built around how people actually learn</h1>
            <p>
              Special Learns Institute teaches computer skills from
              Uttam Nagar, New Delhi — with small groups, hands-on practice and
              teachers who know every student by name.
            </p>
          </div>
        </div>
      </section>

      {/* ================= MISSION ================= */}
      <section className="section" aria-labelledby="mission-heading">
        <div className="container">
          <div className="split split--wide-text">
            <div className="split__body">
              <SectionHeading
                align="left"
                eyebrow="Our vision"
                title="Dream more, learn more, become more"
                as="h2"
                id="mission-heading"
              >
                <p style={{ marginTop: '1.25rem' }}>{vision}</p>
              </SectionHeading>

              <div className="prose">
                {aboutStory.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="split__media">
              <div className="art-frame">
                <ClassroomIllustration />
              </div>
              <DecoBurst size={46} style={{ position: 'absolute', top: -18, right: -10, opacity: 0.6 }} />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOUNDER ================= */}
      <section className="section section--cream" aria-labelledby="founder-heading">
        <div className="container container--narrow">
          <div style={{ textAlign: 'center' }}>
            <span className="icon-tile icon-tile--lg" style={{ margin: '0 auto' }}>
              <Quote size={26} />
            </span>
            <blockquote
              style={{
                marginTop: '1.75rem',
                fontSize: 'clamp(1.25rem, 1rem + 1.2vw, 1.75rem)',
                fontWeight: 800,
                lineHeight: 1.45,
                letterSpacing: '-0.02em',
                color: 'var(--sl-heading)',
                textWrap: 'balance',
              }}
            >
              “{founderQuote.text}”
            </blockquote>
            <p style={{ marginTop: '1.25rem' }}>
              <strong style={{ display: 'block', color: 'var(--sl-heading)' }}>
                {founderQuote.name}
              </strong>
              <span style={{ color: 'var(--sl-text-muted)', fontSize: '0.9375rem' }}>
                {founderQuote.role}, {brand.name}
              </span>
            </p>
            <DecoStar style={{ marginTop: '1.25rem' }} />
          </div>
        </div>
      </section>

      {/* ================= APPROACH ================= */}
      <section className="section" aria-labelledby="approach-heading">
        <div className="container">
          <SectionHeading
            eyebrow="Our approach"
            title="Four things we hold to"
            id="approach-heading"
          >
            These are not slogans — they are how the courses are actually built.
          </SectionHeading>

          <div className="grid grid--4">
            {aboutApproach.map((item, index) => (
              <Reveal key={item.title} delay={index * 70}>
                <div className="card card--hover" style={{ height: '100%' }}>
                  <span className="icon-tile icon-tile--mint">
                    <Icon name={item.icon} size={24} />
                  </span>
                  <h3 className="card__title">{item.title}</h3>
                  <p className="card__text">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TWO STRENGTHS ================= */}
      <section className="section section--mint" aria-labelledby="strengths-heading">
        <div className="container">
          <SectionHeading
            eyebrow="What we do"
            title="One institute, many paths"
            id="strengths-heading"
          >
            {categories.length} course areas and {facts.computerCourses} individual
            courses, taught in the same lab by the same faculty.
          </SectionHeading>

          <div className="grid grid--2">
            <article className="card card--raised" style={{ background: 'var(--sl-white)' }}>
              <span className="icon-tile icon-tile--lg icon-tile--yellow">
                <Icon name="laptop" size={28} />
              </span>
              <h3 className="card__title" style={{ fontSize: 'var(--sl-h4)' }}>
                Computer courses
              </h3>
              <p className="card__text">
                {categories.length} course areas, {facts.computerCourses} individual
                courses — from Basic Computer through to diplomas in accounting,
                graphic design with VFX, and website development.
              </p>
              <ul className="chips" style={{ marginTop: '0.5rem' }}>
                {categories.map((category) => (
                  <li className="chip" key={category.slug}>
                    {category.title}
                  </li>
                ))}
              </ul>
              <div className="card__foot">
                <Button to="/programs" variant="indigo">
                  Browse computer courses
                  <ArrowRight size={16} aria-hidden="true" />
                </Button>
              </div>
            </article>

            <article className="card card--raised" style={{ background: 'var(--sl-white)' }}>
              <span className="icon-tile icon-tile--lg icon-tile--mint">
                <Icon name="target" size={28} />
              </span>
              <h3 className="card__title" style={{ fontSize: 'var(--sl-h4)' }}>
                Where these courses lead
              </h3>
              <p className="card__text">
                Every course is built around real work, so it is worth deciding what you
                want to be able to do before you pick one.
              </p>
              <ul className="stack stack--sm" style={{ listStyle: 'none', padding: 0, marginTop: '0.5rem' }}>
                {[
                  'First job support — office, data entry and computer operator work',
                  'Accounts and back office — Tally, Excel and MIS reporting',
                  'Design and publishing — print, branding, photo and video work',
                  'Web and programming — websites, apps and e-commerce',
                ].map((item) => (
                  <li key={item} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                    <CheckCircle2
                      size={18}
                      aria-hidden="true"
                      style={{ color: 'var(--sl-indigo-600)', flexShrink: 0, marginTop: 3 }}
                    />
                    <span style={{ fontSize: '0.9375rem' }}>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="card__foot">
                <Button to="/programs" variant="indigo">
                  Compare the course areas
                  <ArrowRight size={16} aria-hidden="true" />
                </Button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <LearningDetails />

      {/* ================= NUMBERS ================= */}
      <section className="section" aria-labelledby="numbers-heading">
        <div className="container">
          <SectionHeading align="left" eyebrow="Today" title="What we offer right now" id="numbers-heading">
            Taken directly from our current course list.
          </SectionHeading>
          <div className="grid grid--4">
            {stats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 70}>
                <div className="stat">
                  <Icon name={['laptop', 'layers', 'book-open', 'graduation-cap'][index]} size={26} />
                  <span className="stat__value">{stat.value}</span>
                  <span className="stat__label">{stat.label}</span>
                  <span className="stat__text">{stat.text}</span>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="cluster" style={{ marginTop: '2rem' }}>
            <Button to="/contact" variant="ghost">
              Visit us in {contact.address.city}
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Come and see"
        title="The best way to judge us is to visit"
        text="Sit in on a class, meet the faculty and ask whatever you want to know. Learners have told us a trial class is well worth the visit."
      />
    </>
  );
}
