/* Clickt — the Clickt cursor, across the site.
   The first time each section scrolls into view, the cursor from the Clickt logo
   glides in and clicks the section's most important control: a press ring, click
   ripples and the logo's rays. The click is only shown; nothing is opened or
   followed. One cursor at a time, once per section per visit.
   Target, in order: [data-cursor] → primary button → any button → an unselected
   tab → an "Explore" link → a question → a card link. A section opts out with
   data-cursor="off". Skipped with reduced motion and in lite mode (ClicktPerf, theme.js).
   Per frame it only moves things (transform) and fades them (opacity). */
(function () {
  'use strict';
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var perf = window.ClicktPerf;
  var lite = function () { return !!(perf && perf.lite); };
  if (reduced || lite() || !('IntersectionObserver' in window)) return;
  var doc = document;

  // The home hero has its own cursor animation, and the module story animates its
  // own cards; long reading pages (guide, legal) are left calm.
  var SECTIONS = 'main section.section, main .page-hero';
  var SKIP = '.hero, #workspaces, [data-cursor="off"], .legal';
  var PICK = ['[data-cursor]', '.btn--primary', '.btn', '[role="tab"][aria-selected="false"]', '.link-arrow', 'summary', 'a.card'];

  function shown(el) {
    if (!el || el.closest('[hidden], [inert], dialog:not([open])')) return false;
    var r = el.getBoundingClientRect();
    return r.width > 8 && r.height > 8 && window.getComputedStyle(el).visibility !== 'hidden';
  }
  function targetIn(section) {
    for (var i = 0; i < PICK.length; i++) {
      var list = section.querySelectorAll(PICK[i]);
      for (var k = 0; k < list.length; k++) if (shown(list[k])) return list[k];
    }
    return null;
  }

  // One overlay, shared: the cursor, a press ring that matches the control's shape,
  // three click ripples and eight rays.
  var layer = doc.createElement('div');
  layer.className = 'ptr';
  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = '<span class="ptr-press"></span><span class="ptr-click">' +
    '<span class="ptr-ring"></span><span class="ptr-ring"></span><span class="ptr-ring"></span>' +
    [0, 45, 90, 135, 180, 225, 270, 315].map(function (r) { return '<span class="ptr-ray" style="transform:rotate(' + r + 'deg)"><i></i></span>'; }).join('') +
    '</span><span class="ptr-cursor"><svg viewBox="0 0 24 24"><path d="M3 2.5 L20 11 L12.2 12.8 L9 20.5 Z"/></svg></span>';
  doc.body.appendChild(layer);
  var cursor = layer.querySelector('.ptr-cursor');
  var press = layer.querySelector('.ptr-press');
  var click = layer.querySelector('.ptr-click');
  var rings = layer.querySelectorAll('.ptr-ring');
  var rays = layer.querySelectorAll('.ptr-ray i');

  var clamp01 = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var ramp = function (x, a, b) { return clamp01((x - a) / (b - a)); };
  var outq = function (k) { return 1 - Math.pow(1 - k, 3); };
  var bump = function (x, a, b) { return Math.sin(ramp(x, a, b) * Math.PI); };

  var queue = [], busy = false, DUR = 2.1;
  function play(target) {
    busy = true;
    var radius = window.getComputedStyle(target).borderRadius || '12px';
    var t0 = performance.now();
    var w = -1, h = -1;
    // The press ring is styled once; each frame only moves it and changes its opacity.
    press.style.cssText = 'left:0;top:0;border-radius:' + radius + ';box-shadow:0 0 0 6px color-mix(in srgb, var(--blue) 22%, transparent);opacity:0;will-change:transform,opacity';
    layer.classList.add('is-on');
    function tick(now) {
      var x = (now - t0) / 1000;
      // Follow the control while the page scrolls.
      var r = target.getBoundingClientRect();
      if (r.width !== w || r.height !== h) { w = r.width; h = r.height; press.style.width = w.toFixed(1) + 'px'; press.style.height = h.toFixed(1) + 'px'; }
      var px = r.left + Math.min(r.width * 0.62, r.width - 10), py = r.top + r.height * 0.62;
      var go = outq(ramp(x, 0, 0.9)), tap = bump(x, 0.9, 1.15), away = ramp(x, 1.3, 2.1);
      cursor.style.opacity = (ramp(x, 0, 0.25) * (1 - ramp(x, 1.55, 2.1))).toFixed(3);
      cursor.style.transform = 'translate(' + (px + (1 - go) * 170 + away * 16).toFixed(1) + 'px,' + (py + (1 - go) * 120 + away * 12).toFixed(1) + 'px) scale(' + (1 - 0.16 * tap).toFixed(3) + ')';
      click.style.transform = 'translate(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px)';
      rings.forEach(function (ring, k) {
        var p = ramp(x, 0.95 + k * 0.14, 1.85 + k * 0.14);
        ring.style.opacity = (p > 0 && p < 1 ? 0.55 * (1 - p) : 0).toFixed(3);
        ring.style.transform = 'scale(' + (0.15 + 3.6 * outq(p)).toFixed(3) + ')';
      });
      var rp = ramp(x, 0.95, 1.4);
      rays.forEach(function (ray) { ray.style.opacity = (rp > 0 && rp < 1 ? 1 - rp : 0).toFixed(3); ray.style.transform = 'translateY(' + (16 + 14 * rp).toFixed(1) + 'px)'; });
      var pr = bump(x, 0.92, 1.6);
      press.style.transform = 'translate(' + r.left.toFixed(1) + 'px,' + r.top.toFixed(1) + 'px) scale(' + (1 + 0.04 * pr).toFixed(3) + ')';
      press.style.opacity = pr.toFixed(3);
      if (x < DUR && !lite()) requestAnimationFrame(tick);
      else { layer.classList.remove('is-on'); busy = false; setTimeout(next, 350); }
    }
    requestAnimationFrame(tick);
  }
  function inView(el) { var r = el.getBoundingClientRect(); return r.top > 70 && r.bottom < window.innerHeight - 16; }
  function next() {
    if (lite()) { queue.length = 0; return; }
    while (queue.length) {
      var item = queue.shift();
      if (inView(item)) { play(item); return; }
      // Scrolled away before its turn: it plays the next time it is fully in view.
      io.observe(item);
    }
  }
  // Watch each section's chosen control and play once it is fully on screen
  // (sections can be taller than the screen, so the control decides, not the section).
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting || e.intersectionRatio < 0.95 || !inView(e.target)) return;
      var target = e.target;
      io.unobserve(target);
      // Give the section's own entrance animation a moment to settle.
      setTimeout(function () { if (queue.indexOf(target) < 0) queue.push(target); if (!busy) next(); }, 450);
    });
  }, { threshold: [0.95, 1] });

  function start() {
    Array.prototype.forEach.call(doc.querySelectorAll(SECTIONS), function (section) {
      if (section.matches(SKIP)) return;
      var target = targetIn(section);
      if (target) io.observe(target);
    });
  }
  if (window.Clickt && window.Clickt.whenReady) window.Clickt.whenReady(start); else start();
})();
