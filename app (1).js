'use strict';
/* =========================================================
   Lexi – prototype logic
   No backend: everything is saved in localStorage.
   Tutors, friends, live classes and payments use sample data.
   ========================================================= */

/* ---------- helpers ---------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const pad = n => String(n).padStart(2, '0');
const dateISO = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayISO = () => dateISO(new Date());
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z]/g, '').toUpperCase();

/* ---------- icons (simple, recognisable line icons) ---------- */
const ICONS = {
  home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
  cards: '<rect x="3" y="7" width="13" height="13" rx="3"/><path d="M8 4h10a3 3 0 0 1 3 3v9"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="4"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  pin: '<path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c2.5 0 4 1.8 4 4.5"/>',
  video: '<rect x="2" y="6" width="13" height="12" rx="3"/><path d="m15 10 7-4v12l-7-4"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  more: '<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
  bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="3"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  redo: '<path d="M20 12a8 8 0 1 1-3-6.2"/><path d="M20 4v5h-5"/>',
  grid: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>',
  quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  left: '<path d="m15 5-7 7 7 7"/>',
  right: '<path d="m9 5 7 7-7 7"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  flame: '<path d="M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 .3 1.5 1 2 2 2 0-3-1-5 1-8z"/>'
};
const icon = (n, s = 22) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;
const paintIcons = (root = document) => $$('[data-icon]', root).forEach(el => { if (!el.firstChild) el.innerHTML = icon(el.dataset.icon); });

/* ---------- state ---------- */
const KEY = 'lexi.prototype.v2';

function blankState() {
  return {
    course: null, courses: {}, words: [], log: {}, level: 'A2', name: '', email: '', premium: false, plan: 'free', billing: 'monthly',
    reminder: { on: false, time: '18:00' }, booked: [], chats: {}, friends: []
  };
}

/* Starter words and a sample practice history for one country's course */
function seedCourse(id) {
  const c = COURSES[id], now = new Date();
  const ago = n => { const d = new Date(); d.setDate(d.getDate() - n); return dateISO(d); };
  const cons = c.concepts ? c.concepts.map((t, i) => [t, (c.meanings && c.meanings[i]) || CONCEPTS[i][0], CONCEPTS[i][1]]).filter(r => r[0]) : [];
  const list = cons.concat(c.extras);
  const newFrom = c.newFrom != null ? c.newFrom : cons.length;
  const words = list.map((r, i) => ({
    id: id + '-' + (i + 1), term: r[0], meaning: r[1], emoji: r[2], example: '',
    added: i < newFrom ? ago(Math.max(1, newFrom - i)) : todayISO(), new: i >= newFrom
  }));
  const learned = words.filter(w => !w.new).map(w => w.id);
  const log = {};
  for (let d = 1; d < now.getDate(); d++) {
    if ((d * 7) % 5 === 0) continue;
    log[dateISO(new Date(now.getFullYear(), now.getMonth(), d))] = learned.slice(0, Math.min(learned.length, 2 + ((d * 3) % 5)));
  }
  for (let k = 1; k <= 3; k++) { const d = new Date(); d.setDate(d.getDate() - k); if (d.getMonth() === now.getMonth()) log[dateISO(d)] = learned.slice(0, Math.min(learned.length, 3 + k)); }
  return { words, log };
}

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && s.courses) {
      const st = Object.assign(blankState(), s);
      const cur = st.course && st.courses[st.course];
      if (cur) { st.words = cur.words; st.log = cur.log; } else st.course = null;
      return st;
    }
  } catch (e) { /* ignore */ }
  return blankState();
}
function save() {
  try {
    if (state.course) state.courses[state.course] = { words: state.words, log: state.log };
    localStorage.setItem(KEY, JSON.stringify(Object.assign({}, state, { words: [], log: {} })));
  } catch (e) { /* ignore */ }
}
let state = load();
const courseInfo = () => (state.course ? COURSES[state.course] : null);

/* Switch to another country's course (each keeps its own words and history) */
function chooseCourse(id) {
  if (!COURSES[id]) return;
  if (state.course) state.courses[state.course] = { words: state.words, log: state.log };
  const saved = state.courses[id] || seedCourse(id);
  state.words = saved.words; state.log = saved.log; state.course = id;
  liveLang = SESSIONS.some(s => s.lang === COURSES[id].lang) ? COURSES[id].lang : '';
  save();
}

