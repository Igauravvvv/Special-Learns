import { Link } from 'react-router-dom';

import { brand } from '../data/site.js';

/**
 * Logo lockup.
 *
 * `variant="full"` shows the institute's complete logo artwork, wordmark
 * included. `variant="mark"` pairs the emblem with the name set in type —
 * the responsive treatment, because the source emblem is a detailed square
 * that loses legibility when scaled below ~40px.
 */
export default function Logo({ variant = 'mark', tone = 'dark', to = '/', className = '', ...rest }) {
  const isFull = variant === 'full';
  const light = tone === 'light';

  const contents = isFull ? (
    <img
      className="logo__full"
      src={brand.logoFull}
      alt={`${brand.name} logo`}
      width="480"
      height="412"
      loading={isFull ? 'lazy' : undefined}
      decoding="async"
    />
  ) : (
    <>
      <img
        className="logo__mark"
        src={brand.logoMark}
        alt=""
        width={brand.logoMarkDims.width}
        height={brand.logoMarkDims.height}
        decoding="async"
      />
      <span className={`logo__name${light ? ' logo__name--light' : ''}`}>
        <span className="logo__name-main">Special Learns</span>
        {/* Explicit space: without it the two spans collapse to
            "Special LearnsInstitute", which then fails the WCAG
            "Label in Name" check against this link's aria-label. */}
        {' '}
        <span className="logo__name-sub">Institute</span>
      </span>
    </>
  );

  return (
    <Link
      to={to}
      className={`logo logo--${isFull ? 'full' : 'mark'} ${className}`.trim()}
      aria-label={`${brand.name}, home`}
      {...rest}
    >
      {contents}
    </Link>
  );
}
