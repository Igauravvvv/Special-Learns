import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import SectionHeading from './SectionHeading.jsx';
import Button from './Button.jsx';
import LearningScene from './illustrations/LearningScene.jsx';
import LaptopProject from './illustrations/LaptopProject.jsx';
import { processSteps } from '../data/content.js';

export default function LearningDetails() {
  return <>
{/* ================= LEARNING IN ACTION ================= */}
      <section id="how-we-teach" className="section home-approach" aria-labelledby="approach-heading">
        <div className="container">
          <div className="feature">
            <div className="split__media">
              <div className="art-frame">
                <LearningScene />
              </div>
            </div>

            <div className="split__body">
              <SectionHeading
                align="left"
                eyebrow="How a course runs"
                title="Sessions, projects and practice"
                as="h2"
                id="approach-heading"
              >
                <p style={{ marginTop: '1.25rem' }}>
                  A course here is not a lecture hall. It is regular sessions,
                  hands-on work and feedback, so what you practise in the lab is
                  what you can do on your own.
                </p>
              </SectionHeading>

              <ol className="feature__steps">
                <li>
                  <span>
                    <strong>Short, regular sessions.</strong> Consistent practice beats
                    the occasional long class.
                  </span>
                </li>
                <li>
                  <span>
                    <strong>Projects and assignments.</strong> You finish with work you
                    can show, not just notes.
                  </span>
                </li>
                <li>
                  <span>
                    <strong>Group discussions.</strong> Explaining something to the
                    group is how you find out whether it has really landed.
                  </span>
                </li>
                <li>
                  <span>
                    <strong>Design events and exhibitions.</strong> Work gets put in
                    front of people and talked about.
                  </span>
                </li>
              </ol>

              <div className="cluster">
                <Button to="/programs" variant="ghost">
                  Browse courses
                  <ArrowRight size={16} aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    <section className="section section--cream" aria-labelledby="learning-outcomes-heading">
      <div className="container split split--wide-text">
        <div>
          <SectionHeading align="left" eyebrow="Your first class and beyond" title="A clear path from enquiry to practice" id="learning-outcomes-heading" />
          <ol className="learning-details__steps">{processSteps.map(step => <li key={step.title}><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
          <Button to="/contact#enquire" variant="indigo">Ask about getting started<ArrowRight size={16} aria-hidden="true" /></Button>
        </div>
        <FeaturePanel />
      </div>
    </section>
{/* ================= LEARNING SUPPORT ================= */}
      <section className="section home-learning-features" aria-label="Learning support and practice">
        <div className="container home-learning-features__inner">
          <article className="learning-feature">
            <div className="learning-feature__copy">
              <p className="eyebrow eyebrow--plain"><span className="eyebrow__dot" aria-hidden="true" />Learn with guidance</p>
              <h2>Smart classes with an instructor <span>by your side</span></h2>
              <p>Get clear explanations, ask questions as you go, and build confidence with hands-on computer practice.</p>
              <Link className="link-arrow" to="/programs">Find a course <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
            <div className="learning-feature__image learning-feature__image--class">
              <img src="/images/references/smart-class.png" alt="Learners studying together with instructor support" loading="lazy" />
            </div>
          </article>
          <article className="learning-feature learning-feature--reverse">
            <div className="learning-feature__copy">
              <p className="eyebrow eyebrow--plain"><span className="eyebrow__dot" aria-hidden="true" />Practice that sticks</p>
              <h2>Take practice tests and see your progress</h2>
              <p>Use guided exercises to check what you have learned and know what to practise next.</p>
              <Link className="link-arrow" to="/programs">Explore programs <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
            <div className="learning-feature__image learning-feature__image--test">
              <img src="/images/references/instant-results.png" alt="A learner concentrating on a practice test" loading="lazy" />
            </div>
          </article>
        </div>
      </section>
  </>;
}

function FeaturePanel() {
  return (
    <div className="card card--raised" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '1.75rem 1.75rem 0' }}>
        <p className="eyebrow eyebrow--plain">
          <span className="eyebrow__dot" aria-hidden="true" />
          What you leave with
        </p>
        <ul className="stack stack--sm" style={{ listStyle: 'none', padding: 0, margin: '1rem 0 1.75rem' }}>
          {[
            'A computer you are no longer afraid of',
            'Documents, spreadsheets and presentations you build yourself',
            'Design and publishing work you can show',
            'Code that runs — websites, apps and scripts',
            'A clear next step, whether that is a job or a further course',
          ].map((item) => (
            <li key={item} style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
              <CheckCircle2
                size={19}
                aria-hidden="true"
                style={{ color: 'var(--sl-indigo-600)', flexShrink: 0, marginTop: 2 }}
              />
              <span style={{ fontSize: '0.9375rem', lineHeight: 1.55 }}>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <LaptopProject />
    </div>
  );
}