const count = iso => (state.log[iso] || []).length;
function streak() {
  const d = new Date(); let n = 0;
  if (!count(dateISO(d))) d.setDate(d.getDate() - 1);
  while (count(dateISO(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function dailyGoal() {
  const counts = [];
  for (let i = 1; i <= 7; i++) { const d = new Date(); d.setDate(d.getDate() - i); const c = count(dateISO(d)); if (c) counts.push(c); }
  const avg = counts.length ? counts.reduce((a, b) => a + b, 0) / counts.length : null;
  let g = avg ? Math.round(avg) + 1 : 4;
  g = Math.max(4, Math.min(15, g));
  return { goal: Math.max(1, Math.min(g, state.words.length)), avg, days: counts.length };
}
function markDone(id) {
  const t = todayISO();
  const arr = state.log[t] || (state.log[t] = []);
  const w = state.words.find(x => x.id === id);
  if (w) w.new = false;
  if (!arr.includes(id)) arr.push(id);
  save(); renderHeader();
}

/* ---------- toast ---------- */
let toastT;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---------- country stickers (little icons for the chosen country) ---------- */
const stickerIcon = ic => (ic.startsWith('svg:') ? STICKER_SVG[ic.slice(4)] : ic);
const stickerHTML = (s, size) => `<span class="sticker ${size}" role="img" aria-label="${esc(s[1])}" title="${esc(s[1])}">${stickerIcon(s[0])}</span>`;
function renderStrip() {
  const c = courseInfo(), el = $('#strip');
  el.hidden = !c;
  if (c) el.innerHTML = c.stickers.map(s => stickerHTML(s, 'sm')).join('');
}

/* ---------- header ---------- */
function renderHeader() {
  renderStrip();
  $('#streakChip').innerHTML = `🔥 ${streak()} day${streak() === 1 ? '' : 's'}`;
  const p = $('#planPill');
  p.textContent = state.premium ? 'Premium ✦' : 'Free';
  p.classList.toggle('is-premium', state.premium);
  $$('.pro').forEach(el => el.hidden = state.premium);
  const c = courseInfo(), lp = $('#langPill');
  lp.hidden = !c;
  if (c) {
    lp.innerHTML = `<span aria-hidden="true">${c.flag}</span> ${esc(c.dialect)} <span aria-hidden="true">▾</span>`;
    lp.setAttribute('aria-label', `Learning ${c.dialect}. Change language`);
  }
}

/* ---------- router ---------- */
const ROUTES = ['globe', 'home', 'practice', 'progress', 'tutors', 'friends', 'live', 'plans'];
const TITLES = { globe: 'Choose a language', home: 'Home', practice: 'Practice', progress: 'Progress', tutors: 'Find a tutor', friends: 'Friends', live: 'Live classes', plans: 'Plans' };
let pendingGame = null, firstRoute = true;

function route() {
  let r = (location.hash || '#globe').slice(1);
  if (!ROUTES.includes(r)) r = state.course ? 'home' : 'globe';
  if (!state.course) r = 'globe';      /* the globe always comes first */
  document.body.classList.toggle('on-globe', r === 'globe');
  if (r !== 'globe') stopGlobe();
  $$('.screen').forEach(s => s.hidden = s.id !== 'screen-' + r);
  $$('[data-route]').forEach(a => a.getAttribute('data-route') === r ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
  document.title = `${TITLES[r]} · Lexi`;
  if ($('#moreSheet').open) $('#moreSheet').close();
  ({ globe: renderGlobe, home: renderHome, practice: renderPractice, progress: renderProgress, tutors: renderTutors, friends: renderFriends, live: renderLive, plans: renderPlans })[r]();
  renderHeader();
  window.scrollTo(0, 0);
  if (!firstRoute) { const h = $(`#screen-${r} h1`); if (h) h.focus({ preventScroll: true }); }
  firstRoute = false;
  if (r === 'practice' && pendingGame) { const g = pendingGame; pendingGame = null; startGame(g); }
}
window.addEventListener('hashchange', route);

/* ---------- word markup ---------- */
const wordHTML = w => `<span class="word${w.new ? ' is-new' : ''}">${esc(w.term)}</span>`;

/* =========================================================
   HOME
   ========================================================= */
function renderHome() {
  const h = new Date().getHours();
  const hello = h < 12 ? 'Good morning' : h < 19 ? 'Good afternoon' : 'Good evening';
  $('#greetDate').textContent = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  $('#greetTitle').textContent = `${hello}${state.name ? ', ' + state.name : ''}!`;
  const course = courseInfo();
  $('#courseLine').innerHTML = `<span aria-hidden="true">${course.flag}</span> Learning <strong>${esc(course.dialect)}</strong>`;
  $('#tipText').textContent = course.tip;
  $('#stickerTitle').textContent = `Little things from ${prettyCountry(course.country)}`;
  $('#stickerSheet').innerHTML = course.stickers.map(s => `<figure class="sticker-card">${stickerHTML(s, 'lg')}<figcaption>${esc(s[1])}</figcaption></figure>`).join('');

  const { goal, avg, days } = dailyGoal();
  const done = count(todayISO());
  $('#ringNum').textContent = done;
  $('#ringOf').textContent = `of ${goal}`;
  $('#ringFg').style.strokeDashoffset = 326.7 * (1 - Math.min(1, done / goal));
  $('#paceText').textContent = avg
    ? `You practised on ${days} of the last 7 days, averaging ${avg.toFixed(1)} words. Lexi nudges your goal up by one, never more.`
    : 'Starting gently with 4 words. Lexi adjusts as it learns your pace.';

  const list = [...state.words.filter(w => w.new), ...state.words.filter(w => !w.new).slice(-3).reverse()].slice(0, 8);
  $('#homeWords').innerHTML = list.length ? list.map(w => `
    <li><span class="emoji" aria-hidden="true">${w.emoji || '📝'}</span>
      <span>${wordHTML(w)}${w.new ? '<span class="badge-new">new</span>' : ''}</span>
      <span class="meaning">${esc(w.meaning)}</span></li>`).join('')
    : '<li class="empty">No words yet. Add some from your next class!</li>';

  $('#remOn').checked = state.reminder.on;
  $('#remTime').value = state.reminder.time;
  checkBanner();
}

/* reminders */
let remTimer, bannerDismissed = false;
function nowMinutes(t) { const [h, m] = t.split(':').map(Number); return h * 60 + m; }
function checkBanner() {
  const d = new Date();
  const due = state.reminder.on && !bannerDismissed && (d.getHours() * 60 + d.getMinutes()) >= nowMinutes(state.reminder.time) && count(todayISO()) < dailyGoal().goal;
  $('#reminderBanner').hidden = !due;
}
function scheduleReminder() {
  clearTimeout(remTimer);
  if (!state.reminder.on) return;
  const [h, m] = state.reminder.time.split(':').map(Number);
  const now = new Date(), t = new Date();
  t.setHours(h, m, 0, 0);
  if (t <= now) t.setDate(t.getDate() + 1);
  remTimer = setTimeout(() => { fireReminder(); scheduleReminder(); }, t - now);
}
function fireReminder() {
  bannerDismissed = false;
  toast('🌸 Time for your daily practice!');
  try { if ('Notification' in window && Notification.permission === 'granted') new Notification('Lexi 🌸', { body: 'A few minutes of practice keeps your streak going.' }); } catch (e) { /* ignore */ }
  checkBanner();
}
$('#remOn').addEventListener('change', async e => {
  state.reminder.on = e.target.checked; save();
  if (e.target.checked) {
    if ('Notification' in window && Notification.permission === 'default') {
      try { await Notification.requestPermission(); } catch (err) { /* ignore */ }
    }
    toast(`Reminder set for ${state.reminder.time}`);
  } else toast('Reminder turned off');
  scheduleReminder(); checkBanner();
});
$('#remTime').addEventListener('change', e => { state.reminder.time = e.target.value || '18:00'; save(); scheduleReminder(); checkBanner(); if (state.reminder.on) toast(`Reminder set for ${state.reminder.time}`); });
$('#dismissBanner').addEventListener('click', () => { bannerDismissed = true; checkBanner(); });

/* =========================================================
   ADD VOCAB
   ========================================================= */
const EMOJIS = ['🍎', '🍞', '🥛', '☕', '🍕', '🐶', '🐱', '🏠', '🚗', '🚆', '✈️', '📚', '💧', '☀️', '🌙', '🏖️', '🌳', '👕', '🎵', '⚽', '🛒', '🏥', '💼', '🪟'];
let pickedEmoji = '', addMode = 'single';
const dlg = $('#addDialog');

function openAdd(prefill = '') {
  $('#addForm').reset();
  pickedEmoji = ''; setMode('single');
  $('#addTerm').value = prefill; $('#addErr').hidden = true;
  $('#emojiRow').innerHTML = EMOJIS.map(e => `<button type="button" aria-pressed="false" aria-label="Picture ${e}" data-e="${e}">${e}</button>`).join('');
  if (!dlg.open) dlg.showModal();
  (prefill ? $('#addMeaning') : $('#addTerm')).focus();
}
function setMode(m) {
  addMode = m;
  $$('[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === m)));
  $('#modeSingle').hidden = m !== 'single'; $('#modeBulk').hidden = m !== 'bulk';
}
function addWord(term, meaning, example = '', emoji = '') {
  term = term.trim(); meaning = meaning.trim();
  if (!term || !meaning) return false;
  if (state.words.some(w => w.term.toLowerCase() === term.toLowerCase())) return false;
  state.words.push({ id: 'w' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), term, meaning, example: example.trim(), emoji, added: todayISO(), new: true });
  return true;
}
$('#emojiRow').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  pickedEmoji = pickedEmoji === b.dataset.e ? '' : b.dataset.e;
  $$('#emojiRow button').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.e === pickedEmoji)));
});
$$('[data-mode]').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
$('#addForm').addEventListener('submit', e => {
  e.preventDefault();
  const err = $('#addErr'); err.hidden = true;
  let added = 0, skipped = 0;
  if (addMode === 'single') {
    const t = $('#addTerm').value, m = $('#addMeaning').value;
    if (!t.trim() || !m.trim()) { err.textContent = 'Please fill in both the word and its meaning.'; err.hidden = false; return; }
    addWord(t, m, $('#addExample').value, pickedEmoji) ? added++ : skipped++;
  } else {
    $('#addBulk').value.split(/\n+/).forEach(line => {
      if (!line.trim()) return;
      const m = line.match(/^(.+?)\s*(?:=|:|\t|\s[-–—]\s)\s*(.+)$/);
      if (m && addWord(m[1], m[2])) added++; else skipped++;
    });
    if (!added && !skipped) { err.textContent = 'Paste at least one line like “word = meaning”.'; err.hidden = false; return; }
  }
  if (!added) { err.textContent = 'Nothing new was added. Those words may already be saved, or a line is missing “=”.'; err.hidden = false; return; }
  save(); dlg.close(); renderHeader();
  toast(`Added ${added} new word${added === 1 ? '' : 's'} 🌸${skipped ? ` (${skipped} skipped)` : ''}`);
  route();
});
$('#addClose').innerHTML = icon('close'); $('#addClose').addEventListener('click', () => dlg.close());
$('#addCancel').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
$('#quickAdd').addEventListener('submit', e => { e.preventDefault(); const v = $('#quickWord').value; $('#quickWord').value = ''; openAdd(v); });
document.addEventListener('click', e => { if (e.target.closest('[data-open-add]')) openAdd(); });

/* =========================================================
   PRACTICE
   ========================================================= */
