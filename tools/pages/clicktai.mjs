import { icon } from '../lib/icons.mjs';
import { url, storeButtons, androidDialog } from '../lib/shell.mjs';
import { approve, trust, byok } from '../lib/scenes.mjs';

const img = (src, alt, w, h, extra = '') => `<img src="/assets/img/${src}" alt="${alt}" width="${w}" height="${h}" decoding="async" ${extra}>`;
const phone = (src, alt, w = 240) => `<div class="phone" style="--w:${w}px"><div class="screen">${img(src, alt, 640, 1391, 'loading="lazy"')}</div></div>`;

export default function clicktai(p) {
  const benefits = ['one', 'two', 'three'].map((n, i) => `<article class="card" data-reveal style="--d:${i}"><span class="num">0${i + 1}</span>${p.e('h3', `clicktai.benefits.${n}Title`)}${p.e('p', `clicktai.benefits.${n}Body`)}</article>`).join('');
  const steps = [1, 2, 3, 4].map((n) => `<li class="step" data-reveal style="--d:${n - 1}">${p.e('h3', `clicktai.workflow.step${n}Title`)}${p.e('p', `clicktai.workflow.step${n}Body`)}</li>`).join('');
  const cop = [
    ['teams', 'phone/ai-teams.webp', 'cTeams'], ['checklist', 'phone/ai-checklist.webp', 'cChecklist'], ['builder', 'phone/ai-builder.webp', 'cBuilder'],
    ['presentation', 'phone/ai-presentation.webp', 'cPresentation'], ['connect', 'phone/ai-connect.webp', 'cConnect'],
  ].map(([k, src, key], i) => `<figure class="cop" data-reveal style="--d:${i}">${phone(src, key)}<figcaption>${p.e('b', `prod.ai.${key}`)}${p.e('span', `prod.ai.${key}B`)}</figcaption></figure>`).join('');
  const rules = [1, 2, 3, 4].map((n) => `<div class="principle">${p.e('b', `prod.ai.r${n}t`)}${p.e('span', `prod.ai.r${n}b`)}</div>`).join('');
  const related = [['teams', 'teams'], ['checklist', 'checklist'], ['builder', 'builder'], ['presentation', 'presentation']].map(([k, ico]) => `<a class="card rel" href="${url(k)}" data-reveal style="--c:var(--${k})"><span class="ico-box">${icon(ico)}</span>${p.e('h3', `clicktai.related.${k}`)}<span class="link-arrow">${p.t(`siteShell.product.${k}`)}${icon('arrow')}</span></a>`).join('');

  return `
<section class="page-hero">
  <span class="glow glow--blue" style="width:640px;height:640px;left:-12%;top:-30%"></span><span class="glow glow--violet" style="width:520px;height:520px;right:-10%;top:-10%;opacity:.4"></span>
  <div class="wrap prod-hero-in" style="position:relative;z-index:1">
    <div class="prod-hero-copy">
      <span class="eyebrow" data-reveal>ClicktAI</span>
      ${p.e('h1', 'clicktai.hero.title', 'class="title prod-title" data-reveal="wipe" style="font-size:clamp(2.6rem,5.6vw,5rem)"')}
      ${p.e('p', 'clicktai.hero.lead', 'class="lead" data-reveal style="--d:2"')}
      <p class="ai-provider" data-reveal style="--d:3">${icon('key')}${p.t('clicktai.hero.providerNote')}</p>
      <div class="actions" data-reveal style="--d:3">${storeButtons(p)}</div>
    </div>
    <div class="frame vignette" style="padding:clamp(16px,2.4vw,32px)" data-reveal="scale"><i class="mk"></i><i class="mk"></i><i class="mk"></i><i class="mk"></i><div style="position:relative;z-index:2">${approve(p)}</div></div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap"><div class="grid grid--3">${benefits}</div></div>
</section>

<section class="section section--paper2">
  <div class="wrap">
    <div class="sec-head">${p.e('span', 'clicktai.workflow.kicker', 'class="eyebrow"')}${p.e('h2', 'clicktai.workflow.title', 'class="title" data-reveal="wipe"')}${p.e('p', 'clicktai.workflow.lead', 'class="lead"')}</div>
    <ol class="steps">${steps}</ol>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="sec-head">${p.e('span', 'prod.aiKicker', 'class="eyebrow"')}${p.e('h2', 'prod.ai.title', 'class="title" data-reveal="wipe"')}${p.e('p', 'prod.ai.lead', 'class="lead"')}</div>
    <div class="cops">${cop}</div>
  </div>
</section>

<section class="section section--tight" id="trust">
  <div class="wrap">
    <div class="sec-head">${p.e('span', 'prod.ai.rulesKicker', 'class="eyebrow"')}${p.e('h2', 'prod.ai.rulesTitle', 'class="title" data-reveal="wipe"')}${p.e('p', 'home.ch5.lead', 'class="lead"')}</div>
    <div class="frame vignette chapter-frame" data-reveal="scale">
      <i class="mk"></i><i class="mk"></i><i class="mk"></i><i class="mk"></i>
      <span class="glow glow--blue" style="width:420px;height:420px;left:-8%;bottom:-25%"></span><span class="glow glow--peach" style="width:380px;height:380px;right:-6%;top:-25%"></span>
      <div class="duo">
        ${trust(p)}
        <div>
          ${p.e('h3', 'scene.key.title', 'class="h-serif" style="font-size:clamp(1.8rem,3vw,2.5rem);font-weight:400;margin-bottom:12px"')}
          ${p.e('p', 'scene.key.lead', 'class="lead" style="margin-bottom:24px;font-size:1rem"')}
          ${byok(p)}
        </div>
      </div>
    </div>
    <div class="principles">${rules}</div>
  </div>
</section>

<section class="section section--paper2">
  <div class="wrap">
    <div class="split split--rev">
      <div class="side"><div class="tablet" style="--w:min(400px,80vw)"><div class="screen">${img('tablet/ipad-clicktai1.webp', p.text('clicktai.example.imgAlt'), 900, 1306, 'loading="lazy"')}</div></div></div>
      <div>
        ${p.e('span', 'clicktai.example.kicker', 'class="eyebrow"')}
        ${p.e('h2', 'clicktai.example.title', 'class="title title--sm" style="margin-top:18px" data-reveal="wipe"')}
        ${p.e('p', 'clicktai.example.body', 'class="lead" style="margin-top:20px"')}
        <div style="margin-top:28px"><a class="link-arrow" href="/#workspaces">${p.t('clicktai.example.linkText')}${icon('arrow')}</a></div>
      </div>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="sec-head">${p.e('span', 'clicktai.related.kicker', 'class="eyebrow"')}${p.e('h2', 'clicktai.related.title', 'class="title title--sm" data-reveal="wipe"')}</div>
    <div class="grid grid--4">${related}</div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="endcard" data-reveal="scale">
      <span class="glow glow--violet" style="width:520px;height:520px;left:-10%;top:-40%;opacity:.5"></span><span class="glow glow--peach" style="width:420px;height:420px;right:-8%;bottom:-40%;opacity:.35"></span>
      ${p.e('h2', 'clicktai.finalCta.title', 'class="title"')}
      ${p.e('p', 'clicktai.finalCta.body', 'class="lead"')}
      ${storeButtons(p)}
    </div>
  </div>
</section>
${androidDialog(p)}
`;
}
