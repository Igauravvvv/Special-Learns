/**
 * Student websites showcase.
 *
 * HOW TO ADD A STUDENT WEBSITE
 * ----------------------------
 * Add one object to `studentWebsites` below.
 *
 *   {
 *     title: 'Site Title',
 *     url: 'https://example.com',
 *     student: 'Student Name',
 *     course: 'Web Design & Development',
 *     blurb: 'Description of the site and tech stack.',
 *     screenshot: '/showcase/image.png',
 *   }
 */

export const studentWebsites = [
  {
    title: "Slug's Era",
    url: 'https://www.slugsera.com',
    student: 'Gaurav Bhatt',
    alumni: true,
    course: 'Web Design & Development',
    category: 'Streetwear & E-Commerce',
    blurb:
      'Independent streetwear & oversized apparel fashion brand storefront featuring custom lookbooks, responsive mobile shopping and cart checkout flow.',
    screenshot: '/showcase/slugsera.png',
    tags: ['E-Commerce', 'Fashion Brand', 'Responsive UI'],
  },
  {
    title: 'Rupali Construction & Homes',
    url: 'https://rupaliconstruction.com',
    student: 'Gaurav Bhatt',
    alumni: true,
    course: 'Web Design & Development',
    category: 'Real Estate & Architecture',
    blurb:
      'Full-service real estate and construction portal featuring property discovery, project catalogues, interactive filtering and mobile-first architecture.',
    screenshot: '/showcase/rupali-construction.png',
    tags: ['Corporate Portal', 'Property Showcase', 'Architecture'],
  },
  {
    title: 'AAW Aesthetic Wear',
    url: 'https://awaestheticwear.com',
    student: 'Gaurav Bhatt',
    alumni: true,
    course: 'Web Design & Development',
    category: 'Luxury Fashion & Apparel',
    blurb:
      'Contemporary fashion & luxury streetwear brand website with sleek dark styling, seasonal collections, dynamic product galleries and direct shopping.',
    screenshot: '/showcase/aesthetic-wear.png',
    tags: ['Streetwear', 'Dark Mode UI', 'Online Store'],
  },
];

/** Group entries by the course they came from, for filter chips. */
export function websitesByCourse() {
  const map = new Map();
  for (const site of studentWebsites) {
    const key = site.course ?? 'Other';
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(site);
  }
  return [...map.entries()].map(([course, items]) => ({ course, items }));
}

/**
 * Normalises a student-entered URL so links are always safe and consistent.
 * Rejects anything that is not plain http(s), which also stops `javascript:`
 * URLs ever reaching an href.
 */
export function safeUrl(url) {
  if (typeof url !== 'string' || url.trim() === '') return null;
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

/** Two-letter monogram used on the generated fallback tile. */
export function initials(title) {
  return String(title ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

/** Hostname, shown under the card title so visitors know where it leads. */
export function hostOf(url) {
  const safe = safeUrl(url);
  if (!safe) return '';
  return new URL(safe).hostname.replace(/^www\./, '');
}
