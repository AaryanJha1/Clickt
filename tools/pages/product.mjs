import { icon } from '../lib/icons.mjs';
import { url, storeButtons, androidDialog } from '../lib/shell.mjs';
import { approve, claim, reminder, checklist, charts, deck } from '../lib/scenes.mjs';

const img = (src, alt, w, h, extra = '') => `<img src="/assets/img/${src}" alt="${alt}" width="${w}" height="${h}" decoding="async" ${extra}>`;

const MODS = {
  teams: {
    color: '--teams', ico: 'teams', phone: 'phone/teams.webp', tablet: 'tablet/ipad-teams1.webp', caps: 5, scene: 'seeTeams',
    scenes: (p) => `<div class="duo">${claim(p)}${reminder(p)}</div>`, next: 'checklist', others: ['checklist', 'builder', 'presentation'],
  },
  checklist: {
    color: '--checklist', ico: 'checklist', phone: 'phone/checklist.webp', tablet: 'tablet/ipad-checklist1.webp', caps: 5, scene: 'seeChecklist',
    scenes: (p) => `<div class="duo">${checklist(p)}${reminder(p)}</div>`, next: 'teams', others: ['teams', 'builder', 'presentation'],
  },
  builder: {
    color: '--builder', ico: 'builder', phone: 'phone/builder.webp', tablet: 'tablet/ipad-builder3.webp', caps: 4, scene: 'seeBuilder',
    scenes: (p) => `<div class="solo">${charts(p)}</div>`, next: 'presentation', others: ['teams', 'checklist', 'presentation'], scenario: true,
  },
  presentation: {
    color: '--presentation', ico: 'presentation', phone: 'phone/presentation.webp', tablet: 'tablet/ipad-presentation2.webp', caps: 4, scene: 'seePresentation',
    scenes: (p) => `<div class="solo">${deck(p)}</div>`, next: 'builder', others: ['teams', 'checklist', 'builder'], scenario: true,
  },
};
const cap = (k) => k.charAt(0).toUpperCase() + k.slice(1);