let practiceSet = 'new', stopFns = [];
function stopGame() { stopFns.forEach(f => f()); stopFns = []; }
function showPicker() { $('#stage').hidden = true; $('#stage').innerHTML = ''; $('#picker').hidden = false; }
function renderPractice() {
  stopGame(); showPicker();
  $$('[data-set]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.set === practiceSet)));
}
$$('[data-set]').forEach(b => b.addEventListener('click', () => { practiceSet = b.dataset.set; renderPractice(); }));
document.addEventListener('click', e => {
  const t = e.target.closest('[data-game]'); if (!t) return;
  if ((location.hash || '#home') !== '#practice') { pendingGame = t.dataset.game; location.hash = '#practice'; } else startGame(t.dataset.game);
});

function deckFor(n, needEmoji = false) {
  let pool = state.words.filter(w => (!needEmoji || w.emoji) && (practiceSet === 'all' || w.new));
  if (!pool.length) { pool = state.words.filter(w => !needEmoji || w.emoji); if (pool.length) toast('No new words left, so we mixed in the ones you know.'); }
  return shuffle(pool).slice(0, n);
}
function shell(title) {
  $('#picker').hidden = true;
  const st = $('#stage'); st.hidden = false;
  st.innerHTML = `
    <div class="stage-head"><button class="btn ghost" id="stageBack">${icon('left')} All games</button><h2>${title}</h2></div>
    <div class="bar" role="progressbar" aria-label="Progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span id="barFill"></span></div>
    <p class="progress-text" id="barText" aria-live="polite"></p>
    <div id="stageBody"></div>`;
  $('#stageBack').onclick = () => { stopGame(); showPicker(); };
  return $('#stageBody');
}
function setProgress(done, total) {
  const p = total ? Math.round(done / total * 100) : 0;
  $('#barFill').style.width = p + '%';
  $('.bar').setAttribute('aria-valuenow', p);
  $('#barText').textContent = `${done} of ${total} done`;
}
function finish(body, { title, text, again }) {
  body.innerHTML = `<div class="finish"><div class="big-emoji" aria-hidden="true">🎉</div><h3 class="h2" tabindex="-1" id="finTitle">${title}</h3><p class="muted">${text}</p>
    <p><strong>${count(todayISO())}</strong> words completed today.</p>
    <div class="finish-actions"><button class="btn primary" id="againBtn">Play again</button><a class="btn" href="#progress">See progress</a><button class="btn ghost" id="otherBtn">Other games</button></div></div>`;
  $('#finTitle').focus();
  $('#againBtn').onclick = again; $('#otherBtn').onclick = () => { stopGame(); showPicker(); };
}
function emptyStage(title, msg) {
  const body = shell(title);
  body.innerHTML = `<div class="finish"><div class="big-emoji" aria-hidden="true">🌱</div><p>${msg}</p><div class="finish-actions"><button class="btn primary" data-open-add>Add words</button><button class="btn ghost" id="otherBtn">Back</button></div></div>`;
  $('#otherBtn').onclick = () => { stopGame(); showPicker(); };
}
function startGame(g) {
  stopGame();
  ({ flash: gameFlash, quiz: gameQuiz, search: gameSearch, match: gameMatch }[g] || gameFlash)();
}

/* ---------- Flashcards ---------- */
function gameFlash() {
  const deck = deckFor(10);
  if (!deck.length) return emptyStage('Flashcards', 'Add a few words first and your flashcards will appear here.');
  const body = shell('Flashcards');
  const total = deck.length; let queue = [...deck], done = 0, flipped = false;
  setProgress(0, total);
  const draw = () => {
    if (!queue.length) return finish(body, { title: 'Deck complete!', text: `You worked through ${total} cards.`, again: gameFlash });
    const w = queue[0];
    const front = `<span class="fc-label">${w.new ? 'New word' : 'Word'}</span>${w.emoji ? `<span class="fc-emoji" aria-hidden="true">${w.emoji}</span>` : ''}<span class="fc-main">${wordHTML(w)}</span><span class="fc-hint">Tap the card to flip</span>`;
    const back = `<span class="fc-label">Meaning</span><span class="fc-main">${esc(w.meaning)}</span>${w.example ? `<span class="fc-ex">“${esc(w.example)}”</span>` : ''}`;
    body.innerHTML = `
      <button class="flashcard${w.new ? ' is-new' : ''}" id="card" aria-label="Flashcard. Press to flip.">${flipped ? back : front}</button>
      <div class="fc-actions">${flipped
        ? `<button class="btn" id="later">${icon('redo')} Come back to it</button><button class="btn primary" id="got">${icon('check')} Got it</button>`
        : '<button class="btn primary" id="flip">Show answer</button>'}</div>`;
    $('#card').focus({ preventScroll: true });
    $('#card').onclick = () => { flipped = !flipped; draw(); };
    if ($('#flip')) $('#flip').onclick = () => { flipped = true; draw(); };
    if ($('#got')) $('#got').onclick = () => { markDone(w.id); queue.shift(); done++; flipped = false; setProgress(done, total); draw(); };
    if ($('#later')) $('#later').onclick = () => { queue.push(queue.shift()); flipped = false; toast('No problem, it’ll come back at the end.'); draw(); };
  };
  draw();
}

/* ---------- Multiple choice ---------- */
function gameQuiz() {
  if (state.words.length < 4) return emptyStage('Multiple choice', 'The quiz needs at least 4 words. Add a few more from class!');
  const deck = deckFor(8), body = shell('Multiple choice');
  let i = 0, score = 0; setProgress(0, deck.length);
  const ask = () => {
    if (i >= deck.length) return finish(body, { title: `${score} / ${deck.length} correct`, text: score === deck.length ? 'A perfect round! 🌟' : 'Come back to the tricky ones with flashcards.', again: gameQuiz });
    const w = deck[i], toTerm = Math.random() < .5;
    const opts = shuffle([w, ...shuffle(state.words.filter(x => x.id !== w.id)).slice(0, 3)]);
    body.innerHTML = `
      <div class="q-card"><p class="fc-label">${toTerm ? 'Which word means…' : 'What does this mean?'}</p>
        <h3 class="q-prompt">${toTerm ? esc(w.meaning) : wordHTML(w)}</h3></div>
      <div class="options" role="group" aria-label="Answers">${opts.map((o, k) => `<button class="opt" data-id="${o.id}"><span class="opt-key" aria-hidden="true">${'ABCD'[k]}</span>${esc(toTerm ? o.term : o.meaning)}</button>`).join('')}</div>
      <div class="q-feedback" id="fb" aria-live="polite"></div>`;
    $$('.opt', body).forEach(b => b.onclick = () => {
      const ok = b.dataset.id === w.id;
      $$('.opt', body).forEach(x => { x.disabled = true; if (x.dataset.id === w.id) x.classList.add('correct'); });
      if (!ok) b.classList.add('wrong'); else { score++; markDone(w.id); }
      i++; setProgress(i, deck.length);
      $('#fb').innerHTML = `<span>${ok ? '✅ Correct!' : `❌ It’s “${esc(toTerm ? w.term : w.meaning)}”`}</span><button class="btn primary" id="next">${i >= deck.length ? 'See results' : 'Next'}</button>`;
      $('#next').focus(); $('#next').onclick = ask;
    });
  };
  ask();
}

/* ---------- Word search ---------- */
function gameSearch() {
  const cand = shuffle(state.words.filter(w => { const n = norm(w.term); return n.length >= 3 && n.length <= 10 && (practiceSet === 'all' || w.new); }));
  let pool = cand.length ? cand : shuffle(state.words.filter(w => { const n = norm(w.term); return n.length >= 3 && n.length <= 10; }));
  if (!pool.length) return emptyStage('Word search', 'Add some single words (3–10 letters) to build a word search.');
  if (!cand.length) toast('No new words fit the grid, so we mixed in others.');
  const N = 10, grid = Array.from({ length: N }, () => Array(N).fill(''));
  const dirs = [[1, 0], [0, 1], [1, 1], [1, -1]], placed = [];
  for (const w of pool.slice(0, 8)) {
    if (placed.length >= 6) break;
    const s = norm(w.term);
    for (let t = 0; t < 250; t++) {
      const [dx, dy] = dirs[Math.floor(Math.random() * 4)];
      const str = Math.random() < .3 ? [...s].reverse().join('') : s;
      const x0 = Math.floor(Math.random() * N), y0 = Math.floor(Math.random() * N);
      const x1 = x0 + dx * (str.length - 1), y1 = y0 + dy * (str.length - 1);
      if (x1 < 0 || x1 >= N || y1 < 0 || y1 >= N) continue;
      let fit = true;
      for (let k = 0; k < str.length; k++) { const c = grid[y0 + dy * k][x0 + dx * k]; if (c && c !== str[k]) { fit = false; break; } }
      if (!fit) continue;
      for (let k = 0; k < str.length; k++) grid[y0 + dy * k][x0 + dx * k] = str[k];
      placed.push({ w, s, found: false }); break;
    }
  }
  const letters = placed.map(p => p.s).join('') + 'AEIOUNRST';
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!grid[y][x]) grid[y][x] = letters[Math.floor(Math.random() * letters.length)];

  const body = shell('Word search'); let start = null, found = 0; setProgress(0, placed.length);
  const render = () => {
    body.innerHTML = `
      <p class="muted">Read the clues, then tap the <strong>first</strong> and <strong>last</strong> letter of the word. Words can run in any straight direction, even backwards.</p>
      <div class="ws-wrap">
        <div class="ws-grid" id="wsGrid" role="group" aria-label="Letter grid">${grid.map((row, y) => row.map((c, x) => `<button class="ws-cell" data-x="${x}" data-y="${y}" aria-label="${c}, row ${y + 1}, column ${x + 1}">${c}</button>`).join('')).join('')}</div>
        <ul class="ws-list" id="wsList">${placed.map(p => `<li data-s="${p.s}"><span class="clue">${esc(p.w.meaning)}</span><span class="blanks">${'_ '.repeat(p.s.length).trim()}</span></li>`).join('')}</ul>
      </div>`;
    $('#wsGrid').addEventListener('click', onCell);
  };
  const cell = (x, y) => $(`.ws-cell[data-x="${x}"][data-y="${y}"]`, body);
  const onCell = e => {
    const c = e.target.closest('.ws-cell'); if (!c) return;
    const x = +c.dataset.x, y = +c.dataset.y;
    if (!start) { start = { x, y }; c.classList.add('sel'); return; }
    if (start.x === x && start.y === y) { c.classList.remove('sel'); start = null; return; }
    const dx = x - start.x, dy = y - start.y, len = Math.max(Math.abs(dx), Math.abs(dy)) + 1;
    const first = cell(start.x, start.y); first.classList.remove('sel');
    const straight = dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy);
    const sx = Math.sign(dx), sy = Math.sign(dy), cells = [];
    if (straight) for (let k = 0; k < len; k++) cells.push({ x: start.x + sx * k, y: start.y + sy * k });
    const str = cells.map(p => grid[p.y][p.x]).join('');
    const hit = straight && placed.find(p => !p.found && (p.s === str || [...p.s].reverse().join('') === str));
    start = null;
    if (!hit) { [first, c].forEach(el => { el.classList.add('shake'); setTimeout(() => el.classList.remove('shake'), 400); }); return; }
    hit.found = true; found++;
    cells.forEach(p => cell(p.x, p.y).classList.add('f' + (found % 6)));
    const li = $(`#wsList li[data-s="${hit.s}"]`, body);
    li.classList.add('done'); $('.blanks', li).textContent = hit.w.term + ' ✓';
    markDone(hit.w.id); setProgress(found, placed.length);
    if (found === placed.length) setTimeout(() => finish(body, { title: 'All words found!', text: 'Sharp eyes. 🔍', again: gameSearch }), 900);
  };
  render();
}

