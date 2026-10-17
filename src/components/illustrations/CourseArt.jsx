import AnimatedScene, { Learner, Spark } from './AnimatedScene.jsx';
import LaptopProject from './LaptopProject.jsx';

const choices = [
  { x: 29, y: 87, title: 'Computer basics', sub: 'Start with confidence', icon: 'Aa', color: '#DDF0E7' },
  { x: 415, y: 81, title: 'Web development', sub: 'Build for the web', icon: '</>', color: '#E5E7FC' },
  { x: 17, y: 182, title: 'Design & VFX', sub: 'Bring ideas to life', icon: '✳', color: '#FFE4D8' },
  { x: 432, y: 176, title: 'Programming', sub: 'Make your code run', icon: '{ }', color: '#E1EBFD' },
  { x: 30, y: 277, title: 'Accounting', sub: 'Make numbers count', icon: '₹', color: '#FFF0C5' },
  { x: 420, y: 271, title: 'Digital marketing', sub: 'Reach the right people', icon: '↗', color: '#E2EFE1' },
];

export function DeskWorkerArt({ className = '', style }) {
  return <div className={className} style={style}>
    <AnimatedScene kind="courses" title="Find your thing. Build your future." description="A learner practises at a laptop as six course paths appear in sequence: computer basics, web development, design and VFX, programming, accounting and digital marketing." caption="Different paths. Your next big thing.">
      <circle cx="322" cy="232" r="151" fill="#C5E7D8" />
      <text x="32" y="38" className="scene-overline">A LITTLE CURIOSITY CAN GO A LONG WAY</text>
      <g fill="none" stroke="#92BEA9" strokeWidth="1.5" strokeDasharray="4 6"><path d="M199 120q65 0 90 73m128-83q-68 0-83 87M185 220h64m182-4h-49M192 311q45 0 70-32m160 28q-41 0-59-36" /></g>
      <Learner x={166} y={23} />
      <path d="m358 242 7-53q1-8 9-8h56q9 0 7 9l-10 53Z" fill="#29204F" stroke="#29204F" strokeWidth="3" /><path d="m371 191-6 44h54l7-44Z" fill="#596CE3" /><path d="m389 209-7 6 6 5m14-11 6 6-8 5" fill="none" stroke="#FFF6E3" strokeWidth="2" strokeLinecap="round" /><path d="M349 243h85" stroke="#29204F" strokeWidth="5" strokeLinecap="round" />
      {choices.map((item, i) => <g key={item.title} transform={`translate(${item.x} ${item.y})`}>
        <g className="scene-course-tile" style={{ '--tile-delay': `${i * 0.32}s` }}>
          <rect y="4" width="190" height="66" rx="14" fill="#29204F" opacity=".06" />
          <rect width="190" height="66" rx="14" fill="#FFFFFF" stroke="#D3E3DA" />
          <rect x="11" y="13" width="37" height="39" rx="11" fill={item.color} /><text x="29" y="39" textAnchor="middle" className="scene-course-icon">{item.icon}</text>
          <text x="58" y="28" className="scene-course-title">{item.title}</text><text x="58" y="45" className="scene-course-sub">{item.sub}</text>
        </g>
      </g>)}
      <Spark x={252} y={81} size={11} /><Spark x={401} y={367} size={9} color="#EE7554" />
    </AnimatedScene>
  </div>;
}

export function LaptopDeskArt({ className = '', style }) {
  return <div className={className} style={style}><LaptopProject /></div>;
}

export default LaptopDeskArt;
