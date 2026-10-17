/**
 * Hand-drawn doodle library.
 *
 * Every motif is original SVG drawn in a loose, marker-like style: open
 * paths, slightly irregular curves and round caps, so they read as sketched
 * rather than geometric. All are decorative and hidden from assistive tech.
 *
 * Usage:  <DoodleStar color="#FFC72C" size={28} />
 *         <Doodle.Arrow bottom={0} left={40} />
 */

const S = {
  fill: 'none',
  cap: 'round',
  join: 'round',
};

/* -------------------------------------------------------------------------- */
/* Primary motifs                                                             */
/* -------------------------------------------------------------------------- */

/** Five-point sparkle — the workhorse doodle. */
export function DoodleStar({ size = 28, color = '#FFC72C', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden focusable="false" style={style}>
      <path
        d="M16 2.6c.7 6.4 2.6 9.4 9 10.9-6.4 1.5-8.3 4.5-9 10.9-.7-6.4-2.6-9.4-9-10.9C13.4 12 15.3 9 16 2.6Z"
        fill={color}
      />
    </svg>
  );
}

/** Four-point sparkle with a soft centre — used for highlights. */
export function DoodleSparkle({ size = 22, color = '#FFC72C', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden focusable="false" style={style}>
      <path
        d="M12 .8c.9 5.6 3 7.7 8.6 8.6-5.6.9-7.7 3-8.6 8.6-.9-5.6-3-7.7-8.6-8.6C9 8.5 11.1 6.4 12 .8Z"
        fill={color}
      />
    </svg>
  );
}

/** Curved hand-drawn arrow. `rotate` points it in a new direction. */
export function DoodleArrow({ size = 56, color = '#FFC72C', rotate = 0, style }) {
  return (
    <svg
      width={size}
      height={size * 0.62}
      viewBox="0 0 70 44"
      aria-hidden
      focusable="false"
      style={{ ...style, transform: style?.transform ? `${style.transform} rotate(${rotate}deg)` : `rotate(${rotate}deg)` }}
    >
      <path
        d="M4 33c9-17 24-23 40-19"
        {...S}
        stroke={color}
        strokeWidth="3.4"
      />
      <path
        d="M36 5.5 46.5 14 34.6 19.5"
        {...S}
        stroke={color}
        strokeWidth="3.4"
      />
    </svg>
  );
}

/** Springy two-loop squiggle. */
export function DoodleSquiggle({ width = 60, color = '#FF8A65', style }) {
  return (
    <svg width={width} height={width * 0.38} viewBox="0 0 64 24" aria-hidden focusable="false" style={style}>
      <path
        d="M4 15.5C9 4 14 4 18 15s9 11.5 13 0 9-11.5 13 0 9 11.5 13 0"
        {...S}
        stroke={color}
        strokeWidth="3.2"
      />
    </svg>
  );
}

/** Loose marker underline that sits under a heading. */
export function DoodleUnderline({ width = 190, color = '#FFC72C', style }) {
  return (
    <svg
      width={width}
      height={16}
      viewBox="0 0 200 16"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
      style={style}
    >
      {/* Two overlapping strokes give it weight, like a real marker swipe. */}
      <path d="M4 10.5C38 4 66 12 100 8.5s70 5 96 2.5" {...S} stroke={color} strokeWidth="6.5" opacity="0.95" />
      <path d="M10 13c32-4 58 1 90-2s62 2 88 0" {...S} stroke={color} strokeWidth="2.6" opacity="0.5" />
    </svg>
  );
}

/** Sketchy open circle. */
export function DoodleRing({ size = 20, color = '#C8F0E2', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden focusable="false" style={style}>
      <path d="M12 2.6c5.3-.4 9.3 3.4 9.6 8.8.3 5.5-3.3 9.7-8.8 10C7 21.7 2.6 18 2.3 12.6 2 7 5.8 3 12 2.6Z" {...S} stroke={color} strokeWidth="3" />
    </svg>
  );
}

/** Radiating burst — the "attention" motif. */
export function DoodleBurst({ size = 46, color = '#F0A83C', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden focusable="false" style={style}>
      <g stroke={color} strokeWidth="3.2" {...S}>
        <path d="M24 3.5v9.5" />
        <path d="M24 35v9.5" />
        <path d="M3.5 24H13" />
        <path d="M35 24h9.5" />
        <path d="M9.6 9.6 16 16" />
        <path d="M32 32l6.4 6.4" />
        <path d="M38.4 9.6 32 16" />
        <path d="M16 32l-6.4 6.4" />
      </g>
    </svg>
  );
}

/** Rosette / flower shape from the reference language. */
export function DoodleFlower({ size = 34, color = '#FFB894', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden focusable="false" style={style}>
      <g fill={color} opacity="0.9">
        <ellipse cx="20" cy="9" rx="6.5" ry="8.5" />
        <ellipse cx="20" cy="31" rx="6.5" ry="8.5" />
        <ellipse cx="9" cy="20" rx="8.5" ry="6.5" />
        <ellipse cx="31" cy="20" rx="8.5" ry="6.5" />
      </g>
      <circle cx="20" cy="20" r="5.5" fill="#FFC72C" />
    </svg>
  );
}

