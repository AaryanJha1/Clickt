/* Clickt — services: choose an existing system, see the layer we build around it. */
(function () {
  'use strict';
  var C = window.Clickt;
  if (!C) return;
  C.qsa('[data-sysmap]').forEach(function (root) {
    var tabs = C.qsa('[data-sys]', root);
    var outs = C.qsa('[data-out]', root);
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var k = tab.getAttribute('data-sys');
        tabs.forEach(function (t) { t.setAttribute('aria-selected', t === tab ? 'true' : 'false'); });
        outs.forEach(function (o) { o.hidden = o.getAttribute('data-out') !== k; });
      });
    });
  });
})();
