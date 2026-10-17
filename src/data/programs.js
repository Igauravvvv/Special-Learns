/**
 * The institute's published computer course list, grouped into six
 * categories. Course titles and module lists are reproduced from
 * speciallearns.in (typos corrected, nothing added or removed).
 *
 * `summary` lines are written to describe exactly what the listed modules
 * cover — they make no claims about duration, fees or outcomes.
 */

export const categories = [
  {
    slug: 'computer-fundamentals',
    title: 'Computer Fundamentals',
    tagline: 'Start here',
    icon: 'monitor',
    accent: 'mint',
    description:
      'Build a confident working foundation on a computer — from finding your way around Windows to producing polished documents, spreadsheets and presentations.',
    outcomes: [
      'Navigate the Windows desktop, folders and files without help',
      'Produce properly formatted documents in MS Word',
      'Build and format worksheets, formulas and charts in Excel',
      'Build and deliver presentations in MS PowerPoint',
      'Understand the internet, email and online safety essentials',
    ],
  },
  {
    slug: 'accounting-erp',
    title: 'Accounting & Office Automation',
    tagline: 'For office and finance work',
    icon: 'calculator',
    accent: 'yellow',
    description:
      'Practical accounting and office systems used every day in Indian business — Tally, advanced Excel, MIS reporting and VBA automation.',
    outcomes: [
      'Handle company data in Tally ERP 9.0 and Tally Prime',
      'Manage accounting records and generate reports',
      'Build advanced Excel models, charts and protected workbooks',
      'Automate repetitive spreadsheet tasks with VBA',
      'Prepare management information system (MIS) reports',
    ],
  },
  {
    slug: 'graphic-design-vfx',
    title: 'Graphic Design, Publishing & VFX',
    tagline: 'Create and publish',
    icon: 'palette',
    accent: 'cream',
    description:
      'Design and motion courses for print, branding and screen — CorelDraw, Photoshop, Illustrator, InDesign, Lightroom, Premiere Pro and After Effects.',
    outcomes: [
      'Design for print with CorelDraw, InDesign, Illustrator and Photoshop',
      'Prepare and edit photographs in Lightroom',
      'Edit video in Premiere Pro',
      'Add motion graphics and effects in After Effects',
      'Publish finished desktop publications and creative work',
    ],
  },
  {
    slug: 'web-design-development',
    title: 'Web Design & Development',
    tagline: 'Build for the web',
    icon: 'code',
    accent: 'mint',
    description:
      'From your first HTML page through to WordPress, e-commerce and server-side PHP — a complete path to building real websites.',
    outcomes: [
      'Write valid HTML5 and style it with CSS3 and Bootstrap',
      'Add interactivity with JavaScript and jQuery',
      'Build and customise WordPress themes',
      'Work with PHP and MySQL on the server side',
      'Set up e-commerce with Magento and build shopping sites',
    ],
  },
  {
    slug: 'programming',
    title: 'Programming',
    tagline: 'Learn to code',
    icon: 'terminal',
    accent: 'cream',
    description:
      'Learn programming languages with hands-on practice, from C and C++ through Java, Python, PHP and Android development with Dart.',
    outcomes: [
      'Write and debug programs in C and C++',
      'Build applications with Java',
      'Work with Python for modern scripting and app development',
      'Build dynamic sites with PHP',
      'Develop Android apps using Dart and Android Studio',
    ],
  },
  {
    slug: 'digital-marketing',
    title: 'Digital Marketing',
    tagline: 'Be found online',
    icon: 'megaphone',
    accent: 'yellow',
    description:
      'Learn how to promote a business or a service online — search engine optimisation, social media optimisation and wider digital marketing practice.',
    outcomes: [
      'Plan and run digital marketing campaigns',
      'Improve visibility in search engines with SEO',
      'Optimise social media presence with SMO',
      'Understand audiences, content and measurement',
    ],
  },
];

