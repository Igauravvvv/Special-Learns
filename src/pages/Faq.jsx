import { ArrowRight } from 'lucide-react';

import Seo from '../components/Seo.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Accordion from '../components/Accordion.jsx';
import Button from '../components/Button.jsx';
import CtaBand from '../components/CtaBand.jsx';
import { faqs } from '../data/faqs.js';

export default function Faq() {
  return (
    <>
      <Seo
        title="Frequently Asked Questions — Special Learns Institute"
        description="Answers about joining Special Learns Institute in New Delhi — who can enrol, which computer courses are available, how enrolment works, fees and trial classes."
        path="/faq"
      />

      <section className="page-hero">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="crumbs">
              <li>
                <a href="/">Home</a>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">FAQ</li>
            </ol>
          </nav>
          <div className="page-hero__inner">
            <h1>Frequently asked questions</h1>
            <p>
              Straight answers about courses, joining the institute and
              visiting for the first time. Anything not covered here, just ask us.
            </p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="faq-list-heading">
        <div className="container">
          <h2 id="faq-list-heading" className="sr-only">
            All questions and answers
          </h2>
          <Accordion items={faqs} defaultOpen="0" allowMultiple />
        </div>
      </section>

      <section className="section section--cream" aria-labelledby="still-stuck">
        <div className="container container--narrow center">
          <h2 id="still-stuck">Still have a question?</h2>
          <p className="lead" style={{ marginTop: '1rem' }}>
            We would rather answer a question honestly than have you guess. Call the
            institute, send an email, or fill in the enquiry form — whichever suits you.
          </p>
          <div className="cluster" style={{ justifyContent: 'center', marginTop: '1.75rem' }}>
            <Button to="/contact" variant="primary" size="lg">
              Ask a question
              <ArrowRight size={17} aria-hidden="true" />
            </Button>
            <Button to="/programs" variant="ghost" size="lg">
              Browse the courses
            </Button>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Visit us"
        title="Or simply come and see"
        text="A trial class is the fastest way to know whether the teaching suits you. Get in touch and we will arrange a time."
      />
    </>
  );
}
