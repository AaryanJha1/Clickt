// First-visit splash: logo with a 0 → 100 counter. Shown once per browsing session on the
// home page; skipped for reduced-motion. The head snippet locks the page before first paint.
export const splashHead = `<script>try{if(!sessionStorage.getItem('clickt-splash'))document.documentElement.classList.add('splash-lock')}catch(e){}</script>`;

export const splashBody = `<div class="splash" data-splash role="status" aria-live="polite" aria-label="Loading Clickt">
  <span class="glow glow--blue splash-glow splash-glow--a"></span><span class="glow glow--peach splash-glow splash-glow--b"></span>
  <div class="splash-inner">
    <img class="splash-logo" src="/assets/img/brand/logo.webp" alt="Clickt" width="320" height="104" decoding="async">
    <div class="splash-count" aria-hidden="true"><span data-splash-num>0</span><small>%</small></div>
    <div class="splash-bar" aria-hidden="true"><i data-splash-bar></i></div>
  </div>
</div>
<script>
(function () {
  var root = document.documentElement;
  var el = document.querySelector('[data-splash]');
  if (!el) return;
  function done(instant) {
    try { sessionStorage.setItem('clickt-splash', '1'); } catch (e) {}
    root.classList.remove('splash-lock');
    document.dispatchEvent(new CustomEvent('clickt:splash-done'));
    if (instant) { el.remove(); return; }
    el.classList.add('is-leaving');
    setTimeout(function () { el.remove(); }, 900);
  }
  if (!root.classList.contains('splash-lock')) { el.remove(); return; }
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { done(true); return; }
  var ne = false;
  try { ne = localStorage.getItem('clickt-lang') === 'ne'; } catch (e) {}
  var num = el.querySelector('[data-splash-num]');
  var bar = el.querySelector('[data-splash-bar]');
  var digits = '०१२३४५६७८९';
  var start = null, dur = 1900;
  function fmt(n) { var s = String(n); return ne ? s.replace(/\\d/g, function (d) { return digits[d]; }) : s; }
  function tick(ts) {
    if (start === null) start = ts;
    var p = Math.min(1, (ts - start) / dur);
    var e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; // ease in-out
    var n = Math.round(e * 100);
    num.textContent = fmt(n);
    bar.style.transform = 'scaleX(' + e + ')';
    if (p < 1) requestAnimationFrame(tick);
    else setTimeout(function () { done(false); }, 320);
  }
  requestAnimationFrame(tick);
  setTimeout(function () { if (root.classList.contains('splash-lock')) done(false); }, 6000); // never trap the visitor
})();
</script>`;
