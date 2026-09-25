import { icon } from '../lib/icons.mjs';
import { url, storeButtons, androidDialog } from '../lib/shell.mjs';
import { APP_STORE } from '../lib/core.mjs';

export const INDUSTRIES = [
  ['schools', 'school', 'phone/teams.webp'], ['healthcare', 'heart', 'phone/checklist.webp'], ['banks', 'bank', 'phone/builder.webp'],
  ['ngos', 'hands', 'phone/teams-tasks.webp'], ['hotels', 'bed', 'phone/checklist-dark.webp'], ['restaurants', 'utensils', 'phone/checklist.webp'], ['construction', 'hardhat', 'phone/teams-invite.webp'],
];

export default function solutions(p) {
  const tiles = INDUSTRIES.map(([k, ico]) => `<a class="card ind" href="${url('solutions-' + k)}" data-reveal style="--c:var(--blue)"><span class="ico-box">${icon(ico)}</span>${icon('arrowUpRight').replace('<svg', '<svg class="arrow-out"')}<h3>${p.t(`siteShell.industry.${k}`)}</h3>${p.e('p', `solutions.industries.${k}`)}</a>`).join('');
  return `
<section class="page-hero">
  <span class="glow glow--blue" style="width:600px;height:600px;left:-10%;top:-35%"></span><span class="glow glow--peach" style="width:520px;height:520px;right:-8%;top:-10%"></span>
  <div class="wrap center" style="position:relative;z-index:1">
    ${p.e('span', 'solutions.hero.kicker', 'class="eyebrow" data-reveal')}
    ${p.e('h1', 'solutions.hero.title', 'class="title" style="font-size:clamp(2.6rem,6vw,5rem);max-width:17ch;margin-inline:auto" data-reveal="wipe"')}
    ${p.e('p', 'solutions.hero.copy', 'class="lead" style="margin-inline:auto" data-reveal')}
    <div class="store-row" style="justify-content:center;margin-top:32px" data-reveal><a class="btn btn--dark btn--lg" href="${APP_STORE}" target="_blank" rel="noopener noreferrer">${p.t('solutions.hero.cta')}</a></div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="sec-head">${p.e('span', 'solutions.industries.kicker', 'class="eyebrow"')}${p.e('h2', 'solutions.industries.title', 'class="title title--sm" data-reveal="wipe"')}${p.e('p', 'solutions.industries.lead', 'class="lead"')}</div>
    <div class="ind-grid ind-grid--3">${tiles}</div>
  </div>
</section>

<section class="section section--paper2">
  <div class="wrap">
    <div class="sec-head center" style="margin-inline:auto">${p.e('span', 'solutions.fit.kicker', 'class="eyebrow"')}${p.e('h2', 'solutions.fit.title', 'class="title title--sm" data-reveal="wipe"')}</div>
    <div class="fit" data-reveal>
      <div class="fit-node">${icon('data')}<b>${p.t('solutions.fit.stepExisting')}</b></div>
      <span class="fit-line"></span>
      <div class="fit-node fit-node--mid">${icon('sparkle')}<b>${p.t('solutions.fit.stepClickt')}</b></div>
      <span class="fit-line"></span>
      <div class="fit-node">${icon('check')}<b>${p.t('solutions.fit.stepResult')}</b></div>
    </div>
    <div class="grid grid--2" style="margin-top:48px">
      ${['one', 'two'].map((n) => `<article class="card" data-reveal><span class="eyebrow">${p.t(`solutions.principles.${n}Label`)}</span>${p.e('h3', `solutions.principles.${n}Title`, 'style="margin-top:14px;font-size:1.35rem"')}${p.e('p', `solutions.principles.${n}Copy`)}</article>`).join('')}
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="sec-head">${p.e('span', 'solutions.paths.kicker', 'class="eyebrow"')}${p.e('h2', 'solutions.paths.title', 'class="title title--sm" data-reveal="wipe"')}</div>
    <div class="grid grid--2">
      <a class="card rel" href="${url('pricing')}" data-reveal style="--c:var(--blue)"><span class="ico-box">${icon('plans')}</span>${p.e('h3', 'solutions.paths.adoptTitle')}${p.e('p', 'solutions.paths.adoptCopy')}<span class="link-arrow">${p.tl('solutions.paths.adoptLink')}${icon('arrow')}</span></a>
      <a class="card rel" href="${url('services')}" data-reveal style="--c:var(--violet)"><span class="ico-box">${icon('code')}</span>${p.e('h3', 'solutions.paths.serviceTitle')}${p.e('p', 'solutions.paths.serviceCopy')}<span class="link-arrow">${p.tl('solutions.paths.serviceLink')}${icon('arrow')}</span></a>
    </div>
  </div>
</section>
${androidDialog(p)}
`;
}
