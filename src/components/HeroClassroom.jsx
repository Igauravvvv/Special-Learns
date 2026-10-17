import { useEffect, useRef, useState } from 'react';
import { Check, Code2, Pause, Play, Sparkles } from 'lucide-react';

export default function HeroClassroom() {
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const ref = useRef(null);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <figure ref={ref} className="hero-classroom" data-playing={!paused && visible}>
    <div className="hero-classroom__halo" aria-hidden="true" />
    <div className="hero-classroom__stage">
      <img className="hero-classroom__image" src="/images/references/smart-class.png" alt="Two learners taking notes together as an instructor guides them on a laptop" width="790" height="660" fetchpriority="high" />
      <svg className="hero-classroom__marks" viewBox="0 0 790 660" fill="none" aria-hidden="true"><path className="hero-classroom__writing" d="m341 230 9-4 8 3 7-5m-28 15 17-3 8 2 9-5" stroke="#FFD04C" strokeWidth="4" strokeLinecap="round" pathLength="1" /><path className="hero-classroom__signal" d="M405 92q11 8 12 24m-2-35q19 12 20 34" stroke="#4CAEB0" strokeWidth="4" strokeLinecap="round" /></svg>
    </div>
    <div className="hero-classroom__label"><span className="hero-classroom__live" aria-hidden="true" />A little guidance. A big difference.</div>
    <div className="hero-classroom__chip hero-classroom__chip--one" aria-hidden="true"><span><Code2 size={20} /></span><div><strong>Learn by doing</strong><small>One small win at a time</small></div></div>
    <div className="hero-classroom__chip hero-classroom__chip--two" aria-hidden="true"><span><Check size={19} /></span><div><strong>“I made this!”</strong><small>That’s the feeling we’re here for.</small></div><Sparkles size={17} className="hero-classroom__spark" /></div>
    <figcaption className="hero-classroom__caption"><span>Curiosity welcome. Beginners, too.</span><button type="button" onClick={() => setPaused(v => !v)} aria-label={paused ? 'Play hero animation' : 'Pause hero animation'} title={paused ? 'Play animation' : 'Pause animation'}>{paused ? <Play size={14} /> : <Pause size={14} />}</button></figcaption>
  </figure>;
}
