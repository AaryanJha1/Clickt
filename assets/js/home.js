/* Clickt — homepage: hero stage reveal, sticky module story, device tabs. */
(function () {
  'use strict';
  var C = window.Clickt;
  if (!C) return;
  var qsa = C.qsa;
  var reduced = C.reduced;

  /* Hero: pinned scroll stage. Settles into place on entry (--p), then —
     while it stays pinned — keeps scrubbing continuously (--pin): the two
     phones separate and rotate further apart, no snapping, straight off
     scroll position. */
  var stage = document.querySelector('[data-stage]');
  var pin = document.querySelector('[data-hero-pin]');
  if (stage) {
    if (reduced) {
      stage.style.setProperty('--p', 1);
      if (pin) pin.style.setProperty('--pin', 0);
    } else {
      var ticking = false;
      var update = function () {
        ticking = false;
        var r = stage.getBoundingClientRect();
        var vh = window.innerHeight;
        var p = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.75)));
        stage.style.setProperty('--p', p.toFixed(3));
        if (pin) {
          var pr = pin.getBoundingClientRect();
          var total = pr.height - vh;
          var pinP = total > 0 ? Math.max(0, Math.min(1, -pr.top / total)) : 0;
          pin.style.setProperty('--pin', pinP.toFixed(3));
        }
      };
      window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
      window.addEventListener('resize', update);
      update();
    }
  }

  /* Sticky module story: scroll progress through the steps column is
     bucketed into N equal steps (0–1/N is step 1, 1/N–2/N is step 2, …).
     Crossing a boundary snaps the active step; the phone screen and copy
     crossfade via CSS transition. Dots show and jump to the current step. */
  var story = document.querySelector('[data-story]');
  var stepsCol = story && story.querySelector('.story-steps');
  if (story && stepsCol) {
    var steps = qsa('[data-step]', story);
    var shots = qsa('[data-shot]', story);
    var dots = qsa('[data-dots] i', story);
    var glow = story.querySelector('[data-glow]');
    var stageEl = story.querySelector('.story-stage');
    var active = -1;
    var setActive = function (i) {
      if (i === active) return;
      active = i;
      steps.forEach(function (s, n) { s.classList.toggle('is-active', n === i); });
      shots.forEach(function (s, n) { s.classList.toggle('is-active', n === i); });
      dots.forEach(function (d, n) { d.classList.toggle('is-active', n === i); });
      var col = steps[i].getAttribute('data-color');
      if (glow) glow.style.setProperty('--mc', col);
      if (stageEl) stageEl.style.setProperty('--mc', col);
    };
    if (reduced) setActive(0);
    else {
      var storyTicking = false;
      var updateStory = function () {
        storyTicking = false;
        var r = stepsCol.getBoundingClientRect();
        var vh = window.innerHeight;
        var total = r.height - vh;
        var progress = total > 0 ? Math.max(0, Math.min(1, -r.top / total)) : 0;
        var idx = Math.min(steps.length - 1, Math.floor(progress * steps.length));
        setActive(idx);
      };
      window.addEventListener('scroll', function () { if (!storyTicking) { storyTicking = true; requestAnimationFrame(updateStory); } }, { passive: true });
      window.addEventListener('resize', updateStory);
      updateStory();
    }
    dots.forEach(function (d, i) {
      d.addEventListener('click', function () {
        steps[i].scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
      });
    });
  }

  /* Device showcase: choose Apple or Android (phone screens). */
  var dev = document.querySelector('[data-devices]');
  if (dev) {
    var plats = qsa('[data-plat]');
    var panels = qsa('[data-platform]', dev);
    /* On phones the three screens scroll sideways. Start on the middle one. */
    var centreMiddle = function () {
      qsa('.dev-pair--3', dev).forEach(function (row) {
        var mid = row.children[1];
        if (!mid || row.scrollWidth <= row.clientWidth) return;
        row.scrollLeft = mid.offsetLeft - (row.clientWidth - mid.offsetWidth) / 2;
      });
    };
    plats.forEach(function (b) {
      b.addEventListener('click', function () {
        var plat = b.getAttribute('data-plat');
        plats.forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
        panels.forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-platform') === plat); });
        centreMiddle();
      });
    });
    centreMiddle();
    window.addEventListener('load', centreMiddle);
    window.addEventListener('resize', centreMiddle);
  }
})();