/* ---------- Matching (pictures + words) ---------- */
function gameMatch() {
  const deck = deckFor(5, true);
  if (deck.length < 3) return emptyStage('Matching', 'Matching needs at least 3 words with a picture. Pick an emoji when you add words!');
  const body = shell('Matching'); let matched = 0, sel = null, lock = false; setProgress(0, deck.length);
  const L = shuffle(deck), R = shuffle(deck);
  body.innerHTML = `
    <p class="muted">Tap a picture, then tap the word that goes with it.</p>
    <div class="match-grid">
      <div class="match-col" role="group" aria-label="Pictures">${L.map(w => `<button class="m-card pic" data-side="p" data-id="${w.id}" aria-label="Picture of ${esc(w.meaning)}">${w.emoji}</button>`).join('')}</div>
      <div class="match-col" role="group" aria-label="Words">${R.map(w => `<button class="m-card" data-side="w" data-id="${w.id}">${wordHTML(w)}</button>`).join('')}</div>
    </div>`;
  body.addEventListener('click', e => {
    const c = e.target.closest('.m-card'); if (!c || lock || c.classList.contains('ok')) return;
    if (!sel || sel.dataset.side === c.dataset.side) { if (sel) sel.classList.remove('sel'); sel = c; c.classList.add('sel'); return; }
    if (sel.dataset.id === c.dataset.id) {
      [sel, c].forEach(el => { el.classList.remove('sel'); el.classList.add('ok'); el.disabled = true; });
      markDone(c.dataset.id); matched++; setProgress(matched, deck.length); sel = null;
      if (matched === deck.length) setTimeout(() => finish(body, { title: 'All matched!', text: 'Pictures and words, together at last. 🧩', again: gameMatch }), 700);
    } else {
      lock = true; const a = sel; sel = null; a.classList.remove('sel');
      [a, c].forEach(el => el.classList.add('bad'));
      setTimeout(() => { [a, c].forEach(el => el.classList.remove('bad')); lock = false; }, 450);
    }
  });
}

/* =========================================================
   PROGRESS
   ========================================================= */
let cal = { y: new Date().getFullYear(), m: new Date().getMonth() };
function renderProgress() {
  const total = state.words.length, newCount = state.words.filter(w => w.new).length;
  const monthTotal = Object.entries(state.log).filter(([k]) => k.startsWith(`${cal.y}-${pad(cal.m + 1)}`)).reduce((a, [, v]) => a + v.length, 0);
  $('#stats').innerHTML = `
    <div class="stat s1"><strong>${streak()}</strong><span>day streak 🔥</span></div>
    <div class="stat s2"><strong>${total - newCount}</strong><span>words learned</span></div>
    <div class="stat s3"><strong>${newCount}</strong><span>new words waiting</span></div>
    <div class="stat s4"><strong>${monthTotal}</strong><span>completed this month</span></div>`;
  renderCal();
  $('#allWords').innerHTML = state.words.length ? [...state.words].reverse().map(w => `
    <li><span class="emoji" aria-hidden="true">${w.emoji || '📝'}</span>
      <span>${wordHTML(w)}${w.new ? '<span class="badge-new">new</span>' : ''}</span>
      <span class="meaning">${esc(w.meaning)}</span>
      <button class="del" data-del="${w.id}" aria-label="Delete ${esc(w.term)}">✕</button></li>`).join('')
    : '<li class="empty">Your words will show up here.</li>';
}
function renderCal() {
  $('#calPrev').innerHTML = icon('left'); $('#calNext').innerHTML = icon('right');
  const first = new Date(cal.y, cal.m, 1), days = new Date(cal.y, cal.m + 1, 0).getDate(), offset = (first.getDay() + 6) % 7;
  const today = todayISO();
  $('#calTitle').textContent = first.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  let h = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => `<div class="dow" role="columnheader">${d}</div>`).join('');
  for (let i = 0; i < offset; i++) h += '<div class="day blank" aria-hidden="true"></div>';
  for (let d = 1; d <= days; d++) {
    const iso = `${cal.y}-${pad(cal.m + 1)}-${pad(d)}`, c = count(iso), lvl = c === 0 ? 0 : c <= 2 ? 1 : c <= 4 ? 2 : c <= 6 ? 3 : 4;
    h += `<div class="day l${lvl}${iso === today ? ' today' : ''}${iso > today ? ' future' : ''}" role="gridcell" aria-label="${d} ${first.toLocaleDateString('en-GB', { month: 'long' })}: ${c} word${c === 1 ? '' : 's'}"><span>${d}</span><span class="n">${c || ''}</span></div>`;
  }
  $('#calendar').innerHTML = h;
}
$('#calPrev').addEventListener('click', () => { cal.m--; if (cal.m < 0) { cal.m = 11; cal.y--; } renderProgress(); });
$('#calNext').addEventListener('click', () => { cal.m++; if (cal.m > 11) { cal.m = 0; cal.y++; } renderProgress(); });
$('#allWords').addEventListener('click', e => {
  const b = e.target.closest('[data-del]'); if (!b) return;
  state.words = state.words.filter(w => w.id !== b.dataset.del); save(); renderProgress(); toast('Word removed');
});
$('#resetData').addEventListener('click', () => {
  if (confirm('Reset everything back to the sample data?')) { localStorage.removeItem(KEY); state = blankState(); save(); renderHeader(); location.hash = '#globe'; route(); toast('Demo data reset'); }
});

/* =========================================================
   PREMIUM GATES
   ========================================================= */
const GATE_COPY = {
  tutors: ['Find tutors near you', 'Browse tutor profiles on a map, filter by price, language and availability, and book private classes.'],
  friends: ['Learn with friends', 'See what your friends are learning and which level they’re on, then message each other to stay motivated.'],
  live: ['Join live lessons', 'Book small-group Zoom classes with a tutor. Your link appears as soon as you book.']
};
function applyGate(r) {
  const g = $('#gate-' + r), c = $('#content-' + r);
  g.hidden = state.premium; c.hidden = !state.premium;
  if (!state.premium) {
    g.innerHTML = `<div class="lock">${icon('lock')}</div><h2 class="h2">${GATE_COPY[r][0]}</h2><p class="muted">${GATE_COPY[r][1]}</p>
      <div class="gate-actions"><a class="btn primary" href="#plans">See plans</a><button class="btn" data-demo-premium>Preview Premium (demo)</button></div>`;
  }
  return state.premium;
}
document.addEventListener('click', e => {
  if (!e.target.closest('[data-demo-premium]')) return;
  state.premium = true; state.plan = 'premium'; save(); toast('Premium preview on ✦'); route();
});

/* =========================================================
   TUTORS (sample data)
   ========================================================= */
