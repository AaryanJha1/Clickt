/* Clickt — site runtime: header, language, reveal, dialog, counters.
   English is written into the HTML; Nepali is loaded per page on demand. */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var page = root.getAttribute('data-page') || 'home';
  var qsa = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- i18n ---------- */
  var KEY = 'clickt-lang';
  var enJs = {};
  try { enJs = JSON.parse((doc.getElementById('i18n-en') || {}).textContent || '{}'); } catch (e) {}
  window.ClicktI18nNe = window.ClicktI18nNe || {};
  var lang = 'en';
  var neLoading = null;

  function interpolate(s, vars) {
    if (!vars) return s;
    return s.replace(/\{(\w+)\}/g, function (m, n) { return Object.prototype.hasOwnProperty.call(vars, n) ? vars[n] : m; });
  }
  function t(key, vars) {
    var v = lang === 'ne' && window.ClicktI18nNe[key] != null ? window.ClicktI18nNe[key] : enJs[key];
    return interpolate(v != null ? v : key, vars);
  }
  function loadNe() {
    if (neLoading) return neLoading;
    neLoading = new Promise(function (resolve) {
      var s = doc.createElement('script');
      var me = doc.currentScript || doc.querySelector('script[src*="js/app.js"]');
      s.src = (me ? me.src.replace(/js\/app\.js.*$/, '') : '/assets/') + 'i18n/' + page + '.ne.js';
      s.onload = resolve; s.onerror = resolve;
      doc.head.appendChild(s);
    });
    return neLoading;
  }
  function applyDom() {
    var ne = window.ClicktI18nNe;
    qsa('[data-i18n]').forEach(function (el) {
      if (el.__en === undefined) el.__en = el.textContent;
      var v = lang === 'ne' ? ne[el.getAttribute('data-i18n')] : undefined;
      if (v != null && el.hasAttribute('data-trim')) v = v.replace(/\s*[→←]\s*$/, '');
      el.textContent = v != null ? v : el.__en;
    });
    qsa('[data-i18n-html]').forEach(function (el) {
      if (el.__enH === undefined) el.__enH = el.innerHTML;
      var v = lang === 'ne' ? ne[el.getAttribute('data-i18n-html')] : undefined;
      el.innerHTML = v != null ? v : el.__enH;
    });
    qsa('[data-i18n-attr]').forEach(function (el) {
      if (!el.__enA) el.__enA = {};
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var i = pair.indexOf(':');
        var attr = pair.slice(0, i).trim();
        var key = pair.slice(i + 1).trim();
        if (el.__enA[attr] === undefined) el.__enA[attr] = el.getAttribute(attr);
        var v = lang === 'ne' ? ne[key] : undefined;
        el.setAttribute(attr, v != null ? v : el.__enA[attr]);
      });
    });
    qsa('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }
  function setLang(next, persist) {
    if (next !== 'en' && next !== 'ne') return;
    var go = function () {
      lang = next;
      root.lang = next;
      applyDom();
      if (persist) { try { localStorage.setItem(KEY, next); } catch (e) {} }
      doc.dispatchEvent(new CustomEvent('clickt:langchange', { detail: { lang: next } }));
    };
    if (next === 'ne') loadNe().then(go); else go();
  }
  var initial = 'en';
  try {
    var m = /[?&]lang=(en|ne)/.exec(location.search);
    if (m) { initial = m[1]; localStorage.setItem(KEY, initial); }
    else initial = localStorage.getItem(KEY) === 'ne' ? 'ne' : 'en';
  } catch (e) {}
  doc.addEventListener('click', function (ev) {
    var b = ev.target.closest && ev.target.closest('[data-lang]');
    if (b) setLang(b.getAttribute('data-lang'), true);
  });
  window.ClicktI18n = { t: t, lang: function () { return lang; }, set: setLang };
  if (initial === 'ne') setLang('ne', false);

  /* ---------- header ---------- */
  var header = doc.querySelector('[data-header]');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  qsa('[data-menu]').forEach(function (item) {
    var btn = item.querySelector('button');
    function set(open) { item.classList.toggle('is-open', open); btn.setAttribute('aria-expanded', open ? 'true' : 'false'); }
    btn.addEventListener('click', function () { set(!item.classList.contains('is-open')); });
    item.addEventListener('mouseleave', function () { set(false); });
    doc.addEventListener('click', function (e) { if (!item.contains(e.target)) set(false); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  });

  var burger = doc.querySelector('.burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = !doc.body.classList.contains('menu-open');
      doc.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    qsa('[data-sheet] a').forEach(function (a) {
      a.addEventListener('click', function () { doc.body.classList.remove('menu-open'); burger.setAttribute('aria-expanded', 'false'); });
    });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') { doc.body.classList.remove('menu-open'); burger.setAttribute('aria-expanded', 'false'); } });
  }

  /* Run fn once any first-visit splash has finished. */
  function whenReady(fn) {
    if (root.classList.contains('splash-lock')) doc.addEventListener('clickt:splash-done', fn, { once: true });
    else fn();
  }

  /* ---------- frame-rate check ----------
     Device hints miss many old laptops, so watch the page itself: ~2 s of frames once it
     has loaded, and again on the first scroll. If it is visibly struggling (most frames
     slower than ~38 fps, or one in five frames badly late) switch to lite mode — see
     ClicktPerf in theme.js. Skipped with reduced motion (already calm) or ?fx=full. */
  var perf = window.ClicktPerf;
  function sampleFrames(ms, done) {
    var t0 = 0, last = 0, deltas = [], spoiled = false;
    var spoil = function () { spoiled = true; };
    doc.addEventListener('visibilitychange', spoil);
    function step(now) {
      if (!t0) t0 = now; else deltas.push(now - last);
      last = now;
      if (now - t0 < ms) { requestAnimationFrame(step); return; }
      doc.removeEventListener('visibilitychange', spoil);
      if (!spoiled && !doc.hidden && deltas.length >= 10) done(deltas);
    }
    requestAnimationFrame(step);
  }
  function struggling(d) {
    var sorted = d.slice().sort(function (a, b) { return a - b; });
    var median = sorted[Math.floor(sorted.length / 2)];
    var late = d.filter(function (x) { return x > 50; }).length / d.length;
    return median > 26 || late > 0.2;
  }
  if (perf && !perf.lite && perf.forced !== 'full' && !reduced && window.requestAnimationFrame) {
    var checkFps = function () { if (!perf.lite) sampleFrames(2000, function (d) { if (struggling(d)) perf.goLite('fps'); }); };
    var afterLoad = function () { setTimeout(checkFps, 600); };
    whenReady(function () {
      if (doc.readyState === 'complete') afterLoad();
      else window.addEventListener('load', afterLoad, { once: true });
    });
    var firstScroll = function () { window.removeEventListener('scroll', firstScroll); checkFps(); };
    window.addEventListener('scroll', firstScroll, { passive: true });
  }

  /* ---------- reveal ---------- */
  var reveals = qsa('[data-reveal]');
  // reveal-now: this script arrived late on a slow connection and the head timer has
  // already shown everything (see shell.mjs); keep it shown rather than hiding it again.
  if (reduced || !('IntersectionObserver' in window) || root.classList.contains('reveal-now')) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    whenReady(function () { reveals.forEach(function (el) { io.observe(el); }); });
  }

  /* ---------- counters ---------- */
  var counters = qsa('[data-count]');
  function runCounter(el) {
    var to = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var digits = lang === 'ne' ? '०१२३४५६७८९' : null;
    var fmt = function (n) { var s = String(Math.round(n)); return digits ? s.replace(/\d/g, function (d) { return digits[d]; }) : s; };
    if (reduced) { el.textContent = fmt(to) + suffix; return; }
    var start = null;
    var dur = 1400;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(to * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { runCounter(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  } else counters.forEach(runCounter);

  /* ---------- Android tester dialog ---------- */
  var dlg = doc.querySelector('[data-play-dialog]');
  if (dlg) {
    qsa('[data-play-open]').forEach(function (b) { b.addEventListener('click', function () { dlg.showModal(); }); });
    qsa('[data-dialog-close]', dlg).forEach(function (b) { b.addEventListener('click', function () { dlg.close(); }); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    var req = dlg.querySelector('[data-play-request]');
    if (req) req.addEventListener('click', function (e) {
      e.preventDefault();
      window.open(req.href, '_blank', 'noopener,noreferrer');
      window.location.href = 'mailto:clickt@click-t.com?subject=Clickt%20Android%20tester%20request&body=Hello%20Clickt%2C%0A%0AI%20would%20like%20to%20be%20added%20to%20the%20Clickt%20Android%20internal%20test.%0A%0AMy%20Google%20Play%20email%20address%3A%20%0A%0AThank%20you.';
    });
  }

  /* ---------- privacy-preserving interaction hooks ----------
     Nothing is sent anywhere. Events are dispatched in the page, and pushed to
     window.dataLayer only if a consented analytics integration created it. */
  function track(name, detail) {
    var ev = { event: name, page: location.pathname };
    if (detail) Object.keys(detail).forEach(function (k) { ev[k] = detail[k]; });
    doc.dispatchEvent(new CustomEvent('clickt:analytics', { detail: ev }));
    if (Array.isArray(window.dataLayer)) window.dataLayer.push(ev);
  }
  doc.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('apps.apple.com') !== -1) track('download_click');
    else if (href.indexOf('contact.html') !== -1) track('contact_cta_click');
    else if (href.indexOf('services.html') !== -1) track('services_cta_click');
  });
  window.ClicktAnalytics = { track: track };

  /* Shared helper for page scripts. */
  window.Clickt = { whenReady: whenReady, qsa: qsa, reduced: reduced, t: t, onLang: function (fn) { doc.addEventListener('clickt:langchange', fn); } };
})();
