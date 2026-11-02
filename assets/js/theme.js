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
      button.setAttribute('aria-pressed', button.getAttribute('data-theme-choice') === preference ? 'true' : 'false');
    });
    document.querySelectorAll('meta[name="theme-color"][media]').forEach(function (tag) {
      if (!tag.hasAttribute('data-original-media')) tag.setAttribute('data-original-media', tag.media);
      var original = tag.getAttribute('data-original-media');
      tag.media = preference === 'system' ? original : (original.indexOf(resolved) !== -1 ? 'all' : 'not all');
    });
  }
  function choose(value) {
    if (value !== 'system' && value !== 'light' && value !== 'dark') return;
    preference = value;
    try {
      if (value === 'system') localStorage.removeItem(key);
      else localStorage.setItem(key, value);
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
