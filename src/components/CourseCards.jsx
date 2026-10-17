import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';

import Icon from './Icon.jsx';
import { countByCategory, getCategory } from '../data/programs.js';

const ACCENT_CLASS = {
  mint: 'icon-tile--mint',
  yellow: 'icon-tile--yellow',
  cream: 'icon-tile--cream',
};

/** Card linking to a course category page. */
export function CategoryCard({ category, featured = false }) {
  const count = countByCategory().get(category.slug) ?? 0;

  return (
    <Link
      to={`/programs/${category.slug}`}
      className="program-card"
      style={featured ? { background: 'var(--sl-cream-300)', borderColor: 'transparent' } : undefined}
    >
      <div className="program-card__top">
        <span className={`icon-tile ${ACCENT_CLASS[category.accent] ?? ''}`}>
          <Icon name={category.icon} size={24} />
        </span>
        <span className="pill pill--plain">
          <Layers size={12} aria-hidden="true" />
          {count} {count === 1 ? 'course' : 'courses'}
        </span>
      </div>

      <h3 className="program-card__title">{category.title}</h3>
      <p className="program-card__text">{category.description}</p>

      <span className="link-arrow card__foot">
        Explore {category.title.toLowerCase()}
        <ArrowRight size={16} aria-hidden="true" />
      </span>
    </Link>
  );
}

/** Card linking to an individual course page. */
export function CourseCard({ course }) {
  const category = getCategory(course.category);

  return (
    <Link to={`/courses/${course.slug}`} className="program-card">
      <div className="program-card__top">
        <span className="icon-tile icon-tile--mint">
          <Icon name={category?.icon ?? 'sparkles'} size={22} />
        </span>
        {course.level ? <span className="pill">{course.level}</span> : null}
      </div>

      <h3 className="program-card__title">{course.title}</h3>
      <p className="program-card__text">{course.summary}</p>

      <div className="program-card__meta">
        <span>
          <Layers size={13} aria-hidden="true" />
          {course.modules.length} {course.modules.length === 1 ? 'module' : 'modules'}
        </span>
      </div>

      <span className="link-arrow card__foot">
        View course
        <ArrowRight size={16} aria-hidden="true" />
      </span>
    </Link>
  );
}
