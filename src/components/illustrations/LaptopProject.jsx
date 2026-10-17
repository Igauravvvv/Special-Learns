import AnimatedScene, { Spark } from './AnimatedScene.jsx';

export default function LaptopProject() {
  return <AnimatedScene kind="project" className="laptop-project" title="An idea becomes something real" description="An illustrated laptop builds a colourful portfolio website. A design palette, a spreadsheet and a finished project appear around it, showing practical work learners can create." caption="From “how?” to “look what I built.”">
    <circle cx="324" cy="216" r="161" fill="#C9E9DD" />
    <text x="32" y="38" className="scene-overline">LESS THEORY. MORE “LOOK WHAT I MADE.”</text>
    <ellipse cx="325" cy="353" rx="236" ry="16" fill="#29204F" opacity=".08" />
    <g className="scene-laptop">
      <rect x="113" y="91" width="411" height="245" rx="22" fill="#29204F" />
      <rect x="123" y="101" width="391" height="223" rx="13" fill="#FFFFFF" />
      <path d="M123 129h391" stroke="#E3E4EC" /><circle cx="139" cy="115" r="3.5" fill="#EE7554" /><circle cx="151" cy="115" r="3.5" fill="#FFC72C" /><circle cx="163" cy="115" r="3.5" fill="#80D5B8" />
      <rect x="214" y="109" width="204" height="14" rx="5" fill="#F0F1F6" /><text x="270" y="119" className="scene-address">my-first-website /</text>
      <rect x="134" y="140" width="369" height="172" rx="7" fill="#FFF5DE" />
      <text x="151" y="158" className="scene-small" fill="#29204F">hello, i'm a creator.</text><path d="M420 154h17m10 0h17m10 0h13" stroke="#AAA4B5" strokeWidth="2" strokeLinecap="round" />
      <g className="scene-project-content">
        <text x="154" y="193" className="scene-portfolio-title">Small idea.</text><text x="154" y="220" className="scene-portfolio-title">Big possibility.</text>
        <path d="M155 234h132m-132 9h104" stroke="#9F96A7" strokeWidth="3" strokeLinecap="round" />
        <rect x="153" y="258" width="86" height="23" rx="11" fill="#3563E8" /><text x="165" y="273" className="scene-small" fill="white">See my work</text><path d="m222 266 4 4-4 4" fill="none" stroke="white" strokeWidth="1.5" />
        <rect x="339" y="177" width="140" height="114" rx="55" fill="#B5DFCD" />
        <path d="M361 267v-47h32v47Zm39 0v-75h32v75Zm39 0v-33h23v33Z" fill="#3563E8" /><circle cx="458" cy="193" r="19" fill="#FFC72C" /><path d="m348 213 18-22 13 11" fill="none" stroke="#EE7554" strokeWidth="7" strokeLinecap="round" />
      </g>
      <path d="M89 336h459l24 15q0 9-22 9H87q-22 0-22-9Z" fill="#45406B" /><path d="M269 337h99l-8 8h-83Z" fill="#242139" />
    </g>
    <g className="scene-float scene-float--palette">
      <rect x="32" y="163" width="118" height="84" rx="12" fill="white" stroke="#D8DCE6" /><text x="45" y="183" className="scene-overline">MAKE IT YOURS</text>
      {['#3563E8', '#EE7554', '#FFC72C', '#A8D9C2'].map((color, i) => <rect key={color} x={45 + i * 23} y="195" width="18" height="25" rx="7" fill={color} />)}
      <path d="M46 233h66" stroke="#D9DCE6" strokeWidth="3" strokeLinecap="round" />
    </g>
    <g className="scene-float scene-float--sheet">
      <rect x="482" y="215" width="130" height="100" rx="12" fill="white" stroke="#D8DCE6" /><text x="495" y="235" className="scene-overline">REAL SKILLS</text>
      <rect x="495" y="246" width="104" height="54" rx="5" fill="#E3F4EB" /><path d="M495 263h104m-104 18h104m-70-35v54m35-54v54" stroke="#BEDCCC" /><path d="m506 287 22-12 20 3 33-23" fill="none" stroke="#3D9E83" strokeWidth="3" strokeLinecap="round" />
    </g>
    <g className="scene-result"><rect x="421" y="58" width="180" height="39" rx="19" fill="#FFF9ED" stroke="#DDD9C9" /><circle cx="444" cy="77" r="10" fill="#C5EAD7" /><path d="m440 77 3 3 5-6" fill="none" stroke="#246A55" strokeWidth="2" /><text x="461" y="82" className="scene-small" fill="#29204F">Your first project. Done.</text></g>
    <Spark x={69} y={105} size={17} /><Spark x={572} y={164} color="#EE7554" size={13} />
  </AnimatedScene>;
}