const TUTORS = [
  { id: 't1', name: 'Lucía M.', emoji: '👩‍🏫', color: '#FFD6CC', langs: ['Spanish'], price: 18, rating: 4.9, area: 'Malasaña', x: 250, y: 130, days: ['Mon', 'Wed', 'Fri'], evenings: true, bio: 'Patient, chatty and loves café role-play.' },
  { id: 't2', name: 'Pierre D.', emoji: '🧑‍🎨', color: '#BDEAE4', langs: ['French'], price: 24, rating: 4.8, area: 'Chamberí', x: 430, y: 105, days: ['Tue', 'Thu', 'Sat'], evenings: false, bio: 'Native Parisian. Pronunciation is my thing.' },
  { id: 't3', name: 'Emma W.', emoji: '👩‍💼', color: '#E1D9FA', langs: ['English'], price: 22, rating: 4.7, area: 'Retiro', x: 495, y: 215, days: ['Mon', 'Tue', 'Thu', 'Sun'], evenings: true, bio: 'Exam prep and everyday English.' },
  { id: 't4', name: 'Giulia R.', emoji: '🧑‍🍳', color: '#FFEDB8', langs: ['Italian'], price: 26, rating: 5.0, area: 'Lavapiés', x: 320, y: 300, days: ['Wed', 'Sat', 'Sun'], evenings: false, bio: 'Italian through food, music and stories.' },
  { id: 't5', name: 'Carlos S.', emoji: '🧔', color: '#FFD6CC', langs: ['Spanish'], price: 15, rating: 4.6, area: 'Atocha', x: 430, y: 330, days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], evenings: true, bio: 'Relaxed lessons for beginners.' },
  { id: 't6', name: 'Sofia K.', emoji: '👩‍🎓', color: '#BDEAE4', langs: ['French', 'English'], price: 30, rating: 4.9, area: 'Salamanca', x: 560, y: 120, days: ['Tue', 'Fri'], evenings: false, bio: 'Bilingual teacher with 10 years’ experience.' },
  { id: 't7', name: 'Marco B.', emoji: '🧑‍💻', color: '#E1D9FA', langs: ['Italian', 'Spanish'], price: 20, rating: 4.5, area: 'Moncloa', x: 115, y: 205, days: ['Thu', 'Sat', 'Sun'], evenings: true, bio: 'Conversation practice for busy people.' },
  { id: 't8', name: 'Hana L.', emoji: '🙋‍♀️', color: '#FFEDB8', langs: ['English', 'Spanish'], price: 12, rating: 4.4, area: 'La Latina', x: 245, y: 255, days: ['Wed', 'Fri', 'Sat'], evenings: true, bio: 'Student tutor, friendly and affordable.' },
  { id: 't9', name: 'Inês F.', emoji: '👩‍🏫', color: '#FFEDB8', langs: ['Portuguese'], price: 19, rating: 4.9, area: 'Chamberí', x: 335, y: 160, days: ['Mon', 'Wed', 'Sat'], evenings: true, bio: 'From Lisbon. European Portuguese, step by step.' },
  { id: 't10', name: 'Rafael S.', emoji: '🧑‍🎤', color: '#FFD6CC', langs: ['Portuguese', 'Spanish'], price: 17, rating: 4.8, area: 'Salamanca', x: 610, y: 285, days: ['Tue', 'Thu', 'Sun'], evenings: true, bio: 'From São Paulo. Brazilian Portuguese, with lots of speaking.' },
  { id: 't11', name: 'Anna K.', emoji: '👩‍🎨', color: '#E1D9FA', langs: ['German'], price: 23, rating: 4.7, area: 'Moncloa', x: 185, y: 335, days: ['Mon', 'Fri', 'Sat'], evenings: false, bio: 'Clear, calm German for beginners.' },
  { id: 't12', name: 'Yuki T.', emoji: '🧑‍🏫', color: '#FFD6CC', langs: ['Japanese'], price: 28, rating: 4.9, area: 'Retiro', x: 410, y: 268, days: ['Wed', 'Sat', 'Sun'], evenings: true, bio: 'Reading, speaking and a bit of manga.' },
  { id: 't13', name: 'Min-jun P.', emoji: '🧑‍💻', color: '#BDEAE4', langs: ['Korean'], price: 21, rating: 4.6, area: 'Malasaña', x: 95, y: 125, days: ['Tue', 'Thu'], evenings: true, bio: 'K-drama phrases and polite speech.' },
  { id: 't14', name: 'Wei L.', emoji: '👨‍🏫', color: '#FFEDB8', langs: ['Chinese'], price: 25, rating: 4.8, area: 'Salamanca', x: 660, y: 205, days: ['Mon', 'Wed', 'Fri'], evenings: false, bio: 'Mandarin tones made simple.' },
  { id: 't15', name: 'Rima K.', emoji: '👩‍🍳', color: '#E1D9FA', langs: ['Arabic', 'French'], price: 20, rating: 4.9, area: 'Lavapiés', x: 285, y: 345, days: ['Mon', 'Thu', 'Sat'], evenings: true, bio: 'From Beirut. Lebanese Arabic through food and everyday chat.' },
  { id: 't16', name: 'Omar H.', emoji: '🧑‍🏫', color: '#BDEAE4', langs: ['Arabic', 'English'], price: 18, rating: 4.7, area: 'Atocha', x: 520, y: 345, days: ['Tue', 'Wed', 'Sun'], evenings: true, bio: 'From Cairo. Egyptian Arabic and a lot of film quotes.' }
];
let tutorCourse = null;
let selTutor = null;
const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
function tutorMatches(t) {
  const l = $('#fLang').value, p = +$('#fPrice').value, a = $('#fAvail').value;
  if (l && !t.langs.includes(l)) return false;
  if (t.price > p) return false;
  if (a === 'today' && !t.days.includes(DAY[new Date().getDay()])) return false;
  if (a === 'evenings' && !t.evenings) return false;
  if (a === 'weekend' && !(t.days.includes('Sat') || t.days.includes('Sun'))) return false;
  return true;
}
function renderTutors() {
  if (!applyGate('tutors')) return;
  const sel = $('#fLang'), langs = [...new Set(Object.values(COURSES).map(c => c.lang))].sort();
  if (sel.options.length !== langs.length + 1) { const cur = sel.value; sel.innerHTML = '<option value="">Any</option>' + langs.map(l => `<option>${l}</option>`).join(''); sel.value = cur; }
  if (tutorCourse !== state.course) {          /* start with tutors for the language you picked */
    tutorCourse = state.course; selTutor = null;
    const l = courseInfo().lang;
    $('#fLang').value = [...$('#fLang').options].some(o => o.value === l) ? l : '';
  }
  const list = TUTORS.filter(tutorMatches);
  $('#fPriceOut').textContent = '€' + $('#fPrice').value;
  $('#tutorCount').textContent = `${list.length} tutor${list.length === 1 ? '' : 's'} found near you`;
  $('#tutorList').innerHTML = list.length ? list.map(t => `
    <article class="tutor${t.id === selTutor ? ' is-selected' : ''}" id="card-${t.id}">
      <div class="avatar" style="background:${t.color}" aria-hidden="true">${t.emoji}</div>
      <div><h3>${t.name}</h3>
        <p class="muted" style="margin:0">${t.area} · ${t.langs.join(', ')}</p>
        <p class="tags">${t.days.map(d => `<span class="tag">${d}</span>`).join('')}${t.evenings ? '<span class="tag">Evenings</span>' : ''}</p>
        <p class="bio">${t.bio}</p></div>
      <div class="tutor-side"><strong class="price">€${t.price}<small>/hr</small></strong><span class="rating"><span aria-hidden="true">★</span> ${t.rating}<span class="sr"> out of 5</span></span>
        <button class="btn small primary" data-book-tutor="${t.id}">Request lesson</button></div>
    </article>`).join('') : '<div class="card empty">No tutors match those filters yet. Try another language, a higher price or another day.</div>';
  $('#pins').innerHTML = list.map(t => `
    <g class="pin${t.id === selTutor ? ' is-sel' : ''}" data-tutor="${t.id}" transform="translate(${t.x} ${t.y})" tabindex="0" role="button" aria-label="${t.name}, €${t.price} per hour, ${t.area}">
      <path d="M0 0C-12-14-18-22-18-30a18 18 0 1 1 36 0c0 8-6 16-18 30z"/><text y="-26">€${t.price}</text></g>`).join('');
}
function pickTutor(id) {
  selTutor = id; renderTutors();
  const c = $('#card-' + id); if (c) c.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
$('#pins').addEventListener('click', e => { const g = e.target.closest('[data-tutor]'); if (g) pickTutor(g.dataset.tutor); });
$('#pins').addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const g = e.target.closest('[data-tutor]'); if (!g) return; e.preventDefault(); pickTutor(g.dataset.tutor);
  const again = $(`#pins [data-tutor="${g.dataset.tutor}"]`); if (again) again.focus();
});
$('#tutorList').addEventListener('click', e => {
  const b = e.target.closest('[data-book-tutor]');
  if (b) { const t = TUTORS.find(x => x.id === b.dataset.bookTutor); toast(`Lesson request sent to ${t.name} (demo)`); return; }
  const c = e.target.closest('.tutor'); if (c) { selTutor = c.id.replace('card-', ''); renderTutors(); }
});
$('#tutorFilters').addEventListener('input', renderTutors);
$('#tutorFilters').addEventListener('submit', e => e.preventDefault());

/* =========================================================
   FRIENDS (sample data)
   ========================================================= */
