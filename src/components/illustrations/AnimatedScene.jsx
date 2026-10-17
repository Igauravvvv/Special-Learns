import { useEffect, useId, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';

/** Shared playback keeps decorative motion quiet offscreen and user-controllable. */
export default function AnimatedScene({ kind, title, description, caption, children, className = '' }) {
  const id = useId();
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener('change', update);
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting), { threshold: 0.12 },
    );
    if (observer) observer.observe(ref.current);
    else setInView(true);
    return () => { observer?.disconnect(); preference.removeEventListener('change', update); };
  }, []);

  return (
    <figure ref={ref} className={`animated-scene animated-scene--${kind} ${className}`} data-playing={inView && !paused && !reduced}>
      <div className="animated-scene__canvas" key={version}>
        <svg viewBox="0 0 640 420" role="img" aria-labelledby={`${id}-title ${id}-desc`} xmlns="http://www.w3.org/2000/svg">
          <title id={`${id}-title`}>{title}</title>
          <desc id={`${id}-desc`}>{description}</desc>
          <defs>
            <pattern id={`${id}-grid`} width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#29204F" strokeOpacity=".045" /></pattern>
          </defs>
          <rect width="640" height="420" fill={kind === 'code' ? '#EDF7F2' : '#E4F5EE'} />
          <rect width="640" height="420" fill={`url(#${id}-grid)`} />
          {children}
        </svg>
      </div>
      <figcaption className="animated-scene__caption">
        <span><i aria-hidden="true" />{caption}</span>
        <span className="animated-scene__controls">
          {!reduced && <button type="button" onClick={() => setVersion(v => v + 1)} aria-label={`Replay animation: ${title}`} title="Replay animation"><RotateCcw size={14} /></button>}
          {!reduced && <button type="button" onClick={() => setPaused(v => !v)} aria-label={`${paused ? 'Play' : 'Pause'} animation: ${title}`} title={paused ? 'Play animation' : 'Pause animation'}>{paused ? <Play size={14} /> : <Pause size={14} />}</button>}
        </span>
      </figcaption>
    </figure>
  );
}

export function Spark({ x, y, color = '#FFC72C', size = 14 }) {
  return <path className="scene-spark" d={`M${x} ${y - size}q2 ${size - 2} ${size} ${size}q-${size - 2} 2 -${size} ${size}q-2 -${size - 2} -${size} -${size}q${size - 2} -2 ${size} -${size}Z`} fill={color} />;
}

/** Original vector character, hands placed over the keyboard rather than waving at a chart. */
export function Learner({ x = 0, y = 0 }) {
  return <g transform={`translate(${x} ${y})`}>
    <rect x="46" y="169" width="104" height="112" rx="32" fill="#B9C9F6" stroke="#29204F" strokeWidth="3" />
    <path d="M89 274v49m-33 0h73m-55 0-13 14m48-14 13 14" fill="none" stroke="#29204F" strokeWidth="7" strokeLinecap="round" />
    <path d="M104 257h73l-6 73h-30l-1-42h-16l-6 42H88Z" fill="#34305A" />
    <path d="M87 329h31v12H77q-6-9 10-12m56 0h29l14 12h-43Z" fill="#FFF9ED" stroke="#29204F" strokeWidth="3" strokeLinejoin="round" />
    <path d="M92 168q13-24 43-24h12q34 0 43 31l13 85H87Z" fill="#EE7554" stroke="#29204F" strokeWidth="3" />
    <path d="M130 129v25q10 10 24 0v-25" fill="#DCA27E" />
    <g className="scene-head">
      <ellipse cx="141" cy="100" rx="36" ry="42" fill="#F2C6A0" stroke="#29204F" strokeWidth="3" />
      <path d="M104 102q-9-50 35-52 44-1 42 48-17-8-27-23-15 21-50 27Z" fill="#29243D" />
      <path d="M114 66q19-20 40-7" fill="none" stroke="#514662" strokeWidth="4" strokeLinecap="round" />
      <circle cx="134" cy="105" r="3" fill="#29204F" /><circle cx="160" cy="103" r="3" fill="#29204F" />
      <path d="M139 119q9 8 18-2" fill="none" stroke="#29204F" strokeWidth="3" strokeLinecap="round" />
      <path d="M103 98q-5-40 32-43m-32 43v19" fill="none" stroke="#3563E8" strokeWidth="5" strokeLinecap="round" />
      <rect x="98" y="96" width="11" height="24" rx="5" fill="#3563E8" />
    </g>
    <path d="M110 184q-11 34 24 44l44 2" fill="none" stroke="#29204F" strokeWidth="21" strokeLinecap="round" />
    <path d="M110 184q-11 34 24 44l44 2" fill="none" stroke="#F2C6A0" strokeWidth="16" strokeLinecap="round" />
    <g className="scene-hand scene-hand--left"><path d="m172 230 24-1 10 5" fill="none" stroke="#F2C6A0" strokeWidth="13" strokeLinecap="round" /></g>
    <path d="m177 180 19 29 34 13" fill="none" stroke="#29204F" strokeWidth="19" strokeLinecap="round" />
    <path d="m177 180 19 29 34 13" fill="none" stroke="#F2C6A0" strokeWidth="14" strokeLinecap="round" />
    <g className="scene-hand scene-hand--right"><path d="m224 222 19 7 9 5" fill="none" stroke="#F2C6A0" strokeWidth="12" strokeLinecap="round" /></g>
    <path d="M41 242h262v13H41Zm22 13v79m218-79v79" fill="#FFF6E3" stroke="#29204F" strokeWidth="4" strokeLinejoin="round" />
    <path d="m159 237 99-1 7 6H153Z" fill="#29204F" /><path d="M168 239h78" stroke="#B9C9F6" strokeWidth="2" strokeDasharray="3 2" />
  </g>;
}
