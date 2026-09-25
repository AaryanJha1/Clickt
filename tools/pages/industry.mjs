import { icon } from '../lib/icons.mjs';
import { url, storeButtons, androidDialog } from '../lib/shell.mjs';
import { INDUSTRIES } from './solutions.mjs';
import { APP_STORE } from '../lib/core.mjs';

const MOD = [['teams', 'teams'], ['checklist', 'checklist'], ['builder', 'builder'], ['presentation', 'presentation']];

export default function industry(p, def) {
  const k = def.industry;
  const [, ico, phone] = INDUSTRIES.find((i) => i[0] === k);
  const ip = (s) => `industryPages.${k}.${s}`;
  const cm = (s) => `industryPages.common.${s}`;
  const rows = MOD.map(([m], i) => `<li class="flow" data-reveal style="--d:${i}"><span class="mod mod--${m}">${p.t(`siteShell.product.${m}`)}</span>${p.e('p', ip(m))}</li>`).join('');
  return `
<section class="page-hero prod-hero" style="--mod:var(--blue)">
  <span class="glow glow--blue" style="width:640px;height:640px;left:-12%;top:-30%"></span><span class="glow glow--peach" style="width:520px;height:520px;right:-10%;top:0"></span>
  <div class="wrap prod-hero-in">
    <div class="prod-hero-copy">
      <nav class="crumbs" ${p.at({ 'aria-label': cm('breadcrumbAria') })}><a href="/">Clickt</a><span aria-hidden="true">/</span><a href="${url('solutions')}">${p.t(cm('solutions'))}</a><span aria-hidden="true">/</span><span>${p.t(ip('name'))}</span></nav>
      ${p.e('span', ip('eyebrow'), 'class="eyebrow" style="margin-top:22px"')}
      ${p.e('h1', ip('title'), 'class="title prod-title" data-reveal="wipe"')}
      ${p.e('p', ip('intro'), 'class="lead" data-reveal style="--d:2"')}
      <div class="actions" data-reveal style="--d:3">
        <a class="btn btn--dark btn--lg" href="${APP_STORE}" target="_blank" rel="noopener noreferrer">${p.t(cm('download'))}</a>
        <a class="btn btn--ghost btn--lg" href="${url('contact')}#project">${p.t(cm('brief'))}</a>
      </div>
    </div>
    <figure class="prod-hero-device" data-reveal="scale"><div class="phone" style="--w:min(300px,70vw)"><div class="screen"><img src="/assets/img/${phone}" alt="${p.text(cm('phoneScreen'))}" width="640" height="1391" fetchpriority="high"></div></div></figure>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="grid grid--2">
      <article class="card ind-card" data-reveal><span class="eyebrow">${p.t(cm('recurringLabel'))}</span>${p.e('h2', ip('problemTitle'), 'class="h-serif" style="font-size:clamp(1.7rem,2.6vw,2.3rem);margin:16px 0 12px;font-weight:400"')}${p.e('p', ip('problem'))}</article>
      <article class="card ind-card" data-reveal style="--d:1"><span class="eyebrow">${p.t(cm('existingLabel'))}</span>${p.e('h2', ip('existingTitle'), 'class="h-serif" style="font-size:clamp(1.7rem,2.6vw,2.3rem);margin:16px 0 12px;font-weight:400"')}${p.e('p', ip('existingCopy'))}</article>
    </div>
  </div>
</section>

<section class="section section--paper2">
  <div class="wrap">
    <div class="split">
      <div>
        <span class="eyebrow">${p.t(cm('workflowLabel'))}</span>
        ${p.e('h2', ip('workflowTitle'), 'class="title title--sm" style="margin-top:18px" data-reveal="wipe"')}
        ${p.e('p', ip('workflowLead'), 'class="lead" style="margin-top:18px"')}
        ${p.e('p', cm('reviewNote'), 'class="muted" style="margin-top:20px;font-size:.92rem;max-width:56ch"')}
      </div>
      <ol class="flows">${rows}</ol>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap wrap--narrow">
    <div class="result" data-reveal>
      <span class="eyebrow" style="color:rgba(255,255,255,.7)">${p.t(cm('resultLabel'))}</span>
      <span class="badge" style="margin-top:20px;background:rgba(255,255,255,.14)">${p.t(ip('resultBadge'))}</span>
      ${p.e('h2', ip('resultTitle'), 'class="title title--sm" style="margin-top:20px;color:#fff"')}
      ${p.e('p', ip('resultCopy'), 'style="margin-top:16px;color:rgba(255,255,255,.78);max-width:60ch"')}
    </div>
    <p class="boundary" data-reveal>${icon('shield')}<span><b>${p.t(cm('boundaryLabel'))}.</b> ${p.t(ip('boundary'))}</span></p>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="endcard" data-reveal="scale">
      <span class="glow glow--violet" style="width:520px;height:520px;left:-10%;top:-40%;opacity:.5"></span>
      <span class="eyebrow" style="color:rgba(255,255,255,.7)">${p.t(cm('finalLabel'))}</span>
      ${p.e('h2', ip('finalTitle'), 'class="title" style="margin-top:18px"')}
      ${p.e('p', ip('finalCopy'), 'class="lead"')}
      <div class="store-row"><a class="btn btn--dark btn--lg" href="${APP_STORE}" target="_blank" rel="noopener noreferrer">${p.t(cm('download'))}</a><a class="btn btn--ghost btn--lg" href="${url('contact')}#project">${p.t(cm('brief'))}</a></div>
    </div>
  </div>
</section>
${androidDialog(p)}
`;
}
