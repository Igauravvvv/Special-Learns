import { useEffect, useRef, useState } from 'react';

/**
 * Thin reading-progress bar pinned to the bottom edge of the sticky header.
 *
 * Written with a rAF-throttled scroll listener and a CSS transform (no layout
 * properties) so it stays smooth on mobile. Ignored entirely under
 * prefers-reduced-motion, where the bar would be meaningless anyway.
 */
export default function ScrollProgress() {
  const barRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return undefined;

    const bar = barRef.current;
    if (!bar) return undefined;

    let frame = 0;
    let visible = false;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;

      if (scrollable <= 8) {
        bar.style.transform = 'scaleX(0)';
        return;
      }

      const ratio = Math.min(Math.max(window.scrollY / scrollable, 0), 1);
      bar.style.transform = `scaleX(${ratio})`;

      if (!visible && ratio > 0.01) {
        visible = true;
        setActive(true);
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      ref={barRef}
      className="scroll-progress"
      data-active={active}
      aria-hidden="true"
    />
  );
}
