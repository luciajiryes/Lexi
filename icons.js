/* =========================================================
   Lexi – little drawn sticker icons (no emoji)
   Soft colours, round shapes, one friendly outline.
   Every course's emoji list is turned into these drawings below.
   Emoji without a drawing (and anything stereotypical) are dropped.
   ========================================================= */
(function () {
  const OUT = '#5A3E43';
  const svg = body => `<svg viewBox="0 0 64 64" aria-hidden="true"><g stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`;
  const face = (x, y, w = 8) => `<g stroke="none"><circle cx="${x - w / 2}" cy="${y}" r="1.7" fill="${OUT}"/><circle cx="${x + w / 2}" cy="${y}" r="1.7" fill="${OUT}"/><circle cx="${x - w / 2 - 2}" cy="${y + 3.5}" r="2.2" fill="#FF9DA7" opacity=".7"/><circle cx="${x + w / 2 + 2}" cy="${y + 3.5}" r="2.2" fill="#FF9DA7" opacity=".7"/></g>`;
  const pet = (fill, ears) => `${ears}<circle cx="32" cy="36" r="19" fill="${fill}"/>${face(32, 36, 12)}<path d="M29 43 Q32 46 35 43" fill="none"/>`;

  const I = {
    sun: svg(`<g stroke="#F0A93B">${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<path d="M32 6 V12" transform="rotate(${a} 32 32)"/>`).join('')}</g><circle cx="32" cy="32" r="14" fill="#FFD36B"/>${face(32, 31, 10)}`),
    cloud: svg(`<path d="M18 46 a10 10 0 0 1 1-20 a13 13 0 0 1 25 3 a8.5 8.5 0 0 1 1 17Z" fill="#E8F1FF"/>${face(32, 37, 10)}`),
    wave: svg(`<path d="M5 34 Q13 24 21 34 T37 34 T53 34 T61 34 V54 Q61 58 57 58 H9 Q5 58 5 54Z" fill="#7CC4EC"/><path d="M5 44 Q13 36 21 44 T37 44 T53 44" fill="none" stroke="#fff" stroke-width="2.4"/>`),
    mountain: svg(`<circle cx="48" cy="17" r="7" fill="#FFD36B" stroke="none"/><path d="M5 54 L25 17 L38 40 L45 29 L59 54Z" fill="#A9B8E6"/><path d="M25 17 L18 30 L25 27 L31 31Z" fill="#fff"/>`),
    palm: svg(`<path d="M32 58 Q30 40 34 26" fill="none" stroke-width="5" stroke="#B98253"/><path d="M33 27 Q22 16 10 24 Q22 22 33 27Z M33 27 Q44 14 56 22 Q44 22 33 27Z M33 27 Q28 12 34 6 Q36 16 33 27Z" fill="#6CC17A"/><circle cx="31" cy="30" r="3" fill="#8B5E3C"/><circle cx="37" cy="30" r="3" fill="#8B5E3C"/>`),
    tree: svg(`<rect x="28" y="40" width="8" height="18" rx="3" fill="#B98253"/><circle cx="32" cy="28" r="18" fill="#73C58A"/>${face(32, 28, 12)}`),
    leaf: svg(`<path d="M12 52 Q8 20 50 12 Q54 50 12 52Z" fill="#7CCB8E"/><path d="M12 52 Q28 34 42 22" fill="none"/>`),
    flower: svg(`${[0, 72, 144, 216, 288].map(a => `<circle cx="32" cy="17" r="9" fill="#FF9DB8" transform="rotate(${a} 32 32)"/>`).join('')}<circle cx="32" cy="32" r="8" fill="#FFD36B"/>${face(32, 31, 6)}`),
    shell: svg(`<path d="M8 46 Q8 14 32 12 Q56 14 56 46 Q32 56 8 46Z" fill="#FFC6B0"/><path d="M32 13 V50 M20 16 L18 48 M44 16 L46 48" fill="none"/>`),
    fish: svg(`<path d="M48 32 L61 20 V44Z" fill="#FFB36B"/><ellipse cx="29" cy="32" rx="22" ry="15" fill="#FFB36B"/><circle cx="20" cy="29" r="2.4" fill="${OUT}" stroke="none"/><path d="M33 22 Q38 32 33 42" fill="none"/>`),
    boat: svg(`<path d="M32 8 V40 H12Z" fill="#fff"/><path d="M36 14 L52 40 H36Z" fill="#FFB5C0"/><path d="M8 44 H56 L50 54 H14Z" fill="#8FB8F0"/>`),
    bird: svg(`<ellipse cx="30" cy="36" rx="19" ry="16" fill="#8FD3E8"/><path d="M48 32 L58 35 L48 38Z" fill="#FFC15E"/><path d="M18 38 Q28 52 38 38Z" fill="#6BB7D1"/><circle cx="40" cy="30" r="2.2" fill="${OUT}" stroke="none"/><path d="M26 20 Q28 12 34 16" fill="none"/>`),
    penguin: svg(`<ellipse cx="32" cy="36" rx="17" ry="21" fill="#5B6B8C"/><ellipse cx="32" cy="40" rx="11" ry="15" fill="#fff"/><path d="M28 31 L32 36 L36 31Z" fill="#FFB347"/><circle cx="27" cy="26" r="2" fill="#fff" stroke="none"/><circle cx="37" cy="26" r="2" fill="#fff" stroke="none"/>`),
    cat: svg(pet('#FFD9A8', '<path d="M15 26 L16 8 L28 19Z M49 26 L48 8 L36 19Z" fill="#FFD9A8"/>')),
    dog: svg(pet('#E8C9A0', '<path d="M13 22 Q6 40 16 44 L20 24Z M51 22 Q58 40 48 44 L44 24Z" fill="#B98253"/>')),
    bear: svg(pet('#C9946B', '<circle cx="17" cy="19" r="7" fill="#C9946B"/><circle cx="47" cy="19" r="7" fill="#C9946B"/>')),
    sheep: svg(`<circle cx="20" cy="30" r="10" fill="#fff"/><circle cx="32" cy="24" r="11" fill="#fff"/><circle cx="44" cy="30" r="10" fill="#fff"/><circle cx="32" cy="38" r="12" fill="#fff"/><ellipse cx="32" cy="40" rx="11" ry="10" fill="#4B3B3F"/>${'' }<g stroke="none"><circle cx="28" cy="38" r="1.7" fill="#fff"/><circle cx="36" cy="38" r="1.7" fill="#fff"/></g>`),
    elephant: svg(`<circle cx="13" cy="30" r="11" fill="#B9C3DB"/><circle cx="51" cy="30" r="11" fill="#B9C3DB"/><circle cx="32" cy="30" r="17" fill="#C9D3EA"/><path d="M27 38 Q26 54 36 52" fill="none" stroke-width="6" stroke="#B9C3DB"/>${face(32, 27, 12)}`),
    lion: svg(`<circle cx="32" cy="34" r="25" fill="#F5A55B"/><circle cx="32" cy="35" r="16" fill="#FFD9A0"/>${face(32, 33, 11)}<path d="M29 41 Q32 44 35 41" fill="none"/>`),
    frog: svg(`<circle cx="18" cy="20" r="8" fill="#8EDC8E"/><circle cx="46" cy="20" r="8" fill="#8EDC8E"/><ellipse cx="32" cy="38" rx="23" ry="17" fill="#8EDC8E"/><circle cx="18" cy="20" r="2.4" fill="${OUT}" stroke="none"/><circle cx="46" cy="20" r="2.4" fill="${OUT}" stroke="none"/><path d="M22 41 Q32 49 42 41" fill="none"/>`),
    turtle: svg(`<ellipse cx="30" cy="36" rx="21" ry="15" fill="#7CCB8E"/><circle cx="54" cy="34" r="7" fill="#A9E0A9"/><path d="M20 28 L30 24 L40 28 L40 40 L30 44 L20 40Z" fill="#5FB478" stroke-width="2"/><path d="M14 48 L14 54 M42 48 L42 54" stroke-width="5"/>`),
    butterfly: svg(`<path d="M32 32 Q8 4 6 28 Q6 42 32 34Z M32 32 Q56 4 58 28 Q58 42 32 34Z" fill="#C7A8F0"/><path d="M32 34 Q14 40 18 54 Q28 54 32 38Z M32 34 Q50 40 46 54 Q36 54 32 38Z" fill="#E6D2FA"/><path d="M32 20 V50 M32 20 Q28 12 24 12 M32 20 Q36 12 40 12" fill="none"/>`),
    bee: svg(`<ellipse cx="20" cy="22" rx="9" ry="12" fill="#E6F4FF" transform="rotate(-25 20 22)"/><ellipse cx="44" cy="22" rx="9" ry="12" fill="#E6F4FF" transform="rotate(25 44 22)"/><ellipse cx="32" cy="38" rx="19" ry="16" fill="#FFD84D"/><path d="M26 24 Q22 38 27 53 M38 24 Q42 38 37 53" fill="none" stroke-width="4"/>${face(32, 34, 10)}`),
    paw: svg(`<ellipse cx="32" cy="42" rx="14" ry="11" fill="#FFB8C8"/><circle cx="14" cy="28" r="6" fill="#FFB8C8"/><circle cx="26" cy="17" r="6" fill="#FFB8C8"/><circle cx="38" cy="17" r="6" fill="#FFB8C8"/><circle cx="50" cy="28" r="6" fill="#FFB8C8"/>`),
    drum: svg(`<path d="M10 24 V46 Q32 58 54 46 V24Z" fill="#E98B6B"/><ellipse cx="32" cy="24" rx="22" ry="9" fill="#FFE2C4"/><path d="M14 32 L24 52 M26 34 L32 54 M38 34 L44 52 M50 32 L40 50" fill="none" stroke-width="1.6"/><path d="M20 8 L32 22 M44 8 L32 22" fill="none" stroke-width="3"/>`),
    music: svg(`<path d="M24 46 V14 L50 8 V40" fill="none" stroke-width="3"/><ellipse cx="18" cy="47" rx="8" ry="6" fill="#B79CED"/><ellipse cx="44" cy="41" rx="8" ry="6" fill="#B79CED"/><path d="M24 22 L50 16" stroke-width="5"/>`),
    guitar: svg(`<path d="M42 10 L54 22 L48 28 L36 16Z" fill="#B98253"/><path d="M36 22 L44 30 L28 46" fill="none" stroke-width="3"/><path d="M26 28 Q38 24 38 36 Q38 44 32 46 Q32 54 20 54 Q8 54 8 42 Q8 34 18 36 Q16 28 26 28Z" fill="#F4B27A"/><circle cx="23" cy="42" r="3.5" fill="${OUT}" stroke="none"/>`),
    ball: svg(`<circle cx="32" cy="32" r="22" fill="#fff"/><path d="M32 22 L41 29 L38 40 H26 L23 29Z" fill="#6E5A5F"/><path d="M32 22 V10 M41 29 L52 25 M38 40 L45 50 M26 40 L19 50 M23 29 L12 25" fill="none" stroke-width="2"/>`),
    bike: svg(`<circle cx="15" cy="42" r="10" fill="none"/><circle cx="49" cy="42" r="10" fill="none"/><path d="M15 42 L28 24 H42 L49 42 M28 24 L33 42 H15 M24 18 H31 M42 24 L40 16 H46" fill="none"/><circle cx="33" cy="42" r="3" fill="#FFB8C8"/>`),
    bus: svg(`<rect x="8" y="12" width="48" height="36" rx="8" fill="#FF9D8A"/><rect x="13" y="18" width="38" height="14" rx="3" fill="#E8F6FF"/><circle cx="20" cy="50" r="5" fill="#6E5A5F"/><circle cx="44" cy="50" r="5" fill="#6E5A5F"/><circle cx="16" cy="39" r="2.4" fill="#FFE066" stroke="none"/><circle cx="48" cy="39" r="2.4" fill="#FFE066" stroke="none"/>`),
    castle: svg(`<path d="M10 56 V24 H18 V30 H24 V24 H30 V30 H36 V24 H42 V30 H48 V24 H54 V56Z" fill="#E9D9F5"/><path d="M26 56 V42 Q32 34 38 42 V56Z" fill="#B79CED"/><path d="M32 24 V8 L46 13 L32 18" fill="#FF9DB8"/>`),
    bridge: svg(`<path d="M4 42 H60 M4 50 H60" fill="none"/><path d="M12 42 V16 M52 42 V16" stroke-width="4" fill="none"/><path d="M12 16 Q32 48 52 16" fill="none"/><path d="M22 36 V42 M32 40 V42 M42 36 V42" fill="none"/>`),
    house: svg(`<path d="M8 32 L32 10 L56 32Z" fill="#FF9D8A"/><rect x="14" y="32" width="36" height="24" fill="#FFE9C7"/><rect x="27" y="40" width="10" height="16" rx="3" fill="#B98253"/><rect x="17" y="36" width="7" height="7" rx="1.5" fill="#BFE3F5"/><rect x="40" y="36" width="7" height="7" rx="1.5" fill="#BFE3F5"/>`),
    cup: svg(`<path d="M15 24 H45 V38 Q45 52 30 52 Q15 52 15 38Z" fill="#fff"/><path d="M45 28 Q56 28 55 38 Q54 44 45 44" fill="none" stroke-width="3"/><path d="M24 18 Q20 12 25 8 M33 18 Q29 12 34 8" fill="none" stroke="#C9A89E" stroke-width="2.4"/><path d="M22 32 H38" stroke="#FF9DB8" stroke-width="4"/>`),
    bread: svg(`<path d="M8 30 Q8 14 32 14 Q56 14 56 30 Q56 36 52 36 V50 Q52 54 48 54 H16 Q12 54 12 50 V36 Q8 36 8 30Z" fill="#F4C27A"/><path d="M22 24 L26 32 M32 22 L36 30 M42 24 L46 32" fill="none" stroke-width="2.2"/>`),
    cheese: svg(`<path d="M6 44 L54 20 V44Z M6 44 V52 H54 V44" fill="#FFD966"/><circle cx="22" cy="46" r="2.5" fill="#F0B93B" stroke="none"/><circle cx="38" cy="38" r="3.5" fill="#F0B93B" stroke="none"/><circle cx="44" cy="46" r="2.2" fill="#F0B93B" stroke="none"/>`),
    apple: svg(`<path d="M32 20 Q20 12 12 24 Q6 40 16 52 Q24 58 32 54 Q40 58 48 52 Q58 40 52 24 Q44 12 32 20Z" fill="#FF8A8A"/><path d="M32 20 Q32 10 38 6" fill="none" stroke-width="3"/><path d="M36 14 Q44 6 50 12 Q42 18 36 14Z" fill="#7CCB8E"/>`),
    orange: svg(`<circle cx="32" cy="36" r="22" fill="#FFB347"/><path d="M32 14 Q38 6 46 10 Q42 18 32 14Z" fill="#7CCB8E"/>${face(32, 38, 12)}`),
    grapes: svg(`${[[20, 28], [32, 28], [44, 28], [26, 40], [38, 40], [32, 52]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#B79CED"/>`).join('')}<path d="M32 18 Q32 8 40 6" fill="none" stroke-width="3"/>`),
    banana: svg(`<path d="M10 24 Q14 52 46 54 Q56 54 56 46 Q36 48 26 36 Q20 28 18 18Z" fill="#FFE066"/><path d="M10 24 L18 18" stroke-width="4"/>`),
    coconut: svg(`<circle cx="32" cy="32" r="22" fill="#B98253"/><path d="M14 22 Q32 12 50 22 Q50 34 32 36 Q14 34 14 22Z" fill="#fff" stroke-width="2"/><circle cx="26" cy="46" r="2.4" fill="${OUT}" stroke="none"/><circle cx="38" cy="46" r="2.4" fill="${OUT}" stroke="none"/>`),
    corn: svg(`<path d="M32 6 Q46 18 44 40 Q40 52 32 54 Q24 52 20 40 Q18 18 32 6Z" fill="#FFE066"/><path d="M26 18 V46 M32 12 V52 M38 18 V46 M22 30 H42 M24 40 H40" fill="none" stroke-width="1.5"/><path d="M32 58 Q14 54 12 30 Q24 36 32 54Z M32 58 Q50 54 52 30 Q40 36 32 54Z" fill="#7CCB8E"/>`),
    chili: svg(`<path d="M16 16 Q54 14 52 44 Q50 56 40 56 Q46 40 32 30 Q22 24 16 16Z" fill="#FF7A7A"/><path d="M16 16 Q12 8 20 8" fill="none" stroke="#5FB478" stroke-width="4"/>`),
    bowl: svg(`<path d="M8 30 H56 Q56 54 32 54 Q8 54 8 30Z" fill="#FFE9C7"/><path d="M14 30 Q16 14 28 14 Q32 20 26 30 M34 30 Q34 16 46 14 Q50 22 44 30" fill="#FF9D8A"/><path d="M42 8 L30 28" fill="none" stroke-width="3"/>`),
    sweet: svg(`<path d="M12 32 H52 L46 56 H18Z" fill="#FFB8C8"/><path d="M14 32 Q10 18 24 16 Q26 6 38 10 Q52 10 50 32Z" fill="#FFF3F6"/><circle cx="38" cy="8" r="4" fill="#FF7A8A"/>`),
    volcano: svg(`<path d="M6 56 L24 24 H40 L58 56Z" fill="#C79A8A"/><path d="M24 24 Q32 30 40 24" fill="#FF8A5C"/><path d="M28 18 Q24 10 30 6 M38 18 Q42 10 36 4" fill="none" stroke="#C9A89E"/>`),
    snow: svg(`<g stroke="#8FC5EA" stroke-width="3.2">${[0, 60, 120].map(a => `<path d="M32 8 V56 M24 14 L32 20 L40 14 M24 50 L32 44 L40 50" transform="rotate(${a} 32 32)" fill="none"/>`).join('')}</g>`),
    kite: svg(`<path d="M32 6 L50 26 L32 46 L14 26Z" fill="#FF9DB8"/><path d="M32 6 V46 M14 26 H50" fill="none" stroke-width="1.8"/><path d="M32 46 Q24 52 32 56 Q40 60 34 64" fill="none"/>`),
    lantern: svg(`<path d="M32 4 V10" fill="none"/><rect x="22" y="10" width="20" height="6" rx="2" fill="#B98253"/><ellipse cx="32" cy="32" rx="16" ry="17" fill="#FF8A7A"/><path d="M24 17 Q20 32 24 47 M32 15 V49 M40 17 Q44 32 40 47" fill="none" stroke-width="1.8"/><rect x="24" y="48" width="16" height="5" rx="2" fill="#B98253"/>`),
    gem: svg(`<path d="M16 14 H48 L58 26 L32 56 L6 26Z" fill="#A8E6F0"/><path d="M6 26 H58 M24 14 L20 26 L32 56 L44 26 L40 14" fill="none" stroke-width="1.8"/>`),
    crown: svg(`<path d="M8 46 L8 20 L22 32 L32 14 L42 32 L56 20 L56 46Z" fill="#FFD966"/><circle cx="32" cy="38" r="4" fill="#FF8A8A" stroke-width="1.8"/>`),
    star: svg(`<path d="M32 6 L39 25 L58 25 L43 37 L49 56 L32 44 L15 56 L21 37 L6 25 L25 25Z" fill="#FFD36B"/>${face(32, 33, 9)}`),
    heart: svg(`<path d="M32 56 Q6 38 8 22 Q10 8 24 10 Q30 11 32 18 Q34 11 40 10 Q54 8 56 22 Q58 38 32 56Z" fill="#FF8FA3"/>${face(32, 28, 12)}`),
    book: svg(`<path d="M8 12 H28 Q32 12 32 16 V54 Q32 50 28 50 H8Z" fill="#FFB8A8"/><path d="M56 12 H36 Q32 12 32 16 V54 Q32 50 36 50 H56Z" fill="#FFD9B8"/><path d="M14 22 H26 M14 30 H26 M38 22 H50 M38 30 H50" fill="none" stroke-width="1.8"/>`),
    balloon: svg(`<ellipse cx="32" cy="26" rx="17" ry="20" fill="#FF9DB8"/><path d="M28 46 H36 L32 52Z" fill="#FF9DB8"/><path d="M32 52 Q26 58 32 62" fill="none"/>`),
    cactus: svg(`<rect x="22" y="10" width="20" height="46" rx="10" fill="#7CCB8E"/><path d="M22 36 H14 V24 M42 30 H50 V18" fill="none" stroke="#7CCB8E" stroke-width="7"/><path d="M22 36 H14 V24 M42 30 H50 V18" fill="none" stroke-width="1" opacity="0"/>${face(32, 30, 8)}`),
    olive: svg(`<path d="M8 54 Q30 40 56 10" fill="none" stroke-width="3"/><path d="M20 46 Q14 34 24 30 Q28 40 20 46Z M34 34 Q28 22 38 18 Q42 28 34 34Z M44 22 Q42 10 52 10 Q54 20 44 22Z" fill="#8FBF7A"/><ellipse cx="30" cy="50" rx="5" ry="6.5" fill="#7A8F5A" transform="rotate(30 30 50)"/><ellipse cx="44" cy="40" rx="5" ry="6.5" fill="#5E7A4A" transform="rotate(30 44 40)"/>`),
    anchor: svg(`<circle cx="32" cy="12" r="5" fill="none"/><path d="M32 17 V54 M20 28 H44 M10 38 Q14 54 32 54 Q50 54 54 38" fill="none" stroke-width="3"/>`),
    rain: svg(`<path d="M18 36 a10 10 0 0 1 1-20 a13 13 0 0 1 25 3 a8.5 8.5 0 0 1 1 17Z" fill="#D9E6F5"/><path d="M22 42 L19 52 M33 42 L30 52 M44 42 L41 52" fill="none" stroke="#6FB4E8" stroke-width="3"/>`),
    wind: svg(`<path d="M6 24 H38 Q50 24 50 16 Q50 10 44 10 M6 36 H46 Q58 36 58 44 Q58 52 50 52 M6 46 H26" fill="none" stroke-width="3"/>`)
  };

  /* which drawing each emoji becomes (anything not listed is dropped) */
  const MAP = {
    sun: '☀️ 🌞 🌅 🌄 🌇', cloud: '☁️', rain: '🌧️', wind: '🌬️', wave: '🌊', mountain: '⛰️ 🏔️ 🏞️', palm: '🌴 🏝️ 🏖️', tree: '🌲 🌳', leaf: '🌿 ☘️', flower: '🌺 🌸 🌷 🌹 🌻',
    shell: '🐚', fish: '🐟 🐠 🦈 🦐', boat: '⛵ ⛴️ 🚢 🛶', bird: '🦅 🦜', penguin: '🐧', cat: '🐈', dog: '🐕', bear: '🐻', sheep: '🐑', elephant: '🐘', lion: '🦁',
    frog: '🐸', turtle: '🐢', butterfly: '🦋', bee: '🐝', paw: '🐆 🐅 🦍 🐒 🦒 🦓 🦏 🦛 🦬 🐎 🐴 🐄 🦌 🦙 🐊 🦥 🐋', drum: '🥁', music: '🎶 🎻 🎺 🎹', guitar: '🎸',
    ball: '⚽ 🏀 🏉 🏏 ⚾', bike: '🚲 🛵 🛺', bus: '🚌 🚐 🚋 🚆 🚂', castle: '🏰 🏯 ⛪ 🛕 🏛️', bridge: '🌉', house: '🏠 🏙️', cup: '☕ 🍵 🫖 🧋', bread: '🍞 🥐 🫓 🥖',
    cheese: '🧀', apple: '🍎 🍑', orange: '🍊 🥝', grapes: '🍇 🍷', banana: '🍌 🥭', coconut: '🥥', corn: '🌽 🥔 🌾', chili: '🌶️', bowl: '🍜 🍚 🍲 🥙 🍛 🥟 🥗 🍖 🍟',
    sweet: '🧁 🥧 🍫 🍬 🧇 🥞 🍯', volcano: '🌋', snow: '❄️ 🧊', kite: '🪁', balloon: '🎈 🎉', lantern: '🏮 🪔', gem: '💎', crown: '👑', cactus: '🌵', anchor: '⚓', olive: '🫒', book: '📚'
  };
  const EMOJI_KEY = {};
  Object.entries(MAP).forEach(([k, list]) => list.split(' ').forEach(e => { EMOJI_KEY[e.replace(/️/g, '')] = k; }));
  const NAMES = { sun: 'Sunshine', cloud: 'Cloud', rain: 'Rain', wind: 'Wind', wave: 'Waves', mountain: 'Mountains', palm: 'Palm tree', tree: 'Tree', leaf: 'Leaf', flower: 'Flower', shell: 'Seashell', fish: 'Fish', boat: 'Boat', bird: 'Bird', penguin: 'Penguin', cat: 'Cat', dog: 'Dog', bear: 'Bear', sheep: 'Sheep', elephant: 'Elephant', lion: 'Lion', frog: 'Frog', turtle: 'Turtle', butterfly: 'Butterfly', bee: 'Bee', paw: 'Wildlife', drum: 'Drum', music: 'Music', guitar: 'Guitar', ball: 'Football', bike: 'Bicycle', bus: 'Bus', castle: 'Old building', bridge: 'Bridge', house: 'Home', cup: 'Warm drink', bread: 'Fresh bread', cheese: 'Cheese', apple: 'Fruit', orange: 'Orange', grapes: 'Grapes', banana: 'Banana', coconut: 'Coconut', corn: 'Corn', chili: 'Chilli', bowl: 'Tasty food', sweet: 'Sweet treat', volcano: 'Volcano', snow: 'Snow', kite: 'Kite', balloon: 'Party', lantern: 'Lantern', gem: 'Gem', crown: 'Crown', cactus: 'Cactus', anchor: 'Anchor', olive: 'Olive branch', book: 'Books', star: 'Star', heart: 'Heart' };

  Object.keys(I).forEach(k => { STICKER_SVG['i-' + k] = I[k]; });
  const FILL = ['star', 'heart', 'book', 'sun', 'cloud', 'leaf'];
  Object.values(COURSES).forEach(c => {
    const seen = new Set(), out = [];
    (c.stickers || []).forEach(([ic, name]) => {
      let key = null;
      if (ic.startsWith('svg:')) { if (['pyramid', 'fez'].includes(ic.slice(4)) && c.id !== 'ar-LB') return; if (!seen.has(ic)) { seen.add(ic); out.push([ic, name]); } return; }
      key = EMOJI_KEY[ic.replace(/️/g, '')];
      if (!key || seen.has(key)) return;
      seen.add(key); out.push(['svg:i-' + key, COURSE_STICKERS && Object.prototype.hasOwnProperty.call(COURSE_STICKERS, c.id) ? name : NAMES[key]]);
    });
    for (const k of FILL) { if (out.length >= 6) break; if (!seen.has(k)) { seen.add(k); out.push(['svg:i-' + k, NAMES[k]]); } }
    c.stickers = out;
  });
})();