/** Flat list of all 38 published courses. */
export const courses = [
  // --- Computer Fundamentals ---------------------------------------------
  {
    slug: 'basic-computer',
    title: 'Basic Computer',
    category: 'computer-fundamentals',
    duration: 'TODO',
    level: 'Beginner',
    summary:
      'The essential starting point. Get comfortable with a computer from the very first session and leave able to work with documents, spreadsheets and the internet confidently.',
    modules: [
      'Operating System — Windows',
      'Microsoft Word — Professional Level',
      'MS Excel',
      'Internet Concepts',
    ],
  },
  {
    slug: 'ms-office',
    title: 'MS-Office',
    category: 'computer-fundamentals',
    level: 'Beginner',
    summary:
      'Master the complete Microsoft Office suite used in almost every workplace, with intermediate and advanced Excel practice included.',
    modules: [
      'Microsoft Word — Professional Level',
      'MS Excel Training (Intermediate and Advanced)',
      'MS PowerPoint',
      'MS Access',
    ],
  },
  {
    slug: 'ms-word',
    title: 'MS-Word',
    category: 'computer-fundamentals',
    level: 'Beginner',
    summary:
      'Professional-level word processing: styling, page layout, tables, references and practical document production.',
    modules: ['Microsoft Word — Professional Level'],
  },
  {
    slug: 'ms-excel',
    title: 'MS-Excel',
    category: 'computer-fundamentals',
    level: 'Beginner',
    summary:
      'Spreadsheet fundamentals through to intermediate and advanced work in formulas, formatting and analysis.',
    modules: ['MS Excel Training (Intermediate and Advanced)'],
  },
  {
    slug: 'ms-powerpoint',
    title: 'MS-PowerPoint',
    category: 'computer-fundamentals',
    level: 'Beginner',
    summary:
      'Build clear, confident presentations with proper structure, consistent design and effective use of visuals.',
    modules: ['MS PowerPoint'],
  },
  {
    slug: 'professional-excel',
    title: 'Professional Excel',
    category: 'computer-fundamentals',
    level: 'Advanced',
    summary:
      'A deeper course for people who use Excel for real work — advanced functions, techniques, charting and securing your files.',
    modules: [
      'Basic Excel',
      'Advanced Excel',
      'Advanced Excel: Formulas & Functions',
      'Advanced Excel: Features & Techniques',
      'Advanced Excel: Advanced Chart Techniques',
      'Advanced Excel Security',
    ],
  },

  // --- Accounting & Office Automation ------------------------------------
  {
    slug: 'financial-accounting',
    title: 'Financial Accounting',
    category: 'accounting-erp',
    level: 'Intermediate',
    summary:
      'Learn the accounting software and advanced spreadsheet skills that finance and office roles use every day.',
    modules: [
      'Operating System — Windows',
      'Microsoft Word — Professional Level',
      'MS Excel',
      'Internet Concepts',
      'Accounting — Tally ERP 9.0 and Tally Prime',
      'Advanced Excel',
    ],
  },
  {
    slug: 'tally-erp-prime',
    title: 'Tally ERP 9.0 & Tally Prime',
    category: 'accounting-erp',
    level: 'Intermediate',
    summary:
      'A focused course on India’s most widely used accounting package — company setup, vouchers, inventory, GST-era billing and reporting.',
    modules: ['Tally ERP 9.0', 'Tally Prime'],
  },
  {
    slug: 'diploma-financial-accounting',
    title: 'Diploma in Financial Accounting',
    category: 'accounting-erp',
    level: 'Diploma',
    summary:
      'A complete accounting qualification, combining Tally and advanced Excel with management information systems and VBA automation.',
    modules: [
      'Operating System — Windows',
      'Microsoft Word — Professional Level',
      'MS Excel',
      'Internet Concepts',
      'Accounting — Tally ERP 9.0 and Tally Prime',
      'Advanced Excel',
      'MIS (Management Information System)',
      'VBA (Visual Basic for Applications)',
    ],
  },
  {
    slug: 'diploma-computer-application',
    title: 'Diploma in Computer Application',
    category: 'accounting-erp',
    level: 'Diploma',
    summary:
      'A broad computer application diploma covering office fundamentals, design software, accounting and the foundations of programming.',
    modules: [
      'Operating System — Windows',
      'Microsoft Word — Professional Level',
      'MS Excel',
      'Internet Concepts',
      'Designing Software — CorelDraw, InDesign, Photoshop',
      'Accounting and Programming — Tally ERP 9.0, C, C++, HTML, CSS',
    ],
  },
  {
    slug: 'mis',
    title: 'MIS',
    category: 'accounting-erp',
    level: 'Advanced',
    summary:
      'Management Information Systems — turning spreadsheet data into reports that actually help a business make decisions.',
    modules: [
      'Basic Excel',
      'Advanced Excel',
      'Advanced Excel: Formulas & Functions',
      'Advanced Excel: Features & Techniques',
      'Advanced Excel: Advanced Chart Techniques',
      'Advanced Excel Security',
      'Macros',
    ],
  },
  {
    slug: 'vba',
    title: 'VBA',
    category: 'accounting-erp',
    level: 'Advanced',
    summary:
      'Visual Basic for Applications — learn to automate repetitive spreadsheet and reporting work instead of doing it by hand.',
    modules: ['Visual Basic for Applications (VBA)', 'Macros'],
  },

  // --- Graphic Design, Publishing & VFX ----------------------------------
  {
    slug: 'graphic-designing',
    title: 'Graphic Designing',
    category: 'graphic-design-vfx',
    level: 'Intermediate',
    summary:
      'A practical design course covering the industry-standard creative suite, from page layout and photo editing to vector illustration.',
    modules: [
      'Corel Draw',
      'InDesign',
      'Photoshop',
      'Illustrator',
      'Page Maker',
    ],
  },
  {
    slug: 'desktop-publishing',
    title: 'Desktop Publishing',
    category: 'graphic-design-vfx',
    level: 'Beginner',
    summary:
      'A complete first course in publishing — computer basics through to producing designed documents with CorelDraw, InDesign and Photoshop.',
    modules: [
      'Operating System — Windows',
      'Microsoft Word — Professional Level',
      'MS Excel',
      'Internet Concepts',
      'Designing Software — CorelDraw, InDesign, Photoshop',
    ],
  },
  {
    slug: 'diploma-graphic-designing-vfx',
    title: 'Diploma in Graphic Designing & VFX',
    category: 'graphic-design-vfx',
    level: 'Diploma',
    summary:
      'Design plus motion in one programme — a full graphic design curriculum followed by video editing and visual effects.',
    modules: [
      'Corel Draw',
      'InDesign',
      'Photoshop',
      'Illustrator',
      'Page Maker',
      'Special Effects',
      'Premiere Pro',
      'After Effects',
    ],
  },
  {
    slug: 'corel-draw',
    title: 'Corel Draw',
    category: 'graphic-design-vfx',
    level: 'Beginner',
    summary:
      'Vector illustration and page layout for logos, brochures and print-ready artwork.',
    modules: ['Corel Draw'],
  },
  {
    slug: 'photoshop',
    title: 'Photoshop',
    category: 'graphic-design-vfx',
    level: 'Beginner',
    summary:
      'Image editing, retouching and compositing — the industry standard for digital design work.',
    modules: ['Photoshop'],
  },
  {
    slug: 'illustrator',
    title: 'Illustrator',
    category: 'graphic-design-vfx',
    level: 'Intermediate',
    summary:
      'Precise vector artwork for logos, icons and print, with clean control over shapes, type and colour.',
    modules: ['Illustrator'],
  },
  {
    slug: 'indesign',
    title: 'InDesign',
    category: 'graphic-design-vfx',
    level: 'Intermediate',
    summary:
      'Professional page layout for magazines, brochures and long-form publications.',
    modules: ['InDesign'],
  },
  {
    slug: 'lightroom',
    title: 'Lightroom',
    category: 'graphic-design-vfx',
    level: 'Beginner',
    summary:
      'Organise, adjust and prepare large photo libraries for consistent, professional results.',
    modules: ['Lightroom'],
  },
  {
    slug: 'after-effects',
    title: 'After Effects',
    category: 'graphic-design-vfx',
    level: 'Intermediate',
    summary:
      'Motion graphics and visual effects — titles, animation and compositing for video, web and broadcast.',
    modules: ['After Effects'],
  },
  {
    slug: 'premiere-pro',
    title: 'Premiere Pro',
    category: 'graphic-design-vfx',
    level: 'Intermediate',
    summary:
      'Professional video editing — cut, sequence and finish footage for social media, events and digital content.',
    modules: ['Premiere Pro'],
  },

  // --- Web Design & Development ------------------------------------------
  {
    slug: 'diploma-web-design-development',
    title: 'Diploma in Website Designing & Development',
    category: 'web-design-development',
    level: 'Diploma',
    summary:
      'A full web development diploma — design front-ends, build dynamic sites, and manage WordPress and PHP/MySQL projects.',
    modules: [
      'Web Designing — CorelDraw, Photoshop, HTML/HTML5, CSS/CSS3, Bootstrap 3 & 4',
      'Web Development — JavaScript & jQuery, WordPress, Theme Customisation, PHP & MySQL',
    ],
  },
  {
    slug: 'html-html5',
    title: 'HTML / HTML5',
    category: 'web-design-development',
    level: 'Beginner',
    summary:
      'Write the structure of every web page and learn the semantic elements of modern HTML5.',
    modules: ['HTML / HTML5'],
  },
  {
    slug: 'css-css3',
    title: 'CSS / CSS3',
    category: 'web-design-development',
    level: 'Beginner',
    summary:
      'Style web pages from scratch and build responsive layouts with modern CSS.',
    modules: ['CSS / CSS3'],
  },
  {
    slug: 'javascript',
    title: 'JavaScript',
    category: 'web-design-development',
    level: 'Intermediate',
    summary:
      'Add behaviour and interactivity to web pages and build the interactive parts users expect.',
    modules: ['JavaScript', 'jQuery'],
  },
  {
    slug: 'php',
    title: 'PHP',
    category: 'web-design-development',
    level: 'Intermediate',
    summary:
      'Server-side development — connect websites to databases and build dynamic, data-driven applications.',
    modules: ['PHP', 'MySQL'],
  },
  {
    slug: 'wordpress',
    title: 'WordPress',
    category: 'web-design-development',
    level: 'Intermediate',
    summary:
      'Build and maintain websites on the world’s most popular CMS, including theme customisation.',
    modules: ['WordPress', 'Theme Customisation'],
  },
  {
    slug: 'magento',
    title: 'Magento',
    category: 'web-design-development',
    level: 'Advanced',
    summary:
      'Set up and manage a full e-commerce store — catalogue, checkout and online selling.',
    modules: ['Magento'],
  },
  {
    slug: 'shopping-site',
    title: 'Shopping Site',
    category: 'web-design-development',
    level: 'Intermediate',
    summary:
      'A project-led course in building a complete shopping website from catalogue to checkout.',
    modules: ['Shopping Site Development', 'E-commerce Fundamentals'],
  },

  // --- Programming --------------------------------------------------------
  {
    slug: 'programming',
    title: 'Programming',
    category: 'programming',
    level: 'Intermediate',
    summary:
      'A broad programming course spanning web, desktop, systems and mobile languages — the fundamentals applied across five languages.',
    modules: ['PHP', 'C & C++', 'Java', 'Python', 'Dart / Android Studio'],
  },
  {
    slug: 'python',
    title: 'Python',
    category: 'programming',
    level: 'Beginner',
    summary:
      'One of the most widely used languages today, learned through writing real programs from the first lesson.',
    modules: ['Python'],
  },
  {
    slug: 'java',
    title: 'Java',
    category: 'programming',
    level: 'Intermediate',
    summary:
      'A strongly typed, object-oriented language used for desktop, web and Android applications.',
    modules: ['Java'],
  },
  {
    slug: 'c-cpp',
    title: 'C, C++',
    category: 'programming',
    level: 'Intermediate',
    summary:
      'The foundation languages of computing — learn memory, logic and structure the way professionals were taught.',
    modules: ['C', 'C++'],
  },
  {
    slug: 'dart-android-studio',
    title: 'Dart / Android Studio',
    category: 'programming',
    level: 'Intermediate',
    summary:
      'Build real mobile applications for Android using Dart and Android Studio.',
    modules: ['Dart', 'Android Studio'],
  },

  // --- Digital Marketing --------------------------------------------------
  {
    slug: 'digital-marketing',
    title: 'Digital Marketing',
    category: 'digital-marketing',
    level: 'Intermediate',
    summary:
      'A practical introduction to promoting a business or service online, including search, social and content strategy.',
    modules: ['Digital Marketing Strategy', 'Content & Campaign Planning', 'Measuring Results'],
  },
  {
    slug: 'seo',
    title: 'SEO',
    category: 'digital-marketing',
    level: 'Intermediate',
    summary:
      'Search engine optimisation — how to make a website findable in Google through on-page work, content and technical fixes.',
    modules: ['On-Page SEO', 'Technical SEO', 'Content for Search'],
  },
  {
    slug: 'smo',
    title: 'SMO',
    category: 'digital-marketing',
    level: 'Intermediate',
    summary:
      'Social media optimisation — build and run profiles and campaigns that reach the right audience.',
    modules: ['Social Media Optimisation', 'Social Content Strategy'],
  },
];

/* ---- Lookups ----------------------------------------------------------- */

const categoryMap = new Map(categories.map((c) => [c.slug, c]));

export function getCategory(slug) {
  return categoryMap.get(slug) ?? null;
}

export function getCourse(slug) {
  return courses.find((c) => c.slug === slug) ?? null;
}

export function getCoursesByCategory(categorySlug) {
  return courses.filter((c) => c.category === categorySlug);
}

export function getRelatedCourses(course, limit = 3) {
  const sameCategory = courses.filter(
    (c) => c.category === course.category && c.slug !== course.slug,
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  // Top up from other categories so the section is never left short.
  const others = courses.filter(
    (c) => c.category !== course.category && c.slug !== course.slug,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function countByCategory() {
  const counts = new Map(categories.map((c) => [c.slug, 0]));
  for (const course of courses) {
    counts.set(course.category, (counts.get(course.category) ?? 0) + 1);
  }
  return counts;
}
