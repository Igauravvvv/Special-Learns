/**
 * Highlighted text band.
 *
 * The reference designs set a short phrase inside a solid rounded block with a
 * warm offset shadow behind it, so it reads like a marker swipe. This component
 * reproduces that treatment and keeps the text real, selectable text.
 *
 *   <h2>Smart classes with instructor <Highlight>in private</Highlight></h2>
 *
 * `tone` picks the palette variant so a page can vary the colour without
 * breaking contrast.
 */

const TONES = {
  green: {
    bg: 'var(--sl-hl-green)',
    ink: '#FFFDF8',
    shadow: 'var(--sl-hl-green-shadow)',
  },
  indigo: {
    bg: 'var(--sl-indigo-600)',
    ink: '#FFFFFF',
    shadow: 'var(--sl-coral)',
  },
  yellow: {
    bg: 'var(--sl-yellow-400)',
    ink: 'var(--sl-ink-900)',
    shadow: 'var(--sl-ink-800)',
  },
  plum: {
    bg: 'var(--sl-plum-800)',
    ink: '#FFFFFF',
    shadow: 'var(--sl-indigo-500)',
  },
};

export default function Highlight({ children, tone = 'green', as: Tag = 'span', className = '' }) {
  const t = TONES[tone] ?? TONES.green;

  return (
    <Tag
      className={`hl ${className}`.trim()}
      style={{ background: t.bg, color: t.ink, '--hl-shadow': t.shadow }}
    >
      {children}
    </Tag>
  );
}

/**
 * A whole line/paragraph rendered as a highlighted band. Useful when the
 * emphasised phrase is the entire heading.
 */
export function HighlightBlock({ children, tone = 'green', className = '' }) {
  return (
    <Highlight tone={tone} as="span" className={`hl--block ${className}`.trim()}>
      {children}
    </Highlight>
  );
}
