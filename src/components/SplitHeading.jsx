import { Fragment, useEffect, useRef, useState } from 'react';

import { nextFrame } from '../utils/frame.js';

const REDUCED = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Heading that animates in word by word.
 *
 * Each word is wrapped in a span that rises and fades on a short stagger, so a
 * headline reads as though it is being written rather than simply appearing.
 * Words are wrapped in <span> inside the element the caller chose, which
 * preserves the heading level and keeps the text selectable and copyable.
 *
 * Reduced motion is handled twice on purpose: in CSS (so it holds even if this
 * component is never observed) and here in JS (so words are never left at
 * opacity 0 waiting for an intersection that will not drive a transition).
 */
export default function SplitHeading({
  as: Tag = 'h2',
  text,
  className = '',
  delay = 0,
  step = 55,
  children,
  ...rest
}) {
  const words = String(text).split(' ');
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === 'undefined' || REDUCED()) {
      setStarted(true);
      return undefined;
    }

    let done = false;
    let pending = null;

    const markStarted = () => {
      if (done) return;
      done = true;
      if (pending) {
        pending();
        pending = null;
      }
      setStarted(true);
      teardown();
    };

    const inViewport = () => {
      const rect = node.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) markStarted();
      },
      { threshold: 0.2 },
    );

    // Backstop: IO can miss a page loaded in a background tab, which would
    // leave every word stuck at opacity 0.
    const onScroll = () => {
      if (done || pending) return;
      pending = nextFrame(() => {
        pending = null;
        if (inViewport()) markStarted();
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

    if (inViewport()) markStarted();

    return () => {
      if (pending) pending();
      teardown();
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`split-head${started ? ' is-started' : ''}${className ? ` ${className}` : ''}`}
      {...rest}
    >
      {words.map((word, index) => (
        /*
         * The space must sit BETWEEN the word spans as its own text node.
         * Putting it inside an inline-block span would collapse it against the
         * next span, so the words would render run together as one string.
         */
        <Fragment key={`${word}-${index}`}>
          <span
            className="split-head__word"
            style={{ '--word-delay': `${delay + index * step}ms` }}
          >
            {word}
          </span>
          {index < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
      {children}
    </Tag>
  );
}
