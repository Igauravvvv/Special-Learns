import { Palette, Code2, Video, Camera, Layers } from 'lucide-react';

import Seo from '../components/Seo.jsx';
import StudentWebsites from '../components/StudentWebsites.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Reveal from '../components/Reveal.jsx';
import CtaBand from '../components/CtaBand.jsx';
import Gallery from '../components/Gallery.jsx';
import { studentWork } from '../data/studentWork.js';
import { categories } from '../data/programs.js';

const TAG_ICONS = {
  Photoshop: Palette,
  Illustrator: Palette,
  InDesign: Layers,
  Lightroom: Camera,
  Illustration: Palette,
  'Graphic Design': Palette,
};

export default function StudentWork() {
  const tags = [...new Set(studentWork.map((item) => item.tag))];

  return (
    <>
      <Seo
        title="Student Work — Special Learns Institute"
        description="A gallery of student work from Special Learns Institute in New Delhi — posters, flyers, logos, illustrations, web and photo work produced during our computer courses."
        path="/student-work"
      />

      <section className="page-hero">
        <div className="container">
          <nav aria-label="Breadcrumb">
            <ol className="crumbs">
              <li>
                <a href="/">Home</a>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">Student Work</li>
            </ol>
          </nav>
          <div className="page-hero__inner">
            <h1>Made in our lab</h1>
            <p>
              Work produced by learners during our computer courses — design, publishing,
              illustration, web and photo projects. Select any image to view it larger.
            </p>
            <div className="cluster" style={{ marginTop: '1.5rem' }}>
              <span className="pill">
                <Layers size={12} aria-hidden="true" />
                {studentWork.length} projects
              </span>
              {tags.map((tag) => {
                const TagIcon = TAG_ICONS[tag] ?? Palette;
                return (
                  <span className="chip" key={tag}>
                    <TagIcon size={13} aria-hidden="true" style={{ marginRight: 5 }} />
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="gallery-heading">
        <div className="container">
          <SectionHeading
            align="left"
            eyebrow="Portfolio"
            title="Student gallery"
            id="gallery-heading"
            underline={false}
          >
            All work here was produced by learners at the institute as part of their
            coursework. Use the arrow keys to move between images in the viewer.
          </SectionHeading>

          <Reveal>
            <Gallery items={studentWork} />
          </Reveal>
        </div>
      </section>

      <StudentWebsites />

      {/* ================= COURSE MAPPING ================= */}
      <section className="section section--cream" aria-labelledby="which-course-heading">
        <div className="container">
          <SectionHeading
            eyebrow="Where this comes from"
            title="The courses behind this work"
            id="which-course-heading"
          >
            Most of these projects are final pieces from our design and publishing
            courses. If something here interests you, the course is on the list.
          </SectionHeading>

          <div className="grid grid--3">
            {categories
              .filter((category) =>
                ['graphic-design-vfx', 'computer-fundamentals', 'web-design-development'].includes(
                  category.slug,
                ),
              )
              .map((category, index) => (
                <Reveal key={category.slug} delay={index * 70}>
                  <div className="card card--hover" style={{ height: '100%' }}>
                    <span className="icon-tile icon-tile--yellow">
                      {category.icon === 'code' ? (
                        <Code2 size={24} />
                      ) : category.icon === 'palette' ? (
                        <Palette size={24} />
                      ) : (
                        <Video size={24} />
                      )}
                    </span>
                    <h3 className="card__title">{category.title}</h3>
                    <p className="card__text">{category.description}</p>
                    <a className="link-arrow card__foot" href={`/programs/${category.slug}`}>
                      View the area
                    </a>
                  </div>
                </Reveal>
              ))}
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Your turn"
        title="Start making something you are proud of"
        text="Every piece in this gallery started with a first lesson. Tell us what you would like to make and we will point you at the right course."
      />
    </>
  );
}
