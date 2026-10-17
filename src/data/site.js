/**
 * Verified site-wide facts for Special Learns Institute.
 *
 * Everything in this file was taken from the institute's own website
 * (speciallearns.in) — address, phone numbers, email addresses, social
 * profiles, the founder's name and the published course list.
 *
 * Items marked TODO are genuine gaps in the source material. They are
 * deliberately left empty rather than filled with invented details.
 */

export const SITE_URL = 'https://speciallearns.in';

export const brand = {
  name: 'Special Learns Institute',
  shortName: 'Special Learns',
  /**
   * The institute's own logo artwork, taken from its website uploads.
   * `logoMark` is the emblem alone; `logoFull` includes the wordmark.
   * The navbar uses the mark beside a typeset name so the lockup stays
   * legible at small sizes.
   */
  logoMark: '/brand/logo-mark.png',
  logoFull: '/brand/logo-full.png',
  logoMarkDims: { width: 400, height: 400 },
  logoAlt: '',
  foundedBy: 'Saurabh Shukla',
  tagline: 'Dream more, learn more, become more.',
};

export const contact = {
  phones: [
    { label: '+91 85271 84745', href: 'tel:+918527184745' },
    { label: '+91 88106 88775', href: 'tel:+91810688775' },
  ],
  emails: [
    { label: 'info@speciallearns.in', href: 'mailto:info@speciallearns.in' },
    { label: 'speciallearns@gmail.com', href: 'mailto:speciallearns@gmail.com' },
  ],
  address: {
    line1: 'K-3, Mohan Garden, 40 Feet Road',
    line2: 'Near R.P Memorial School, Uttam Nagar',
    city: 'New Delhi',
    postcode: '110059',
    country: 'India',
  },
  /** No verified map coordinates were published, so we link to a search. */
  mapSearchUrl:
    'https://www.google.com/maps/search/?api=1&query=Special+Learns+Institute+Mohan+Garden+Uttam+Nagar+New+Delhi',
};

export const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/speciallearns/', icon: 'instagram' },
  { label: 'Facebook', href: 'https://www.facebook.com/speciallearns', icon: 'facebook' },
  { label: 'X (Twitter)', href: 'https://twitter.com/LearnsSpecial', icon: 'twitter' },
];

/**
 * The institute's own published vision statement, lightly tidied for the web.
 */
export const vision =
  'We aim to inspire our students to dream more, learn more and become more in their respective journeys of life.';

/**
 * Source for the hero paragraph — a rewritten version of the institute's
 * "Learning Begins With Us" copy. Same meaning, cleaner English.
 */
export const heroIntro =
  'Special Learns Institute provides supportive, practical computer education from Uttam Nagar, New Delhi. Our aim is to give learners the skills, confidence and independence to create their own destinations.';

export const mission =
  'We teach the way people actually learn — hands-on, at a comfortable pace, and with real tools. Whether it is a first computer course, a diploma in accounting or a career in design, every learner gets personal attention and work they are proud of.';

/**
 * Verified, countable facts derived directly from the published course list.
 * No estimate or marketing inflation.
 */
export const facts = {
  computerCourses: 38,
  courseCategories: 6,
  /** TODO: the site published enrolment/staff counters but left them at 0.
   *  They have been removed here rather than replaced with invented figures. */
};

export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Computer Courses', to: '/programs' },
  { label: 'Student Work', to: '/student-work' },
  { label: 'Contact', to: '/contact' },
];

export const footerNav = [
  { label: 'Home', to: '/' },
  { label: 'About us', to: '/about' },
  { label: 'Computer courses', to: '/programs' },
  { label: 'Student work', to: '/student-work' },
  { label: 'Contact', to: '/contact' },
];

export const legalLinks = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms of Use', to: '/terms' },
];

export const copyrightYear = new Date().getFullYear();
