/* Clickt — homepage hero background: "Drafts, then your call".
   Every 8 seconds: loose scraps of work drift in, ClicktAI turns them into faint
   draft tasks around the headline (never behind it), the Clickt cursor clicks the
   last word of the headline ("call") and every card is applied, nearest first.
   Each loop shows a different kind of organisation. Text is read by key through
   Clickt.t, so the cards follow the language toggle. With reduced motion the hero
   shows one still frame: the cards placed and applied. */
(function () {
  'use strict';
  var C = window.Clickt;
  var root = document.querySelector('[data-hero-fx]');
  var dataEl = document.getElementById('hero-fx-data');
  if (!C || !root || !dataEl) return;
  var DATA;
  try { DATA = JSON.parse(dataEl.textContent); } catch (e) { return; }

  var LOOP = 8, STILL = 6.05;
  var reduced = C.reduced;
  var fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  var t = C.t;

  var field = root.querySelector('.hfx-field');
  var origin = root.querySelector('.hfx-origin');
  var cursor = root.querySelector('.hfx-cursor');
  var rings = C.qsa('.hfx-ring', root);
  var rays = C.qsa('.hfx-ray i', root);
  var slate = root.querySelector('.hero-in .slate');
  var title = root.querySelector('.hero-in .display');
  var lead = root.querySelector('.hero-in .lead');
  var ctas = root.querySelector('.hero-cta');

  var clamp01 = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var ramp = function (x, a, b) { return clamp01((x - a) / (b - a)); };
  var smooth = function (k) { return k * k * (3 - 2 * k); };
  var outq = function (k) { return 1 - Math.pow(1 - k, 3); };
  var bump = function (x, a, b) { return Math.sin(ramp(x, a, b) * Math.PI); };
  var rnd = function (seed) { var x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); };

  var W = 0, H = 0, ox = 0, oy = 0, sc = 0, start = 0, loopId = 0, cards = [];
  var mx = 0.5, my = 0.42, visible = true, elapsed = 0, aimed = false;

  // Where an element will rest: the copy slides in on load (data-reveal), so its own
  // entrance offset is taken out, and even the first loop uses the final layout.
  function rel(el) {
    var R = root.getBoundingClientRect(), r = el.getBoundingClientRect();
    var dx = 0, dy = 0;
    var tf = window.getComputedStyle(el).transform;
    if (tf && tf !== 'none') { var m = tf.match(/matrix\(([^)]+)\)/); if (m) { var v = m[1].split(','); dx = parseFloat(v[4]) || 0; dy = parseFloat(v[5]) || 0; } }
    var L = r.left - R.left - dx, T = r.top - R.top - dy;
    return { left: L, right: L + r.width, top: T, bottom: T + r.height, cx: L + r.width / 2, cy: T + r.height / 2 };
  }
  // The click lands on the headline's last accented word, wherever it wraps.
  function aim() {
    var ems = title ? title.querySelectorAll('em') : [];
    var word = ems.length ? ems[ems.length - 1] : title;
    if (!word) return;
    var r = rel(word);
    ox = r.left + (r.right - r.left) * 0.45; oy = r.top + (r.bottom - r.top) * 0.62;
    origin.style.left = ox.toFixed(1) + 'px'; origin.style.top = oy.toFixed(1) + 'px';
  }
  // Card positions around the copy: beside the badge, beside the headline when it
  // leaves room (otherwise beside the lead), and beside the buttons. On phones, one
  // row under the buttons.
  function slots() {
    var R = root.getBoundingClientRect(); W = R.width; H = R.height;
    var narrow = W < 560, cw = narrow ? 156 : 212, ch = 74, gap = narrow ? 14 : 30, out = [];
    var add = function (x, y) { if (x - cw / 2 >= 10 && x + cw / 2 <= W - 10) out.push({ x: x, y: y }); };
    if (!slate || !ctas) return out;
    var s = rel(slate), b = rel(ctas);
    if (narrow) {
      // Under the "Book a demo" line when there is one, so the cards never sit on it.
      var demo = root.querySelector('.hero-demo');
      var y = (demo ? rel(demo).bottom : b.bottom) + 16 + ch / 2;
      add(W / 2 - cw / 2 - 6, y); add(W / 2 + cw / 2 + 6, y);
      return out;
    }
    add(s.left - gap - cw / 2, s.cy); add(s.right + gap + cw / 2, s.cy);
    var placed = false;
    if (title) {
      var range = document.createRange(); range.selectNodeContents(title);
      var lines = Array.prototype.slice.call(range.getClientRects());
      if (lines.length) {
        var hl = Math.min.apply(null, lines.map(function (r) { return r.left; })) - R.left;
        var hr = Math.max.apply(null, lines.map(function (r) { return r.right; })) - R.left;
        if (hl - gap - cw >= 10) { var hy = rel(title).cy; add(hl - gap - cw / 2, hy); add(hr + gap + cw / 2, hy); placed = true; }
      }
    }
    if (!placed && lead) { var l = rel(lead); add(l.left - gap - cw / 2, l.cy); add(l.right + gap + cw / 2, l.cy); }
    add(b.left - gap - cw / 2, b.cy + 18); add(b.right + gap + cw / 2, b.cy + 18);
    return out;
  }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function build() {
    loopId++; aimed = false;
    field.textContent = '';
    var S = DATA.loop[sc];
    aim();
    cards = slots().map(function (slot, i) {
      var k = S.tasks[i % S.tasks.length];
      var card = el('div', 'hfx-card');
      card.appendChild(el('div', 'hfx-raw', t(k.r)));
      var task = el('div', 'hfx-task');
      var mod = el('span', 'hfx-mod', t(DATA.modules[k.mod])); mod.style.setProperty('--c', 'var(--' + k.mod + ')');
      task.appendChild(mod);
      task.appendChild(el('b', '', t(k.t)));
      var meta = el('div', 'hfx-meta');
      meta.appendChild(el('span', '', t(k.who) + (k.due ? ' · ' + t(k.due) : '')));
      var state = el('span', 'hfx-state');
      state.appendChild(el('span', 'hfx-d', t(DATA.labels.draft)));
      state.appendChild(el('span', 'hfx-a', '✓ ' + t(DATA.labels.applied)));
      meta.appendChild(state); task.appendChild(meta); card.appendChild(task);
      field.appendChild(card);
      var dir = slot.x < W / 2 ? -1 : 1, seed = loopId * 7 + i;
      var depth = [1, 0.86, 0.74][i % 3];
      return { el: card, i: i, slot: slot, dir: dir, depth: depth,
        from: { x: slot.x + dir * (90 + rnd(seed) * 110), y: slot.y + (rnd(seed + 3) - 0.5) * 110, r: (rnd(seed + 5) - 0.5) * 26 },
        dist: Math.hypot(slot.x - ox, slot.y - oy) };
    });
    cards.slice().sort(function (a, b) { return a.dist - b.dist; }).forEach(function (c, n) { c.ord = n; });
  }
  function render(x) {
    if (!aimed && x >= 4) { aim(); aimed = true; }
    var dark = document.documentElement.getAttribute('data-theme') === 'dark' || (!document.documentElement.getAttribute('data-theme') && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var base = dark ? 0.38 : 0.3;
    cards.forEach(function (c) {
      var i = c.i;
      var appear = smooth(ramp(x, 0.15 + i * 0.13, 0.9 + i * 0.13));
      var prep = smooth(ramp(x, 1.9 + i * 0.12, 3.2 + i * 0.12));
      var apAt = 5.25 + c.ord * 0.12, ap = smooth(ramp(x, apAt, apAt + 0.3));
      var leave = smooth(ramp(x, 6.5 + i * 0.06, 7.6 + i * 0.06));
      var bob = Math.sin((x + i) * 1.3) * 4 * (1 - prep * 0.6);
      var px = c.from.x + (c.slot.x - c.from.x) * prep + c.dir * leave * 70 + (mx - 0.5) * 22 * c.depth;
      var py = c.from.y + (c.slot.y - c.from.y) * prep + bob - leave * 12 + (my - 0.42) * 14 * c.depth;
      var rot = c.from.r * (1 - prep);
      var scale = (0.9 + 0.1 * prep) * (0.86 + 0.14 * c.depth) * (1 + 0.04 * bump(x, apAt, apAt + 0.45));
      var op = appear * (1 - leave) * (base + (0.96 - base) * ap) * (0.75 + 0.25 * c.depth);
      var blur = (1 - prep) * 2.2 + (1 - c.depth) * 3 * (1 - ap);
      var s = c.el.style;
      s.transform = 'translate(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px) translate(-50%,-50%) rotate(' + rot.toFixed(2) + 'deg) scale(' + scale.toFixed(3) + ')';
      s.opacity = op.toFixed(3);
      s.filter = blur > 0.05 ? 'blur(' + blur.toFixed(2) + 'px)' : 'none';
      s.setProperty('--rawk', (1 - prep).toFixed(3));
      s.setProperty('--ap', ap.toFixed(3));
      c.el.classList.toggle('is-applied', ap > 0.5);
    });
    // The Clickt cursor glides in from below right and clicks.
    var go = outq(ramp(x, 4.2, 5.15)), press = bump(x, 5.12, 5.42), away = ramp(x, 5.5, 6.5);
    cursor.style.opacity = reduced ? 0 : (ramp(x, 4.2, 4.5) * (1 - ramp(x, 5.9, 6.5))).toFixed(3);
    cursor.style.transform = 'translate(' + ((1 - go) * 240 + away * 18).toFixed(1) + 'px,' + ((1 - go) * 170 + away * 14).toFixed(1) + 'px) scale(' + (1 - 0.16 * press).toFixed(3) + ')';
    rings.forEach(function (r, k) {
      var p = reduced ? 0 : ramp(x, 5.22 + k * 0.16, 6.35 + k * 0.16);
      r.style.opacity = (p > 0 && p < 1 ? 0.6 * (1 - p) : 0).toFixed(3);
      r.style.transform = 'scale(' + (0.15 + 5.4 * outq(p)).toFixed(3) + ')';
    });
    var rp = reduced ? 0 : ramp(x, 5.22, 5.75);
    rays.forEach(function (r) { r.style.opacity = (rp > 0 && rp < 1 ? 1 - rp : 0).toFixed(3); r.style.transform = 'translateY(' + (24 + 20 * rp).toFixed(1) + 'px)'; });
    root.style.setProperty('--hfx-glow', (reduced ? 0 : bump(x, 5.2, 6.2)).toFixed(3));
  }
  // Hide the click (cursor, ripples, rays, word glow) so nothing stays frozen mid-fade.
  function clearClick() {
    cursor.style.opacity = 0;
    rings.forEach(function (r) { r.style.opacity = 0; });
    rays.forEach(function (r) { r.style.opacity = 0; });
    root.style.setProperty('--hfx-glow', 0);
  }
  function frame(now) {
    if (visible) {
      var x = (now - start) / 1000;
      if (x >= LOOP) { sc = (sc + 1) % DATA.loop.length; start = now; build(); x = 0; }
      render(x);
    }
    requestAnimationFrame(frame);
  }
  function begin() {
    root.classList.add('hfx-on');
    sc = 0; start = performance.now(); build();
    if (reduced) { render(STILL); return; }
    requestAnimationFrame(frame);
  }

  if (fine && !reduced) {
    root.addEventListener('pointermove', function (e) { var R = root.getBoundingClientRect(); mx = (e.clientX - R.left) / R.width; my = (e.clientY - R.top) / R.height; });
    root.addEventListener('pointerleave', function () { mx = 0.5; my = 0.42; });
  }
  // Pause while the hero is off screen.
  if ('IntersectionObserver' in window && !reduced) new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting && visible) { visible = false; elapsed = performance.now() - start; clearClick(); }
      else if (e.isIntersecting && !visible) { visible = true; start = performance.now() - elapsed; }
    });
  }).observe(root);
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { build(); if (reduced) render(STILL); }, 150); });
  // New language: rebuild the current cards in it (the headline may wrap differently too).
  C.onLang(function () { setTimeout(function () { build(); if (reduced) render(STILL); }, 30); });
  C.whenReady(function () {
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(begin); else begin();
  });
})();
