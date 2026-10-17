import SplitHeading from './SplitHeading.jsx';
import { DoodleUnderline, DoodleSparkle } from './illustrations/Deco.jsx';

/**
 * Consistent section header: optional eyebrow, heading, supporting copy and
 * actions.
 *
 * The heading reveals word by word, and gets a hand-drawn underline that
 * "draws itself on" once the heading has appeared.
 */
export default function SectionHeading({
  eyebrow,
  title,
  children,
  actions,
  align = 'center',
  underline = true,
  id,
  as: Tag = 'h2',
  animate = true,
}) {
  const centred = align === 'center';

  return (
    <div className={`section-head${centred ? '' : ' section-head--left'}`}>
      {eyebrow ? (
        <p className="eyebrow" style={{ marginBottom: '1.15rem' }}>
          <span className="eyebrow__dot" aria-hidden="true" />
          {eyebrow}
        </p>
      ) : null}

      <Tag id={id} className={underline ? 'section-head__title' : undefined}>
        {animate ? (
          <SplitHeading as="span" text={title} />
        ) : (
          title
        )}

        {underline ? (
          <span className="section-head__underline" aria-hidden="true">
            <DoodleUnderline width={centred ? 150 : 120} />
          </span>
        ) : null}
      </Tag>

      {children ? <div className="lead">{children}</div> : null}

      {actions ? <div className="section-head__actions">{actions}</div> : null}

      {centred ? (
        <DoodleSparkle
          size={22}
          style={{ marginTop: 18, opacity: 0.7, animation: 'doodle-float 9s ease-in-out infinite' }}
        />
      ) : null}
    </div>
  );
}
