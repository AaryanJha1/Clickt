// First-visit splash: a cursor clicks, the click ripples out in ink and floods the screen,
// then settles into the logo while the wordmark writes itself out. Shown once per
// browsing session on the home page; skipped for reduced-motion. The head snippet locks the
// page before first paint. The timeline lives in home.css; the mark is the logo redrawn in
// its own pixel space (1105 × 360), and wordmark.webp is the logo's lettering on that canvas.
export const splashHead = `<script>try{if(!sessionStorage.getItem('clickt-splash'))document.documentElement.classList.add('splash-lock')}catch(e){}</script>`;

export const splashBody = `<div class="splash" data-splash role="status" aria-live="polite" aria-label="Loading Clickt">
  <span class="glow glow--blue splash-glow splash-glow--a"></span><span class="glow glow--peach splash-glow splash-glow--b"></span>
  <div class="splash-burst" aria-hidden="true"><i style="--c:var(--ink);--d:0.52s"></i><i style="--c:var(--paper);--d:0.58s"></i><i style="--c:var(--ink);--d:0.68s"></i><i style="--c:var(--paper);--d:0.74s"></i></div>
  <div class="splash-flood" aria-hidden="true"></div>
  <div class="splash-stage">
    <img class="splash-word" data-splash-word src="/assets/img/brand/wordmark.webp" alt="" width="828" height="270" decoding="async" fetchpriority="high">
    <svg class="splash-mark" viewBox="0 0 1105 360" aria-hidden="true" focusable="false">
      <g class="splash-m">
        <g transform="rotate(-1.6 191.7 177.9)">
          <ellipse class="splash-disc" cx="191.7" cy="177.9" rx="167.3" ry="153.9"/>
          <ellipse class="splash-hole" cx="191.7" cy="177.9" rx="161.3" ry="147.9"/>
        </g>
        <g class="splash-ring">
          <path class="splash-arc" d="M27.6 186.7A164.3 150.9-1.6 0 1 338.5 109.5"/>
          <path class="splash-arc" d="M261.2 314.3A164.3 150.9-1.6 0 1 106.4 307.2"/>
          <path class="splash-arc splash-arc--tick" d="M45.4 247.2A164.3 150.9-1.6 0 1 40.9 238.5"/>
          <path class="splash-gap" pathLength="1" d="M338.5 109.5A164.3 150.9-1.6 0 1 345.2 230.8"/>
          <path class="splash-gap" pathLength="1" d="M261.2 314.3A164.3 150.9-1.6 0 0 345.2 230.8"/>
          <path class="splash-gap splash-gap--s" d="M106.4 307.2A164.3 150.9-1.6 0 1 46.8 249.6"/>
          <path class="splash-gap splash-gap--s" d="M39.7 235.9A164.3 150.9-1.6 0 1 27.6 186.7"/>
        </g>
        <circle class="splash-dot" cx="193.5" cy="135.5" r="30"/>
        <g class="splash-rays">
          <path pathLength="1" d="M188.5 105.5L188.5 73.5"/>
          <path pathLength="1" d="M162.4 112.5L144 88"/>
          <path pathLength="1" d="M214.2 113.1L234.5 88.6"/>
          <path pathLength="1" d="M143.8 132.6L114.9 119.9"/>
          <path pathLength="1" d="M227.9 136.4L259.3 127.4"/>
          <path pathLength="1" d="M223.6 163L252.8 175.3"/>
        </g>
        <path class="splash-arrow" d="M193.5 135.5L29.2 212.8 78.5 234.5 35.2 293.8 66 318 120.2 260 158 296Z"/>
      </g>
    </svg>
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
    if (instant) { el.remove(); document.dispatchEvent(new CustomEvent('clickt:splash-done')); return; }
    /* Overlap: the splash dissolves while the page rises into place underneath it. */
    root.classList.add('splash-reveal');
    el.classList.add('is-leaving');
    document.dispatchEvent(new CustomEvent('clickt:splash-done'));
    setTimeout(function () { el.remove(); root.classList.remove('splash-reveal'); }, 1300);
  }
  function finish() { if (root.classList.contains('splash-lock')) done(false); }
  if (!root.classList.contains('splash-lock')) { el.remove(); return; }
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { done(true); return; }
  /* The wordmark is the last thing to move: hold on the finished logo for a beat, then leave. */
  el.querySelector('[data-splash-word]').addEventListener('animationend', function (e) {
    if (e.animationName === 'splash-word') setTimeout(finish, 330);
  });
  el.addEventListener('click', finish); // a click or any key skips it
  document.addEventListener('keydown', finish, { once: true });
  setTimeout(finish, 6000); // never trap the visitor
})();
</script>`;
