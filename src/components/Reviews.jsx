import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { testimonials } from '../data/testimonials.js';

// SVG components matching the user's reference mockup
function LightbulbIcon() {
  return (
    <svg className="specially-lightbulb-svg" viewBox="0 0 46 54" fill="none" aria-hidden="true">
      <line x1="23" y1="2" x2="23" y2="8" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="8" y1="8" x2="13" y2="13" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="38" y1="8" x2="33" y2="13" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="2" y1="23" x2="8" y2="23" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="44" y1="23" x2="38" y2="23" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M14 26 C12 21 13 14 18 10 C23 7 30 8 33 13 C36 17 34 22 32 26 C30 29 29 32 29 36 L17 36 C17 32 16 29 14 26 Z"
        fill="#FDE047"
        stroke="#111827"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <line x1="18" y1="36" x2="28" y2="36" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="19" y1="40" x2="27" y2="40" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="20" y1="44" x2="26" y2="44" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="21" y1="48" x2="25" y2="48" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function CornerArcs() {
  return (
    <svg className="specially-card__arcs" viewBox="0 0 46 46" fill="none" aria-hidden="true">
      <path d="M46 10 C34 12 12 34 10 46" stroke="#DEAA5A" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M46 22 C37 24 24 37 22 46" stroke="#DEAA5A" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

function CurlDoodle() {
  return (
    <div className="specially-curl-doodle" aria-hidden="true">
      <svg width="74" height="74" viewBox="0 0 74 74" fill="none">
        <path
          d="M14 46 C18 28, 28 12, 38 14 C48 16, 45 32, 34 38 C25 43, 18 36, 28 26 C38 16, 52 14, 61 28 C66 38, 59 50, 48 52 C39 54, 37 43, 46 36 C54 29, 64 32, 68 40"
          stroke="#3577F6"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// Circular official seal stamped over the header
function HeaderStamp() {
  return (
    <div className="specially-header-stamp" aria-hidden="true">
      <svg viewBox="0 0 100 100" width="80" height="80">
        <circle cx="50" cy="50" r="46" stroke="#B91C1C" strokeWidth="2.5" fill="none" strokeDasharray="5 3" />
        <circle cx="50" cy="50" r="39" stroke="#B91C1C" strokeWidth="1.5" fill="none" />
        <text x="50" y="28" textAnchor="middle" fill="#B91C1C" fontSize="7" fontWeight="900" letterSpacing="1.5">
          SPECIAL LEARNS
        </text>
        <line x1="22" y1="33" x2="78" y2="33" stroke="#B91C1C" strokeWidth="1" />
        <text x="50" y="47" textAnchor="middle" fill="#B91C1C" fontSize="11" fontWeight="900" letterSpacing="1">
          OFFICIAL
        </text>
        <text x="50" y="58" textAnchor="middle" fill="#B91C1C" fontSize="7.5" fontWeight="900" letterSpacing="1.5">
          ★ ★ ★ ★ ★
        </text>
        <line x1="22" y1="64" x2="78" y2="64" stroke="#B91C1C" strokeWidth="1" />
        <text x="50" y="75" textAnchor="middle" fill="#B91C1C" fontSize="6.5" fontWeight="900" letterSpacing="1.2">
          VERIFIED REVIEWS
        </text>
      </svg>
    </div>
  );
}

// Rubber Ink Stamp stamped over individual cards with postmark cancellation waves
function CardStamp({ color = '#B91C1C', main = 'VERIFIED', sub = 'SPECIAL LEARNS' }) {
  return (
    <div className="specially-card-stamp" style={{ '--stamp-color': color }} aria-hidden="true">
      <div className="specially-stamp-badge">
        <span className="specially-stamp-stars">★ ★ ★</span>
        <span className="specially-stamp-main">{main}</span>
        <span className="specially-stamp-sub">{sub}</span>
      </div>
      <svg className="specially-stamp-waves" viewBox="0 0 54 24" fill="none" stroke="currentColor">
        <path d="M0 4 Q 9 0 18 4 T 36 4 T 54 4" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M0 12 Q 9 8 18 12 T 36 12 T 54 12" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M0 20 Q 9 16 18 20 T 36 20 T 54 20" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function CertificateIcon() {
  return (
    <svg className="specially-card__icon" viewBox="0 0 48 48" fill="none" stroke="#111827" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="6" width="32" height="28" rx="3" />
      <line x1="14" y1="13" x2="26" y2="13" />
      <line x1="14" y1="19" x2="34" y2="19" />
      <line x1="14" y1="25" x2="24" y2="25" />
      <circle cx="24" cy="34" r="5" fill="#FFF8EC" />
      <path d="M21 38 L19 44 L24 42 L29 44 L27 38" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg className="specially-card__icon" viewBox="0 0 48 48" fill="none" stroke="#111827" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 24 C12 16 17 10 24 10 C31 10 36 16 36 24" />
      <rect x="8" y="22" width="6" height="12" rx="3" />
      <rect x="34" y="22" width="6" height="12" rx="3" />
      <path d="M37 28 C37 35 30 38 24 38 L22 38" />
      <circle cx="20" cy="38" r="2" fill="#111827" />
      <rect x="18" y="18" width="12" height="10" rx="2" />
      <path d="M21 28 C21 25 27 25 27 28" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg className="specially-card__icon" viewBox="0 0 48 48" fill="none" stroke="#111827" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="8" width="36" height="24" rx="3" />
      <polygon points="21,15 29,20 21,25" fill="none" stroke="#111827" strokeWidth="2.4" strokeLinejoin="round" />
      <line x1="6" y1="38" x2="42" y2="38" />
      <line x1="6" y1="38" x2="18" y2="38" strokeWidth="3.2" />
      <circle cx="18" cy="38" r="2.5" fill="#111827" />
      <circle cx="10" cy="38" r="1.5" fill="#111827" />
    </svg>
  );
}

function getIcon(type) {
  switch (type) {
    case 'certificate':
      return <CertificateIcon />;
    case 'support':
      return <SupportIcon />;
    case 'video':
    default:
      return <VideoIcon />;
  }
}

// 1. Exact cards from the provided mockup with stamped attributes
const mockupFeatures = [
  {
    id: 'mockup-cert',
    iconType: 'certificate',
    title: 'Get your certificate and add to your resume',
    text: "Everyone agrees with the fact that learning management systems are a tremendous way to expand learners' knowledge.",
    stampColor: '#B91C1C',
    stampMain: 'CERTIFIED',
    stampSub: 'GOVT RECOGNISED',
  },
  {
    id: 'mockup-support',
    iconType: 'support',
    title: 'Premium one-to-one support for students',
    text: "Everyone agrees with the fact that learning management systems are a tremendous way to expand learners' knowledge.",
    stampColor: '#1D4ED8',
    stampMain: '1-ON-1 MENTOR',
    stampSub: 'STUDENT FIRST',
  },
  {
    id: 'mockup-access',
    iconType: 'video',
    title: 'Lifetime access to all your enrolled courses',
    text: "Everyone agrees with the fact that learning management systems are a tremendous way to expand learners' knowledge.",
    stampColor: '#047857',
    stampMain: 'LIFETIME PASS',
    stampSub: 'PRACTICAL LAB',
  },
];

// 2. Real testimonials structured faithfully in the same high-impact visual design
const enrichedTestimonials = [
  {
    id: 'pooja-yadav',
    iconType: 'certificate',
    title: 'Get your certificate and add to your resume',
    name: 'Pooja',
    role: 'Basic Computer & Accounting',
    rating: 5,
    text: 'If you are looking to gain good knowledge in the field of computers, why not come here. I am pursuing basic computer and financial accounting and I am so happy taking lots of knowledge.',
    stampColor: '#B91C1C',
    stampMain: 'VERIFIED ALUMNI',
    stampSub: 'ACCOUNTING COURSE',
  },
  {
    id: 'mehak',
    iconType: 'support',
    title: 'Premium one-to-one support for students',
    name: 'Mehak',
    role: 'Learner',
    rating: 5,
    text: 'They educate in a very good manner. Very easy for a child to understand the concepts. I highly recommend this institute to every learner. Good content at affordable fees.',
    stampColor: '#1D4ED8',
    stampMain: 'TOP RATED',
    stampSub: 'PATIENT TEACHERS',
  },
  {
    id: 'vansh',
    iconType: 'video',
    title: 'Lifetime access to all your practical skills',
    name: 'Vansh',
    role: 'Learner',
    rating: 5,
    text: 'This is the place where you can trust the teachers blindly. Dedicated faculty who take time to explain every single practical detail until you are completely confident.',
    stampColor: '#047857',
    stampMain: '100% TRUSTED',
    stampSub: 'PRACTICAL LAB',
  },
  {
    id: 'saurabh',
    iconType: 'support',
    title: 'Polite faculties and best course content',
    name: 'Saurabh',
    role: 'Learner',
    rating: 5,
    text: 'I am glad to study at Special Learns Computer Institute. Well educated, professional and polite faculties, and the content given by them is top-tier in India.',
    stampColor: '#B91C1C',
    stampMain: 'BEST CONTENT',
    stampSub: 'POLITE FACULTY',
  },
  {
    id: 'harsh',
    iconType: 'certificate',
    title: 'Best computer training institute in West Delhi',
    name: 'Harsh',
    role: 'Learner',
    rating: 5,
    text: 'Best computer institute in West Delhi. Excellent practical labs, patient teachers, and great environment for building job skills that prepare you for work.',
    stampColor: '#1D4ED8',
    stampMain: 'DELHI #1',
    stampSub: 'STUDENT CHOICE',
  },
  {
    id: 'gulshan',
    iconType: 'video',
    title: 'The best platform for your future career',
    name: 'Gulshan',
    role: 'Learner',
    rating: 5,
    text: 'The best place and platform where you can learn a lot of things for your future career. High-quality instruction and supportive peers in every batch.',
    stampColor: '#047857',
    stampMain: 'CAREER READY',
    stampSub: 'FUTURE PROOF',
  },
  {
    id: 'ambuj',
    iconType: 'certificate',
    title: 'The right place to master practical computers',
    name: 'Ambuj',
    role: 'Learner',
    rating: 5,
    text: 'If you want to learn something related to computers, you are at the right place. Here you can learn lots of practical things with personal guidance.',
    stampColor: '#B91C1C',
    stampMain: 'RIGHT PLACE',
    stampSub: 'PRACTICAL SKILLS',
  },
  {
    id: 'xenificity',
    iconType: 'support',
    title: 'Dedicated mentors and great trial classes',
    name: 'Xenificity',
    role: 'Visitor',
    rating: 5,
    text: 'A good institute run by a dedicated, eminent person. It is totally worth a visit and having a trial class to experience the quality firsthand.',
    stampColor: '#1D4ED8',
    stampMain: 'TRIAL CLASS',
    stampSub: 'HIGHLY RECOMMENDED',
  },
  {
    id: 'pooja-rathore',
    iconType: 'video',
    title: 'Well educated teachers who provide best knowledge',
    name: 'Pooja',
    role: 'Learner',
    rating: 5,
    text: 'This institute provides lots of skills and teachers are well educated and provide us the best knowledge. You have to join this institute.',
    stampColor: '#047857',
    stampMain: 'SKILLS MASTER',
    stampSub: 'TOP MENTORS',
  },
];

const PAGE_SIZE = 3;

export default function Reviews() {
  const [viewMode, setViewMode] = useState('testimonials'); // 'testimonials' | 'mockup'
  const [page, setPage] = useState(0);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const trackRef = useRef(null);

  const allItems = viewMode === 'mockup' ? mockupFeatures : enrichedTestimonials;
  const totalPages = Math.ceil(allItems.length / PAGE_SIZE);

  // Sync mobile scroll position with active dot
  function handleMobileScroll() {
    const node = trackRef.current;
    if (!node || !node.children.length) return;
    const cardWidth = node.children[0].getBoundingClientRect().width + 16;
    if (cardWidth > 0) {
      const index = Math.round(node.scrollLeft / cardWidth);
      setMobileActiveIndex(Math.max(0, Math.min(allItems.length - 1, index)));
    }
  }

  function scrollToCard(index) {
    const node = trackRef.current;
    if (!node || !node.children[index]) return;
    const target = node.children[index];
    node.scrollTo({
      left: target.offsetLeft - node.offsetLeft,
      behavior: 'smooth',
    });
    setMobileActiveIndex(index);
  }

  function handlePrev() {
    if (window.matchMedia('(max-width: 768px)').matches) {
      scrollToCard(Math.max(0, mobileActiveIndex - 1));
    } else {
      setPage(p => Math.max(0, p - 1));
    }
  }

  function handleNext() {
    if (window.matchMedia('(max-width: 768px)').matches) {
      scrollToCard(Math.min(allItems.length - 1, mobileActiveIndex + 1));
    } else {
      setPage(p => Math.min(totalPages - 1, p + 1));
    }
  }

  return (
    <section className="section home-reviews specially-reviews-section" aria-labelledby="reviews-heading">
      <CurlDoodle />

      <div className="container">
        {/* Top Header Row matching mockup */}
        <div className="specially-header">
          {/* Main Title Block + Official Circular Seal */}
          <div className="specially-title-block">
            <h2 id="reviews-heading" className="specially-title">
              <span className="specially-title__row">
                Specially
                <span className="specially-lightbulb-box">
                  <LightbulbIcon />
                </span>
              </span>
              <span className="specially-title__line">features are</span>
              <span className="specially-title__line">only for you</span>
            </h2>

            {/* Official Circular Institute Seal stamped over the section */}
            <HeaderStamp />
          </div>

          {/* Right Action Block with Description & 3D Pill Button */}
          <div className="specially-action-block">
            <p className="specially-intro">
              With high social media impact levels, video content has become extremely popular among users.
              People of almost all age groups and interests have become used to video content.
            </p>

            <div className="specially-cta-row">
              <Link to="/programs" className="specially-pill-btn">
                View all course
              </Link>

              {/* View Switcher: Testimonials vs Mockup */}
              <div className="specially-view-toggles" role="tablist" aria-label="Content view">
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === 'testimonials'}
                  className={`specially-toggle-chip ${viewMode === 'testimonials' ? 'is-active' : ''}`}
                  onClick={() => {
                    setViewMode('testimonials');
                    setPage(0);
                    setMobileActiveIndex(0);
                    if (trackRef.current) trackRef.current.scrollTo({ left: 0, behavior: 'instant' });
                  }}
                >
                  Testimonials
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === 'mockup'}
                  className={`specially-toggle-chip ${viewMode === 'mockup' ? 'is-active' : ''}`}
                  onClick={() => {
                    setViewMode('mockup');
                    setPage(0);
                    setMobileActiveIndex(0);
                    if (trackRef.current) trackRef.current.scrollTo({ left: 0, behavior: 'instant' });
                  }}
                >
                  Mockup View
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 
          Cards Grid: 
          - On Desktop: 3-column paginated grid
          - On Mobile: Single row horizontal swipe track (vertically short, horizontally long)
        */}
        <div
          ref={trackRef}
          className="specially-grid"
          role="region"
          aria-label="Feature and testimonial cards"
          onScroll={handleMobileScroll}
        >
          {allItems.map((item, index) => {
            const isDesktopHidden =
              viewMode === 'testimonials' && Math.floor(index / PAGE_SIZE) !== page;

            return (
              <div
                className={`specially-card-wrapper ${isDesktopHidden ? 'specially-card-wrapper--hide-desktop' : ''}`}
                key={item.id}
              >
                {/* 1. Underlying sheet/desk blotter: The surface the card is stamped over */}
                <div className="specially-card-underlay" aria-hidden="true" />

                {/* 2. Main Stamped Card (vertically short & horizontally long on mobile) */}
                <article className="specially-card">
                  {/* Golden Corner Arcs */}
                  <CornerArcs />

                  {/* 3. Rubber Ink Stamp: Stamped Diagonally Over the Card */}
                  <CardStamp
                    color={item.stampColor}
                    main={item.stampMain}
                    sub={item.stampSub}
                  />

                  <div>
                    {/* Line art Icon */}
                    <div className="specially-card__icon-wrap">
                      {getIcon(item.iconType)}
                    </div>

                    {/* Card Title */}
                    <h3 className="specially-card__title">{item.title}</h3>

                    {/* Card Description / Review text */}
                    <p className="specially-card__text">{item.text}</p>
                  </div>

                  {/* Student Details Footer (shown for testimonials) */}
                  {item.name ? (
                    <div className="specially-card__foot">
                      <div className="specially-card__author">
                        <span className="specially-card__avatar" aria-hidden="true">
                          {item.name.charAt(0)}
                        </span>
                        <div className="specially-card__meta">
                          <span className="specially-card__name">{item.name}</span>
                          <span className="specially-card__role">{item.role}</span>
                        </div>
                      </div>
                      <div className="specially-card__stars" role="img" aria-label={`${item.rating} out of 5 stars`}>
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" aria-hidden="true" />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </article>
              </div>
            );
          })}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="specially-mobile-swipe-hint" aria-hidden="true">
          <span>Swipe left / right to read more</span>
          <ArrowRight size={13} />
        </div>

        {/* Navigation & Dots */}
        <nav className="specially-pagination" aria-label="Testimonials pagination">
          <button
            type="button"
            className="specially-nav-btn"
            onClick={handlePrev}
            aria-label="Previous testimonials"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Desktop Pagination Dots */}
          <div className="specially-dots specially-dots--desktop">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                className={`specially-dot ${page === i ? 'is-active' : ''}`}
                onClick={() => setPage(i)}
                aria-label={`Go to page ${i + 1}`}
                aria-current={page === i ? 'true' : 'false'}
              />
            ))}
          </div>

          {/* Mobile Swipe Dots (synced to every card in the row) */}
          <div className="specially-dots specially-dots--mobile">
            {allItems.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`specially-dot ${mobileActiveIndex === i ? 'is-active' : ''}`}
                onClick={() => scrollToCard(i)}
                aria-label={`Go to review ${i + 1}`}
                aria-current={mobileActiveIndex === i ? 'true' : 'false'}
              />
            ))}
          </div>

          <button
            type="button"
            className="specially-nav-btn"
            onClick={handleNext}
            aria-label="Next testimonials"
          >
            <ArrowRight size={18} />
          </button>
        </nav>
      </div>
    </section>
  );
}
