/* Taşköprü Kahvesi — flat vector art, no external images. */
(function () {
  'use strict';

  function scene(prefix) {
    var p = prefix || 's';
    var svg = `
<svg class="art-svg" viewBox="0 0 400 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#180b2f"/>
      <stop offset=".34" stop-color="#572060"/>
      <stop offset=".56" stop-color="#c24563"/>
      <stop offset=".73" stop-color="#ff8055"/>
      <stop offset=".88" stop-color="#ffc879"/>
      <stop offset="1" stop-color="#ffe3ad"/>
    </linearGradient>
    <radialGradient id="sunGlow" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#fff0bf" stop-opacity=".95"/>
      <stop offset=".45" stop-color="#ffcf6b" stop-opacity=".5"/>
      <stop offset="1" stop-color="#ff9d4d" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="riverG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffc08a"/>
      <stop offset=".18" stop-color="#d4707b"/>
      <stop offset=".55" stop-color="#7c3566"/>
      <stop offset="1" stop-color="#2a133f"/>
    </linearGradient>
    <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#160b24" stop-opacity="0"/>
      <stop offset=".45" stop-color="#160b24" stop-opacity=".62"/>
      <stop offset="1" stop-color="#12081f" stop-opacity=".96"/>
    </linearGradient>
    <linearGradient id="wallG" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#41173f"/>
      <stop offset="1" stop-color="#240d30"/>
    </linearGradient>
    <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="4" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <mask id="bridgeCut">
      <rect x="0" y="0" width="400" height="420" fill="#fff"/>
      <circle cx="44" cy="252" r="27" fill="#000"/>
      <circle cx="112" cy="252" r="27" fill="#000"/>
      <circle cx="180" cy="252" r="27" fill="#000"/>
      <circle cx="248" cy="252" r="27" fill="#000"/>
    </mask>
  </defs>

  <!-- sky -->
  <rect width="400" height="420" fill="url(#skyG)"/>

  <!-- stars -->
  <g fill="#ffe9c9" opacity=".7">
    <circle cx="28" cy="26" r="1.3"/><circle cx="74" cy="48" r="1"/><circle cx="132" cy="22" r="1.6"/>
    <circle cx="188" cy="49" r="1.1"/><circle cx="238" cy="20" r="1.2"/><circle cx="318" cy="38" r="1.4"/>
    <circle cx="362" cy="18" r="1"/><circle cx="392" cy="58" r="1.2"/><circle cx="104" cy="72" r=".9"/>
  </g>

  <!-- sun -->
  <circle cx="292" cy="172" r="108" fill="url(#sunGlow)" class="sun-glow"/>
  <circle cx="292" cy="172" r="33" fill="#ffe4a6" class="sun-core"/>
  <circle cx="292" cy="172" r="43" fill="none" stroke="#ffe4a6" stroke-opacity=".25" stroke-width="1.5"/>

  <!-- clouds -->
  <g fill="#ffb99a" opacity=".2">
    <path d="M22 96q10-13 27-10 7-14 26-10t18 17q16-2 19 9z"/>
    <path d="M150 66q8-9 20-7 5-10 18-8t13 12q11-1 13 6z"/>
    <path d="M280 104q7-8 17-6 5-8 15-6t11 10q9-1 11 5z" opacity=".7"/>
  </g>

  <!-- far city -->
  <g fill="#481a4a" opacity=".78">
    <path d="M0 206h20v-15h10v15h14v-26h9v26h12v-11h10v11h16v-32h8v32h14v-14h8v14h18v-21h9v21h14v-9h9v9h14v-25h8v25h15v-13h8v13h16v-31h9v31h13v-17h7v17h16v-10h9v10h22v-22h8v22h20v-13h8v13h20v-29h8v29h22v-10h9v10h20v32H0z"/>
    <path d="M52 205v-34h2v-9h4v9h2v34zM58 162l4-8 4 8z"/>
    <circle cx="57" cy="157" r="5"/>
  </g>

  <!-- Taşköprü -->
  <g>
    <g mask="url(#bridgeCut)">
      <rect x="-14" y="203" width="306" height="47" fill="#2b1035"/>
      <rect x="-14" y="203" width="306" height="7" fill="#3a1644"/>
      <g stroke="#1d0a27" stroke-width="1.2" opacity=".55">
        <path d="M-10 218h300M-10 228h300M-10 238h300"/>
      </g>
    </g>
    <g stroke="#2b1035" stroke-width="3">
      <path d="M-10 202h300"/>
    </g>
    <g stroke="#ffb27a" stroke-width="1.6" opacity=".55">
      <path d="M-10 201.5h300"/>
    </g>
    <g fill="#2b1035">
      <rect x="8" y="190" width="3" height="12"/><rect x="40" y="190" width="3" height="12"/>
      <rect x="74" y="190" width="3" height="12"/><rect x="108" y="190" width="3" height="12"/>
      <rect x="142" y="190" width="3" height="12"/><rect x="176" y="190" width="3" height="12"/>
      <rect x="210" y="190" width="3" height="12"/><rect x="244" y="190" width="3" height="12"/>
      <rect x="278" y="190" width="3" height="12"/>
    </g>
    <path d="M-10 190h300" stroke="#2b1035" stroke-width="3"/>
  </g>

  <!-- river -->
  <rect x="0" y="248" width="400" height="110" fill="url(#riverG)"/>
  <g fill="#ffe0a8" opacity=".5" class="river-shine">
    <ellipse cx="292" cy="258" rx="26" ry="2.2"/>
    <ellipse cx="292" cy="268" rx="19" ry="1.8" opacity=".8"/>
    <ellipse cx="292" cy="280" rx="30" ry="2.4" opacity=".55"/>
    <ellipse cx="292" cy="294" rx="16" ry="1.6" opacity=".45"/>
    <ellipse cx="292" cy="310" rx="24" ry="2" opacity=".3"/>
  </g>
  <g stroke="#ffc79a" stroke-width="1.2" opacity=".18">
    <path d="M12 272q30 3 60 0M128 286q34 3 68 0M36 304q26 3 54 0M172 318q30 3 60 0M0 338q40 3 80 0"/>
  </g>
  <g fill="#1c0a27" opacity=".35">
    <path d="M0 250v9q34 3 68 0v-9zM96 250v7q30 3 60 0v-7zM204 250v6q30 3 60 0v-6z"/>
  </g>

  <!-- left palm -->
  <g class="palm palm-left" fill="#1a0927">
    <path d="M36 344c-9-50-3-115 12-164" stroke="#1a0927" stroke-width="10" fill="none" stroke-linecap="round"/>
    <g transform="translate(48 180)" class="fronds">
      <path d="M0 0C-18-16-42-20-60-10c20 1 40 8 55 20z" transform="rotate(4)"/>
      <path d="M0 0C-18-16-42-20-60-10c20 1 40 8 55 20z" transform="rotate(-36)"/>
      <path d="M0 0C-18-16-42-20-60-10c20 1 40 8 55 20z" transform="rotate(-76)"/>
      <path d="M0 0C-18-16-42-20-60-10c20 1 40 8 55 20z" transform="rotate(44) scale(.9)"/>
      <path d="M0 0C-18-16-42-20-60-10c20 1 40 8 55 20z" transform="rotate(84) scale(.85)"/>
      <path d="M0 0C18-16 42-20 60-10c-20 1-40 8-55 20z" transform="rotate(-8)"/>
      <path d="M0 0C18-16 42-20 60-10c-20 1-40 8-55 20z" transform="rotate(-48)"/>
      <path d="M0 0C18-16 42-20 60-10c-20 1-40 8-55 20z" transform="rotate(32) scale(.9)"/>
      <path d="M0 0C18-16 42-20 60-10c-20 1-40 8-55 20z" transform="rotate(72) scale(.85)"/>
    </g>
    <circle cx="48" cy="184" r="8"/>
    <circle cx="61" cy="193" r="6"/>
  </g>

  <!-- café wall + awning -->
  <g>
    <rect x="298" y="62" width="102" height="260" fill="url(#wallG)"/>
    <rect x="298" y="62" width="102" height="260" fill="none" stroke="#1c0a27" stroke-width="2"/>
    <!-- warm window -->
    <rect x="316" y="96" width="66" height="136" rx="5" fill="#5d2342"/>
    <rect x="322" y="102" width="54" height="124" rx="3" fill="#ffb45e" opacity=".22"/>
    <g stroke="#2b1035" stroke-width="2.5">
      <path d="M349 96v136M316 164h66"/>
    </g>
    <g fill="#2b1035" opacity=".85">
      <path d="M330 240c0-16 34-16 34 0z"/>
      <rect x="344" y="226" width="6" height="16" rx="2"/>
    </g>
    <!-- hanging lamps -->
    <g class="bulb">
      <path d="M335 70v16M365 70v24" stroke="#2b1035" stroke-width="1.5"/>
      <circle cx="335" cy="90" r="4.5" fill="#ffd98a" filter="url(#softGlow)"/>
      <circle cx="365" cy="98" r="4" fill="#ffd98a" filter="url(#softGlow)"/>
    </g>
    <!-- awning -->
    <path d="M206 0h194v58H206z" fill="#f4dfc2"/>
    <g fill="#b3403f">
      <path d="M206 0h19v58h-19z"/><path d="M244 0h19v58h-19z"/><path d="M282 0h19v58h-19z"/>
      <path d="M320 0h19v58h-19z"/><path d="M358 0h19v58h-19z"/><path d="M396 0h10v58h-10z"/>
    </g>
    <g fill="#f4dfc2">
      <circle cx="215" cy="58" r="10"/><circle cx="253" cy="58" r="10"/><circle cx="291" cy="58" r="10"/>
      <circle cx="329" cy="58" r="10"/><circle cx="367" cy="58" r="10"/>
    </g>
    <g fill="#b3403f">
      <circle cx="234" cy="58" r="10"/><circle cx="272" cy="58" r="10"/><circle cx="310" cy="58" r="10"/>
      <circle cx="348" cy="58" r="10"/><circle cx="386" cy="58" r="10"/>
    </g>
    <path d="M202 58h198" stroke="#2b1035" stroke-width="4" stroke-linecap="round"/>
    <path d="M202 58h198" stroke="#ffb27a" stroke-width="1" stroke-opacity=".4"/>
    <!-- side post -->
    <rect x="300" y="58" width="4" height="242" fill="#2b1035"/>
  </g>

  <!-- string lights -->
  <g>
    <path d="M-4 44Q72 92 150 64T302 74T404 34" fill="none" stroke="#2b1035" stroke-width="2.5"/>
    <g fill="#ffd98a" filter="url(#softGlow)" class="bulb">
      <circle cx="26" cy="55" r="3.6"/><circle cx="70" cy="72" r="3.2"/><circle cx="115" cy="80" r="3.8"/>
      <circle cx="160" cy="66" r="3.2"/><circle cx="205" cy="65" r="3.6"/><circle cx="252" cy="71" r="3.1"/>
      <circle cx="300" cy="74" r="3.7"/><circle cx="350" cy="58" r="3.2"/><circle cx="392" cy="40" r="3.4"/>
    </g>
    <g fill="#ffd98a" opacity=".18" class="bulb">
      <circle cx="26" cy="56" r="10"/><circle cx="115" cy="82" r="11"/><circle cx="205" cy="66" r="10"/>
      <circle cx="300" cy="76" r="11"/>
    </g>
  </g>

  <!-- foreground -->
  <path d="M0 356q44-16 96-14 104 5 200-6 60-6 104 8v76H0z" fill="#180b26"/>
  <path d="M0 356q44-16 96-14 104 5 200-6 60-6 104 8" fill="none" stroke="#ffb27a" stroke-opacity=".16" stroke-width="2"/>
  <g opacity=".9">
    <ellipse cx="334" cy="378" rx="22" ry="5" fill="#0f0619"/>
    <path d="M322 378h24l-3-13h-18z" fill="#2b1035"/>
    <path d="M334 360c3-5 8-4 9 0 2 5-2 7-4 9-2-2-6-4-5-9z" fill="#ffb45e" class="flame"/>
    <ellipse cx="62" cy="382" rx="18" ry="4" fill="#0f0619"/>
    <path d="M50 382h24v-13H50z" fill="#2b1035"/>
    <path d="M74 374c8 0 8-7 0-7" fill="none" stroke="#2b1035" stroke-width="3"/>
  </g>

  <rect y="286" width="400" height="134" fill="url(#bottomFade)"/>
  <rect class="night-veil" width="400" height="420" fill="#0c0620" opacity="0"/>
</svg>`;
    ['skyG', 'sunGlow', 'riverG', 'bottomFade', 'wallG', 'softGlow', 'bridgeCut'].forEach(function (id) {
      svg = svg.split(id).join(id + p);
    });
    return svg;
  }

  var LOOKS = {
    deniz: {
      skin: '#e7b088', skinShade: '#cd9166', hair: '#241716', outfit: '#1f6f78', outfit2: '#155059',
      accent: '#2dd4bf', inner: '#f2e7d6', style: 'short', beard: true
    },
    ece: {
      skin: '#f2c29c', skinShade: '#d9a077', hair: '#3a1e20', outfit: '#b8344e', outfit2: '#8a2438',
      accent: '#ff8fa3', inner: '#f2c29c', style: 'long', earrings: '#ffcf6b'
    },
    kerem: {
      skin: '#d9a273', skinShade: '#bd8357', hair: '#2a1a12', outfit: '#b07a2c', outfit2: '#85591c',
      accent: '#ffcf6b', inner: '#f4e4ca', style: 'curly', glasses: true
    },
    selin: {
      skin: '#f4c9a8', skinShade: '#dba47e', hair: '#7b3a2b', outfit: '#466a4a', outfit2: '#314e37',
      accent: '#a7d8a0', inner: '#f4c9a8', style: 'bob', earrings: '#ffd98a'
    }
  };

  function hairBack(style, hair) {
    if (style === 'long') {
      return '<path d="M58 94C54 46 82 30 100 30s46 16 42 64l8 82q-9 13-23 10l2-84H73l2 84q-14 3-23-10z" fill="' + hair + '"/>';
    }
    if (style === 'bob') {
      return '<path d="M57 94C53 46 147 46 143 94l2 48q-5 13-18 13l2-58H71l2 58q-13 0-18-13z" fill="' + hair + '"/>';
    }
    return '';
  }

  function hairFront(style, hair) {
    if (style === 'short') {
      return '<path d="M60 94C56 54 77 39 100 39c25 0 44 16 40 55-4-22-19-32-40-32-20 0-35 10-40 32z" fill="' + hair + '"/>'
        + '<path d="M77 66q21-16 46 2-14-6-25-3-12 3-21 10z" fill="' + hair + '"/>'
        + '<path d="M122 56q7 8 8 18-6-7-13-9z" fill="' + hair + '" opacity=".9"/>';
    }
    if (style === 'long') {
      return '<path d="M60 96C55 50 82 38 100 38c23 0 45 14 40 58-5-21-16-33-31-35-5 9-19 15-34 17-7 1-11 8-15 18z" fill="' + hair + '"/>'
        + '<path d="M66 96q-2 30 2 54" stroke="' + hair + '" stroke-width="9" stroke-linecap="round" fill="none"/>'
        + '<path d="M134 96q2 30-2 54" stroke="' + hair + '" stroke-width="9" stroke-linecap="round" fill="none"/>';
    }
    if (style === 'curly') {
      return '<g fill="' + hair + '"><circle cx="70" cy="72" r="15"/><circle cx="87" cy="57" r="16"/><circle cx="108" cy="54" r="17"/>'
        + '<circle cx="127" cy="67" r="15"/><circle cx="137" cy="86" r="10"/><circle cx="63" cy="90" r="10"/>'
        + '<circle cx="84" cy="70" r="8"/><circle cx="116" cy="66" r="8"/></g>'
        + '<path d="M64 96c2-10 8-17 15-19 2 8 9 13 18 13s17-5 19-13c8 3 14 10 16 19-8-8-16-11-24-9-5 8-19 8-24 0-9-2-16 2-20 9z" fill="' + hair + '"/>';
    }
    if (style === 'bob') {
      return '<path d="M58 96C55 50 145 50 142 96l-2-14c-4-19-18-27-40-27s-36 8-40 27z" fill="' + hair + '"/>'
        + '<path d="M60 94c1-18 8-28 20-31 5 9 15 13 20 13s15-4 20-13c13 4 21 14 22 31-7-10-15-14-22-14-6 6-12 8-20 8s-14-2-20-8c-8 0-15 4-20 14z" fill="' + hair + '"/>'
        + '<path d="M64 96q-1 22 3 41M136 96q1 22-3 41" stroke="' + hair + '" stroke-width="7" stroke-linecap="round" fill="none"/>';
    }
    return '';
  }

  function face(expr, look) {
    var happy = expr === 'happy' || expr === 'cheer';
    var worried = expr === 'worried';
    var eyes;
    if (happy) {
      eyes = '<g fill="none" stroke="#31161d" stroke-width="3" stroke-linecap="round">'
        + '<path d="M79 100q7-7 14 0"/><path d="M107 100q7-7 14 0"/></g>';
    } else if (worried) {
      eyes = '<ellipse cx="86" cy="99" rx="3.4" ry="4.4" fill="#31161d"/>'
        + '<ellipse cx="114" cy="99" rx="3.4" ry="4.4" fill="#31161d"/>'
        + '<circle cx="87" cy="97.5" r="1.2" fill="#fff" opacity=".85"/>'
        + '<circle cx="115" cy="97.5" r="1.2" fill="#fff" opacity=".85"/>';
    } else {
      eyes = '<ellipse cx="86" cy="99" rx="3.4" ry="4.6" fill="#31161d"/>'
        + '<ellipse cx="114" cy="99" rx="3.4" ry="4.6" fill="#31161d"/>'
        + '<circle cx="87.2" cy="97.4" r="1.2" fill="#fff" opacity=".9"/>'
        + '<circle cx="115.2" cy="97.4" r="1.2" fill="#fff" opacity=".9"/>';
    }
    var brows = '<g stroke="' + look.hair + '" stroke-width="2.6" stroke-linecap="round" fill="none" opacity=".9">'
      + (worried
        ? '<path d="M78 88q8-6 16-2"/><path d="M106 86q8-4 16 2"/>'
        : '<path d="M78 88q8-4 16-1"/><path d="M106 87q8-3 16 1"/>')
      + '</g>';
    var mouth = happy
      ? '<path d="M91 116q9 11 18 0" fill="none" stroke="#8d3b46" stroke-width="3" stroke-linecap="round"/>'
        + '<path d="M94 121q6 3 12 0" fill="none" stroke="#d4737c" stroke-width="1.6" stroke-linecap="round"/>'
      : worried
        ? '<ellipse cx="100" cy="119" rx="4.6" ry="5.4" fill="#8d3b46"/>'
        : '<path d="M94 117q6 6 12 0" fill="none" stroke="#8d3b46" stroke-width="3" stroke-linecap="round"/>';

    return '<g>'
      + '<ellipse cx="76" cy="111" rx="7.5" ry="4.2" fill="#e0727f" opacity=".3"/>'
      + '<ellipse cx="124" cy="111" rx="7.5" ry="4.2" fill="#e0727f" opacity=".3"/>'
      + brows + eyes
      + '<path d="M100 101q-2 7 2 9" fill="none" stroke="' + look.skinShade + '" stroke-width="2.2" stroke-linecap="round"/>'
      + mouth
      + '</g>';
  }

  function character(id, expr) {
    var look = LOOKS[id] || LOOKS.deniz;
    expr = expr || 'neutral';
    var isLong = look.style === 'long' || look.style === 'bob';
    var neckY = isLong ? 124 : 122;
    var svg = '<svg viewBox="0 0 200 220" class="portrait-svg" aria-hidden="true" focusable="false">'
      // shoulders
      + '<path d="M18 220c2-44 32-66 60-72h44c28 6 58 28 60 72z" fill="' + look.outfit + '"/>'
      + '<path d="M18 220c2-44 32-66 60-72l8 8c-14 20-22 42-24 64z" fill="' + look.outfit2 + '" opacity=".65"/>'
      + '<path d="M182 220c-2-44-32-66-60-72l-8 8c14 20 22 42 24 64z" fill="' + look.outfit2 + '" opacity=".65"/>'
      + (look.style === 'long' || look.style === 'bob'
        ? '<path d="M82 148l18 26 18-26z" fill="' + look.inner + '"/>'
        : '<path d="M84 150l16 20 16-20z" fill="' + look.inner + '"/>')
      + '<path d="M84 150l-9 12 9 10 16 14 16-14 9-10-9-12-16 18z" fill="' + look.outfit2 + '" opacity=".7"/>'
      + (id === 'kerem'
        ? '<g fill="#3a2411" opacity=".55"><circle cx="100" cy="186" r="2.2"/><circle cx="100" cy="200" r="2.2"/><circle cx="100" cy="214" r="2.2"/></g>'
        : '')
      // neck + ears
      + '<rect x="88" y="' + neckY + '" width="24" height="40" rx="11" fill="' + look.skinShade + '"/>'
      + '<ellipse cx="61" cy="102" rx="7" ry="10" fill="' + look.skin + '"/>'
      + '<ellipse cx="139" cy="102" rx="7" ry="10" fill="' + look.skin + '"/>'
      + hairBack(look.style, look.hair)
      + '<ellipse cx="100" cy="97" rx="39" ry="44" fill="' + look.skin + '"/>'
      + '<path d="M100 53c20 0 35 16 35 35 0 9-2 18-7 25-6-18-16-28-28-28s-22 10-28 28c-5-7-7-16-7-25 0-19 15-35 35-35z" fill="#fff" opacity=".06"/>'
      + (look.beard
        ? '<path d="M63 105c1 24 16 43 37 43s36-19 37-43c-4 17-18 28-37 28s-33-11-37-28z" fill="' + look.hair + '" opacity=".2"/>'
        : '')
      + hairFront(look.style, look.hair)
      + face(expr, look)
      + (look.glasses
        ? '<g fill="none" stroke="#31161d" stroke-width="2.4" opacity=".92"><circle cx="86" cy="99" r="12"/><circle cx="114" cy="99" r="12"/><path d="M98 99h4M74 97l-11-2M126 97l11-2"/></g>'
        : '')
      + (look.earrings
        ? '<g fill="none" stroke="' + look.earrings + '" stroke-width="2.6"><circle cx="61" cy="113" r="4.6"/><circle cx="139" cy="113" r="4.6"/></g>'
        : '')
      + '</svg>';
    return svg;
  }

  window.Art = { scene: scene, character: character };
})();
