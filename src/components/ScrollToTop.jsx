import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Restores scroll position on navigation and honours in-page hash links.
 *
 * Hash targets are scrolled by the browser only on a fresh load, so route
 * changes to a URL carrying a hash need to be handled here.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait a frame so the target exists after a route render.
      const frame = requestAnimationFrame(() => {
        const target = document.getElementById(hash.slice(1));
        if (!target) return;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Move keyboard focus too, so the skip is announced.
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
      return () => cancelAnimationFrame(frame);
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    return undefined;
  }, [pathname, hash]);

  return null;
}
