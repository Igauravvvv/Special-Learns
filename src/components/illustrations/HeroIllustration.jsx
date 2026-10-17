const c = {
  ink: '#29204F', plum: '#3A2F6B', mint: '#C8F0E2', mintDeep: '#93DFC7',
  blue: '#3563E8', yellow: '#FFC72C', coral: '#EF694F', teal: '#1B9AAA',
  cream: '#FFF6E3', white: '#FFFFFF', skin: '#E9B592', hair: '#292333', purple: '#8B3E83',
};

/** A clean study scene with a learner working at an unbranded laptop. */
export default function HeroIllustration() {
  return (
    <svg viewBox="0 0 720 560" role="img" aria-labelledby="hero-art-title hero-art-desc" xmlns="http://www.w3.org/2000/svg" className="hero-illustration">
      <title id="hero-art-title">A learner studying at a laptop</title>
      <desc id="hero-art-desc">A smiling student practices on a laptop at a desk beside a small plant and bookshelf.</desc>
      <defs>
        <linearGradient id="hero-room-glow" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#E7FBF3"/><stop offset="1" stopColor="#C8F0E2" stopOpacity=".35"/></linearGradient>
        <filter id="hero-soft-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="9" stdDeviation="8" floodColor="#29204F" floodOpacity=".12"/></filter>
      </defs>

      {/* Quiet backdrop and pool of light */}
      <path d="M336 54 94 516h546L390 54h-54Z" fill="url(#hero-room-glow)"/>
      <ellipse cx="362" cy="516" rx="274" ry="20" fill={c.ink} opacity=".08"/>

      {/* Simple pendant lamp */}
      <path d="M362 26v74" stroke={c.ink} strokeWidth="7" strokeLinecap="round"/>
      <path d="M300 154c4-39 28-60 62-60s58 21 62 60H300Z" fill={c.purple} stroke={c.ink} strokeWidth="6" strokeLinejoin="round"/>
      <path d="M315 149c5-25 21-39 47-39s42 14 47 39H315Z" fill={c.yellow}/>
      <path d="M362 150 234 340h256L378 150Z" fill={c.yellow} opacity=".09"/>

      {/* Bookshelf kept intentionally quiet */}
      <g filter="url(#hero-soft-shadow)" stroke={c.ink} strokeWidth="6" strokeLinejoin="round">
        <path d="M520 202h142v304H520z" fill="#F7C96D"/>
        <path d="M509 200h164v15H509zM509 302h164v15H509zM509 403h164v15H509zM509 492h164v14H509z" fill={c.plum}/>
        <path d="M534 286v-70h24v70z" fill={c.coral}/><path d="M564 286v-56h29v56z" fill={c.blue}/><path d="M600 286v-67h23v67z" fill={c.yellow}/><path d="M630 286v-60h23v60z" fill={c.teal}/>
        <path d="M535 389v-64h27v64z" fill={c.blue}/><path d="M568 389v-51h26v51z" fill={c.coral}/><path d="M600 389v-63h26v63z" fill={c.purple}/><path d="M632 389v-48h21v48z" fill={c.yellow}/>
        <path d="M536 482v-57h30v57z" fill={c.teal}/><path d="M572 482v-49h25v49z" fill={c.yellow}/><path d="M604 482v-61h26v61z" fill={c.blue}/><path d="M636 482v-43h17v43z" fill={c.coral}/>
      </g>

      {/* Student and chair */}
      <g stroke={c.ink} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M218 319c-33 0-54 24-54 61v98c0 24 17 41 40 41h34V345c0-16-7-26-20-26Z" fill={c.blue}/>
        <path d="M176 374c17-8 34-8 49 0m-45 74h45" fill="none" stroke="#8DABFF" strokeWidth="7"/>
        <path d="M270 428c2 28-1 55-12 82l-5 13h47l14-70 21 70h48l-8-21-12-94" fill={c.teal}/>
        <path d="M248 521h58m42 0h55" fill="none" stroke={c.ink} strokeWidth="8"/>
        <path d="M245 514h52c12 0 20 8 20 18v5h-76c-10 0-15-5-14-12 1-7 7-11 18-11Z" fill={c.white}/>
        <path d="M338 514h48c12 0 20 8 20 18v5h-72c-11 0-16-5-15-12 1-7 7-11 19-11Z" fill={c.white}/>
        <path d="M254 534h51m40 0h53" stroke={c.coral} strokeWidth="5"/>
        <path d="M249 304c13-27 34-41 65-41h29c29 0 48 18 54 46l13 106c2 20-10 33-30 33H245c-18 0-28-14-26-34l9-82c2-12 8-21 21-28Z" fill={c.coral}/>
        <path d="M371 317c20 5 34 20 42 42l20 56c5 14 0 27-12 32-13 5-24-1-30-14l-29-70" fill={c.yellow}/>
        <path d="M422 402c8 13 15 20 24 23" fill="none" stroke={c.skin} strokeWidth="15"/>
        <path d="M289 234h43v45c-11 14-31 14-43 0v-45Z" fill={c.skin}/>
        <path d="M278 160c18-23 62-24 83 2 11 13 14 32 13 53-2 35-23 58-53 60-30 1-51-24-52-58-1-22 0-42 9-57Z" fill={c.skin}/>
        <path d="M268 211c-8-29-4-57 15-76 20-20 53-23 78-11 26 13 36 42 28 75-13-13-26-20-44-24-19 19-45 30-77 36Z" fill={c.purple}/>
        <path d="M281 198c-4-10-5-19-2-29 9 11 18 17 29 18" fill="none" stroke="#AA5C9E" strokeWidth="5"/>
        <circle cx="304" cy="218" r="4" fill={c.ink} stroke="none"/><circle cx="342" cy="217" r="4" fill={c.ink} stroke="none"/>
        <path d="M309 238c9 8 19 8 28-1" fill="none" stroke={c.ink} strokeWidth="4"/>
      </g>

      {/* Desk and a simple, unbranded laptop in front of the learner */}
      <g stroke={c.ink} strokeWidth="6" strokeLinejoin="round">
        <path d="M140 414h365v18H140z" fill={c.plum}/>
        <path d="M169 432v82m305-82v82" fill="none" stroke={c.plum} strokeWidth="11" strokeLinecap="round"/>
        <rect x="257" y="293" width="158" height="112" rx="13" fill={c.plum}/>
        <rect x="267" y="303" width="138" height="91" rx="7" fill={c.cream}/>
        <rect x="278" y="314" width="116" height="14" rx="5" fill={c.blue}/>
        <circle cx="287" cy="321" r="3" fill={c.white} stroke="none"/><circle cx="297" cy="321" r="3" fill={c.yellow} stroke="none"/>
        <rect x="279" y="339" width="47" height="43" rx="5" fill={c.white}/>
        <rect x="286" y="346" width="31" height="5" rx="2" fill={c.coral} stroke="none"/>
        <rect x="286" y="356" width="25" height="4" rx="2" fill="#A4AEC4" stroke="none"/>
        <rect x="286" y="365" width="30" height="4" rx="2" fill="#A4AEC4" stroke="none"/>
        <rect x="334" y="339" width="60" height="43" rx="5" fill={c.white}/>
        <path d="m341 370 13-15 11 9 13-16 10 12" fill="none" stroke={c.teal} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="m241 407 190 0-18 17H258l-17-17Z" fill="#473C7A"/>
        <path d="M307 410h59l-7 6h-45l-7-6Z" fill={c.ink} opacity=".55" stroke="none"/>
      </g>

      {/* Small plant for a little warmth */}
      <g stroke={c.ink} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M114 411c2-39 12-65 31-89m-26 65c-19-20-34-28-49-30m65 8c19-22 36-30 54-30" fill="none" stroke={c.teal} strokeWidth="7"/>
        <path d="M89 384c-13-10-22-8-25 4 11 11 20 10 25-4Zm19-30c-4-15 2-23 14-24 6 14 1 21-14 24Zm27 17c13-14 25-15 34-3-8 14-20 15-34 3Z" fill={c.mintDeep}/>
        <path d="M88 409h61l-9 43H97l-9-43Z" fill={c.yellow}/><path d="M82 403h74v12H82z" fill={c.coral}/>
      </g>

      {/* A few marks, rather than competing decorative objects */}
      <path d="M88 200c-8 13-9 27-3 41m-12-15c-5 10-5 20-1 29" fill="none" stroke={c.yellow} strokeWidth="6" strokeLinecap="round"/>
      <path d="M640 160c10-9 19-10 29-6m-23 21c10-7 19-8 29-3" fill="none" stroke={c.white} strokeWidth="6" strokeLinecap="round"/>
      <path d="m461 265 7 12 14 3-11 8 3 14-13-8-12 8 3-14-11-8 14-3 6-12Z" fill={c.yellow} stroke={c.ink} strokeWidth="3" strokeLinejoin="round"/>
    </svg>
  );
}
