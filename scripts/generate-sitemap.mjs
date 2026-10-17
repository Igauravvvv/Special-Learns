/**
 * Generates public/sitemap.xml from the site's real route data, so the
 * sitemap can never drift out of sync with the courses that exist.
 *
 * Run with:  npm run sitemap
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

const { categories, courses } = await import(
  pathToFileURL(join(root, 'src', 'data', 'programs.js')).href
);

const ORIGIN = 'https://speciallearns.in';
const today = new Date().toISOString().slice(0, 10);

const staticRoutes = [
  ['/', '1.0', 'weekly'],
  ['/programs', '0.9', 'weekly'],
  ['/student-work', '0.7', 'monthly'],
  ['/about', '0.7', 'monthly'],
  ['/faq', '0.5', 'monthly'],
  ['/contact', '0.8', 'monthly'],
  ['/privacy-policy', '0.2', 'yearly'],
  ['/terms', '0.2', 'yearly'],
];

const urls = [
  ...staticRoutes.map(([path, priority, freq]) => ({
    loc: ORIGIN + path,
    priority,
    freq,
  })),
  ...categories.map((c) => ({
    loc: `${ORIGIN}/programs/${c.slug}`,
    priority: '0.7',
    freq: 'monthly',
  })),
  ...courses.map((c) => ({
    loc: `${ORIGIN}/courses/${c.slug}`,
    priority: '0.6',
    freq: 'monthly',
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

const out = join(root, 'public', 'sitemap.xml');
writeFileSync(out, xml);

console.log(
  `sitemap.xml written with ${urls.length} URLs (${categories.length} course areas, ${courses.length} courses)`,
);
