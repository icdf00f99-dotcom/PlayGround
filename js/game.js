/* Aşk & Soygun — game flow, mobile timing heist. */
(function () {
  'use strict';

  var D = window.GameData;
  var C = D.CHARACTERS;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var fmt = new Intl.NumberFormat('tr-TR');

  function money(n) { return fmt.format(Math.round(n || 0)); }
  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function loadStore() {
    var def = { endings: [], best: 0, plays: 0, sound: true };
    try {
      var raw = localStorage.getItem(D.STORE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          def.endings = Array.isArray(parsed.endings) ? parsed.endings : [];
          def.best = Number(parsed.best) || 0;
          def.plays = Number(parsed.plays) || 0;
          def.sound = parsed.sound !== false;
        }
      }
    } catch (e) { /* private mode */ }
    return def;
  }

  var store = loadStore();

  function saveStore() {
    try { localStorage.setItem(D.STORE_KEY, JSON.stringify(store)); } catch (e) { /* ignore */ }
  }

  /* ---------------- sound ---------------- */
  var Sound = (function () {
    var ctx = null;
    var master = null;
    var enabled = store.sound !== false;

    function ensure() {
      if (!enabled) return;
      try {
        if (!ctx) {
          var AC = window.AudioContext || window.webkitAudioContext;
          if (!AC) return;
          ctx = new AC();
          master = ctx.createGain();
          master.gain.value = 0.14;
          master.connect(ctx.destination);
        }
        if (ctx.state === 'suspended') ctx.resume();
      } catch (e) { /* ignore */ }
    }

    function tone(freq, dur, type, delay, gain, slide) {
      if (!enabled) return;
      ensure();
      if (!ctx || !master) return;
      try {
        var t0 = ctx.currentTime + (delay || 0);
        var o = ctx.createOscillator();
        var g = ctx.createGain();
        o.type = type || 'sine';
        o.frequency.setValueAtTime(freq, t0);
        if (slide) o.frequency.exponentialRampToValueAtTime(slide, t0 + dur);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(gain || 0.4, t0 + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        o.connect(g);
        g.connect(master);
        o.start(t0);
        o.stop(t0 + dur + 0.03);
      } catch (e) { /* ignore */ }
    }

    return {
      on: function () { return enabled; },
      ui: function () { tone(420, 0.05, 'triangle', 0, 0.28); },
      choice: function () { tone(330, 0.07, 'triangle', 0, 0.3); tone(495, 0.08, 'sine', 0.05, 0.22); },
      hit: function (quality) {
        var base = quality === 'perfect' ? 640 : quality === 'great' ? 560 : 500;
        tone(base, 0.12, 'triangle', 0, 0.35);
        tone(base * 1.5, 0.18, 'sine', 0.08, 0.28);
        if (quality === 'perfect') tone(base * 2, 0.24, 'sine', 0.16, 0.2);
      },
      miss: function () { tone(150, 0.22, 'sawtooth', 0, 0.28, 90); },
      support: function () { tone(300, 0.1, 'sine', 0, 0.25); tone(450, 0.16, 'sine', 0.08, 0.2); },
      win: function () { [523, 659, 784, 1046].forEach(function (f, i) { tone(f, 0.3, 'triangle', i * 0.11, 0.28); }); },
      lose: function () { [320, 250, 180].forEach(function (f, i) { tone(f, 0.32, 'sawtooth', i * 0.14, 0.2, f * 0.8); }); },
      toggle: function () {
        enabled = !enabled;
        store.sound = enabled;
        saveStore();
        if (enabled) { ensure(); tone(660, 0.1, 'sine', 0, 0.3); }
        return enabled;
      }
    };
  })();

  function vibrate(pattern) {
    try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) { /* ignore */ }
  }

  /* ---------------- state ---------------- */
  var state = {
    screen: 'title',
    you: null,
    partner: null,
    o1: null,
    o2: null,
    kimya: D.START.kimya,
    ortaklik: D.START.ortaklik,
    suphe: 0,
    sceneIndex: 0,
    lineIdx: 0,
    lines: [],
    phase: 'line',
    plan: null
  };

  var heist = null;
  var raf = null;
  var timers = [];
  var suppressClick = false;
  var endingsReturn = 'title';
  var lastShownEnding = null;

  var screens = {
    title: $('#screen-title'),
    cast: $('#screen-cast'),
    date: $('#screen-date'),
    plan: $('#screen-plan'),
    heist: $('#screen-heist'),
    result: $('#screen-result'),
    endings: $('#screen-endings')
  };

  function go(name) {
    Object.keys(screens).forEach(function (key) {
      var el = screens[key];
      var active = key === name;
      el.classList.toggle('active', active);
      el.setAttribute('aria-hidden', active ? 'false' : 'true');
    });
    state.screen = name;
    document.body.dataset.screen = name;
    if (name === 'result') {
      var scroll = $('#screen-result .scroll-area');
      if (scroll) scroll.scrollTop = 0;
    }
  }

  function clearTimers() {
    timers.forEach(function (t) { clearTimeout(t); });
    timers = [];
  }

  function fill(text) {
    if (!text) return '';
    return text
      .replace(/\{you\}/g, state.you ? C[state.you].name : 'Sen')
      .replace(/\{date\}/g, state.partner ? C[state.partner].name : 'Randevun')
      .replace(/\{o1\}/g, state.o1 ? C[state.o1].name : '')
      .replace(/\{o2\}/g, state.o2 ? C[state.o2].name : '');
  }

  function nameOf(id) { return id && C[id] ? C[id].name : ''; }
  function colorOf(id) { return id && C[id] ? C[id].color : '#d9b8a0'; }

  /* ---------------- title ---------------- */
  $('#titleArt').innerHTML = window.Art.scene('t');
  $('#sceneArt').innerHTML = window.Art.scene('d');
  $('#heistBg').innerHTML = window.Art.scene('h');

  function refreshStoreUI() {
    var count = store.endings.length + '/6';
    $('#endingCount').textContent = count;
    $('#resultEndingCount').textContent = count;
    $('#soundLabel').textContent = store.sound ? 'SES AÇIK' : 'SES KAPALI';
    $('#soundBtn').setAttribute('aria-pressed', store.sound ? 'true' : 'false');
  }

  $('#soundBtn').addEventListener('click', function () {
    var on = Sound.toggle();
    $('#soundLabel').textContent = on ? 'SES AÇIK' : 'SES KAPALI';
    this.setAttribute('aria-pressed', on ? 'true' : 'false');
  });

  $('#startBtn').addEventListener('click', function () {
    Sound.ui();
    renderCast();
    go('cast');
  });

  $('#endingsBtn').addEventListener('click', function () { openEndings('title'); });

  /* ---------------- cast ---------------- */
  function renderCast() {
    var grid = $('#castGrid');
    var order = ['deniz', 'ece', 'kerem', 'selin'];
    grid.innerHTML = order.map(function (id) {
      var c = C[id];
      var badge = '';
      if (state.you) {
        if (id === state.you) badge = 'SEN';
        else if (id === state.partner) badge = 'RANDEVU';
        else badge = 'DİĞER ÇİFT';
      }
      var cls = 'cast-card';
      if (state.you === id) cls += ' selected';
      else if (state.partner === id) cls += ' partner';
      else if (state.you) cls += ' dimmed';
      return '<button class="' + cls + '" type="button" data-id="' + id + '" style="--accent:' + c.color + ';--soft:' + c.soft + '">'
        + '<span class="cast-badge">' + badge + '</span>'
        + '<span class="cast-portrait">' + window.Art.character(id, state.partner === id ? 'happy' : 'neutral') + '</span>'
        + '<span class="cast-meta"><span class="cast-name">' + c.name + '</span>'
        + '<span class="cast-tag">' + c.icon + ' ' + c.tag + '</span></span>'
        + '</button>';
    }).join('');

    if (!state.you) {
      $('#castNote').innerHTML = '<div class="cast-note-icon">♥</div><div><strong>Birini seç.</strong>'
        + '<p>Her karakterin soygunda farklı bir avantajı var. Seçtiğin kişi, randevusunun ve diğer çiftin masasına oturur.</p></div>';
      $('#castNext').disabled = true;
    }
  }

  $('#castGrid').addEventListener('click', function (e) {
    var card = e.target.closest('.cast-card');
    if (!card) return;
    var id = card.dataset.id;
    state.you = id;
    state.partner = C[id].partner;
    var other = C[id].couple === 'A' ? D.PAIRS.B : D.PAIRS.A;
    state.o1 = other[0];
    state.o2 = other[1];
    Sound.choice();
    vibrate(8);
    renderCast();
    var c = C[id];
    var p = C[state.partner];
    var o1 = C[state.o1];
    var o2 = C[state.o2];
    $('#castNote').innerHTML = '<div class="cast-note-icon" style="color:' + c.color + '">' + c.icon + '</div>'
      + '<div><strong style="color:' + c.color + '">' + c.name + ' · ' + c.tag + '</strong>'
      + '<p>' + c.perk + ' Randevun <b>' + p.name + '</b>, diğer çift <b>' + o1.name + ' &amp; ' + o2.name + '</b>.</p></div>';
    $('#castNext').disabled = false;
  });

  $('#castBack').addEventListener('click', function () {
    Sound.ui();
    refreshStoreUI();
    go('title');
  });

  $('#castNext').addEventListener('click', function () {
    if (!state.you) return;
    beginDate();
  });

  /* ---------------- date ---------------- */
  function updateHUD() {
    $('#kimyaVal').textContent = Math.round(state.kimya);
    $('#ortaklikVal').textContent = Math.round(state.ortaklik);
    $('#supheVal').textContent = Math.round(state.suphe);
    $('#kimyaBar').style.width = clamp(state.kimya, 0, 100) + '%';
    $('#ortaklikBar').style.width = clamp(state.ortaklik, 0, 100) + '%';
    $('#supheBar').style.width = clamp(state.suphe, 0, 100) + '%';
    var danger = state.suphe >= 60;
    var supheStat = $('.stat[data-stat="suphe"]');
    if (supheStat) supheStat.classList.toggle('danger', danger);
  }

  function bumpStat(key, delta) {
    var el = $('.stat[data-stat="' + key + '"]');
    if (!el) return;
    var cls = delta > 0 ? 'bump-up' : 'bump-down';
    el.classList.remove('bump-up', 'bump-down');
    void el.offsetWidth;
    el.classList.add(cls);
    var chip = document.createElement('span');
    chip.className = 'stat-float ' + cls;
    chip.textContent = (delta > 0 ? '+' : '') + delta;
    el.appendChild(chip);
    setTimeout(function () { chip.remove(); }, 900);
  }

  function beginDate() {
    state.kimya = D.START.kimya;
    state.ortaklik = D.START.ortaklik + (state.you === 'kerem' ? 12 : 0);
    state.suphe = 0;
    state.sceneIndex = 0;
    state.lineIdx = 0;
    state.phase = 'line';
    state.plan = null;
    clearTimers();
    if (raf) cancelAnimationFrame(raf);
    updateHUD();
    buildCastRow();
    go('date');
    renderScene();
    Sound.ui();
  }

  function buildCastRow() {
    var order = [state.you, state.partner, state.o1, state.o2];
    $('#castRow').innerHTML = order.map(function (id, i) {
      return '<div class="mini" data-char="' + id + '" style="--accent:' + colorOf(id) + '">'
        + '<div class="mini-portrait">' + window.Art.character(id, 'neutral') + '</div>'
        + '<span class="mini-name">' + (i === 0 ? 'SEN' : C[id].name) + '</span>'
        + '</div>';
    }).join('');
  }

  function highlight(who) {
    var map = { you: state.you, date: state.partner, o1: state.o1, o2: state.o2 };
    var activeId = map[who] || null;
    $$('#castRow .mini').forEach(function (el) {
      var on = el.dataset.char === activeId;
      el.classList.toggle('active', on);
      var p = el.querySelector('.mini-portrait');
      if (p) p.innerHTML = window.Art.character(el.dataset.char, on ? 'happy' : 'neutral');
    });
  }

  function renderScene() {
    var sc = D.SCENES[state.sceneIndex];
    if (!sc) { goPlan(); return; }
    $('#sceneTag').textContent = sc.time;
    $('#dateScene').classList.toggle('night', !!sc.night);
    $('#choices').innerHTML = '';
    $('#dialogActions').innerHTML = '';
    $('#choiceLabel').hidden = true;
    $('#tapHint').hidden = false;
    state.lines = sc.lines;
    state.lineIdx = 0;
    state.phase = 'line';
    showLine();
  }

  function setDialog(who, text) {
    var dialog = $('#dialog');
    var speakerName = $('#speakerName');
    var dot = $('#speakerDot');
    dialog.classList.toggle('narrator', who === 'narr');
    if (who === 'narr') {
      speakerName.textContent = 'ANLATICI';
      dot.style.background = '#d9b8a0';
      $('#dialogGhost').classList.remove('show');
      $('#dialogGhost').innerHTML = '';
    } else {
      var id = who === 'you' ? state.you : who === 'date' ? state.partner : state.o1 ? (who === 'o1' ? state.o1 : state.o2) : null;
      speakerName.textContent = nameOf(id).toUpperCase();
      dot.style.background = colorOf(id);
      var ghost = $('#dialogGhost');
      ghost.innerHTML = window.Art.character(id, 'happy');
      ghost.classList.add('show');
    }
    var el = $('#dialogText');
    el.textContent = text;
    el.classList.remove('anim');
    void el.offsetWidth;
    el.classList.add('anim');
    var box = $('#dialog');
    box.scrollTop = 0;
  }

  function showLine() {
    if (state.lineIdx >= state.lines.length) { showChoices(); return; }
    var line = state.lines[state.lineIdx];
    state.lineIdx += 1;
    setDialog(line.who, fill(line.text));
    highlight(line.who);
    $('#tapHint').hidden = false;
    $('#choiceLabel').hidden = true;
    $('#choices').innerHTML = '';
    $('#dialogActions').innerHTML = '';
    state.phase = 'line';
  }

  function advanceLine() {
    if (state.phase !== 'line') return;
    Sound.ui();
    showLine();
  }

  function showChoices() {
    state.phase = 'choice';
    $('#tapHint').hidden = true;
    $('#choiceLabel').hidden = false;
    $('#choiceLabel').textContent = D.SCENES[state.sceneIndex].prompt;
    highlight(null);
    var sc = D.SCENES[state.sceneIndex];
    $('#choices').innerHTML = sc.choices.map(function (ch, i) {
      return '<button class="choice" type="button" data-i="' + i + '">'
        + '<span class="choice-key">' + 'ABC'[i] + '</span>'
        + '<span class="choice-body"><span class="choice-text">' + ch.text + '</span>'
        + '<span class="choice-eff">' + effectChips(ch.eff) + '</span></span>'
        + '</button>';
    }).join('');
  }

  function effectChips(eff) {
    var labels = { kimya: '❤️', ortaklik: '🤝', suphe: '👁️' };
    return Object.keys(eff).filter(function (k) { return eff[k]; }).map(function (k) {
      var v = eff[k];
      var good = k === 'suphe' ? v < 0 : v > 0;
      return '<span class="chip ' + (good ? 'good' : 'bad') + '">' + (v > 0 ? '+' : '') + v + ' ' + labels[k] + '</span>';
    }).join('');
  }

  function applyEffects(eff) {
    ['kimya', 'ortaklik', 'suphe'].forEach(function (k) {
      if (!eff[k]) return;
      var old = state[k];
      state[k] = clamp(old + eff[k], 0, 100);
      var delta = Math.round(state[k] - old);
      if (delta !== 0) bumpStat(k, delta);
    });
    updateHUD();
  }

  function choose(index) {
    if (state.phase !== 'choice') return;
    var sc = D.SCENES[state.sceneIndex];
    var ch = sc.choices[index];
    if (!ch) return;
    applyEffects(ch.eff);
    state.phase = 'reply';
    $('#choices').innerHTML = '';
    $('#choiceLabel').hidden = true;
    $('#tapHint').hidden = true;
    Sound.choice();
    vibrate(10);
    setDialog(ch.reply.who, fill(ch.reply.text));
    highlight(ch.reply.who);
    $('#dialogActions').innerHTML = '<button class="mini-cta" id="replyNext" type="button"><span>DEVAM</span><span>→</span></button>';
  }

  function continueAfterReply() {
    if (state.phase !== 'reply') return;
    Sound.ui();
    $('#dialogActions').innerHTML = '';
    state.sceneIndex += 1;
    if (state.sceneIndex >= D.SCENES.length) goPlan();
    else renderScene();
  }

  $('#dialog').addEventListener('click', function (e) {
    if (e.target.closest('button')) return;
    if (state.phase === 'line') advanceLine();
    else if (state.phase === 'reply') continueAfterReply();
  });

  $('#choices').addEventListener('click', function (e) {
    var b = e.target.closest('.choice');
    if (!b) return;
    choose(Number(b.dataset.i));
  });

  $('#dialogActions').addEventListener('click', function (e) {
    if (e.target.closest('#replyNext')) continueAfterReply();
  });

  /* ---------------- plan ---------------- */
  function goPlan() {
    state.plan = null;
    var p = C[state.partner];
    var a = C[state.o1];
    var b = C[state.o2];
    $('#planLede').innerHTML = 'Peçete hazır. <b>' + p.name + '</b> planı tutuyor, <b>' + a.name + ' &amp; ' + b.name + '</b> garsonu izliyor. Bir yöntem seç.';
    $('#planNote').innerHTML = '<span class="plan-note-ico">👁️</span><div><strong>Kafedeki şüphen: ' + Math.round(state.suphe) + '</strong>'
      + '<p>Şüphe 100 olursa yakalanırsın. Partner desteğiyle ibreyi yavaşlatıp hedef bölgeyi genişletebilirsin.</p></div>';
    renderPlans();
    $('#heistStart').disabled = true;
    go('plan');
  }

  function renderPlans() {
    var risk = { tatli: 'ORTA RİSK', salgam: 'DÜŞÜK RİSK', kasa: 'YÜKSEK RİSK' };
    $('#planList').innerHTML = D.PLANS.map(function (p) {
      var sel = state.plan && state.plan.id === p.id ? ' selected' : '';
      return '<button class="plan-card' + sel + '" type="button" data-id="' + p.id + '">'
        + '<span class="plan-icon">' + p.icon + '</span>'
        + '<span class="plan-body">'
        + '<span class="plan-title-row"><strong>' + p.title + '</strong><span class="plan-risk">' + risk[p.id] + '</span></span>'
        + '<span class="plan-desc">' + p.desc + '</span>'
        + '<span class="plan-tags">'
        + p.pros.map(function (t) { return '<span class="ptag good">+' + t + '</span>'; }).join('')
        + p.cons.map(function (t) { return '<span class="ptag bad">−' + t + '</span>'; }).join('')
        + '</span></span></button>';
    }).join('');
  }

  $('#planList').addEventListener('click', function (e) {
    var card = e.target.closest('.plan-card');
    if (!card) return;
    state.plan = D.PLANS.filter(function (p) { return p.id === card.dataset.id; })[0] || null;
    Sound.choice();
    vibrate(8);
    $$('#planList .plan-card').forEach(function (el) {
      el.classList.toggle('selected', state.plan && el.dataset.id === state.plan.id);
    });
    $('#heistStart').disabled = !state.plan;
  });

  $('#planBack').addEventListener('click', function () {
    Sound.ui();
    renderCast();
    go('cast');
  });

  $('#heistStart').addEventListener('click', function () {
    if (!state.plan) return;
    openHeist();
  });

  /* ---------------- heist ---------------- */
  function openHeist() {
    clearTimers();
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    heist = null;
    var p = state.plan;
    var tokens = 2 + (state.you === 'ece' ? 1 : 0) + (state.kimya >= 60 ? 1 : 0);
    $('#briefTitle').textContent = p.title;
    $('#briefDesc').textContent = p.brief;
    var zonePct = Math.round((p.zone - 1) * 100);
    var suspLabel = p.susp < 0.9 ? 'yavaş' : p.susp < 1.05 ? 'normal' : 'hızlı';
    $('#briefRows').innerHTML =
      '<div class="brief-row"><span>Hedef bölge</span><b class="' + (zonePct >= 0 ? 'good' : 'bad') + '">' + (zonePct > 0 ? '+' : '') + zonePct + '%</b></div>'
      + '<div class="brief-row"><span>Şüphe artışı</span><b class="' + (p.susp <= 1 ? 'good' : 'bad') + '">' + suspLabel + '</b></div>'
      + '<div class="brief-row"><span>Ganimet</span><b class="' + (p.loot >= 1 ? 'good' : 'bad') + '">' + (p.loot > 1 ? '+' + Math.round((p.loot - 1) * 100) + '%' : 'standart') + '</b></div>'
      + '<div class="brief-row"><span>Partner desteği</span><b class="good">×' + tokens + '</b></div>';

    $('#gaugeZone').style.opacity = '0';
    $('#timeBar').style.width = '0%';
    $('#needle').setAttribute('transform', 'rotate(0 120 120)');
    $('#lootVal').textContent = '0';
    $('#suspVal').textContent = Math.round(state.suphe);
    $('#suspBar').style.width = clamp(state.suphe, 0, 100) + '%';
    $('#suspicionWrap').classList.remove('danger');
    $('#combo b').textContent = '×0';
    $('#heistMsg').textContent = '';
    $('#heistMsg').className = 'heist-msg';
    $('#heistIntro').classList.add('active');
    $('#roundTag').textContent = 'GÖREV 01 / 05';
    $('#heistTitle').textContent = D.HEIST_ROUNDS[0].title;
    $('#heistHint').textContent = D.HEIST_ROUNDS[0].hint;
    $('#supportCount').textContent = '×' + tokens;
    $('#supportBtn').disabled = true;
    $('#supportBtn').classList.remove('used');
    $('#gaugePop').className = 'gauge-pop';
    $('#gaugeFlash').className = 'gauge-flash';
    go('heist');
  }

  $('#beginHeist').addEventListener('click', function () {
    $('#heistIntro').classList.remove('active');
    Sound.ui();
    startHeistRun();
  });

  function startHeistRun() {
    var tokens = 2 + (state.you === 'ece' ? 1 : 0) + (state.kimya >= 60 ? 1 : 0);
    heist = {
      round: 0,
      loot: 0,
      susp: Math.round(state.suphe),
      combo: 0,
      maxCombo: 0,
      hits: 0,
      misses: 0,
      tokens: tokens,
      widen: false,
      active: false,
      locked: false,
      slowUntil: 0,
      zoneBase: 0,
      zoneFrac: 0,
      half: 0,
      zoneCenter: 0,
      angle: 0,
      speed: 0,
      limit: 0,
      startTime: 0,
      last: 0
    };
    updateHeistHud();
    startRound(0);
  }

  function updateZone() {
    if (!heist) return;
    var len = heist.zoneFrac * 100;
    var start = (heist.zoneCenter - heist.half + 360) % 360;
    var startPct = (start / 360) * 100;
    var zone = $('#gaugeZone');
    zone.style.strokeDasharray = len + ' ' + (100 - len);
    zone.style.strokeDashoffset = String(-startPct);
    zone.style.opacity = '1';
  }

  function updateNeedle() {
    if (!heist) return;
    $('#needle').setAttribute('transform', 'rotate(' + heist.angle.toFixed(2) + ' 120 120)');
  }

  function startRound(index) {
    clearTimers();
    if (!heist) return;
    var r = D.HEIST_ROUNDS[index];
    if (!r) { finish(false); return; }
    heist.round = index;
    heist.active = true;
    heist.locked = false;
    heist.widen = false;
    heist.zoneBase = Math.min(0.5, r.zone * state.plan.zone);
    heist.zoneFrac = heist.zoneBase;
    heist.half = heist.zoneFrac * 180;
    heist.zoneCenter = 58 + Math.random() * 244;
    heist.angle = (heist.zoneCenter + 150 + Math.random() * 60) % 360;
    heist.speed = r.speed;
    heist.limit = r.time;
    heist.startTime = performance.now();
    heist.last = heist.startTime;
    heist.slowUntil = 0;

    $('#roundTag').textContent = 'GÖREV ' + pad(index + 1) + ' / 05';
    $('#heistTitle').textContent = r.title;
    $('#heistHint').textContent = r.hint;
    $('#heistMsg').textContent = '';
    $('#heistMsg').className = 'heist-msg';
    $('#gaugePop').className = 'gauge-pop';
    $('#gaugeFlash').className = 'gauge-flash';
    $('#timeBar').style.width = '100%';
    $('#timeBar').parentNode.classList.remove('low');
    $('#tapBtn').disabled = false;
    $('#supportBtn').classList.remove('used');
    updateZone();
    updateNeedle();
    updateHeistHud();
    Sound.ui();
    raf = requestAnimationFrame(loop);
  }

  function loop(now) {
    if (!heist || !heist.active) return;
    var dt = Math.min(0.06, (now - heist.last) / 1000);
    heist.last = now;
    var speed = heist.speed;
    if (now < heist.slowUntil) speed *= 0.42;
    heist.angle = (heist.angle + speed * dt) % 360;
    updateNeedle();
    var left = heist.limit - (now - heist.startTime) / 1000;
    var pct = clamp((left / heist.limit) * 100, 0, 100);
    $('#timeBar').style.width = pct + '%';
    $('#timeBar').parentNode.classList.toggle('low', left < 1.6);
    if (left <= 0) {
      resolveMiss(true);
      return;
    }
    raf = requestAnimationFrame(loop);
  }

  function updateHeistHud() {
    if (!heist) return;
    $('#lootVal').textContent = money(heist.loot);
    $('#suspVal').textContent = Math.round(heist.susp);
    $('#suspBar').style.width = clamp(heist.susp, 0, 100) + '%';
    $('#suspicionWrap').classList.toggle('danger', heist.susp >= 60);
    $('#combo b').textContent = '×' + heist.combo;
    $('#combo').classList.toggle('on', heist.combo > 1);
    $('#supportCount').textContent = '×' + heist.tokens;
    var disabled = !heist.active || heist.locked || heist.tokens <= 0 || heist.widen;
    $('#supportBtn').disabled = disabled;
    $('#supportBtn').classList.toggle('used', heist.widen);
  }

  function pop(big, small, kind) {
    var el = $('#gaugePop');
    el.className = 'gauge-pop';
    el.innerHTML = '<b>' + big + '</b><span>' + small + '</span>';
    void el.offsetWidth;
    el.className = 'gauge-pop show ' + kind;
    timers.push(setTimeout(function () { el.className = 'gauge-pop'; }, 1100));
  }

  function resolveHit(quality) {
    if (!heist) return;
    heist.active = false;
    heist.locked = true;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    var r = D.HEIST_ROUNDS[heist.round];
    heist.combo += 1;
    heist.maxCombo = Math.max(heist.maxCombo, heist.combo);
    heist.hits += 1;
    var mult = quality === 'perfect' ? 1.5 : quality === 'great' ? 1.25 : 1;
    var reward = Math.round((r.loot * state.plan.loot * mult * (1 + (heist.combo - 1) * 0.04)) / 500) * 500;
    heist.loot += reward;
    if (quality === 'perfect') heist.susp = Math.max(0, heist.susp - 4);
    else if (quality === 'great') heist.susp = Math.max(0, heist.susp - 2);
    updateHeistHud();

    var label = quality === 'perfect' ? 'MÜKEMMEL' : quality === 'great' ? 'HARİKA' : 'TAMAM';
    pop('+₺' + money(reward), label + (heist.combo > 1 ? ' · ×' + heist.combo : ''), 'hit');
    $('#gaugeFlash').className = 'gauge-flash hit';
    $('#heistMsg').textContent = r.win;
    $('#heistMsg').className = 'heist-msg good';
    timers.push(setTimeout(function () { $('#gaugeFlash').className = 'gauge-flash'; }, 500));
    Sound.hit(quality);
    vibrate(quality === 'perfect' ? [12, 30, 12] : 14);
    timers.push(setTimeout(nextRound, 1250));
  }

  function resolveMiss(timeout) {
    if (!heist || heist.locked) return;
    heist.active = false;
    heist.locked = true;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    var r = D.HEIST_ROUNDS[heist.round];
    heist.combo = 0;
    heist.misses += 1;
    var mod = state.you === 'selin' ? 0.8 : 1;
    var gain = 22 * state.plan.susp * mod * (1 - state.ortaklik / 400);
    gain = Math.max(6, Math.round(gain));
    heist.susp = Math.min(100, heist.susp + gain);
    updateHeistHud();
    pop(timeout ? 'ÇOK YAVAŞ' : 'ISKA', 'ŞÜPHE +' + gain, 'miss');
    $('#gaugeFlash').className = 'gauge-flash miss';
    $('#heistMsg').textContent = r.lose;
    $('#heistMsg').className = 'heist-msg bad';
    timers.push(setTimeout(function () { $('#gaugeFlash').className = 'gauge-flash'; }, 500));
    Sound.miss();
    vibrate([25, 40, 25]);
    timers.push(setTimeout(nextRound, 1250));
  }

  function nextRound() {
    if (!heist) return;
    if (heist.susp >= 100) { finish(true); return; }
    if (heist.round >= D.HEIST_ROUNDS.length - 1) { finish(false); return; }
    startRound(heist.round + 1);
  }

  function onTap() {
    if (!heist || !heist.active || heist.locked) return;
    var diff = Math.abs(((heist.angle - heist.zoneCenter + 540) % 360) - 180);
    if (diff <= heist.half) {
      var ratio = diff / heist.half;
      resolveHit(ratio < 0.33 ? 'perfect' : ratio < 0.68 ? 'great' : 'good');
    } else {
      resolveMiss(false);
    }
  }

  var gauge = $('#gauge');
  gauge.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    suppressClick = true;
    setTimeout(function () { suppressClick = false; }, 500);
    onTap();
  });
  $('#tapBtn').addEventListener('click', function () {
    if (suppressClick) { suppressClick = false; return; }
    onTap();
  });

  $('#supportBtn').addEventListener('click', function () {
    if (!heist || !heist.active || heist.locked || heist.tokens <= 0 || heist.widen) return;
    heist.tokens -= 1;
    heist.widen = true;
    heist.zoneFrac = Math.min(0.5, heist.zoneBase * 1.25);
    heist.half = heist.zoneFrac * 180;
    heist.slowUntil = performance.now() + 2600;
    updateZone();
    updateHeistHud();
    $('#heistMsg').textContent = 'Partnerin garsonu oyalıyor. İbre yavaşladı, bölge genişledi.';
    $('#heistMsg').className = 'heist-msg support';
    Sound.support();
    vibrate(16);
  });

  function finish(caught) {
    if (!heist) return;
    clearTimers();
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    heist.active = false;
    var stats = {
      kimya: Math.round(state.kimya),
      ortaklik: Math.round(state.ortaklik),
      susp: Math.round(heist.susp),
      hits: heist.hits,
      misses: heist.misses,
      maxCombo: heist.maxCombo,
      loot: heist.loot
    };
    var endingId;
    if (caught) endingId = 'caught';
    else if (heist.misses === 0 && heist.susp <= 10) endingId = 'ghost';
    else if (state.kimya >= 50 && state.ortaklik >= 50) endingId = 'legend';
    else if (state.kimya >= 50) endingId = 'love';
    else if (state.ortaklik >= 50) endingId = 'crew';
    else endingId = 'cold';

    var ending = D.ENDINGS.filter(function (e) { return e.id === endingId; })[0];
    var final = 0;
    if (!caught) {
      final = heist.loot
        + Math.round(state.kimya * 700)
        + Math.round(state.ortaklik * 500)
        + heist.maxCombo * 1200;
    }
    var isNew = store.endings.indexOf(endingId) === -1;
    if (isNew) store.endings.push(endingId);
    store.plays += 1;
    if (!caught && final > store.best) store.best = final;
    saveStore();

    renderResult(ending, final, caught, isNew, stats);
    go('result');
    if (caught) Sound.lose();
    else Sound.win();
  }

  /* ---------------- result ---------------- */
  function starsFor(ending, final, caught) {
    if (caught) return 0;
    if (ending.rank === 'S') return 3;
    if (final >= 215000) return 3;
    if (final >= 160000) return 2;
    return 1;
  }

  function renderResult(ending, final, caught, isNew, stats) {
    lastShownEnding = ending;
    var index = D.ENDINGS.map(function (e) { return e.id; }).indexOf(ending.id);
    var stamp = $('#resultStamp');
    stamp.textContent = ending.stamp;
    stamp.style.color = ending.color;
    stamp.style.borderColor = ending.color;
    stamp.classList.toggle('bad', caught);

    $('#endingTag').innerHTML = 'SON ' + pad(index + 1) + ' / 06' + (isNew ? '<span class="new-badge">YENİ</span>' : '');
    var title = $('#endingTitle');
    title.textContent = ending.title;
    title.style.color = ending.color;
    $('#endingQuote').textContent = ending.quote;
    $('#endingText').textContent = fill(ending.text);

    $('#moneyLabel').textContent = caught ? 'EL KONULAN' : 'KASADAN ÇIKAN';
    $('#finalLoot').textContent = money(caught ? stats.loot : final);
    $('#moneyCard').classList.toggle('bad', caught);

    var stars = starsFor(ending, final, caught);
    $('#stars').innerHTML = [0, 1, 2].map(function (i) {
      return '<span class="star' + (i < stars ? ' on' : '') + '">★</span>';
    }).join('');

    $('#resultStats').innerHTML =
      statChip('❤️', 'KİMYA', stats.kimya, '#ff8fa3')
      + statChip('🤝', 'ORTAKLIK', stats.ortaklik, '#2dd4bf')
      + statChip('👁️', 'ŞÜPHE', stats.susp, stats.susp >= 60 ? '#ff5f4a' : '#ffcf6b')
      + statChip('🎯', 'İSABET', stats.hits + '/5', '#ffcf6b');

    var order = [state.you, state.partner, state.o1, state.o2];
    $('#resultPortraits').innerHTML = order.map(function (id) {
      return '<div class="result-mini" style="--accent:' + colorOf(id) + '">'
        + '<div class="result-mini-art">' + window.Art.character(id, caught ? 'worried' : 'happy') + '</div>'
        + '<span>' + C[id].name + '</span></div>';
    }).join('');

    var conf = $('#confetti');
    conf.innerHTML = '';
    if (!caught) {
      for (var i = 0; i < 18; i++) {
        var s = document.createElement('i');
        s.style.left = (4 + Math.random() * 92) + '%';
        s.style.animationDelay = (Math.random() * 0.9).toFixed(2) + 's';
        s.style.animationDuration = (1.6 + Math.random() * 1.4).toFixed(2) + 's';
        s.style.background = i % 3 === 0 ? ending.color : i % 3 === 1 ? '#ff8fa3' : '#ffcf6b';
        s.style.transform = 'rotate(' + Math.round(Math.random() * 180) + 'deg)';
        conf.appendChild(s);
      }
    }
    refreshStoreUI();
    $('#resultProgressCount').textContent = store.endings.length + '/6';
    $('#resultDots').innerHTML = D.ENDINGS.map(function (e) {
      var unlocked = store.endings.indexOf(e.id) !== -1;
      var current = e.id === ending.id;
      return '<span class="result-dot' + (unlocked ? ' on' : '') + (current ? ' current' : '') + '"'
        + ' style="--accent:' + e.color + '" title="' + (unlocked ? e.title : 'Henüz görülmedi') + '">'
        + (unlocked ? e.icon : '') + '</span>';
    }).join('');
  }

  function statChip(icon, label, value, color) {
    return '<div class="result-stat" style="--accent:' + color + '"><span>' + icon + '</span>'
      + '<b>' + value + '</b><small>' + label + '</small></div>';
  }

  $('#replayBtn').addEventListener('click', function () {
    Sound.ui();
    if (!state.you) { renderCast(); go('cast'); return; }
    beginDate();
  });

  $('#resultCast').addEventListener('click', function () {
    Sound.ui();
    renderCast();
    go('cast');
  });

  $('#resultEndings').addEventListener('click', function () { openEndings('result'); });

  /* ---------------- endings archive ---------------- */
  function openEndings(from) {
    endingsReturn = from || 'title';
    renderEndings();
    go('endings');
    Sound.ui();
  }

  function renderEndings() {
    $('#endingsGrid').innerHTML = D.ENDINGS.map(function (e, i) {
      var unlocked = store.endings.indexOf(e.id) !== -1;
      return '<div class="ending-card ' + (unlocked ? 'unlocked' : 'locked') + '" style="--accent:' + e.color + '">'
        + '<span class="ending-num">' + pad(i + 1) + '</span>'
        + '<span class="ending-ico">' + (unlocked ? e.icon : '🔒') + '</span>'
        + '<strong>' + (unlocked ? e.title : '???') + '</strong>'
        + '<p>' + (unlocked ? e.quote : 'Henüz görülmedi.') + '</p>'
        + (unlocked ? '<span class="ending-rank">' + e.rank + '</span>' : '')
        + '</div>';
    }).join('');
    $('#bestLine').innerHTML = store.plays
      ? 'En iyi soygun <b>₺' + money(store.best) + '</b> · ' + store.plays + ' oynayış'
      : 'Henüz bir soygun kaydı yok. İlk kasa senin.';
  }

  $('#endingsBack').addEventListener('click', function () {
    Sound.ui();
    refreshStoreUI();
    if (endingsReturn === 'result') {
      go('result');
    } else {
      go('title');
    }
  });

  /* ---------------- misc ---------------- */
  document.addEventListener('keydown', function (e) {
    if (e.key !== ' ' && e.key !== 'Enter') return;
    var tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'BUTTON' || tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (state.screen === 'heist') { e.preventDefault(); onTap(); }
    else if (state.screen === 'date') {
      if (state.phase === 'line') { e.preventDefault(); advanceLine(); }
      else if (state.phase === 'reply') { e.preventDefault(); continueAfterReply(); }
    }
  });

  document.addEventListener('visibilitychange', function () {
    if (!heist || !heist.active) return;
    if (document.hidden) {
      heist.hiddenAt = performance.now();
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    } else {
      var delta = performance.now() - (heist.hiddenAt || performance.now());
      heist.startTime += delta;
      heist.last = performance.now();
      if (heist.slowUntil) heist.slowUntil += delta;
      raf = requestAnimationFrame(loop);
    }
  });

  window.addEventListener('resize', function () {
    if (state.screen === 'heist' && heist) updateNeedle();
  });

  /* boot */
  refreshStoreUI();
  renderCast();
  go('title');
})();
