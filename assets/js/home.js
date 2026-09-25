/* Clickt — homepage: hero stage reveal, sticky module story, device tabs. */
(function () {
  'use strict';
  var C = window.Clickt;
  if (!C) return;
  var qsa = C.qsa;
  var reduced = C.reduced;

  /* Hero stage settles into place as it scrolls into view. */
  var stage = document.querySelector('[data-stage]');
  if (stage) {
    if (reduced) stage.style.setProperty('--p', 1);
    else {
      var ticking = false;
      var update = function () {
        ticking = false;
        var r = stage.getBoundingClientRect();
        var vh = window.innerHeight;
        var p = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.75)));
        stage.style.setProperty('--p', p.toFixed(3));
      };
      window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
      window.addEventListener('resize', update);
      update();
    }
  }

  /* Sticky module story: the step nearest the middle of the viewport wins. */
  var story = document.querySelector('[data-story]');
  if (story && 'IntersectionObserver' in window) {
    var steps = qsa('[data-step]', story);
    var shots = qsa('[data-shot]', story);
    var glow = story.querySelector('[data-glow]');
    var stageEl = story.querySelector('.story-stage');
    var setActive = function (i) {
      steps.forEach(function (s, n) { s.classList.toggle('is-active', n === i); });
      shots.forEach(function (s, n) { s.classList.toggle('is-active', n === i); });
      var col = steps[i].getAttribute('data-color');
      if (glow) glow.style.setProperty('--mc', col);
      if (stageEl) stageEl.style.setProperty('--mc', col);
    };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) setActive(steps.indexOf(e.target)); });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    steps.forEach(function (s) { io.observe(s); });
    setActive(0);
  }

  /* Device showcase: choose Apple or Android (phone screens). */
  var dev = document.querySelector('[data-devices]');
  if (dev) {
    var plats = qsa('[data-plat]');
    var panels = qsa('[data-platform]', dev);
    plats.forEach(function (b) {
      b.addEventListener('click', function () {
        var plat = b.getAttribute('data-plat');
        plats.forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
        panels.forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-platform') === plat); });
      });
    });
  }
})();
