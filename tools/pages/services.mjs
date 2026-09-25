import { icon } from '../lib/icons.mjs';
import { url } from '../lib/shell.mjs';

export default function services(p) {
  p.js('services.systemMap.outcomes.erp.title');
  const opts = ['erp', 'spreadsheets', 'crm', 'field'];
  const optBtns = opts.map((o, i) => `<button type="button" role="tab" data-sys="${o}" aria-selected="${i === 0}">${p.t(`services.systemMap.options.${o}`)}</button>`).join('');
  const outcomes = opts.map((o, i) => `<article class="sys-out" data-out="${o}" ${i ? 'hidden' : ''}>${p.e('span', `services.systemMap.outcomes.${o}.tag`, 'class="badge"')}${p.e('h3', `services.systemMap.outcomes.${o}.title`, 'class="h-serif" style="font-size:clamp(1.7rem,2.8vw,2.4rem);font-weight:400;margin:18px 0 12px;line-height:1.1"')}${p.e('p', `services.systemMap.outcomes.${o}.copy`, 'style="color:var(--ink-2);max-width:56ch"')}</article>`).join('');
  const caps = [['custom', 'code'], ['web', 'globe'], ['mobile', 'phone'], ['data', 'data'], ['ai', 'sparkle'], ['integrations', 'plug']].map(([k, ico], i) => `<article class="card${k === 'integrations' ? ' wide' : ''}" data-reveal style="--d:${i % 3};--c:var(--blue)"><span class="ico-box">${icon(ico)}</span>${p.e('h3', `services.capabilities.${k}.title`)}${p.e('p', `services.capabilities.${k}.body`)}</article>`).join('');
  const existing = Array.from({ length: 10 }, (_, i) => `<span class="chip">${p.t(`services.existingSoftware.item${i + 1}`)}</span>`).join('');
  const how = [1, 2, 3].map((n) => `<li class="step" data-reveal style="--d:${n - 1}">${p.e('h3', `services.howWeWork.step${n}.title`)}${p.e('p', `services.howWeWork.step${n}.body`)}</li>`).join('');
  const work = (k, big = false) => {
    const tags = [1, 2, 3].filter((n) => p.has(`services.work.${k}.tag${n}`)).map((n) => `<span class="chip">${p.t(`services.work.${k}.tag${n}`)}</span>`).join('');
    const ctx = p.has(`services.work.${k}.context`) ? p.e('p', `services.work.${k}.context`, 'class="muted" style="margin-top:12px;font-size:.9rem"') : '';
    return `<article class="card work${big ? ' work--big' : ''}" data-reveal><div class="work-tags">${tags}</div>${p.e('h3', `services.work.${k}.title`, 'style="font-size:1.35rem;margin-top:16px"')}${p.e('p', `services.work.${k}.body`)}${ctx}</article>`;
  };
  const company = Array.from({ length: 7 }, (_, i) => `<li>${p.t(`services.company.item${i + 1}`)}</li>`).join('');
  return `
<section class="page-hero">
  <span class="glow glow--violet" style="width:600px;height:600px;left:-10%;top:-35%;opacity:.4"></span><span class="glow glow--peach" style="width:520px;height:520px;right:-8%;top:-10%"></span>
  <div class="wrap" style="position:relative;z-index:1">
    ${p.e('span', 'services.hero.kicker', 'class="eyebrow" data-reveal')}
    ${p.e('h1', 'services.hero.heading', 'class="title" style="font-size:clamp(2.6rem,6vw,5.2rem);max-width:16ch" data-reveal="wipe"')}
    ${p.e('p', 'services.hero.body', 'class="lead" data-reveal style="--d:2"')}
    <div class="chips-grid" style="margin-top:26px" data-reveal style="--d:3"><span class="chip">${p.t('services.hero.chip1')}</span><span class="chip">${p.t('services.hero.chip2')}</span><span class="chip">${p.t('services.hero.chip3')}</span></div>
    <div class="actions" style="display:flex;flex-wrap:wrap;gap:12px;margin-top:32px" data-reveal><a class="btn btn--dark btn--lg" href="${url('contact')}#project">${p.t('services.hero.ctaDiscuss')}</a><a class="btn btn--ghost btn--lg" href="#work">${p.t('services.hero.ctaWork')}</a></div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="sec-head">${p.e('span', 'services.systemMap.kicker', 'class="eyebrow"')}${p.e('h2', 'services.systemMap.heading', 'class="title title--sm" data-reveal="wipe"')}${p.e('p', 'services.systemMap.lead', 'class="lead"')}</div>
    <div class="frame vignette sysmap" data-sysmap data-reveal="scale"><i class="mk"></i><i class="mk"></i><i class="mk"></i><i class="mk"></i>
      <div class="seg" role="tablist" ${p.at({ 'aria-label': 'services.systemMap.sourcesAriaLabel' })}>${optBtns}</div>
      <div class="sys-bridge"><span></span><b>${p.t('services.systemMap.bridge')}</b><span></span></div>
      <div class="sys-outs">${outcomes}</div>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="sec-head">${p.e('h2', 'services.capabilities.heading', 'class="title" data-reveal="wipe"')}${p.e('p', 'services.capabilities.lead', 'class="lead"')}</div>
    <div class="bento">${caps}</div>
  </div>
</section>

<section class="section section--paper2">
  <div class="wrap wrap--narrow center">
    ${p.e('h2', 'services.existingSoftware.heading', 'class="title" data-reveal="wipe"')}
    ${p.e('p', 'services.existingSoftware.lead', 'class="lead" style="margin-inline:auto;margin-top:18px"')}
    <div class="chips-grid" style="justify-content:center;margin-top:32px">${existing}</div>
    ${p.e('p', 'services.existingSoftware.closing', 'class="h-serif" style="font-size:clamp(1.5rem,2.6vw,2.1rem);margin-top:40px;line-height:1.2"')}
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="sec-head">${p.e('h2', 'services.howWeWork.heading', 'class="title" data-reveal="wipe"')}${p.e('p', 'services.howWeWork.lead', 'class="lead"')}</div>
    <ol class="steps steps--3">${how}</ol>
  </div>
</section>

<section class="section" id="work">
  <div class="wrap">
    <div class="sec-head">${p.e('h2', 'services.work.heading', 'class="title" data-reveal="wipe"')}${p.e('p', 'services.work.lead', 'class="lead"')}</div>
    <p class="group-label">${p.t('services.work.groupClickT')}</p>
    <div class="grid grid--2">${work('clickt', true)}</div>
    <p class="group-label" style="margin-top:48px">${p.t('services.work.groupFounder')}</p>
    <div class="grid grid--3">${work('battery')}${work('toolkit')}${work('crypto')}</div>
    ${p.e('p', 'services.work.founderNote', 'class="muted" style="margin-top:20px;font-size:.9rem;max-width:70ch"')}
  </div>
</section>

<section class="section section--paper2">
  <div class="wrap">
    <div class="split">
      <div>${p.e('span', 'services.company.lead', 'class="eyebrow" style="text-transform:none;letter-spacing:.02em"')}<ul class="tick-list" style="margin-top:22px;columns:2;gap:24px">${company}</ul></div>
      <div class="endcard" data-reveal="scale" style="padding:clamp(32px,4vw,56px)">
        ${p.e('h2', 'services.cta.heading', 'class="title title--sm"')}
        ${p.e('p', 'services.cta.body', 'class="lead" style="font-size:1rem"')}
        <div class="store-row"><a class="btn btn--dark btn--lg" href="${url('contact')}#project">${p.t('services.cta.button')}</a></div>
      </div>
    </div>
  </div>
</section>
`;
}
