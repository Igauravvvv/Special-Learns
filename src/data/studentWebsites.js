/**
 * Student websites showcase.
 *
 * HOW TO ADD A STUDENT WEBSITE
 * ----------------------------
 * Add one object to `studentWebsites` below. Nothing else needs changing —
 * the section, the grid and the empty state all read from this file.
 *
 *   {
 *     title: 'My Recipes Blog',
 *     url: 'https://example.com',        // must include https://
 *     student: 'Aarav Sharma',           // optional, omit if you'd rather not name them
 *     course: 'Web Design & Development', // must match a course title in programs.js
 *     blurb: 'A responsive recipe site built with HTML, CSS and JavaScript.',
 *     screenshot: '/showcase/recipes.jpg', // optional — falls back to a generated tile
 *   }
 *
 * Notes
 * -----
 * - `screenshot` is optional. Without it the card shows a generated tile with
 *   the site's initial, so you can publish entries immediately.
 * - Put screenshots in `public/showcase/` and use a path starting `/showcase/`.
 * - No entries are listed yet, because none have been supplied. The section
 *   renders an honest empty state until you add the first one.
 */

export const studentWebsites = [
  // {
  //   title: 'My Recipes Blog',
  //   url: 'https://example.com',
  //   student: 'Aarav Sharma',
  //   course: 'Web Design & Development',
  //   blurb: 'A responsive recipe site built with HTML, CSS and JavaScript.',
  //   screenshot: '/showcase/recipes.jpg',
  // },
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