const FRIENDS = [
  { id: 'f1', name: 'Marta', emoji: '🦊', lang: 'English', level: 'A2', streak: 12 },
  { id: 'f2', name: 'Jonas', emoji: '🐻', lang: '*', level: 'A2', streak: 5 },
  { id: 'f3', name: 'Aiko', emoji: '🐼', lang: '*', level: 'B1', streak: 21 },
  { id: 'f4', name: 'Léa', emoji: '🦋', lang: '*', level: 'A1', streak: 3 }
];
/* "*" means the friend is learning the same language as you */
const friendLang = f => (f.lang === '*' ? courseInfo().lang : f.lang);
const SEED_CHATS = {
  f1: [{ me: false, text: 'Hola! Did you do your flashcards today? 😄' }, { me: true, text: 'Almost! Doing them now.' }],
  f2: [{ me: false, text: 'Want to practise ordering food together this week?' }]
};
const REPLIES = ['¡Qué bien! 🎉', 'Same here, class was tough today 😅', 'Want to practise together on Thursday?', 'You’re doing great, keep it up!', 'Ha, I always mix those words up too.'];
let selFriend = 'f1';
const allFriends = () => [...FRIENDS, ...state.friends];
function chatFor(id) { return state.chats[id] || (state.chats[id] = (SEED_CHATS[id] || []).map(m => ({ ...m }))); }
function renderFriends() {
  if (!applyGate('friends')) return;
  $('#myLevel').value = state.level;
  const fr = [...allFriends()].sort((a, b) => (b.level === state.level) - (a.level === state.level));
  if (!fr.some(f => f.id === selFriend)) selFriend = fr[0].id;
  $('#friendList').innerHTML = fr.map(f => `
    <li><button class="friend${f.id === selFriend ? ' is-sel' : ''}" data-friend="${f.id}" aria-pressed="${f.id === selFriend}">
      <span class="avatar" aria-hidden="true">${f.emoji}</span>
      <span><strong>${esc(f.name)}</strong><small>Learning ${esc(friendLang(f))} · 🔥 ${f.streak} days</small></span>
      <span class="level${f.level === state.level ? ' same' : ''}" title="${f.level === state.level ? 'Same level as you' : 'Level'}">${f.level}${f.level === state.level ? ' · same' : ''}</span>
    </button></li>`).join('');
  renderChat();
}
function renderChat() {
  const f = allFriends().find(x => x.id === selFriend); if (!f) return;
  $('#chatHead').innerHTML = `<span class="avatar" style="width:44px;height:44px;background:var(--sun-soft);display:grid;place-items:center;border-radius:50%;font-size:1.4rem" aria-hidden="true">${f.emoji}</span><div><strong>${esc(f.name)}</strong><br><small class="muted">${esc(friendLang(f))} · level ${f.level}</small></div>`;
  const msgs = chatFor(f.id);
  $('#chatLog').innerHTML = msgs.length ? msgs.map(m => `<div class="bubble${m.me ? ' me' : ''}">${esc(m.text)}</div>`).join('') : '<p class="empty">Say hello 👋</p>';
  $('#chatLog').scrollTop = $('#chatLog').scrollHeight;
}
$('#friendList').addEventListener('click', e => { const b = e.target.closest('[data-friend]'); if (!b) return; selFriend = b.dataset.friend; renderFriends(); });
$('#myLevel').addEventListener('change', e => { state.level = e.target.value; save(); renderFriends(); });
$('#chatForm').addEventListener('submit', e => {
  e.preventDefault();
  const v = $('#chatInput').value.trim(); if (!v) return;
  const id = selFriend; chatFor(id).push({ me: true, text: v }); $('#chatInput').value = ''; save(); renderChat();
  setTimeout(() => { chatFor(id).push({ me: false, text: REPLIES[Math.floor(Math.random() * REPLIES.length)] }); save(); if (selFriend === id && !$('#screen-friends').hidden) renderChat(); }, 1100);
});
$('#addFriend').addEventListener('submit', e => {
  e.preventDefault();
  const v = $('#friendName').value.trim().replace(/^@/, ''); if (!v) return;
  const emo = ['🐸', '🦉', '🐙', '🐢', '🦄'][Math.floor(Math.random() * 5)];
  state.friends.push({ id: 'x' + Date.now(), name: '@' + v, emoji: emo, lang: courseInfo().lang, level: ['A1', 'A2', 'B1'][Math.floor(Math.random() * 3)], streak: Math.floor(Math.random() * 10) + 1 });
  $('#friendName').value = ''; save(); renderFriends(); toast(`${'@' + v} added (demo friend)`);
});

/* =========================================================
   LIVE CLASSES (sample data)
   ========================================================= */
const SESSIONS = [
  { id: 'L1', title: 'Café conversation', lang: 'Spanish', level: 'A2', teacher: 'Lucía M.', off: 1, time: '18:00', mins: 45, spots: 3 },
  { id: 'L2', title: 'Ordering food & drinks', lang: 'Spanish', level: 'A1', teacher: 'Carlos S.', off: 2, time: '19:30', mins: 45, spots: 5 },
  { id: 'L3', title: 'Past tense workshop', lang: 'Spanish', level: 'B1', teacher: 'Lucía M.', off: 3, time: '17:00', mins: 60, spots: 2 },
  { id: 'L4', title: 'French pronunciation clinic', lang: 'French', level: 'A2', teacher: 'Pierre D.', off: 4, time: '18:30', mins: 45, spots: 6 },
  { id: 'L5', title: 'Small talk for travellers', lang: 'English', level: 'A2', teacher: 'Emma W.', off: 5, time: '12:00', mins: 30, spots: 8 },
  { id: 'L6', title: 'Italian at the market', lang: 'Italian', level: 'A1', teacher: 'Giulia R.', off: 6, time: '20:00', mins: 45, spots: 4 },
  { id: 'L7', title: 'Everyday Portuguese', lang: 'Portuguese', level: 'A1', teacher: 'Inês F.', off: 2, time: '18:00', mins: 45, spots: 5 },
  { id: 'L8', title: 'Brazilian Portuguese chat', lang: 'Portuguese', level: 'A2', teacher: 'Rafael S.', off: 4, time: '19:00', mins: 45, spots: 4 },
  { id: 'L9', title: 'German for beginners', lang: 'German', level: 'A1', teacher: 'Anna K.', off: 3, time: '18:30', mins: 45, spots: 6 },
  { id: 'L10', title: 'Japanese first steps', lang: 'Japanese', level: 'A1', teacher: 'Yuki T.', off: 5, time: '20:00', mins: 45, spots: 5 }
];
let liveLang = '';
function renderLive() {
  if (!applyGate('live')) return;
  const langs = ['', ...new Set(SESSIONS.map(s => s.lang))];
  $('#liveFilter').innerHTML = langs.map(l => `<button class="chip-btn" data-live-lang="${l}" aria-pressed="${l === liveLang}">${l || 'All languages'}</button>`).join('');
  $('#liveList').innerHTML = SESSIONS.filter(s => !liveLang || s.lang === liveLang).map((s, i) => {
    const d = new Date(); d.setDate(d.getDate() + s.off);
    const booked = state.booked.includes(s.id);
    const link = `https://zoom.us/j/8421000${1000 + SESSIONS.indexOf(s)}`;
    return `<article class="live">
      <span class="when">${d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })} · ${s.time}</span>
      <h3 class="h3">${s.title}</h3>
      <p class="meta">${s.lang} · level ${s.level} · ${s.mins} min<br>with ${s.teacher} · ${s.spots} spots left</p>
      <span class="spacer"></span>
      ${booked ? `<div class="zoom"><strong>You’re in! 🎉</strong><br>Zoom link: <a href="${link}" target="_blank" rel="noopener">${link}</a><br><span class="fine">(sample link for the prototype)</span></div>
        <button class="btn small" data-cancel="${s.id}">Cancel booking</button>`
        : `<button class="btn primary" data-book="${s.id}">Book my spot</button>`}
    </article>`;
  }).join('');
}
$('#liveFilter').addEventListener('click', e => { const b = e.target.closest('[data-live-lang]'); if (b) { liveLang = b.dataset.liveLang; renderLive(); } });
$('#liveList').addEventListener('click', e => {
  const b = e.target.closest('[data-book]'), c = e.target.closest('[data-cancel]');
  if (b) { state.booked.push(b.dataset.book); save(); renderLive(); toast('Spot booked! Your Zoom link is on the card.'); }
  if (c) { state.booked = state.booked.filter(x => x !== c.dataset.cancel); save(); renderLive(); toast('Booking cancelled'); }
});

/* =========================================================
   PLANS & SIGN UP
   ========================================================= */
