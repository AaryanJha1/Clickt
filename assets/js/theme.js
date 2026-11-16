/* Apply the saved appearance before the page is painted. */
(function () {
  'use strict';
  var key = 'clickt-theme';
  var root = document.documentElement;
  var preference = 'system';
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  try {
    var saved = localStorage.getItem(key);
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch (e) {}

  function apply() {
    var resolved = preference === 'system' ? (media && media.matches ? 'dark' : 'light') : preference;
    root.setAttribute('data-theme', resolved);
    // Samsung Internet may hide its forced darkening from prefers-color-scheme.
    var samsungSystemLight = /SamsungBrowser\//i.test(navigator.userAgent) && preference === 'system' && resolved === 'light';
    if (samsungSystemLight) root.setAttribute('data-samsung-system', '');
    else root.removeAttribute('data-samsung-system');
    root.style.colorScheme = preference === 'system' ? 'light dark' : resolved;
    var scheme = document.querySelector('meta[name="color-scheme"]');
    if (scheme) scheme.content = preference === 'system' ? 'light dark' : resolved;
    document.querySelectorAll('[data-theme-choice]').forEach(function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-theme-choice') === resolved ? 'true' : 'false');
    });
    document.querySelectorAll('meta[name="theme-color"][media]').forEach(function (tag) {
      if (!tag.hasAttribute('data-original-media')) tag.setAttribute('data-original-media', tag.media);
      var original = tag.getAttribute('data-original-media');
      tag.media = preference === 'system' ? original : (original.indexOf(resolved) !== -1 ? 'all' : 'not all');
    });
  }
  function choose(value) {
    if (value !== 'light' && value !== 'dark') return;
    preference = value;
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
    apply();
  }
  apply();
  document.addEventListener('DOMContentLoaded', apply);
  document.addEventListener('click', function (event) {
    var button = event.target.closest && event.target.closest('[data-theme-choice]');
    if (button) choose(button.getAttribute('data-theme-choice'));
  });
  if (media) {
    if (media.addEventListener) media.addEventListener('change', apply);
    else if (media.addListener) media.addListener(apply);
  }
  window.addEventListener('storage', function (event) {
    if (event.key !== key && event.key !== null) return;
    preference = event.newValue === 'dark' || event.newValue === 'light' ? event.newValue : 'system';
    apply();
  });
})();

/* Performance tier, decided before the page is painted.
   html.perf-lite turns off the decorative motion (grain, drifting glows, mouse light,
   demo cursor, glass blur) and the home hero shows its finished still frame, so older
   phones and laptops get a calm page instead of a stuttering one. It is switched on by:
     - Data Saver, or a device that reports ≤ 2 GB memory or ≤ 2 CPU cores (here);
     - the frame-rate check in app.js, if the page is visibly dropping frames — that
       result is remembered for the rest of the visit (sessionStorage).
   ClicktPerf.slowNet (2G/3G or Data Saver) skips the first-visit splash.
   Try it: ?fx=lite forces lite, ?fx=full forces the full effects, ?fx=auto resets. */
(function () {
  'use strict';
  var root = document.documentElement;
  var KEY = 'clickt-fx';
  var forced = '';
  try {
    var m = /[?&]fx=(lite|full|auto)\b/.exec(location.search);
    if (m) { if (m[1] === 'auto') sessionStorage.removeItem(KEY); else sessionStorage.setItem(KEY, m[1]); }
    forced = sessionStorage.getItem(KEY) || '';
  } catch (e) {}
  var nav = navigator;
  var conn = nav.connection || nav.mozConnection || nav.webkitConnection;
  var saveData = !!(conn && conn.saveData);
  var slowNet = saveData || !!(conn && /(^|-)(2g|3g)$/.test(conn.effectiveType || ''));
  var weak = (nav.deviceMemory && nav.deviceMemory <= 2) || (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2);
  var api = {
    lite: false,
    reason: '',
    slowNet: slowNet,
    forced: forced,
    goLite: function (why) {
      if (api.lite) return;
      api.lite = true;
      api.reason = why || 'auto';
      root.classList.add('perf-lite');
      if (why === 'fps') { try { sessionStorage.setItem(KEY, 'lite'); } catch (e) {} }
      document.dispatchEvent(new CustomEvent('clickt:lite', { detail: { reason: api.reason } }));
    },
  };
  window.ClicktPerf = api;
  if (forced === 'lite') api.goLite(/[?&]fx=lite\b/.test(location.search) ? 'forced' : 'remembered');
  else if (forced !== 'full' && (saveData || weak)) api.goLite(saveData ? 'data-saver' : 'device');
})();
