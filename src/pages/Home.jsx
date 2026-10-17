import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, MapPin, Monitor, Users, Compass } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import HeroClassroom from '../components/HeroClassroom.jsx';
import EnrollmentDialog from '../components/EnrollmentDialog.jsx';
import Highlight from '../components/Highlight.jsx';
import Button from '../components/Button.jsx';
import Icon from '../components/Icon.jsx';
import Reveal from '../components/Reveal.jsx';
import Gallery from '../components/Gallery.jsx';
import Reviews from '../components/Reviews.jsx';
import StudentWebsites from '../components/StudentWebsites.jsx';
import LearningScene from '../components/illustrations/LearningScene.jsx';
import { contact, facts } from '../data/site.js';
import { categories, countByCategory } from '../data/programs.js';
import { studentWork } from '../data/studentWork.js';

const counts = countByCategory();
const courseNotes = {
  'computer-fundamentals': 'Windows, Word, Excel and PowerPoint.',
  'accounting-erp': 'Tally, advanced Excel and office reporting.',
  'graphic-design-vfx': 'Design, photo editing, video and motion.',
  'web-design-development': 'HTML, CSS, JavaScript and WordPress.',
  programming: 'C, C++, Java, Python and more.',
  'digital-marketing': 'SEO, social media and campaign planning.',
};
const courseStyle = {
  'computer-fundamentals': { title: 'Computer essentials', tint: '#EFF6EA', accent: '#56764C' },
  'accounting-erp': { title: 'Accounting & Excel', tint: '#FFF5DD', accent: '#9B742D' },
  'graphic-design-vfx': { title: 'Design & VFX', tint: '#FAEEE8', accent: '#AF664B' },
  'web-design-development': { title: 'Web development', tint: '#EDF2FE', accent: '#526EAF' },
  programming: { title: 'Programming', tint: '#F1EEFA', accent: '#8064A1' },
  'digital-marketing': { title: 'Digital marketing', tint: '#EAF5F0', accent: '#44856E' },
};
const firstSteps = [
  { title: 'Tell us your goal', text: 'Pick a course or ask us to help you choose.' },
  { title: 'Find your fit', text: 'Talk through fees, timings and your starting point.' },
  { title: 'Come and learn', text: 'Visit the lab and arrange a suitable batch with our team.' },
];

