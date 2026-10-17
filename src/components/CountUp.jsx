import { useEffect, useRef, useState } from 'react';

const REDUCED = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const easeOutCubic = (t) => 1 - (1 - t) ** 3;

/**
 * Counts a figure up once, when it first scrolls into view.
 *
 * Used only for real, published numbers — never as a stand-in for a figure
 * that has not been verified. Respects prefers-reduced-motion by rendering the
 * final value immediately, and the real value is always present in the DOM for
 * assistive tech.
 */
export default function CountUp({
  value,
  duration = 1100,
  suffix = '',
  prefix = '',
  className = 'stat__value',
}) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);

  const target = Number(value);
  const isNumeric = Number.isFinite(target);

  useEffect(() => {
    const node = ref.current;
    if (!node || !isNumeric) return undefined;

    if (typeof IntersectionObserver === 'undefined' || REDUCED()) {
      setDisplay(target);
      return undefined;
    }

    let raf = 0;
    let stopped = false;

    const tick = (now) => {
      if (stopped) return;
      const start = tick.start ?? now;
      tick.start = start;
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(easeOutCubic(progress) * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    /*
     * rAF drives the tween, but it is suspended in hidden tabs. A timer runs
     * alongside it so the figure still lands on its real value when the tab is
     * backgrounded, instead of leaving a "0" on screen next to the
     * screen-reader value.
     */
    const startCounting = () => {
      if (tick.start) return;
      tick.start = null;

      const finish = () => {
        if (stopped) return;
        stopped = true;
        cancelAnimationFrame(raf);
        setDisplay(target);
      };

      tick.start = typeof performance !== 'undefined' ? performance.now() : 0;
      raf = requestAnimationFrame(tick);

      // Safety net for frozen animation frames.
      setTimeout(finish, duration + 200);
    };

    const inViewport = () => {
      const rect = node.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    };

    if (inViewport()) {
      startCounting();
      return () => {
        stopped = true;
        cancelAnimationFrame(raf);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startCounting();
      },
      { threshold: 0.4 },
    );

    const onScroll = () => {
      if (tick.start) return;
      if (inViewport()) startCounting();
    };

    observer.observe(node);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onScroll);

    return () => {
      observer.disconnect();
      stopped = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      document.removeEventListener('visibilitychange', onScroll);
    };
  }, [duration, target, isNumeric]);

  if (!isNumeric) {
    // Non-numeric values (e.g. "1–12") render as plain text, never animated.
    return (
      <span className={className}>
        {prefix}
        {value}
        {suffix}
      </span>
    );
  }

  return (
    <span className={className} ref={ref}>
      {/* The true value is always available to assistive tech. */}
      <span aria-hidden="true">
        {prefix}
        {display}
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {value}
        {suffix}
      </span>
    </span>
  );
}
