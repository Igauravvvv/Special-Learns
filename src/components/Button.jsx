import { Link } from 'react-router-dom';

/**
 * A polymorphic button/link. Renders as <Link>, <a> or <button> depending on
 * the props given, so every call site stays semantically correct.
 */
export default function Button({
  as,
  to,
  href,
  variant = 'primary',
  size,
  block = false,
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size ? `btn--${size}` : '',
    block ? 'btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  const Tag = as || 'button';
  // A bare <button> without a handler is useless — fall back to type=button.
  const type = Tag === 'button' ? (rest.type ?? 'button') : undefined;

  return (
    <Tag className={classes} type={type} {...rest}>
      {children}
    </Tag>
  );
}
