import { useEffect } from 'react';
import { brand, SITE_URL } from '../data/site.js';

const ORIGIN = SITE_URL.replace(/\/$/, '');

/**
 * Sets the document title and per-page meta tags, and keeps the canonical
 * URL pointing at speciallearns.in for every route.
 *
 * This is a client-side app, so tags are updated imperatively rather than
 * through a templating layer. See README for the prerender recommendation.
 */
export default function Seo({ title, description, path = '/', image = '/og-image.svg', type = 'website' }) {
  useEffect(() => {
    // Only append the brand suffix when the title does not already carry it,
    // so pages never read "About X | X".
    const hasBrand = title.includes(brand.name) || title.includes(brand.shortName);
    const fullTitle = hasBrand ? title : `${title} | ${brand.name}`;
    document.title = fullTitle;

    const setMeta = (selector, attr, value) => {
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr.startsWith('http') ? 'property' : 'name', attr);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    setMeta('meta[name="description"]', 'name', description);
    setMeta('meta[property="og:title"]', 'property', fullTitle);
    setMeta('meta[property="og:description"]', 'property', description);
    setMeta('meta[property="og:type"]', 'property', type);
    setMeta('meta[property="og:url"]', 'property', `${ORIGIN}${path}`);
    setMeta('meta[property="og:image"]', 'property', `${ORIGIN}${image}`);
    setMeta('meta[name="twitter:title"]', 'name', fullTitle);
    setMeta('meta[name="twitter:description"]', 'name', description);
    setMeta('meta[name="twitter:image"]', 'name', `${ORIGIN}${image}`);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${ORIGIN}${path}`);
  }, [title, description, path, image, type]);

  return null;
}
