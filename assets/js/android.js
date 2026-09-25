/* Clickt — Android page: screenshot groups. */
(function () {
  'use strict';
  var C = window.Clickt;
  if (!C) return;
  var tabs = C.qsa('[data-g]');
  var panels = C.qsa('[data-gp]');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var g = tab.getAttribute('data-g');
      tabs.forEach(function (t) { t.setAttribute('aria-selected', t === tab ? 'true' : 'false'); });
      panels.forEach(function (p) { p.hidden = p.getAttribute('data-gp') !== g; });
    });
  });
})();
