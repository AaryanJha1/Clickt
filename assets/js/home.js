/* Clickt — homepage: hero stage reveal, sticky module story, Open Day Week film. */
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
     Crossing a boundary snaps the active step; the phone screen, copy and
     the step's animated card crossfade via CSS transition. Dots show and jump to the current step. */
  var story = document.querySelector('[data-story]');
  var stepsCol = story && story.querySelector('.story-steps');
  if (story && stepsCol) {
    var steps = qsa('[data-step]', story);
    var shots = qsa('[data-shot]', story);
    var cards = qsa('[data-card]', story);
    var dots = qsa('[data-dots] i', story);
    var glow = story.querySelector('[data-glow]');
    var stageEl = story.querySelector('.story-stage');
    var active = -1;
    var mobileStory = window.matchMedia('(max-width: 860px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)');
    var mobileActive = false;
    var setActive = function (i) {
      if (i === active) return;
      active = i;
      steps.forEach(function (s, n) {
        s.classList.toggle('is-active', n === i);
        s.inert = mobileActive && n !== i;
      });
      shots.forEach(function (s, n) { s.classList.toggle('is-active', n === i); });
      /* The step's card replays its moment each time the step becomes active. */
      cards.forEach(function (c, n) { c.classList.toggle('is-active', n === i); });
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
        var nextMobile = mobileStory.matches;
        if (nextMobile !== mobileActive) {
          mobileActive = nextMobile;
          story.classList.toggle('story-mobile', mobileActive);
          active = -1;
          if (!mobileActive) steps.forEach(function (s) { s.inert = false; });
        }
        var r = (mobileActive ? story : stepsCol).getBoundingClientRect();
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

  /* Open Day Week film. Autoplays (with sound when the browser allows it, see play())
     while at least half of it is on screen; it pauses
     once it is mostly off screen (or the tab is hidden) and carries on from the same point
     when it comes back. Nothing downloads until it is played (preload="none"; when it
     will autoplay, buffering starts just before it scrolls in).
     No autoplay with reduced motion, in lite mode or on a slow network: the poster and a
     play button are shown instead, and slow networks / lite mode get the 480p file.
     If the visitor pauses, it stays paused until they press play. At the end the site's
     own end card (Clickt Business, Watch again) takes over. Without JavaScript the
     browser's own controls are left on. */
  var film = document.querySelector('[data-film]');
  var video = film && film.querySelector('video');
  if (film && video && video.play) {
    var screen = film.querySelector('[data-film-screen]');
    var chs = qsa('[data-film-ch]', film);
    var starts = chs.map(function (b) { return parseFloat(b.getAttribute('data-film-ch')) || 0; });
    var progs = chs.map(function (b) { return b.querySelector('.film-prog i'); });
    var colours = chs.map(function (b) { return b.parentNode.style.getPropertyValue('--c'); });
    var bar = film.querySelector('.film-bar i');
    var rail = film.querySelector('.film-rail');
    var perf = window.ClicktPerf;
    var slow = !!(perf && (perf.lite || perf.slowNet));
    var autoOk = function () { return !reduced && !(perf && (perf.lite || perf.slowNet)); };
    var started = false, userPaused = false, visible = false, hiddenTab = false, current = -1, raf = 0, pendingSeek = null;

    video.removeAttribute('controls');
    video.controls = false;
    if (slow && video.getAttribute('data-lite-src')) video.src = video.getAttribute('data-lite-src');
    film.classList.add('film--js');
    if (autoOk()) film.classList.add('film--auto');
    document.addEventListener('clickt:lite', function () { film.classList.remove('film--auto'); });

    var duration = function () { return video.duration && isFinite(video.duration) ? video.duration : 208.9; };
    var render = function () {
      var t = video.currentTime || 0;
      var i = starts.length - 1;
      while (i > 0 && t < starts[i] - 0.05) i--;
      if (i !== current) {
        current = i;
        chs.forEach(function (b, n) {
          b.classList.toggle('is-active', n === i);
          b.classList.toggle('is-done', n < i);
          if (n === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
          if (n !== i && progs[n]) progs[n].style.transform = n < i ? 'none' : '';
        });
        if (colours[i]) film.style.setProperty('--mc', colours[i]);
        /* On phones the rail is a sideways row of chips: keep the current one in view. */
        if (rail && rail.scrollWidth > rail.clientWidth + 2) {
          var li = chs[i].parentNode;
          var left = li.offsetLeft - (rail.clientWidth - li.offsetWidth) / 2;
          if (rail.scrollTo) rail.scrollTo({ left: left, behavior: reduced ? 'auto' : 'smooth' }); else rail.scrollLeft = left;
        }
      }
      var end = i + 1 < starts.length ? starts[i + 1] : duration();
      var k = Math.max(0, Math.min(1, (t - starts[i]) / Math.max(0.1, end - starts[i])));
      if (progs[i]) progs[i].style.transform = 'scaleX(' + k.toFixed(4) + ')';
      if (bar) bar.style.transform = 'scaleX(' + Math.min(1, t / duration()).toFixed(4) + ')';
    };
    var loop = function () { render(); raf = video.paused ? 0 : requestAnimationFrame(loop); };

    /* Sound is on by default. Browsers only allow sound after the visitor has clicked,
       tapped or pressed a key on the page (scrolling does not count), so: play with sound
       when that has happened or the visitor pressed something in the film; if the browser
       still refuses, carry on muted and switch sound on at their next click or tap
       anywhere on the page. Pressing Mute is remembered and never undone by itself. */
    var userMuted = false;
    var sound = film.querySelector('[data-film-sound]');
    var setMuted = function (m) {
      video.muted = m;
      film.classList.toggle('is-sound', !m);
      if (sound) sound.setAttribute('aria-pressed', m ? 'false' : 'true');
    };
    var ua = navigator.userActivation;
    var blocked = function (err) {
      if (err && err.name === 'AbortError') return; /* paused again before it started */
      film.classList.add('is-blocked'); film.classList.remove('is-playing');
    };
    var play = function (byUser) {
      if (byUser) { started = true; userPaused = false; }
      else if (!video.paused) return;
      if (film.classList.contains('is-ended')) { film.classList.remove('is-ended'); video.currentTime = 0; }
      video.preload = 'auto';
      var withSound = !userMuted && (byUser || !!(ua && ua.hasBeenActive));
      setMuted(!withSound);
      var pr = video.play();
      if (pr && pr.catch) pr.catch(function (err) {
        if (withSound && err && err.name === 'NotAllowedError') {
          setMuted(true); /* sound refused: keep going without it */
          var again = video.play();
          if (again && again.catch) again.catch(blocked);
        } else blocked(err);
      });
    };
    var onGesture = function (ev) {
      if (userMuted || !video.muted || video.paused) return;
      if (ev.target && ev.target.closest && ev.target.closest('.film-grid')) return; /* the film's own buttons handle sound */
      if (ua ? ua.isActive : ev.type === 'click') setMuted(false);
    };
    ['click', 'pointerup', 'keydown'].forEach(function (type) { document.addEventListener(type, onGesture, true); });
    var seek = function (t) {
      film.classList.remove('is-ended');
      if (video.readyState >= 1) { video.currentTime = t; render(); } else pendingSeek = t;
    };
    var userPause = function () { userPaused = true; video.pause(); };
    var toggle = function () { if (video.paused || video.ended) play(true); else userPause(); };

    video.addEventListener('loadedmetadata', function () { if (pendingSeek != null) { video.currentTime = pendingSeek; pendingSeek = null; } render(); });
    video.addEventListener('play', function () { film.classList.add('is-playing', 'is-started'); film.classList.remove('is-blocked'); if (!raf) raf = requestAnimationFrame(loop); });
    video.addEventListener('pause', function () { film.classList.remove('is-playing'); render(); });
    video.addEventListener('seeked', render);
    video.addEventListener('ended', function () { film.classList.remove('is-playing'); film.classList.add('is-ended'); render(); });

    video.addEventListener('click', toggle);
    var playBtn = film.querySelector('[data-film-play]');
    if (playBtn) playBtn.addEventListener('click', function () { play(true); });
    var replay = film.querySelector('[data-film-replay]');
    if (replay) replay.addEventListener('click', function () { seek(0); play(true); });
    var toggleBtn = film.querySelector('[data-film-toggle]');
    if (toggleBtn) toggleBtn.addEventListener('click', toggle);
    if (sound) sound.addEventListener('click', function () {
      userMuted = !video.muted;
      setMuted(userMuted);
      if (!userMuted && video.paused && !video.ended) play(true);
    });
    chs.forEach(function (b, i) {
      b.addEventListener('click', function () { seek(starts[i] + 0.05); play(true); });
    });

    var maybePlay = function () {
      if (!visible || hiddenTab || userPaused || film.classList.contains('is-ended')) return;
      if (started || film.classList.contains('film--auto')) play(false);
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        var r = es[es.length - 1].intersectionRatio;
        if (r >= 0.5) { visible = true; maybePlay(); }
        else if (r < 0.25) { visible = false; if (!video.paused) video.pause(); }
      }, { threshold: [0, 0.25, 0.5, 0.75] }).observe(screen || video);
      /* Start buffering a little before it scrolls in, only when it is going to autoplay. */
      var near = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting && film.classList.contains('film--auto')) { video.preload = 'auto'; near.disconnect(); }
      }, { rootMargin: '400px 0px' });
      near.observe(film);
    }
    document.addEventListener('visibilitychange', function () {
      hiddenTab = document.hidden;
      if (hiddenTab) { if (!video.paused) video.pause(); } else maybePlay();
    });
    render();
  }
})();
