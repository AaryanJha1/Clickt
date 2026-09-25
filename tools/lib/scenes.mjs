// Interactive scene markup. Behaviour lives in assets/js/scenes.js; styling in
// assets/css/scenes.css. Everything renders a readable static state first, so
// the page works without JavaScript.
import { icon } from './icons.mjs';

const MODS = [
  ['teams', 'Teams'],
  ['checklist', 'Checklist'],
  ['builder', 'Builder'],
  ['presentation', 'Presentation'],
];

// ClicktAI proposal: request -> draft -> approve -> receipt.
// `custom` swaps in module-specific copy: { request, head, note, rows: [[mod, key], ...], receipt }
export function approve(p, { compact = false, custom = null } = {}) {
  const cfg = custom || {
    request: 'scene.approve.request', head: 'scene.approve.head', note: 'scene.approve.note',
    rows: MODS.map(([k]) => [k, `scene.approve.${k}`]),
  };
  const label = Object.fromEntries(MODS);
  const rows = cfg.rows.map(
    ([k, key]) => `<li data-row><span class="mod mod--${k}">${label[k]}</span>${p.e('span', key, 'class="row-text"')}<span class="row-state" aria-hidden="true">${icon('check')}</span></li>`
  ).join('');
  const n = cfg.rows.length;
  p.js('scene.approve.receiptN');
  return `<div class="ai-card${compact ? ' ai-card--compact' : ''}" data-scene="approve" data-request="${cfg.request}" data-receipt-n="${n}">
  <div class="ai-bar"><span class="spark" aria-hidden="true">${icon('sparkle')}</span><b>ClicktAI</b><span class="ai-status" data-status>${p.js('scene.approve.status.ready')}</span>${['prep', 'review', 'done'].map((k) => (p.js(`scene.approve.status.${k}`), '')).join('')}</div>
  <div class="ai-msgs">
    <div class="msg msg--user"><span class="who">${p.t('scene.approve.you')}</span><p data-typed>${p.js(cfg.request)}</p></div>
    <div class="thinking" data-thinking aria-hidden="true"><i></i><i></i><i></i></div>
    <div class="proposal" data-proposal>
      <div class="prop-head">${p.e('span', cfg.head)}<span class="draft-badge" data-badge>${p.js('scene.approve.draft')}${(p.js('scene.approve.applied'), '')}</span></div>
      <ul class="prop-rows">${rows}</ul>
      ${p.e('p', cfg.note, 'class="prop-note"')}
      <div class="prop-actions">
        <button class="btn btn--primary btn--sm" type="button" data-approve>${p.t('scene.approve.button')}</button>
      </div>
      <div class="receipt" data-receipt>
        <span class="receipt-ico">${icon('check')}</span>
        <div><strong data-receipt-title>${p.js('scene.approve.receiptN').replace('{n}', n)}</strong><small>${p.t('scene.approve.receiptSub')}</small></div>
        <button type="button" class="receipt-replay" data-replay>${p.t('scene.approve.reset')}</button>
      </div>
    </div>
  </div>
</div>`;
}

// One task, two people, one winner.
export function claim(p) {
  p.js('scene.claim.winner'); p.js('scene.claim.already'); p.js('scene.claim.n1'); p.js('scene.claim.n2');
  return `<div class="scene-card claim" data-scene="claim">
  <div class="task-head"><span class="mod mod--teams">Teams</span>${p.e('span', 'home.ch2.claimK', 'class="scene-kicker"')}</div>
  ${p.e('h4', 'scene.claim.task', 'class="task-title"')}
  ${p.e('p', 'scene.claim.sub', 'class="task-sub"')}
  <ol class="track" data-track>
    <li class="is-on" data-step="0">${p.t('scene.claim.open')}</li>
    <li data-step="1">${p.t('scene.claim.claimed')}</li>
    <li data-step="2">${p.t('scene.claim.done')}</li>
  </ol>
  <div class="claimers">
    <div class="claimer" data-who="0">${p.e('span', 'scene.claim.i1', 'class="av av--a"')}${p.e('b', 'scene.claim.n1', 'data-name')}<button class="btn btn--ghost btn--sm" type="button" data-claim>${p.t('scene.claim.claim')}</button><small data-msg></small></div>
    <div class="claimer" data-who="1">${p.e('span', 'scene.claim.i2', 'class="av av--b"')}${p.e('b', 'scene.claim.n2', 'data-name')}<button class="btn btn--ghost btn--sm" type="button" data-claim>${p.t('scene.claim.claim')}</button><small data-msg></small></div>
  </div>
  <div class="scene-actions">
    <button class="btn btn--dark btn--sm" type="button" data-race>${p.t('scene.claim.race')}</button>
    <button class="btn btn--ghost btn--sm" type="button" data-complete hidden>${p.t('scene.claim.complete')}</button>
    <button class="btn btn--ghost btn--sm" type="button" data-reset hidden>${p.t('scene.claim.again')}</button>
  </div>
  ${p.e('p', 'scene.claim.server', 'class="scene-foot"')}
</div>`;
}