/** Zigzag lightning mark. */
export function DoodleLightning({ size = 26, color = '#FFC72C', style }) {
  return (
    <svg width={size * 0.62} height={size} viewBox="0 0 22 36" aria-hidden focusable="false" style={style}>
      <path
        d="M13.5 2 4 20h6.5L7.5 34 18 15h-6.5L13.5 2Z"
        fill={color}
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Sweeping swoosh, like a brush stroke. */
export function DoodleSwoosh({ width = 90, color = '#93DFC7', style }) {
  return (
    <svg width={width} height={width * 0.3} viewBox="0 0 100 30" aria-hidden focusable="false" style={style}>
      <path d="M3 22C20 6 44 4 97 11" {...S} stroke={color} strokeWidth="5.5" opacity="0.85" />
      <path d="M6 26C26 11 50 9 94 15" {...S} stroke={color} strokeWidth="2.4" opacity="0.45" />
    </svg>
  );
}

/** Small sketch triangle — playful filler. */
export function DoodleTriangle({ size = 26, color = '#4747D7', style }) {
  return (
    <svg width={size} height={size * 0.88} viewBox="0 0 30 26" aria-hidden focusable="false" style={style}>
      <path d="M15 2.5 28 24H2.5Z" {...S} stroke={color} strokeWidth="2.8" />
      <path d="M15 6 24.5 22.5H6.2Z" {...S} stroke={color} strokeWidth="1.4" opacity="0.45" />
    </svg>
  );
}

/** Stack of three sketch lines — a small "list" motif. */
export function DoodleLines({ width = 54, color = '#7FD8BD', style }) {
  return (
    <svg width={width} height={width * 0.44} viewBox="0 0 60 26" aria-hidden focusable="false" style={style}>
      <g stroke={color} strokeWidth="2.6" {...S}>
        <path d="M4 6.5c11-2 22-2 32 0s16 2 20 .5" />
        <path d="M4 13c11-2 22-2 32 0s16 2 20 .5" opacity="0.8" />
        <path d="M4 19.5c11-2 22-2 32 0s16 2 20 .5" opacity="0.6" />
      </g>
    </svg>
  );
}

/** Hand-drawn corner brackets, for framing a block of content. */
export function DoodleCorners({ size = 60, color = '#FFC72C', inset = 2, style }) {
  const d = 18;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden focusable="false" style={style}>
      <g stroke={color} strokeWidth="2.8" {...S}>
        <path d={`M${inset} ${inset + d} V${inset + 3} Q${inset} ${inset} ${inset + 3} ${inset} H${inset + d}`} />
        <path d={`M${64 - inset - d} ${inset} H${64 - inset - 3} Q${64 - inset} ${inset} ${64 - inset} ${inset + 3} V${inset + d}`} />
        <path d={`M${64 - inset} ${64 - inset - d} V${64 - inset - 3} Q${64 - inset} ${64 - inset} ${64 - inset - 3} ${64 - inset} H${64 - inset - d}`} />
        <path d={`M${inset + d} ${64 - inset} H${inset + 3} Q${inset} ${64 - inset} ${inset} ${64 - inset - 3} V${64 - inset - d}`} />
      </g>
    </svg>
  );
}

/** Small dot cluster — subtle texture filler. */
export function DoodleDots({ size = 34, color = '#93DFC7', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden focusable="false" style={style}>
      <g fill={color}>
        <circle cx="8" cy="9" r="3" />
        <circle cx="21" cy="6" r="2.2" />
        <circle cx="32" cy="13" r="3.4" />
        <circle cx="13" cy="22" r="2.4" />
        <circle cx="27" cy="26" r="3" />
        <circle cx="9" cy="34" r="2.2" />
        <circle cx="34" cy="36" r="2.6" />
      </g>
    </svg>
  );
}

/** Loose loop / flourish. */
export function DoodleLoop({ size = 40, color = '#C2185B', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden focusable="false" style={style}>
      <path
        d="M13 6c-8 4-10 14-4 20 5 5 14 4 18-2 4-6 1-14-6-16-6-2-12 3-11 9 .6 4 5 6 9 5"
        {...S}
        stroke={color}
        strokeWidth="3"
      />
    </svg>
  );
}

/** Wavy horizontal rule — a softer divider. */
export function DoodleWave({ width = 120, color = '#C8F0E2', style }) {
  return (
    <svg width={width} height={width * 0.14} viewBox="0 0 120 16" preserveAspectRatio="none" aria-hidden focusable="false" style={style}>
      <path
        d="M2 9c10-6 20-6 30 0s20 6 30 0 20-6 30 0 16 4 26 1"
        {...S}
        stroke={color}
        strokeWidth="2.6"
      />
    </svg>
  );
}

/** Paper plane, optionally with a looping dashed flight path. */
export function DoodlePlane({ size = 52, color = '#4747D7', trail = true, style }) {
  return (
    <svg width={size * 1.9} height={size * 1.5} viewBox="0 0 100 80" aria-hidden focusable="false" style={style}>
      {trail ? (
        <path
          d="M8 70c-4-12 6-16 14-14s10 12 18 10 6-14 16-14 14 10 10 16-12 6-10 0"
          {...S}
          stroke={color}
          strokeWidth="2.4"
          strokeDasharray="5 6"
          opacity="0.65"
        />
      ) : null}
      <path
        d="M56 14 92 30 56 46 60 30 56 14Z"
        fill="#FFFFFF"
        stroke={color}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M60 30 92 30 60 46" {...S} stroke={color} strokeWidth="2.4" />
    </svg>
  );
}

/** Puffy cloud built from overlapping arcs. */
export function DoodleCloud({ width = 150, color = '#FFFFFF', style }) {
  return (
    <svg width={width} height={width * 0.42} viewBox="0 0 160 66" aria-hidden focusable="false" style={style}>
      <path
        d="M28 58c-14 0-22-9-22-19s9-17 19-16c2-13 12-21 25-21 11 0 20 6 24 15 4-3 9-4 14-4 13 0 23 9 25 21 8 2 14 9 14 17 0 4-1 7-3 7Z"
        fill={color}
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Award trophy. */
export function DoodleTrophy({ size = 40, color = '#FFC72C', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden focusable="false" style={style}>
      <path d="M13 6h18v9a9 9 0 0 1-18 0V6Z" fill={color} stroke="#29204F" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M13 9H8a5 5 0 0 0 5 6M31 9h5a5 5 0 0 1-5 6" {...S} stroke="#29204F" strokeWidth="2.4" />
      <path d="M22 24v7M16 38h12M18 31h8v7h-8Z" {...S} stroke="#29204F" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

/** Award ribbon / rosette with a dangling tail. */
export function DoodleRibbon({ size = 40, color = '#C8102E', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden focusable="false" style={style}>
      <path d="M14 26 10 40l7-4 4 5 4-14Z" fill={color} opacity="0.85" />
      <path d="M30 26l4 14-7-4-4 5-4-14Z" fill={color} opacity="0.85" />
      <circle cx="22" cy="19" r="12" fill={color} />
      <circle cx="22" cy="19" r="6" fill="#FFF6E3" />
      <circle cx="22" cy="19" r="3" fill="#C8F0E2" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Named export for `<Doodle.X />` style usage                                 */
/* -------------------------------------------------------------------------- */

export const Doodle = {
  Star: DoodleStar,
  Sparkle: DoodleSparkle,
  Arrow: DoodleArrow,
  Squiggle: DoodleSquiggle,
  Underline: DoodleUnderline,
  Ring: DoodleRing,
  Burst: DoodleBurst,
  Flower: DoodleFlower,
  Lightning: DoodleLightning,
  Swoosh: DoodleSwoosh,
  Triangle: DoodleTriangle,
  Lines: DoodleLines,
  Corners: DoodleCorners,
  Dots: DoodleDots,
  Loop: DoodleLoop,
  Wave: DoodleWave,
  Plane: DoodlePlane,
  Cloud: DoodleCloud,
  Trophy: DoodleTrophy,
  Ribbon: DoodleRibbon,
};

/* -------------------------------------------------------------------------- */
/* Backwards-compatible aliases (previous names used across the site)         */
/* -------------------------------------------------------------------------- */

export const DecoStar = DoodleStar;
export const DecoSparkle = DoodleSparkle;
export const DecoSquiggle = DoodleSquiggle;
export const DecoUnderline = DoodleUnderline;
export const DecoRing = DoodleRing;
export const DecoBurst = DoodleBurst;

/**
 * Scatters a set of doodles deterministically around a section.
 * Deterministic so React never re-shuffles them between renders.
 */
export function DoodleScatter({ items, seed = 1 }) {
  // Cheap deterministic pseudo-random so layout is stable across renders.
  const rand = (n) => {
    const x = Math.sin(seed * 9301 + n * 49297) * 233280;
    return x - Math.floor(x);
  };

  return items.map((item, i) => {
    const Component = Doodle[item.kind] ?? DoodleStar;
    return (
      <span
        key={`${item.kind}-${i}`}
        aria-hidden="true"
        className={`deco${item.hideOnMobile ? ' deco--lg-only' : ''}`}
        style={{
          top: item.top,
          left: item.left,
          right: item.right,
          bottom: item.bottom,
          opacity: item.opacity ?? 0.5,
          pointerEvents: 'none',
          zIndex: 0,
          animation: item.animate
            ? `doodle-float ${7 + rand(i) * 5}s ease-in-out ${rand(i + 9) * 4}s infinite`
            : undefined,
        }}
      >
        <Component
          size={item.size ?? 26}
          color={item.color}
          rotate={item.rotate}
          style={{ display: 'block' }}
        />
      </span>
    );
  });
}

export default Doodle;