const COMPARE = [
  ['Add vocab after every class', 1, 1], ['Flashcards & multiple choice quiz', 1, 1], ['Word search & picture matching', 1, 1],
  ['Daily reminders at your pace', 1, 1], ['Monthly progress calendar', 1, 1],
  ['Location-based tutor finder', 0, 1], ['Private classes', 0, 1], ['Live Zoom lessons', 0, 1], ['Friends at your level + messaging', 0, 1]
];
function renderPlans() {
  $$('[data-bill]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.bill === state.billing)));
  const y = state.billing === 'yearly';
  $('#premPrice').innerHTML = y ? '€59.99<small>/year</small>' : '€7.99<small>/month</small>';
  $('#premSub').textContent = y ? 'That’s about €5 a month. Cancel any time.' : 'Billed monthly. Cancel any time.';
  $('#compareBody').innerHTML = COMPARE.map(r => `<tr><th scope="row">${r[0]}</th>${[r[1], r[2]].map(v => v ? '<td><span class="yes" aria-hidden="true">✓</span><span class="sr">Included</span></td>' : '<td><span class="no" aria-hidden="true">–</span><span class="sr">Not included</span></td>').join('')}</tr>`).join('');
  const cur = $(`input[name="suPlan"][value="${state.premium ? 'premium' : 'free'}"]`); if (cur && !$('#signupOk').textContent) cur.checked = true;
  if (state.name) $('#suName').value = $('#suName').value || state.name;
  if (state.email) $('#suEmail').value = $('#suEmail').value || state.email;
}
$$('[data-bill]').forEach(b => b.addEventListener('click', () => { state.billing = b.dataset.bill; save(); renderPlans(); }));
$$('[data-pick-plan]').forEach(b => b.addEventListener('click', () => {
  const r = $(`input[name="suPlan"][value="${b.dataset.pickPlan}"]`); r.checked = true;
  $('#signup').scrollIntoView({ behavior: 'smooth' }); $('#suName').focus({ preventScroll: true });
}));
$('#signupForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = $('#suName').value.trim(), email = $('#suEmail').value.trim();
  const okName = !!name, okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  $('#suNameErr').hidden = okName; $('#suEmailErr').hidden = okEmail;
  $('#suName').setAttribute('aria-invalid', String(!okName)); $('#suEmail').setAttribute('aria-invalid', String(!okEmail));
  if (!okName) return $('#suName').focus();
  if (!okEmail) return $('#suEmail').focus();
  const plan = $('input[name="suPlan"]:checked').value;
  state.name = name; state.email = email; state.plan = plan; state.premium = plan === 'premium'; save(); renderHeader();
  const ok = $('#signupOk'); ok.hidden = false;
  ok.innerHTML = state.premium
    ? `Welcome, ${esc(name)}! 🎉 Premium is unlocked: try <a href="#tutors">Find a tutor</a>, <a href="#friends">Friends</a> and <a href="#live">Live classes</a>. <button class="linklike" id="downgrade">Switch back to Free</button>`
    : `Welcome, ${esc(name)}! 🌸 You’re on the Free plan. Upgrade any time from this page.`;
  const dg = $('#downgrade'); if (dg) dg.onclick = () => { state.premium = false; state.plan = 'free'; save(); renderHeader(); ok.hidden = true; ok.textContent = ''; toast('Back on Free'); };
});

/* =========================================================
   GLOBE (first page): choose a country to choose a language.
   Each country teaches its own version, for example Brazil
   teaches Brazilian Portuguese and Portugal teaches European.
   ========================================================= */
const GL = { inited: false, running: false, raf: 0, rot: [30, -20], hover: null, drag: null, over: false, w: 0, zoom: 1, pointers: new Map(), pinch: null };
const prettyCountry = n => COUNTRY_LABEL[n] || n;
const GLOBE_HINT = 'Drag to spin, scroll or pinch to zoom, then tap a country to start learning.';

function renderGlobe() {
  const cur = courseInfo(), cont = $('#globeContinue');
  cont.hidden = !cur;
  if (cur) cont.innerHTML = `Continue with <span aria-hidden="true">${cur.flag}</span> ${esc(cur.dialect)}`;
  const byLang = {}, q = norm(($('#globeSearch') || {}).value || '');
  Object.values(COURSES).filter(c => !q || norm(c.lang + ' ' + c.dialect + ' ' + prettyCountry(c.country)).includes(q))
    .sort((a, b) => prettyCountry(a.country).localeCompare(prettyCountry(b.country)))
    .forEach(c => (byLang[c.lang] = byLang[c.lang] || []).push(c));
  $('#globeList').innerHTML = !Object.keys(byLang).length ? '<p class="muted">No country or language matches that.</p>' : Object.entries(byLang).sort((a, b) => a[0].localeCompare(b[0])).map(([lang, cs]) => `
    <div class="lang-group">
      <h3 class="lg-title"><i style="background:${LANG_COLORS[lang]}" aria-hidden="true"></i>${lang}</h3>
      <div class="chips">${cs.map(c => `<button class="country-chip" data-course="${c.id}"><span class="flag" aria-hidden="true">${c.flag}</span><span><strong>${esc(prettyCountry(c.country))}</strong><small>${esc(c.dialect)}</small></span></button>`).join('')}</div>
    </div>`).join('');
  $('#globeInfo').textContent = GLOBE_HINT;
  startGlobe();
}
function renderGlobeList() { const keep = $('#globeInfo').textContent; renderGlobe(); $('#globeInfo').textContent = keep; }


function startGlobe() {
  const wrap = $('#globeWrap');
  if (!(window.d3 && window.topojson && window.LEXI_WORLD)) {
    wrap.hidden = true;
    $('#globeInfo').textContent = 'The globe could not load. Please choose a country from the list below.';
    return;
  }
  wrap.hidden = false;
  if (!GL.inited) initGlobe();
  sizeGlobe(); setZoom(GL.zoom);
  GL.running = true;
  if (!GL.raf) GL.raf = requestAnimationFrame(tickGlobe);
}
function stopGlobe() { GL.running = false; cancelAnimationFrame(GL.raf); GL.raf = 0; }

function initGlobe() {
  GL.inited = true;
  const topo = window.LEXI_WORLD, cv = $('#globeCanvas');
  GL.features = topojson.feature(topo, topo.objects.countries).features;
  GL.features.forEach(f => { f.course = COUNTRY_COURSE[f.properties.name] || null; });
  GL.courseFeatures = GL.features.filter(f => f.course);
  GL.proj = d3.geoOrthographic().clipAngle(90).precision(0.5);
  GL.ctx = cv.getContext('2d');
  GL.path = d3.geoPath(GL.proj, GL.ctx);
  GL.proj2 = d3.geoOrthographic().clipAngle(90).precision(0.5);   /* slightly bigger copy, used to lift the hovered country */
  GL.path2 = d3.geoPath(GL.proj2, GL.ctx);
  GL.grat = d3.geoGraticule10();
  GL.reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  const local = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const gap = () => { const [a, b] = [...GL.pointers.values()]; return Math.hypot(a[0] - b[0], a[1] - b[1]); };
  cv.addEventListener('pointerdown', e => {
    GL.pointers.set(e.pointerId, [e.clientX, e.clientY]);
    try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    if (GL.pointers.size === 2) { GL.pinch = { d: gap(), z: GL.zoom }; GL.drag = null; return; }   /* two fingers: pinch to zoom */
    GL.drag = { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, moved: false };
    cv.classList.add('grabbing');
  });
  cv.addEventListener('pointermove', e => {
    GL.over = true;
    if (GL.pointers.has(e.pointerId)) GL.pointers.set(e.pointerId, [e.clientX, e.clientY]);
    if (GL.pinch && GL.pointers.size === 2) { setZoom(GL.pinch.z * gap() / GL.pinch.d); return; }
    if (GL.drag) {
      if (Math.abs(e.clientX - GL.drag.sx) + Math.abs(e.clientY - GL.drag.sy) > 6) GL.drag.moved = true;
      GL.rot[0] += (e.clientX - GL.drag.x) * 0.35 / GL.zoom;
      GL.rot[1] = Math.max(-75, Math.min(75, GL.rot[1] - (e.clientY - GL.drag.y) * 0.35 / GL.zoom));
      GL.drag.x = e.clientX; GL.drag.y = e.clientY;
      GL.proj.rotate(GL.rot);
    }
    const [x, y] = local(e);
    hoverGlobe(featureAt(x, y), x, y);
  });
  const endDrag = e => {
    GL.pointers.delete(e.pointerId);
    if (GL.pinch) { if (GL.pointers.size < 2) GL.pinch = null; GL.drag = null; cv.classList.remove('grabbing'); return; }
    const d = GL.drag; GL.drag = null; cv.classList.remove('grabbing');
    if (d && !d.moved && e.type === 'pointerup') {
      const [x, y] = local(e), f = featureAt(x, y);
      if (f && f.course) pickCourse(f.course);
      else if (f) toast(`${prettyCountry(f.properties.name)} isn’t on Lexi yet. Try a coloured country.`);
    }
  };
  cv.addEventListener('pointerup', endDrag);
  cv.addEventListener('pointercancel', endDrag);
  cv.addEventListener('pointerleave', () => { GL.over = false; hoverGlobe(null); });
  /* mouse wheel / trackpad zoom, easing towards the spot under the pointer */
  cv.addEventListener('wheel', e => {
    e.preventDefault();
    const before = GL.zoom;
    setZoom(GL.zoom * Math.exp(-e.deltaY * 0.0018));
    if (GL.zoom > before) {
      const [x, y] = local(e); GL.proj.rotate(GL.rot);
      const p = GL.proj.invert([x, y]);
      if (p && isFinite(p[0]) && Math.hypot(x - GL.w / 2, y - GL.w / 2) < GL.w / 2) {
        const k = Math.min(0.25, (GL.zoom / before - 1) * 2);
        GL.rot[0] += ((((-p[0] - GL.rot[0]) % 360) + 540) % 360 - 180) * k;
        GL.rot[1] = Math.max(-75, Math.min(75, GL.rot[1] + (-p[1] - GL.rot[1]) * k));
      }
    }
  }, { passive: false });
  window.addEventListener('resize', () => { if (GL.running) sizeGlobe(); });
}

