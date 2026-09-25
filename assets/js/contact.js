/* Clickt — contact: confirmation after the project-brief form returns. */
(function () {
  'use strict';
  if (!/[?&]submitted=project/.test(location.search)) return;
  var ok = document.querySelector('[data-form-ok]');
  var form = document.getElementById('project-enquiry-form');
  if (ok) { ok.hidden = false; }
  if (form) form.hidden = true;
  var target = document.getElementById('project');
  if (target) target.scrollIntoView();
})();
