import AnimatedScene, { Learner, Spark } from './AnimatedScene.jsx';

export default function LearningScene() {
  return <AnimatedScene kind="code" className="learning-scene" title="Small steps. Real breakthroughs." description="An animated learner types Python at a desk. Code appears line by line, runs, and produces Hello, world! with a successful result." caption="Write it. Run it. Make it yours.">
    <circle cx="169" cy="235" r="140" fill="#C6EBDD" />
    <path d="M47 355h550" stroke="#29204F" strokeOpacity=".12" strokeWidth="2" />
    <text x="32" y="38" className="scene-overline">THE FIRST “I MADE THAT.” MOMENT</text>
    <Learner x={8} y={10} />
    <g>
      <path d="M366 260v34m-32 0h71" stroke="#29204F" strokeWidth="9" strokeLinecap="round" />
      <rect x="255" y="94" width="350" height="174" rx="16" fill="#29204F" />
      <rect x="263" y="102" width="334" height="158" rx="10" fill="#242139" />
      <path d="M264 128h332" stroke="#514A70" />
      <circle cx="277" cy="115" r="3" fill="#EE7554" /><circle cx="288" cy="115" r="3" fill="#FFC72C" /><circle cx="299" cy="115" r="3" fill="#80D5B8" />
      <text x="317" y="119" className="scene-code-tab">first_project.py</text>
      <text x="278" y="153" className="scene-line-number">1</text><text x="278" y="177" className="scene-line-number">2</text><text x="278" y="201" className="scene-line-number">3</text>
      <g className="scene-code-line scene-code-line--one"><text x="302" y="153" className="scene-code"><tspan fill="#C3AEFF">message</tspan><tspan fill="#FFFFFF"> = </tspan><tspan fill="#A4E2C2">&quot;Hello, world!&quot;</tspan></text></g>
      <g className="scene-code-line scene-code-line--two"><text x="302" y="177" className="scene-code"><tspan fill="#FFD57B">print</tspan><tspan fill="#FFFFFF">(message)</tspan></text></g>
      <rect className="scene-cursor" x="302" y="189" width="7" height="15" fill="#C7B9FF" />
      <rect x="278" y="222" width="66" height="23" rx="7" fill="#C3EFD9" /><path d="m288 228 8 5-8 5Z" fill="#246A55" /><text x="302" y="237" className="scene-small" fill="#246A55">Run</text>
      <path className="scene-run-progress" d="M356 234h220" stroke="#80D5B8" strokeWidth="3" strokeLinecap="round" pathLength="1" />
    </g>
    <g className="scene-result">
      <rect x="329" y="288" width="260" height="79" rx="13" fill="#29204F" opacity=".1" transform="translate(0 5)" />
      <rect x="329" y="288" width="260" height="79" rx="13" fill="#FFFFFF" stroke="#B6DACA" />
      <circle cx="351" cy="309" r="5" fill="#3D9E83" /><text x="364" y="313" className="scene-overline">OUTPUT · SUCCESS</text>
      <text x="347" y="343" className="scene-output">Hello, world!</text><path d="m554 332 6 6 12-14" fill="none" stroke="#3D9E83" strokeWidth="3" strokeLinecap="round" />
    </g>
    <g className="scene-result"><Spark x={596} y={285} size={12} /><Spark x={310} y={335} color="#EE7554" size={8} /></g>
    <g transform="translate(440 54)"><rect width="140" height="26" rx="13" fill="#FFF9ED" stroke="#D8DDCE" /><circle cx="15" cy="13" r="4" fill="#3D9E83" /><text x="26" y="17" className="scene-small">Learning by doing</text></g>
  </AnimatedScene>;
}
