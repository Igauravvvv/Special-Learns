import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

/**
 * Student work gallery with a keyboard-accessible lightbox.
 *
 * Each tile is a real <button>, so it is reachable and operable by keyboard
 * without any extra wiring. Images are lazy-loaded and given explicit
 * dimensions to avoid layout shift.
 */
export default function Gallery({ items, columns }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const closeRef = useRef(null);
  const triggerRefs = useRef([]);

  const close = useCallback(() => {
    setActiveIndex((index) => {
      if (index !== null) triggerRefs.current[index]?.focus();
      return null;
    });
  }, []);

  const open = (index) => setActiveIndex(index);

  const step = useCallback(
    (delta) => {
      setActiveIndex((index) => {
        if (index === null) return index;
        return (index + delta + items.length) % items.length;
      });
    },
    [items.length],
  );

  // Lightbox keyboard support: Escape to close, arrows to navigate,
  // focus moved to the close button on open and restored to the tile.
  useEffect(() => {
    if (activeIndex === null) return undefined;

    closeRef.current?.focus();

    const onKeyDown = (event) => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          close();
          break;
        case 'ArrowRight':
          event.preventDefault();
          step(1);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          step(-1);
          break;
        case 'Tab': {
          const dialog = document.querySelector('.lightbox');
          const focusables = dialog?.querySelectorAll('button');
          if (!focusables?.length) break;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
          break;
        }
        default:
          break;
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeIndex, close, step]);

  const active = activeIndex === null ? null : items[activeIndex];

  return (
    <>
      <ul
        className="gallery"
        style={columns ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } : undefined}
      >
        {items.map((item, index) => (
          <li key={item.src}>
            <button
              type="button"
              className="gallery__item"
              ref={(node) => {
                triggerRefs.current[index] = node;
              }}
              onClick={() => open(index)}
              /*
               * The visible caption is repeated at the start of the
               * accessible name so the control satisfies WCAG "Label in
               * Name": what is announced must contain the text a sighted
               * user can actually see on it.
               */
              aria-label={`${item.caption} — view larger image`}
            >
              <img
                src={item.src}
                alt={item.alt}
                width="600"
                height="600"
                loading="lazy"
                decoding="async"
              />
              <span className="gallery__caption" aria-hidden="true">
                {item.caption}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {active ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${active.caption} — image ${activeIndex + 1} of ${items.length}`}
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <button
            type="button"
            className="lightbox__close"
            onClick={close}
            ref={closeRef}
            aria-label="Close image viewer"
          >
            <X size={22} aria-hidden="true" />
          </button>

          <figure className="lightbox__figure" style={{ margin: 0 }}>
            <img className="lightbox__img" src={active.src} alt={active.alt} />
            <figcaption className="lightbox__caption">
              {active.caption} — {active.tag}
              {items.length > 1 ? ` (${activeIndex + 1} of ${items.length})` : ''}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}
