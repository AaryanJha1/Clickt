/* Clickt — interactive scenes. Each initialiser is self-contained and safe to
   run on any page that includes the matching markup. */
(function () {
  'use strict';
  var C = window.Clickt;
  if (!C) return;
  var qsa = C.qsa;
  var T = function (k, v) { return C.t(k, v); };
  var reduced = C.reduced;

  function inView(el, fn, threshold) {
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var run = fn;
    fn = function () { C.whenReady(run); };
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { fn(); io.disconnect(); } });
    }, { threshold: threshold || 0.4 });
    io.observe(el);
  }

  /* ---------------- ClicktAI proposal -> approve -> receipt ---------------- */
  qsa('[data-scene="approve"]').forEach(function (card) {
    var typed = card.querySelector('[data-typed]');
    var status = card.querySelector('[data-status]');
    var badge = card.querySelector('[data-badge]');
    var rows = qsa('[data-row]', card);
    var approveBtn = card.querySelector('[data-approve]');
    var replay = card.querySelector('[data-replay]');
    var reqKey = card.getAttribute('data-request') || 'scene.approve.request';
    var state = 'idle';
    var timers = [];
    var charTimer = 0;
    rows.forEach(function (r, i) { r.style.setProperty('--i', i); });

    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
    function clear() { timers.forEach(clearTimeout); timers = []; clearInterval(charTimer); }
    function labels() {
      var map = { idle: 'ready', typing: 'ready', thinking: 'prep', proposed: 'review', approved: 'done' };
      status.textContent = T('scene.approve.status.' + map[state]);
      badge.textContent = T(state === 'approved' ? 'scene.approve.applied' : 'scene.approve.draft');
      var rt = card.querySelector('[data-receipt-title]');
      if (rt) rt.textContent = T('scene.approve.receiptN', { n: card.getAttribute('data-receipt-n') || rows.length });
    }
    function setState(s) {
      state = s;
      card.classList.toggle('is-started', s !== 'idle');
      card.classList.toggle('is-thinking', s === 'thinking');
      card.classList.toggle('is-proposed', s === 'proposed');
      card.classList.toggle('is-approved', s === 'approved');
      labels();
    }
    function play() {
      clear();
      card.classList.add('is-anim');
      var full = T(reqKey);
      typed.textContent = '';
      setState('typing');
      var i = 0;
      charTimer = setInterval(function () {
        i += 2;
        typed.textContent = full.slice(0, i);
        if (i >= full.length) {
          clearInterval(charTimer);
          later(function () { setState('thinking'); }, 350);
          later(function () { setState('proposed'); }, 1250);
        }
      }, 22);
    }
    function showFinal() { clear(); card.classList.remove('is-anim'); typed.textContent = T(reqKey); setState('proposed'); }

    if (approveBtn) approveBtn.addEventListener('click', function () {
      if (state === 'typing' || state === 'thinking') { clear(); typed.textContent = T(reqKey); setState('proposed'); }
      later(function () { setState('approved'); }, state === 'proposed' ? 0 : 200);
    });
    if (replay) replay.addEventListener('click', function () { play(); });
    C.onLang(function () {
      if (state === 'typing') { clear(); typed.textContent = T(reqKey); setState('proposed'); }
      else { typed.textContent = T(reqKey); labels(); }
    });

    if (reduced) { showFinal(); return; }
    // Hold the pre-animation state until the card is on screen.
    card.classList.add('is-anim');
    typed.textContent = '';
    inView(card, play, 0.45);
  });

  /* ---------------- claim: one winner ---------------- */
  qsa('[data-scene="claim"]').forEach(function (root) {
    var who = qsa('.claimer', root);
    var steps = qsa('[data-step]', root);
    var raceBtn = root.querySelector('[data-race]');
    var doneBtn = root.querySelector('[data-complete]');
    var resetBtn = root.querySelector('[data-reset]');
    var state = 0;
    var winner = -1;
    function name(i) { return T(i === 0 ? 'scene.claim.n1' : 'scene.claim.n2'); }
    function paint() {
      steps.forEach(function (s, i) { s.classList.toggle('is-on', i === state); s.classList.toggle('is-past', i < state); });
      who.forEach(function (w, i) {
        w.classList.toggle('is-winner', winner === i);
        w.classList.toggle('is-loser', winner !== -1 && winner !== i);
        var msg = w.querySelector('[data-msg]');
        msg.textContent = winner === -1 ? '' : (winner === i ? T('scene.claim.winner', { name: name(i) }) : T('scene.claim.already', { name: name(winner) }));
      });
      raceBtn.hidden = state !== 0;
      doneBtn.hidden = state !== 1;
      resetBtn.hidden = state === 0;
    }
    function take(i) { if (state !== 0) return; winner = i; state = 1; paint(); }
    who.forEach(function (w, i) { w.querySelector('[data-claim]').addEventListener('click', function () { take(i); }); });
    raceBtn.addEventListener('click', function () {
      if (state !== 0) return;
      who.forEach(function (w) { w.classList.remove('is-pulsing'); void w.offsetWidth; w.classList.add('is-pulsing'); });
      setTimeout(function () { take(Math.random() < 0.5 ? 0 : 1); }, reduced ? 0 : 520);
    });
    doneBtn.addEventListener('click', function () { state = 2; paint(); doneBtn.hidden = true; });
    resetBtn.addEventListener('click', function () { state = 0; winner = -1; paint(); });
    C.onLang(paint);
    paint();
  });

  /* ---------------- reminder timeline ---------------- */
  qsa('[data-scene="reminder"]').forEach(function (root) {
    var input = root.querySelector('[data-due]');
    var out = root.querySelector('[data-out]');
    var marks = root.querySelector('[data-marks]');
    var strip = root.querySelector('[data-strip]');
    var doneBtn = root.querySelector('[data-done]');
    var cap = root.querySelector('[data-caption]');
    var done = false;
    var START = 8, SPAN = 24, QUIET = 22;
    var dots = [];
    function fmt(h) { var t = ((h % 24) + 24) % 24; var hh = Math.floor(t); var mm = Math.round((t - hh) * 60); return (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm; }
    function pct(h) { return ((h - START) / SPAN) * 100 + '%'; }
    function dot(cls, h, label) {
      var d = document.createElement('i');
      d.className = 'mk-dot ' + cls;
      d.style.left = pct(h);
      if (label) d.title = label;
      marks.appendChild(d);
      return d;
    }
    function render() {
      var due = parseFloat(input.value);
      out.textContent = fmt(due);
      marks.innerHTML = '';
      dot('mk-dot--pre', due - 0.25, fmt(due - 0.25) + ' · ' + T('scene.reminder.pre'));
      dot('mk-dot--due', due, fmt(due) + ' · ' + T('scene.reminder.atDue'));
      var deferred = 0;
      for (var h = due + 3; h < START + SPAN; h += 3) {
        var q = h >= QUIET;
        if (q) deferred++;
        dot(q ? 'mk-dot--deferred' : 'mk-dot--follow', h, fmt(h) + (q ? ' · ' + T('scene.reminder.deferred') : ''));
      }
      if (deferred) {
        var dg = document.createElement('i');
        dg.className = 'mk-dot mk-dot--digest';
        dg.textContent = deferred;
        dg.title = '08:00 · ' + T('scene.reminder.digest');
        marks.appendChild(dg);
      }
      input.style.setProperty('--p', ((due - 9) / 11) * 100 + '%');
    }
    function paintDone() {
      strip.classList.toggle('is-done', done);
      doneBtn.setAttribute('aria-pressed', done ? 'true' : 'false');
      doneBtn.textContent = T(done ? 'scene.reminder.undo' : 'scene.reminder.done');
      cap.textContent = T(done ? 'scene.reminder.stopped' : 'scene.reminder.summary');
    }
    input.addEventListener('input', render);
    doneBtn.addEventListener('click', function () { done = !done; paintDone(); });
    C.onLang(function () { render(); paintDone(); });
    render();
  });

  /* ---------------- recurring checklist ---------------- */
  qsa('[data-scene="checklist"]').forEach(function (root) {
    var items = qsa('[data-item]', root);
    var bar = root.querySelector('[data-bar]');
    var count = root.querySelector('[data-count]');
    var reset = root.querySelector('[data-clreset]');
    function paint() {
      var n = items.filter(function (i) { return i.checked; }).length;
      bar.style.width = (n / items.length) * 100 + '%';
      count.textContent = T('scene.checklist.progress', { n: n, total: items.length });
      root.classList.toggle('is-complete', n === items.length);
    }
    items.forEach(function (i) { i.addEventListener('change', paint); });
    reset.addEventListener('click', function () { items.forEach(function (i) { i.checked = false; }); paint(); });
    C.onLang(paint);
    paint();
  });

  /* ---------------- charts: one dataset, many chart types ---------------- */
  qsa('[data-scene="charts"]').forEach(function (root) {
    var vals = root.getAttribute('data-values').split(',').map(Number);
    var keys = ['kathmandu', 'pokhara', 'lalitpur', 'biratnagar', 'butwal'];
    var canvas = root.querySelector('[data-canvas]');
    var tabs = qsa('[data-kind]', root);
    var COL = ['#e08a00', '#1f4bff', '#12a150', '#7a5cfa', '#e5484d'];
    var kind = 'bar';
    var max = Math.max.apply(null, vals);
    var total = vals.reduce(function (a, b) { return a + b; }, 0);
    function names() { return keys.map(function (k) { return T('scene.chart.' + k); }); }
    function svg(inner) { return '<svg viewBox="0 0 360 220" role="img" aria-label="' + T('scene.chart.' + kind) + '">' + inner + '</svg>'; }
    var X0 = 28, X1 = 348, YB = 178, YT = 26;
    function gx(i) { return X0 + 32 + i * ((X1 - X0 - 64) / (vals.length - 1)); }
    function gy(v) { return YB - (v / (max * 1.12)) * (YB - YT); }
    function grid() {
      var s = '';
      for (var i = 0; i <= 3; i++) { var y = YB - i * ((YB - YT) / 3); s += '<line x1="' + X0 + '" x2="' + X1 + '" y1="' + y + '" y2="' + y + '" stroke="rgba(11,16,32,.08)"/>'; }
      return s;
    }
    function labels(n) {
      return n.map(function (t, i) { return '<text x="' + gx(i) + '" y="200" text-anchor="middle">' + t + '</text>'; }).join('');
    }
    var draw = {
      bar: function () {
        var n = names(), s = grid(), w = 34;
        vals.forEach(function (v, i) {
          var h = YB - gy(v);
          s += '<rect class="c-in" style="animation-delay:' + i * 70 + 'ms" x="' + (gx(i) - w / 2) + '" y="' + gy(v) + '" width="' + w + '" height="' + h + '" rx="6" fill="' + COL[0] + '" opacity="' + (i === 0 ? 1 : 0.55) + '"/><text class="val c-fade" x="' + gx(i) + '" y="' + (gy(v) - 6) + '" text-anchor="middle">' + v + '</text>';
        });
        return svg(s + labels(n));
      },
      line: function () {
        var n = names(), s = grid(), d = '';
        vals.forEach(function (v, i) { d += (i ? 'L' : 'M') + gx(i) + ' ' + gy(v); });
        s += '<path class="c-line" style="--len:520" d="' + d + '" fill="none" stroke="' + COL[1] + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';
        vals.forEach(function (v, i) { s += '<circle class="c-fade" style="animation-delay:' + (300 + i * 90) + 'ms" cx="' + gx(i) + '" cy="' + gy(v) + '" r="5" fill="#fff" stroke="' + COL[1] + '" stroke-width="2.5"/>'; });
        return svg(s + labels(n));
      },
      area: function () {
        var n = names(), s = grid(), d = '';
        vals.forEach(function (v, i) { d += (i ? 'L' : 'M') + gx(i) + ' ' + gy(v); });
        s += '<defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + COL[2] + '" stop-opacity=".45"/><stop offset="1" stop-color="' + COL[2] + '" stop-opacity="0"/></linearGradient></defs>';
        s += '<path class="c-fade" d="' + d + 'L' + gx(4) + ' ' + YB + 'L' + gx(0) + ' ' + YB + 'Z" fill="url(#ag)"/><path class="c-line" style="--len:520" d="' + d + '" fill="none" stroke="' + COL[2] + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';
        return svg(s + labels(n));
      },
      donut: function () {
        var n = names(), r = 62, c = 2 * Math.PI * r, off = 0, s = '';
        vals.forEach(function (v, i) {
          var len = (v / total) * c;
          s += '<circle class="c-fade" style="animation-delay:' + i * 90 + 'ms" cx="120" cy="105" r="' + r + '" fill="none" stroke="' + COL[i] + '" stroke-width="26" stroke-dasharray="' + (len - 2) + ' ' + (c - len + 2) + '" stroke-dashoffset="' + (-off) + '" transform="rotate(-90 120 105)"/>';
          off += len;
        });
        s += '<text x="120" y="104" text-anchor="middle" style="font-size:24px;font-weight:700;fill:#0b1020">' + total + '</text><text x="120" y="122" text-anchor="middle">' + T('scene.chart.sales').split('(')[0].trim() + '</text>';
        n.forEach(function (t, i) { s += '<rect x="226" y="' + (52 + i * 24) + '" width="10" height="10" rx="3" fill="' + COL[i] + '"/><text x="244" y="' + (61 + i * 24) + '" style="font-size:11px">' + t + '</text>'; });
        return svg(s);
      },
      scatter: function () {
        var n = names(), s = grid();
        vals.forEach(function (v, i) { s += '<circle class="c-fade" style="animation-delay:' + i * 90 + 'ms" cx="' + gx(i) + '" cy="' + gy(v) + '" r="' + (7 + (v / max) * 12) + '" fill="' + COL[3] + '" fill-opacity=".55" stroke="' + COL[3] + '" stroke-width="2"/>'; });
        return svg(s + labels(n));
      },
      heat: function () {
        var n = names(), mo = ['7', '8', '9'], s = '';
        var f = [[0.86, 1.0, 0.92], [0.7, 0.82, 1.0], [1.0, 0.78, 0.9], [0.6, 0.9, 0.74], [0.82, 0.68, 1.0]];
        mo.forEach(function (m, j) { s += '<text x="' + (118 + j * 70) + '" y="30" text-anchor="middle">' + m + '</text>'; });
        vals.forEach(function (v, i) {
          s += '<text x="92" y="' + (63 + i * 30) + '" text-anchor="end">' + n[i] + '</text>';
          for (var j = 0; j < 3; j++) {
            var a = 0.12 + 0.88 * (v / max) * f[i][j];
            s += '<rect class="c-fade" style="animation-delay:' + (i * 3 + j) * 40 + 'ms" x="' + (86 + j * 70 + 6) + '" y="' + (42 + i * 30) + '" width="64" height="24" rx="6" fill="' + COL[0] + '" fill-opacity="' + a.toFixed(2) + '"/>';
          }
        });
        return svg(s);
      },
    };
    function render() { canvas.innerHTML = draw[kind](); }
    tabs.forEach(function (b) {
      b.addEventListener('click', function () {
        kind = b.getAttribute('data-kind');
        tabs.forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
        render();
      });
    });
    C.onLang(render);
    render();
  });

  /* ---------------- presentation themes ---------------- */
  qsa('[data-scene="deck"]').forEach(function (root) {
    var slide = root.querySelector('[data-slide]');
    var tabs = qsa('[data-family]', root);
    var sws = qsa('.sw', root);
    function apply(sw) {
      slide.style.setProperty('--bg', sw.getAttribute('data-bg'));
      slide.style.setProperty('--ac', sw.getAttribute('data-ac'));
      slide.style.setProperty('--fg', sw.getAttribute('data-fg'));
      slide.setAttribute('data-family', sw.getAttribute('data-fam'));
      sws.forEach(function (s) { s.setAttribute('aria-pressed', s === sw ? 'true' : 'false'); });
    }
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var fam = tab.getAttribute('data-family');
        tabs.forEach(function (x) { x.setAttribute('aria-selected', x === tab ? 'true' : 'false'); });
        sws.forEach(function (s) { s.hidden = s.getAttribute('data-fam') !== fam; });
        apply(sws.filter(function (s) { return s.getAttribute('data-fam') === fam; })[0]);
      });
    });
    sws.forEach(function (sw) { sw.addEventListener('click', function () { apply(sw); }); });
  });

  /* ---------------- trust: preview / refusal / ask ---------------- */
  qsa('[data-scene="trust"]').forEach(function (root) {
    var tabs = qsa('[data-tab]', root);
    var panels = qsa('[data-panel]', root);
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var name = tab.getAttribute('data-tab');
        tabs.forEach(function (x) { x.setAttribute('aria-selected', x === tab ? 'true' : 'false'); });
        panels.forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== name; });
      });
    });
    var pv = root.querySelector('[data-preview]');
    root.querySelector('[data-pv-approve]').addEventListener('click', function () { pv.classList.add('is-applied'); });
    root.querySelector('[data-pv-cancel]').addEventListener('click', function () { pv.classList.toggle('is-cancelled'); pv.classList.remove('is-applied'); });
    var done = root.querySelector('[data-choice-done]');
    var picked = -1;
    var opts = ['scene.trust.askA', 'scene.trust.askB'];
    function paintChoice() { if (picked > -1) { done.hidden = false; done.textContent = T('scene.trust.askDone', { team: T(opts[picked]) }); } }
    qsa('[data-choice]', root).forEach(function (b) {
      b.addEventListener('click', function () { picked = +b.getAttribute('data-choice'); paintChoice(); });
    });
    C.onLang(paintChoice);
  });

  /* ---------------- bring your own key ---------------- */
  qsa('[data-scene="byok"]').forEach(function (root) {
    var mask = root.querySelector('[data-mask]');
    var hints = { openai: 'sk-••••••••••••••••', anthropic: 'sk-ant-•••••••••••', gemini: 'AIza•••••••••••••••', nvidia: 'nvapi-••••••••••••' };
    var btns = qsa('[data-prov]', root);
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        mask.textContent = hints[b.getAttribute('data-prov')];
      });
    });
  });
})();