// Reminder policy on a 24-hour strip: 15 min before, every 3 h, quiet 22:00-08:00, 08:00 digest.
export function reminder(p) {
  ['scene.reminder.pre', 'scene.reminder.atDue', 'scene.reminder.deferred', 'scene.reminder.stopped', 'scene.reminder.done', 'scene.reminder.undo', 'scene.reminder.digest', 'scene.reminder.summary'].forEach((k) => p.js(k));
  return `<div class="scene-card reminder" data-scene="reminder">
  <div class="task-head"><span class="mod mod--calendar">${icon('bell')}</span>${p.e('span', 'home.ch2.reminderK', 'class="scene-kicker"')}</div>
  <div class="rem-controls">
    <label class="rem-due"><span>${p.t('scene.reminder.due')}</span><output data-out>14:00</output>
      <input type="range" min="9" max="20" step="0.25" value="14" data-due aria-label="${p.text('scene.reminder.due')}"></label>
    <button class="btn btn--ghost btn--sm" type="button" data-done aria-pressed="false">${p.t('scene.reminder.done')}</button>
  </div>
  <div class="rem-strip" data-strip role="img" aria-label="${p.text('scene.reminder.summary')}">
    <div class="rem-quiet"><span>${icon('moon')}${p.t('scene.reminder.quiet')}</span></div>
    <div class="rem-marks" data-marks></div>
    <div class="rem-axis"><i>08</i><i>12</i><i>16</i><i>20</i><i>00</i><i>04</i><i>08</i></div>
  </div>
  <ul class="rem-legend">
    <li><i class="k k--pre"></i>${p.t('scene.reminder.pre')}</li>
    <li><i class="k k--due"></i>${p.t('scene.reminder.atDue')}</li>
    <li><i class="k k--follow"></i>${p.t('scene.reminder.follow')}</li>
    <li><i class="k k--digest"></i>${p.t('scene.reminder.digest')}</li>
    <li class="rem-quiet-key"><i class="k k--quiet"></i>${p.t('scene.reminder.quiet')}</li>
  </ul>
  <p class="scene-foot" data-caption>${p.t('scene.reminder.summary')}</p>
</div>`;
}

// A recurring checklist that finishes and returns next cycle.
export function checklist(p) {
  p.js('scene.checklist.progress');
  const items = [1, 2, 3, 4].map((i) => `<li><label><input type="checkbox" data-item><span class="cb" aria-hidden="true">${icon('check')}</span><span data-i18n="scene.checklist.i${i}">${p.t(`scene.checklist.i${i}`)}</span></label></li>`).join('');
  return `<div class="scene-card checklist-scene" data-scene="checklist">
  <div class="task-head"><span class="mod mod--checklist">Checklist</span><span class="scene-kicker">${icon('calendar')}${p.t('scene.checklist.recurring')}</span></div>
  ${p.e('h4', 'scene.checklist.title', 'class="task-title"')}
  <div class="cl-progress"><div class="cl-bar"><i data-bar></i></div><span data-count>0 / 4</span></div>
  <ul class="cl-items">${items}</ul>
  <div class="cl-done" data-cldone><span class="receipt-ico">${icon('check')}</span><strong>${p.t('scene.checklist.next')}</strong><button type="button" class="receipt-replay" data-clreset>${p.t('scene.checklist.reset')}</button></div>
</div>`;
}

