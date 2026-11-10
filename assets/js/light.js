/* Clickt — a soft light that follows the mouse on every page.
   It eases toward the pointer, sits behind the content (see .mouse-light in
   base.css) and fades out when the mouse leaves the window. Mouse and pen only:
   nothing on touch screens, and nothing with reduced motion. */
(function () {
  'use strict';
  var mq = window.matchMedia;
  if (!mq || !mq('(pointer: fine)').matches || mq('(prefers-reduced-motion: reduce)').matches) return;
  var light = document.createElement('div');
  light.className = 'mouse-light';
  light.setAttribute('aria-hidden', 'true');
  document.body.appendChild(light);
  var tx = window.innerWidth / 2, ty = window.innerHeight * 0.4, x = tx, y = ty, running = false;
  function tick() {
    x += (tx - x) * 0.16; y += (ty - y) * 0.16;
    light.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
    if (Math.abs(tx - x) > 0.4 || Math.abs(ty - y) > 0.4) requestAnimationFrame(tick);
    else running = false;
  }
  document.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    tx = e.clientX; ty = e.clientY;
    light.classList.add('is-on');
    if (!running) { running = true; requestAnimationFrame(tick); }
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', function () { light.classList.remove('is-on'); });
  window.addEventListener('blur', function () { light.classList.remove('is-on'); });
})();
