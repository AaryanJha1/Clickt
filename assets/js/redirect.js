/* Clickt — 404: old flat page URLs (e.g. /teams.html) now live under /pages/. */
(function () {
  'use strict';
  var m = /^\/([A-Za-z0-9_-]+)\.html$/.exec(location.pathname);
  if (!m) return;
  var name = m[1];
  var pages = ['teams', 'checklist', 'builder', 'presentation', 'clicktai', 'pricing', 'solutions', 'services', 'about', 'contact', 'support', 'security', 'privacy', 'terms', 'user-guide',
    'solutions-schools', 'solutions-healthcare', 'solutions-banks', 'solutions-ngos', 'solutions-hotels', 'solutions-restaurants', 'solutions-construction'];
  var alias = { 'google-play-store': '/pages/android.html', 'Clickt-Business-Pitch-Deck': '/pages/pitch-deck.html', playbook: '/', 'at-work': '/pages/solutions.html', index: '/' };
  var to = alias[name] || (pages.indexOf(name) > -1 ? '/pages/' + name + '.html' : '');
  if (to) location.replace(to + location.search + location.hash);
})();