// One dataset, twelve chart types.
export function charts(p) {
  const cities = ['kathmandu', 'pokhara', 'lalitpur', 'biratnagar', 'butwal'];
  const vals = [148, 74, 92, 52, 54];
  const rows = cities.map((c, i) => `<tr><td data-i18n="scene.chart.${c}">${p.t(`scene.chart.${c}`)}</td><td>${vals[i]}</td></tr>`).join('');
  cities.forEach((c) => p.js(`scene.chart.${c}`));
  const types = ['bar', 'line', 'area', 'donut', 'scatter', 'heat'];
  types.forEach((k) => p.js(`scene.chart.${k}`));
  const tabs = types.map((k, i) => `<button type="button" role="tab" data-kind="${k}" aria-selected="${i === 0}">${p.t(`scene.chart.${k}`)}</button>`).join('');
  return `<div class="scene-card chart-scene" data-scene="charts" data-values="${vals.join(',')}">
  <div class="task-head"><span class="mod mod--builder">Builder</span>${p.e('span', 'scene.chart.dataset', 'class="scene-kicker"')}</div>
  <div class="chart-grid">
    <table class="mini-table"><thead><tr><th>${p.t('scene.chart.city')}</th><th>${p.t('scene.chart.sales')}</th></tr></thead><tbody>${rows}</tbody></table>
    <div class="chart-canvas" data-canvas aria-live="polite"></div>
  </div>
  <div class="chart-tabs"><div class="seg" role="tablist" aria-label="${p.text('scene.chart.pick')}">${tabs}</div><span class="chip"><i class="dot" style="--c:var(--builder)"></i>${p.t('scene.chart.more')}</span></div>
  <p class="scene-foot">${p.t('scene.chart.types')} · ${p.t('scene.chart.export')}</p>
</div>`;
}

// Presentation themes: three designed families, nine palettes.
export function deck(p) {
  const fam = [
    ['spotlight', [['#0b0b0d', '#f5d90a', '#fff'], ['#0b1b4a', '#3d7bff', '#fff'], ['#f4efe0', '#1f5a3a', '#14261c']]],
    ['story', [['#0f1f3d', '#ff8a3d', '#fff'], ['#2a3446', '#4a86ff', '#fff'], ['#ffffff', '#d63a3a', '#1a1a1a']]],
    ['editorial', [['#efe6d2', '#6b7a2c', '#2b2a20'], ['#ffffff', '#111111', '#111111'], ['#f7dfdc', '#7a1f36', '#3a1420']]],
  ];
  const tabs = fam.map(([k], i) => `<button type="button" role="tab" data-family="${k}" aria-selected="${i === 0}">${p.t(`scene.deck.${k}`)}</button>`).join('');
  const swatches = fam.map(([k, pal]) => pal.map(([bg, ac, fg], j) => `<button type="button" class="sw" data-fam="${k}" data-bg="${bg}" data-ac="${ac}" data-fg="${fg}" ${(k === 'spotlight' && j === 0) ? 'aria-pressed="true"' : 'aria-pressed="false"'} ${k === 'spotlight' ? '' : 'hidden'} style="--bg:${bg};--ac:${ac}" aria-label="${k} ${j + 1}"></button>`).join('')).join('');
  return `<div class="scene-card deck-scene" data-scene="deck">
  <div class="task-head"><span class="mod mod--presentation">Presentation</span>${p.e('span', 'scene.deck.themes', 'class="scene-kicker"')}</div>
  <div class="slide" data-slide data-family="spotlight" style="--bg:#0b0b0d;--ac:#f5d90a;--fg:#ffffff">
    <div class="slide-art" aria-hidden="true"><i></i><i></i></div>
    <div class="slide-body">
      <small>${p.t('scene.deck.sub')}</small>
      <h4>${p.t('scene.deck.title')}</h4>
      <div class="slide-cards">
        <div><b>${p.t('scene.deck.k1')}</b><span>${p.t('scene.deck.k1l')}</span></div>
        <div><b>${p.t('scene.deck.k2')}</b><span>${p.t('scene.deck.k2l')}</span></div>
        <div><b>${p.t('scene.deck.k3')}</b><span>${p.t('scene.deck.k3l')}</span></div>
      </div>
    </div>
  </div>
  <div class="deck-controls"><div class="seg" role="tablist" aria-label="${p.text('scene.deck.pick')}">${tabs}</div><div class="swatches">${swatches}</div></div>
  <p class="scene-foot">${p.t('scene.deck.export')}</p>
</div>`;
}

