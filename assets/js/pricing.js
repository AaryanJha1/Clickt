/* Clickt — pricing: one currency, chosen by where the visitor is.
   Nepal (Asia/Kathmandu time zone, or an ne / -NP language setting) sees NPR only;
   everyone else sees USD only. No network lookup is made. */
(function () {
  'use strict';
  var C = window.Clickt;
  if (!C) return;
  var prices = C.qsa('[data-price]');
  var seat = document.querySelector('[data-seat-line]');
  var noteText = document.querySelector('[data-cur-text]');
  var note = document.querySelector('[data-cur-note]');
  var cur = 'usd';
  try {
    var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    var langs = (navigator.languages || [navigator.language || '']).join(',');
    if (/^Asia\/Kath?mandu$/.test(tz) || /[-_]NP\b/i.test(langs)) cur = 'npr';
  } catch (e) {}
  var forced = /[?&]currency=(npr|usd)/i.exec(location.search); // handy for previewing either view
  if (forced) cur = forced[1].toLowerCase();
  function paint() {
    document.documentElement.setAttribute('data-currency', cur);
    prices.forEach(function (el) { el.textContent = el.getAttribute('data-' + cur); });
    if (seat) seat.textContent = C.t('pricing.currency.perUser.business.' + cur);
    if (noteText) noteText.textContent = C.t(cur === 'npr' ? 'pricing.currency.showingNepal' : 'pricing.currency.showingIntl');
    if (note) note.classList.toggle('is-npr', cur === 'npr');
  }
  C.onLang(paint);
  paint();
})();
