/**
 * Seamless looping ticker of course names.
 *
 * The list is duplicated and translated by exactly -50%, which is one full
 * copy width — so the loop is seamless. Pauses on hover and whenever the
 * keyboard is focused, and is hidden from assistive tech because the same
 * courses are listed properly elsewhere on the page.
 */

export default function Marquee({
  items,
  speed = 38, // seconds per loop
  reverse = false,
  label,
}) {
  const doubled = [...items, ...items];

  return (
    <div className="marquee" aria-hidden="true">
      <div
        className="marquee__track"
        style={{
          '--marquee-duration': `${speed}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {doubled.map((item, index) => (
          <span className="marquee__item" key={`${item}-${index}`}>
            {item}
            <span className="marquee__dot" aria-hidden="true" />
          </span>
        ))}
      </div>
      {label ? <span className="sr-only">{label}</span> : null}
    </div>
  );
}