export default function product(p, def) {
  const k = def.module_key;
  const M = MODS[k];
  const mp = (s) => `modulePages.${k}.${s}`;
  const caps = Array.from({ length: M.caps }, (_, i) => i + 1).map((n) => `<article class="card cap${n === 5 ? ' wide' : ''}" data-reveal style="--d:${n % 3}">
      <span class="num">0${n}</span>${p.e('h3', mp(`capability${n}Title`))}${p.e('p', mp(`capability${n}Body`))}
    </article>`).join('');
  const steps = [1, 2, 3, 4].map((n) => `<li class="step" data-reveal style="--d:${n - 1}">${p.e('h3', mp(`step${n}Title`))}${p.e('p', mp(`step${n}Body`))}</li>`).join('');
  const related = M.others.map((o) => `<a class="card rel" href="${url(o)}" data-reveal style="--c:var(${MODS[o].color})">
      <span class="ico-box">${icon(MODS[o].ico)}</span>
      <span class="mod mod--${o}">${p.t(mp(`related${cap(o)}Label`))}</span>
      ${p.e('h3', mp(`related${cap(o)}Title`))}${p.e('p', mp(`related${cap(o)}Body`))}
      <span class="link-arrow">${p.tl(mp(`related${cap(o)}Link`))}${icon('arrow')}</span>
    </a>`).join('');

  const aiCustom = {
    request: mp('aiRequest'), head: mp('aiProposalTitle'), note: mp('aiControlNote'),
    rows: [1, 2, 3].map((n) => [k, mp(`aiProposal${n}`)]),
  };

  const scenario = M.scenario ? `<section class="section section--tight">
  <div class="wrap wrap--narrow">
    <div class="sec-head center">${p.e('span', mp('scenarioEyebrow'), 'class="eyebrow"')}${p.e('h2', mp('scenarioTitle'), 'class="title title--sm"')}</div>
    <div class="ba" data-reveal>
      <div class="ba-col">${p.e('span', mp('scenarioBeforeLabel'), 'class="ba-label"')}${p.e('p', mp('scenarioBeforeBody'))}</div>
      <span class="ba-arrow">${icon('arrow')}</span>
      <div class="ba-col ba-col--after">${p.e('span', mp('scenarioAfterLabel'), 'class="ba-label"')}${p.e('p', mp('scenarioAfterBody'))}</div>
    </div>
  </div>
</section>` : '';

  return `
<section class="page-hero prod-hero" style="--mod:var(${M.color})">
  <span class="glow glow--blue" style="width:640px;height:640px;left:-12%;top:-30%;background:radial-gradient(circle,color-mix(in srgb,var(--mod) 40%,transparent),transparent 65%)"></span>
  <span class="glow glow--peach" style="width:520px;height:520px;right:-10%;top:0"></span>
  <div class="wrap prod-hero-in">
    <div class="prod-hero-copy">
      <nav class="crumbs" data-reveal><a href="/">Clickt</a><span aria-hidden="true">/</span><span>${p.t('prod.crumbProduct')}</span><span aria-hidden="true">/</span><span>${p.t(mp('eyebrow'))}</span></nav>
      <span class="mod mod--${k}" style="margin-top:22px" data-reveal>${p.t(mp('eyebrow'))}</span>
      ${p.e('h1', mp('heroTitle'), 'class="title prod-title" data-reveal="wipe"')}
      ${p.e('p', mp('heroLead'), 'class="lead" data-reveal style="--d:2"')}
      <div class="actions" data-reveal style="--d:3">
        ${storeButtons(p)}
      </div>
    </div>
    <figure class="prod-hero-device" data-reveal="scale">
      <div class="phone" style="--w:min(310px,70vw)"><div class="screen">${img(M.phone, p.text(mp('deviceImgAlt')), 640, 1391, 'fetchpriority="high"')}</div></div>
      <figcaption><strong>${p.t(mp('deviceCaptionStrong'))}</strong><span>${p.t(mp('deviceCaptionText'))}</span></figcaption>
    </figure>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="sec-head">${p.e('span', 'prod.seeKicker', 'class="eyebrow"')}${p.e('h2', `prod.${M.scene}.title`, 'class="title" data-reveal="wipe"')}${p.e('p', `prod.${M.scene}.lead`, 'class="lead"')}</div>
    <div class="frame vignette chapter-frame" data-reveal="scale" style="padding:clamp(20px,3.4vw,48px)">
      <i class="mk"></i><i class="mk"></i><i class="mk"></i><i class="mk"></i>
      <span class="glow glow--blue" style="width:420px;height:420px;left:-8%;top:-20%;z-index:0"></span><span class="glow glow--peach" style="width:380px;height:380px;right:-6%;bottom:-25%;z-index:0"></span>
      <div style="position:relative;z-index:2">${M.scenes(p)}</div>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="sec-head">${p.e('span', mp('capabilitiesEyebrow'), 'class="eyebrow"')}${p.e('h2', mp('capabilitiesTitle'), 'class="title" data-reveal="wipe"')}${p.e('p', mp('capabilitiesLead'), 'class="lead"')}</div>
    <div class="bento caps">${caps}</div>
  </div>
</section>

<section class="section section--paper2" id="workflow">
  <div class="wrap">
    <div class="sec-head">${p.e('h2', mp('workflowTitle'), 'class="title" data-reveal="wipe"')}${p.e('p', mp('workflowLead'), 'class="lead"')}</div>
    <ol class="steps">${steps}</ol>
  </div>
</section>
${scenario}
<section class="section">
  <div class="wrap">
    <div class="split">
      <div>
        ${p.e('span', mp('aiEyebrow'), 'class="eyebrow"')}
        ${p.e('h2', mp('aiTitle'), 'class="title title--sm" style="margin-top:18px" data-reveal="wipe"')}
        ${p.e('p', mp('aiLead'), 'class="lead" style="margin-top:20px"')}
        <div style="margin-top:28px"><a class="link-arrow" href="${url('clicktai')}">ClicktAI ${icon('arrow')}</a></div>
      </div>
      <div class="frame vignette" style="padding:clamp(16px,2.4vw,32px)" data-reveal="scale"><i class="mk"></i><i class="mk"></i><i class="mk"></i><i class="mk"></i><div style="position:relative;z-index:2">${approve(p, { compact: true, custom: aiCustom })}</div></div>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="split split--rev">
      <div class="side"><div class="tablet" style="--w:min(400px,80vw)"><div class="screen">${img(M.tablet, p.text(mp('screenImgAlt')), 900, 1306, 'loading="lazy"')}</div></div></div>
      <div>
        ${p.e('span', mp('screenEyebrow'), 'class="eyebrow"')}
        ${p.e('h2', mp('screenTitle'), 'class="title title--sm" style="margin-top:18px" data-reveal="wipe"')}
        ${p.e('p', mp('screenLead'), 'class="lead" style="margin-top:20px"')}
        <div style="margin-top:28px"><a class="link-arrow" href="${url(M.next)}">${p.t(mp('screenLinkText'))}${icon('arrow')}</a></div>
      </div>
    </div>
  </div>
</section>

<section class="section section--paper2">
  <div class="wrap">
    <div class="sec-head">${p.e('h2', mp('relatedTitle'), 'class="title title--sm" data-reveal="wipe"')}${p.e('p', mp('relatedLead'), 'class="lead"')}</div>
    <div class="grid grid--3">${related}</div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="endcard" data-reveal="scale">
      <span class="glow glow--violet" style="width:520px;height:520px;left:-10%;top:-40%;opacity:.5"></span><span class="glow glow--peach" style="width:420px;height:420px;right:-8%;bottom:-40%;opacity:.35"></span>
      ${p.e('span', mp('finalEyebrow'), 'class="eyebrow" style="color:rgba(255,255,255,.7)"')}
      ${p.e('h2', mp('finalTitle'), 'class="title" style="margin-top:18px"')}
      ${p.e('p', mp('finalLead'), 'class="lead"')}
      ${storeButtons(p)}
      <p class="note"><a href="${url('pricing')}" style="text-decoration:underline">${p.t('modulePages.common.ctaViewPlans')}</a></p>
    </div>
  </div>
</section>
${androidDialog(p)}
`;
}
