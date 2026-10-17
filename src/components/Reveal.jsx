import { useEffect, useRef, useState } from 'react';

import { nextFrame } from '../utils/frame.js';

const REDUCED = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Scroll-triggered entrance animation.
 *
 * IntersectionObserver is the primary trigger, backed up by a throttled
 * scroll/resize check. IO alone is not enough: it does not reliably fire for a
 * page loaded in a background or occluded tab, and a missed callback would
 * leave the content stuck at opacity 0 — invisible to sighted users while
 * still present in the accessibility tree.
 *
 * The backstop removes itself as soon as the element has been revealed.
 */
export default function Reveal({
  as: Tag = 'div',
  delay = 0,
  variant = 'up', // up | fade | scale | left | right | blur
  className = '',
  children,
  ...rest
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === 'undefined' || REDUCED()) {
      setVisible(true);
      return undefined;
    }

    let revealed = false;
    let pending = null;

    const markRevealed = () => {
      if (revealed) return;
      revealed = true;
      if (pending) {
        pending();
        pending = null;
      }
      setVisible(true);
      teardown();
    };

    const inViewport = () => {
      const rect = node.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    };

    // Fire a touch before the element is fully on screen so motion overlaps
    // the scroll rather than trailing behind it.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) markRevealed();
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.04 },
    );

    const onScroll = () => {
      if (revealed || pending) return;
      pending = nextFrame(() => {
        pending = null;
        if (inViewport()) markRevealed();
      });
    };

    const teardown = () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      document.removeEventListener('visibilitychange', onScroll);
    };

    observer.observe(node);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onScroll);

    // Already on screen at load? Reveal immediately, no observer needed.
    if (inViewport()) markRevealed();

    // Safety fallback: reveal after 200ms so content is never stuck at opacity 0
    const safetyTimer = setTimeout(markRevealed, 200);

    return () => {
      clearTimeout(safetyTimer);
      if (pending) pending();
      teardown();
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${variant}${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      style={delay ? { '--reveal-delay': `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