export default function Home() {
  const [enrollmentOpen, setEnrollmentOpen] = useState(false);
  return <div className="home-page">
    <Seo title="Special Learns Institute — Computer Courses in New Delhi" description="Learn practical computer skills at Special Learns Institute, Uttam Nagar. Explore 38 courses, see student work and find your next step." path="/" />
      {/* ================= HERO ================= */}
      <section className="hero hero--inviting" aria-labelledby="hero-heading">
        <div className="container">
          <div className="hero__inner hero__inner--editorial">
            <div className="hero__copy">
              <p className="eyebrow"><span className="eyebrow__dot" aria-hidden="true" />Learn something. Build something.</p>
              <h1 className="hero__title" id="hero-heading">
                Your next chapter.<br /><Highlight tone="green">Starts with a skill.</Highlight>
              </h1>
              <p className="hero__text">
                Practical computer skills. Patient teachers. A course that fits your next step.
              </p>
              <div className="hero__actions">
                <Button onClick={() => setEnrollmentOpen(true)} aria-haspopup="dialog" variant="primary" size="lg">
                  Help me get started
                  <ArrowRight size={18} aria-hidden="true" />
                </Button>
                <Button to="/programs" variant="ghost" size="lg">
                  Explore courses
                </Button>
              </div>
              <p className="hero__reassurance"><CheckCircle2 size={14} aria-hidden="true" /> Beginners welcome. We’ll help you choose.</p>
              <div className="hero__meta" aria-label="Institute highlights">
                <span><MapPin size={17} aria-hidden="true" />{contact.address.city}</span>
                <span><BookOpen size={17} aria-hidden="true" />{facts.computerCourses} practical courses</span>
              </div>
            </div>
            <div className="hero__art hero__art--editorial">
              <HeroClassroom />
            </div>
          </div>
        </div>

      </section>
      <EnrollmentDialog open={enrollmentOpen} onClose={() => setEnrollmentOpen(false)} />


    <section className="section home-intro" aria-labelledby="intro-heading">
      <div className="container home-intro__inner">
        <div><p className="eyebrow eyebrow--plain">Welcome to Special Learns</p><h2 id="intro-heading">A place to start.<br />{' '}Room to grow.</h2><p>We’re a computer training institute in Uttam Nagar, New Delhi. Whether you’re opening a computer for the first time or building skills for work, we’ll help you take the next step.</p><Link className="link-arrow" to="/about">Get to know us<ArrowRight size={16} aria-hidden="true" /></Link></div>
        <ul className="home-intro__values">
          <li><span><Users size={21} aria-hidden="true" /></span><div><h3>Guidance when you need it</h3><p>Ask questions and work through concepts with your teacher.</p></div></li>
          <li><span><Monitor size={21} aria-hidden="true" /></span><div><h3>Skills you put into practice</h3><p>Work with real tools, exercises and projects in the lab.</p></div></li>
          <li><span><Compass size={21} aria-hidden="true" /></span><div><h3>A starting point that fits you</h3><p>Explore beginner courses, specialised skills and diplomas.</p></div></li>
        </ul>
      </div>
    </section>
    <section className="section home-course-preview" aria-labelledby="courses-heading">
      <div className="container">
        <div className="home-section-heading"><div><p className="eyebrow eyebrow--plain">38 courses · 6 areas</p><h2 id="courses-heading">Find your next skill.</h2></div><Link className="link-arrow" to="/programs">All courses<ArrowRight size={16} aria-hidden="true" /></Link></div>
        <p className="home-course-preview__intro">A first computer course, a creative skill, or a step towards work. Start with what you want to do.</p>
        <div className="home-course-grid">
          {categories.map((category, index) => (
            <Reveal key={category.slug} delay={index * 70} variant="up">
              <Link
                className="home-course-card"
                to={`/programs/${category.slug}`}
                style={{ '--course-tint': courseStyle[category.slug].tint, '--course-accent': courseStyle[category.slug].accent }}
              >
                <span className="home-course-card__top">
                  <span className="icon-tile"><Icon name={category.icon} size={23} /></span>
                  <small>{counts.get(category.slug)} courses</small>
                </span>
                <span className="home-course-card__body">
                  <strong>{courseStyle[category.slug].title}</strong>
                  <span className="home-course-card__note">{courseNotes[category.slug]}</span>
                </span>
                <span className="home-course-card__foot">Explore this area<ArrowRight size={16} aria-hidden="true" /></span>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="home-course-help"><span>Not sure where to begin?</span><button type="button" onClick={() => setEnrollmentOpen(true)} aria-haspopup="dialog">Let’s find your course<ArrowRight size={14} aria-hidden="true" /></button></div>
      </div>
    </section>
    <section className="section home-learning-preview" aria-labelledby="learning-preview-heading">
      <div className="container home-learning-preview__inner">
        <div><p className="eyebrow eyebrow--plain">Small steps. Real progress.</p><h2 id="learning-preview-heading">Learn it. Try it.<br />{' '}Make it yours.</h2><p>Guided lessons, hands-on projects and feedback that helps you move forward.</p><ul className="home-learning-points"><li><CheckCircle2 size={15} aria-hidden="true" />Practise what you learn in each session.</li><li><CheckCircle2 size={15} aria-hidden="true" />Build documents, designs or code you can show.</li></ul><Link className="link-arrow" to="/about#how-we-teach">See how we teach<ArrowRight size={16} aria-hidden="true" /></Link></div>
        <LearningScene />
      </div>
    </section>
    <section className="section home-work" aria-labelledby="work-heading">
      <div className="container"><div className="home-section-heading"><div><p className="eyebrow eyebrow--plain">Made by our learners</p><h2 id="work-heading">A little practice. Real work.</h2></div><Link className="link-arrow" to="/student-work">More student work<ArrowRight size={16} aria-hidden="true" /></Link></div><p className="home-work__intro">Posters, layouts and digital artwork created by learners during their courses. Tap a project for a closer look.</p><Gallery items={studentWork.slice(0, 4)} /></div>
    </section>
    <StudentWebsites limit={3} />
    <section className="section home-start" aria-labelledby="start-heading">
      <div className="container"><div className="home-section-heading"><div><p className="eyebrow eyebrow--plain">Getting started</p><h2 id="start-heading">From curious to your first class.</h2></div></div>
        <ol className="home-start__steps">{firstSteps.map((step, index) => <li key={step.title}><span aria-hidden="true">0{index + 1}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol>
      </div>
    </section>
    <Reviews />
    <section className="section home-next-step" aria-labelledby="next-step-heading"><div className="container"><div className="home-next-step__inner"><div><h2 id="next-step-heading">Your next step can be a small one.</h2><p>Tell us what you’d like to learn. We’ll help from there.</p></div><Button variant="primary" onClick={() => setEnrollmentOpen(true)} aria-haspopup="dialog">Let’s get started<ArrowRight size={17} aria-hidden="true" /></Button></div><nav className="home-detail-links" aria-label="Learn more"><Link to="/about">About the institute</Link><Link to="/faq">Questions & answers</Link><Link to="/contact">Visit or contact us</Link></nav></div></section>
  </div>;
}