// Preview first / a clear no / it asks.
export function trust(p) {
  p.js('scene.trust.askDone'); p.js('scene.trust.askA'); p.js('scene.trust.askB');
  const rows = [1, 2, 3].map((i) => p.e('li', `scene.trust.pr${i}`)).join('');
  return `<div class="scene-card trust" data-scene="trust">
  <div class="seg" role="tablist" aria-label="ClicktAI">
    <button type="button" role="tab" data-tab="preview" aria-selected="true">${p.t('scene.trust.tabPreview')}</button>
    <button type="button" role="tab" data-tab="refusal" aria-selected="false">${p.t('scene.trust.tabRefusal')}</button>
    <button type="button" role="tab" data-tab="ask" aria-selected="false">${p.t('scene.trust.tabAsk')}</button>
  </div>
  <div class="trust-panel" data-panel="preview">
    <div class="msg msg--user"><span class="who">${p.t('scene.approve.you')}</span><p>${p.t('scene.trust.previewAsk')}</p></div>
    <div class="preview-card" data-preview>
      <div class="prop-head">${p.e('span', 'scene.trust.previewCard')}${p.e('span', 'scene.approve.draft', 'class="draft-badge"')}</div>
      <ul class="pv-rows">${rows}</ul>
      <div class="prop-actions"><button class="btn btn--primary btn--sm" type="button" data-pv-approve>${p.t('scene.trust.previewApprove')}</button><button class="btn btn--ghost btn--sm" type="button" data-pv-cancel>${p.t('scene.trust.previewCancel')}</button></div>
      <div class="pv-receipt" data-pv-receipt><span class="receipt-ico">${icon('check')}</span>${p.t('scene.trust.previewReceipt')}</div>
    </div>
  </div>
  <div class="trust-panel" data-panel="refusal" hidden>
    <div class="msg msg--user"><span class="who">${p.t('scene.approve.you')}</span><p>${p.t('scene.trust.refusalAsk')}</p></div>
    <div class="msg msg--ai"><span class="who">ClicktAI</span>
      <p><strong>${p.t('scene.trust.refusalSay')}</strong> ${p.t('scene.trust.refusalWhy')}</p>
      <p class="alt-head">${p.t('scene.trust.refusalAlt')}</p>
      <ul class="alts"><li>${p.t('scene.trust.refusalA1')}</li><li>${p.t('scene.trust.refusalA2')}</li><li>${p.t('scene.trust.refusalA3')}</li></ul>
      <p class="muted">${p.t('scene.trust.refusalNext')}</p>
    </div>
  </div>
  <div class="trust-panel" data-panel="ask" hidden>
    <div class="msg msg--user"><span class="who">${p.t('scene.approve.you')}</span><p>${p.t('scene.trust.askAsk')}</p></div>
    <div class="msg msg--ai"><span class="who">ClicktAI</span>
      <p>${p.t('scene.trust.askSay')}</p>
      <div class="choices"><button class="btn btn--ghost btn--sm" type="button" data-choice="0">${p.t('scene.trust.askA')}</button><button class="btn btn--ghost btn--sm" type="button" data-choice="1">${p.t('scene.trust.askB')}</button></div>
      <p class="choice-done" data-choice-done hidden></p>
    </div>
  </div>
  <p class="scene-foot">${p.t('scene.trust.hint')}</p>
</div>`;
}

// Bring your own key.
export function byok(p) {
  const provs = ['openai', 'anthropic', 'gemini', 'nvidia'];
  const btns = provs.map((k, i) => `<button type="button" class="prov" data-prov="${k}" aria-pressed="${i === 0}">${p.t(`scene.key.${k}`)}</button>`).join('');
  return `<div class="scene-card byok" data-scene="byok">
  <div class="task-head"><span class="mod mod--calendar" style="--c:var(--blue)">${icon('key')}</span></div>
  <div class="provs">${btns}</div>
  <div class="key-field"><span>${p.t('scene.key.placeholder')}</span><code data-mask>sk-••••••••••••••••</code></div>
  <ul class="key-facts">
    <li>${icon('lock')}${p.t('scene.key.f1')}</li>
    <li>${icon('arrowUpRight')}${p.t('scene.key.f2')}</li>
    <li>${icon('check')}${p.t('scene.key.f3')}</li>
  </ul>
</div>`;
}

// Framed wrapper with registration marks.
export const frame = (inner, { cls = '', tag = '' } = {}) =>
  `<div class="frame vignette ${cls}"><i class="mk"></i><i class="mk"></i><i class="mk"></i><i class="mk"></i>${tag ? `<span class="frame-tag">${tag}</span>` : ''}${inner}</div>`;