function sizeGlobe() {
  const w = Math.round($('#globeWrap').clientWidth); if (!w || !GL.inited) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2), cv = $('#globeCanvas');
  cv.width = Math.round(w * dpr); cv.height = Math.round(w * dpr);
  GL.w = w; GL.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  GL.proj.translate([w / 2, w / 2]).rotate(GL.rot);
  GL.proj2.translate([w / 2, w / 2]).rotate(GL.rot);
  applyScale();
}
function applyScale() {
  const R = (GL.w / 2 - 4) * GL.zoom;
  GL.proj.scale(R); GL.proj2.scale(R * 1.035);
}
function setZoom(z) {
  if (!GL.inited) return;
  GL.zoom = Math.max(1, Math.min(8, z));
  applyScale();
  $('#zoomIn').disabled = GL.zoom >= 8; $('#zoomOut').disabled = GL.zoom <= 1;
  $('#zoomReset').disabled = GL.zoom <= 1;
}
$('#zoomIn').addEventListener('click', () => setZoom(GL.zoom * 1.5));
$('#zoomOut').addEventListener('click', () => setZoom(GL.zoom / 1.5));
$('#zoomReset').addEventListener('click', () => setZoom(1));

function featureAt(x, y) {
  const r = Math.min(GL.proj.scale(), GL.w / 2), dx = x - GL.w / 2, dy = y - GL.w / 2;
  if (!GL.w || dx * dx + dy * dy > r * r) return null;
  GL.proj.rotate(GL.rot);
  const p = GL.proj.invert([x, y]); if (!p) return null;
  const f = GL.courseFeatures.find(f => d3.geoContains(f, p)) || GL.features.find(f => d3.geoContains(f, p)) || null;
  return f && !(typeof NO_HOVER !== 'undefined' && NO_HOVER.has(f.properties.name)) ? f : null;
}

function hoverGlobe(f, x, y) {
  const changed = f !== GL.hover;
  GL.hover = f;
  const tip = $('#globeTip'), cv = $('#globeCanvas'), info = $('#globeInfo');
  cv.classList.toggle('can-pick', !!(f && f.course));
  if (!f) { tip.hidden = true; info.textContent = GLOBE_HINT; return; }
  const name = prettyCountry(f.properties.name), c = f.course ? COURSES[f.course] : null;
  if (changed || tip.hidden) {
    tip.innerHTML = c
      ? `<span class="tip-flag" aria-hidden="true">${c.flag}</span><span class="tip-text"><strong>${esc(c.dialect)}</strong><small>${esc(name)} · tap to learn!</small></span>`
      : `<span class="tip-flag soft" aria-hidden="true">🌱</span><span class="tip-text"><strong>${esc(name)}</strong><small>Not on Lexi yet</small></span>`;
    tip.classList.toggle('soft', !c);
    tip.hidden = false;
    tip.classList.remove('pop'); void tip.offsetWidth; tip.classList.add('pop');   /* little bounce */
    info.textContent = c ? `${name}: ${c.dialect}. Click to start learning.` : `${name} isn’t on Lexi yet.`;
  }
  if (x == null) return;
  const wrapW = $('#globeWrap').clientWidth, tw = tip.offsetWidth, th = tip.offsetHeight;
  const left = x + 24 + tw > wrapW - 4 ? x - tw - 24 : x + 24;       /* beside the pointer, flips near the edge */
  tip.style.left = Math.max(4, left) + 'px';
  tip.style.top = Math.max(4, y - th / 2) + 'px';
}

function tickGlobe() {
  if (!GL.running) return;
  if (!GL.drag && !GL.over && !GL.reduce) GL.rot[0] += 0.15 / GL.zoom;
  drawGlobe();
  GL.raf = requestAnimationFrame(tickGlobe);
}

const lighten = (hex, a) => { const n = parseInt(hex.slice(1), 16), m = c => Math.round(c + (255 - c) * a); return `rgb(${m(n >> 16)},${m((n >> 8) & 255)},${m(n & 255)})`; };

/* A glossy, bubbly globe: soft pastel sea, candy-coloured countries with white outlines,
   a shiny highlight, and the hovered country "pops" up from the surface. */
function drawGlobe() {
  const { ctx, path, proj, w } = GL; if (!w) return;
  proj.rotate(GL.rot);
  ctx.clearRect(0, 0, w, w);
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const sea = ctx.createRadialGradient(w * 0.36, w * 0.3, w * 0.04, w / 2, w / 2, w / 2);
  sea.addColorStop(0, '#E3F6FA'); sea.addColorStop(0.55, '#B5E2F0'); sea.addColorStop(1, '#86C5E4');
  ctx.beginPath(); path({ type: 'Sphere' }); ctx.fillStyle = sea; ctx.fill();
  ctx.beginPath(); path(GL.grat); ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 0.8; ctx.stroke();
  GL.features.forEach(f => {
    ctx.beginPath(); path(f);
    ctx.fillStyle = f.course ? COURSES[f.course].color : '#FFF8F3'; ctx.fill();
    ctx.strokeStyle = f.course ? 'rgba(255,255,255,.95)' : 'rgba(222,184,166,.6)';
    ctx.lineWidth = f.course ? 1.6 : 0.7; ctx.stroke();
  });
  ctx.save();
  ctx.beginPath(); path({ type: 'Sphere' }); ctx.clip();
  if (GL.hover) {
    if (GL.hover.course) {            /* lift the country up like a sticker */
      GL.proj2.rotate(GL.rot);
      ctx.save();
      ctx.shadowColor = 'rgba(59,42,51,.38)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 6;
      ctx.beginPath(); GL.path2(GL.hover); ctx.fillStyle = lighten(COURSES[GL.hover.course].color, 0.28); ctx.fill();
      ctx.restore();
      ctx.beginPath(); GL.path2(GL.hover); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke();
    } else {
      ctx.beginPath(); path(GL.hover); ctx.fillStyle = 'rgba(255,127,110,.2)'; ctx.fill();
      ctx.strokeStyle = 'rgba(201,60,47,.6)'; ctx.lineWidth = 1.5; ctx.stroke();
    }
  }
  /* soft shading at the edge + shiny highlight, like a bubble */
  const shade = ctx.createRadialGradient(w * 0.36, w * 0.3, w * 0.2, w / 2, w / 2, w * 0.52);
  shade.addColorStop(0, 'rgba(255,255,255,0)'); shade.addColorStop(0.7, 'rgba(255,255,255,0)'); shade.addColorStop(1, 'rgba(70,140,190,.32)');
  ctx.fillStyle = shade; ctx.fillRect(0, 0, w, w);
  const gloss = ctx.createRadialGradient(w * 0.3, w * 0.2, 0, w * 0.3, w * 0.2, w * 0.34);
  gloss.addColorStop(0, 'rgba(255,255,255,.38)'); gloss.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gloss; ctx.fillRect(0, 0, w, w);
  ctx.restore();
  ctx.save(); ctx.translate(w * 0.23, w * 0.165); ctx.rotate(-0.65);
  ctx.beginPath(); ctx.ellipse(0, 0, w * 0.05, w * 0.02, 0, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fill(); ctx.restore();
  ctx.beginPath(); ctx.arc(w * 0.31, w * 0.105, w * 0.009, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.fill();
  ctx.beginPath(); ctx.arc(w / 2, w / 2, Math.min(proj.scale(), w / 2 - 1.5), 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 3; ctx.stroke();
}

function pickCourse(id) {
  const first = !state.course;
  chooseCourse(id);
  toast(`${COURSES[id].flag} ${COURSES[id].dialect}${first ? ': let’s go!' : ' selected'}`);
  if (location.hash === '#home') route(); else location.hash = '#home';
}
$('#globeSearch').addEventListener('input', () => { const c = courseInfo(); const cont = $('#globeContinue'); cont.hidden = !c; renderGlobeList(); });
$('#globeList').addEventListener('click', e => { const b = e.target.closest('[data-course]'); if (b) pickCourse(b.dataset.course); });
$('#globeContinue').addEventListener('click', () => { location.hash = '#home'; });

/* =========================================================
   BOOT
   ========================================================= */
$('#moreBtn').addEventListener('click', () => $('#moreSheet').showModal());
$('#closeMore').addEventListener('click', () => $('#moreSheet').close());
$('#moreSheet').addEventListener('click', e => { if (e.target === $('#moreSheet')) $('#moreSheet').close(); });
paintIcons();
$$('.bottomnav [data-icon], .topnav [data-icon]').forEach(el => el.firstChild || paintIcons(el.parentNode));
save(); scheduleReminder(); route();
setInterval(() => { if (!$('#screen-home').hidden) checkBanner(); }, 60000);
