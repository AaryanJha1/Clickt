import { icon } from '../lib/icons.mjs';
import { url, storeButtons, androidDialog } from '../lib/shell.mjs';
import { approve, claim, reminder, checklist, charts, deck, trust, byok, frame } from '../lib/scenes.mjs';
import { APP_STORE } from '../lib/core.mjs';

const img = (src, alt, w, h, extra = '') => `<img src="/assets/img/${src}" alt="${alt}" width="${w}" height="${h}" decoding="async" ${extra}>`;
const phoneEl = (src, alt, style = '', cls = '') => `<div class="phone ${cls}" style="${style}"><div class="screen">${img(src, alt, 640, 1391, 'loading="lazy"')}</div></div>`;

export default function home(p) {
  const steps = [
    ['teams', 'phone/teams-tasks.webp', 'var(--teams)', 'teams'],
    ['checklist', 'phone/checklist.webp', 'var(--checklist)', 'checklist'],
    ['builder', 'phone/builder.webp', 'var(--builder)', 'builder'],
    ['presentation', 'phone/presentation.webp', 'var(--presentation)', 'presentation'],
    ['calendar', 'phone/calendar.webp', 'var(--calendar)', 'clicktai'],
  ];
  const storyHtml = steps.map(([k, src, col, page], i) => `<article class="story-step${i === 0 ? ' is-active' : ''}" data-step data-color="${col}">
      <span class="mod mod--${k}">${p.t(`home.ch1.${k}.k`)}</span>
      ${p.e('h3', `home.ch1.${k}.h`, 'class="h-serif"')}
      ${p.e('p', `home.ch1.${k}.b`)}
      <a class="link-arrow" href="${url(page)}">${p.t(`home.ch1.${k}.l`)}${icon('arrow')}</a>
      <div class="step-shot">${phoneEl(src, k, '', '')}</div>
    </article>`).join('');
  const shots = steps.map(([k, src], i) => `<div class="shot${i === 0 ? ' is-active' : ''}" data-shot>${img(src, k, 640, 1391, i === 0 ? '' : 'loading="lazy"')}</div>`).join('');

  const industries = [
    ['schools', 'school'], ['healthcare', 'heart'], ['banks', 'bank'], ['ngos', 'hands'], ['hotels', 'bed'], ['restaurants', 'utensils'], ['construction', 'hardhat'],
  ];
  const indHtml = industries.map(([k, ico]) => `<a class="card ind" href="${url('solutions-' + k)}" data-reveal style="--c:var(--blue)">
      <span class="ico-box">${icon(ico)}</span>${icon('arrowUpRight').replace('<svg', '<svg class="arrow-out"')}
      <h3>${p.t(`siteShell.industry.${k}`)}</h3>${p.e('p', `solutions.industries.${k}`)}
    </a>`).join('') + `<a class="card ind" href="${url('solutions')}" data-reveal style="background:var(--paper-2)"><span class="ico-box" style="--c:var(--ink)">${icon('arrow')}</span><h3>${p.t('home.nepal.all')}</h3></a>`;

  const droid = (src, alt) => phoneEl(src, alt, '--w:min(230px,44vw)', 'phone--android');
  // [platform, markup]
  const panels = [
    ['apple', `<div class="dev-pair">${phoneEl('phone/home.webp', p.text('home.devices.iphoneAlt'), '--w:min(250px,44vw)')}${phoneEl('phone/ai-connect.webp', p.text('home.devices.iphoneAlt'), '--w:min(250px,44vw)')}</div>`],
    ['android', `<div class="dev-pair dev-pair--3">${droid('android/android_homepage.webp', p.text('home.devices.androidAlt'))}${droid('android/android_team2.webp', p.text('home.devices.androidAlt'))}${droid('android/android_builder3.webp', p.text('home.devices.androidAlt'))}</div>`],
  ];

  const faq = [1, 2, 3, 4, 5].map((i) => `<details data-reveal><summary>${p.t(`home.faq.q${i}`)}</summary>${p.e('div', `home.faq.a${i}`, 'class="ans"')}</details>`).join('');

  const proof = [
    ['12', 'a'], ['23', 'b'], ['4', 'c'], ['0', 'd'],
  ].map(([n, k]) => `<div data-reveal><span class="kpi" ${n !== '0' ? `data-count="${n}"` : ''}>${n}</span>${p.e('p', `home.proof.${k}`)}</div>`).join('');

  return `
<section class="hero">
  <div class="hero-bg" aria-hidden="true"><span class="glow glow--blue"></span><span class="glow glow--peach"></span><span class="glow glow--violet"></span></div>
  <div class="wrap hero-in">
    <span class="slate" data-reveal><i class="rec"></i><b>Clickt</b>${p.e('span', 'home.hero.platforms')}</span>
    ${p.e('h1', 'home.hero.title', 'class="display" data-reveal="wipe" style="--d:1"')}
    ${p.e('p', 'home.hero.lead', 'class="lead" data-reveal style="--d:3"')}
    <div class="hero-cta" data-reveal style="--d:4">
      ${storeButtons(p)}
      ${p.e('p', 'home.hero.note', 'class="hero-note"')}
    </div>
  </div>
  <div class="wrap hero-stage-wrap">
    <div class="frame vignette hero-stage" data-stage>
      <i class="mk"></i><i class="mk"></i><i class="mk"></i><i class="mk"></i>
      <span class="frame-tag">ClicktAI · Live</span>
      <span class="stage-glow stage-glow--a"></span><span class="stage-glow stage-glow--b"></span>
      <div class="stage-grid">
        ${approve(p)}
        <div class="stage-phones" aria-hidden="false">
          ${phoneEl('phone/home.webp', p.text('home.hero.phoneAlt'))}
          ${phoneEl('phone/ai-home.webp', 'ClicktAI on iPhone')}
        </div>
      </div>
    </div>
  </div>
  <div class="wrap"><div class="proof">${proof}</div></div>
</section>

<section class="section" id="workspaces">
  <div class="wrap">
    <div class="story-head" data-story-head>
      <span class="slate" data-reveal><b>${p.t('home.ch1.slate')}</b><i></i>${p.t('home.ch1.name')}</span>
      ${p.e('h2', 'home.ch1.title', 'class="title" data-reveal="wipe"')}
      ${p.e('p', 'home.ch1.lead', 'class="lead" data-reveal style="--d:2"')}
    </div>
    <div class="story-body" data-story>
      <div class="story-steps">${storyHtml}</div>
      <div class="story-stage" aria-hidden="true">
        <span class="story-glow" data-glow></span>
        <div class="phone"><div class="screen">${shots}</div></div>
      </div>
    </div>
  </div>
</section>

<section class="section section--tight" id="teams-scenes">
  <div class="wrap">
    <div class="chapter-head">
      <span class="slate" data-reveal><b>${p.t('home.ch2.slate')}</b><i></i>${p.t('home.ch2.name')}</span>
      ${p.e('h2', 'home.ch2.title', 'class="title" data-reveal="wipe"')}
      ${p.e('p', 'home.ch2.lead', 'class="lead" data-reveal style="--d:2"')}
    </div>
    <div class="frame vignette chapter-frame" data-reveal="scale">
      <i class="mk"></i><i class="mk"></i><i class="mk"></i><i class="mk"></i>
      <span class="glow glow--blue" style="width:420px;height:420px;left:-8%;top:-20%"></span><span class="glow glow--peach" style="width:380px;height:380px;right:-6%;bottom:-25%"></span>
      <div class="duo">${claim(p)}${reminder(p)}</div>
    </div>
  </div>
</section>

<section class="section section--tight" id="data-scenes">
  <div class="wrap">
    <div class="chapter-head">
      <span class="slate" data-reveal><b>${p.t('home.ch3.slate')}</b><i></i>${p.t('home.ch3.name')}</span>
      ${p.e('h2', 'home.ch3.title', 'class="title" data-reveal="wipe"')}
      ${p.e('p', 'home.ch3.lead', 'class="lead" data-reveal style="--d:2"')}
    </div>
    <div class="frame vignette chapter-frame" data-reveal="scale">
      <i class="mk"></i><i class="mk"></i><i class="mk"></i><i class="mk"></i>
      <span class="glow glow--peach" style="width:460px;height:460px;left:-10%;bottom:-30%"></span><span class="glow glow--violet" style="width:380px;height:380px;right:-6%;top:-25%"></span>
      <div class="split">
        ${charts(p)}
        <div class="side"><div class="tablet" style="--w:min(300px,70vw)"><div class="screen">${img('tablet/ipad-builder3.webp', 'Builder deliverables on iPad', 900, 1306, 'loading="lazy"')}</div></div></div>
      </div>
    </div>
  </div>
</section>

<section class="section section--tight" id="deck-scenes">
  <div class="wrap">
    <div class="chapter-head">
      <span class="slate" data-reveal><b>${p.t('home.ch4.slate')}</b><i></i>${p.t('home.ch4.name')}</span>
      ${p.e('h2', 'home.ch4.title', 'class="title" data-reveal="wipe"')}
      ${p.e('p', 'home.ch4.lead', 'class="lead" data-reveal style="--d:2"')}
    </div>
    <div class="frame vignette chapter-frame" data-reveal="scale">
      <i class="mk"></i><i class="mk"></i><i class="mk"></i><i class="mk"></i>
      <span class="glow glow--violet" style="width:460px;height:460px;right:-10%;bottom:-30%"></span><span class="glow glow--blue" style="width:380px;height:380px;left:-6%;top:-25%"></span>
      <div class="solo">${deck(p)}</div>
    </div>
  </div>
</section>

<section class="section section--tight" id="trust">
  <div class="wrap">
    <div class="chapter-head">
      <span class="slate" data-reveal><b>${p.t('home.ch5.slate')}</b><i></i>${p.t('home.ch5.name')}</span>
      ${p.e('h2', 'home.ch5.title', 'class="title" data-reveal="wipe"')}
      ${p.e('p', 'home.ch5.lead', 'class="lead" data-reveal style="--d:2"')}
    </div>
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
  </div>
</section>

<section class="section" id="devices">
  <div class="wrap">
    <div class="dev-head sec-head center" style="margin-inline:auto">
      ${p.e('span', 'home.devices.kicker', 'class="eyebrow"')}
      ${p.e('h2', 'home.devices.title', 'class="title" data-reveal="wipe"')}
      ${p.e('p', 'home.devices.lead', 'class="lead"')}
      <div class="dev-controls">
        <div class="seg" role="tablist" aria-label="Platform">
          <button type="button" role="tab" data-plat="apple" aria-selected="true">${p.t('home.devices.apple')}</button>
          <button type="button" role="tab" data-plat="android" aria-selected="false">${p.t('home.devices.android')}</button>
        </div>
      </div>
    </div>
    <div class="frame vignette dev-stage" data-devices>
      <i class="mk"></i><i class="mk"></i><i class="mk"></i><i class="mk"></i>
      <span class="glow glow--blue" style="width:480px;height:480px;left:20%;top:10%"></span><span class="glow glow--peach" style="width:380px;height:380px;right:14%;bottom:-10%"></span>
      ${panels.map(([pl, html], i) => `<div class="dev-panel${i === 0 ? ' is-active' : ''}" data-platform="${pl}">${html}${pl === 'android' ? p.e('p', 'home.devices.androidNote', 'class="dev-note"') : ''}</div>`).join('')}
    </div>
  </div>
</section>

<section class="section section--paper2" id="nepal">
  <div class="wrap">
    <div class="sec-head">
      ${p.e('span', 'home.nepal.kicker', 'class="eyebrow"')}
      ${p.e('h2', 'home.nepal.title', 'class="title" data-reveal="wipe"')}
      ${p.e('p', 'home.nepal.lead', 'class="lead"')}
    </div>
    <div class="ind-grid">${indHtml}</div>
    <div class="price-band" data-reveal>
      ${p.e('p', 'home.nepal.price')}
      <a class="btn" href="${url('pricing')}">${p.t('home.nepal.priceCta')}${icon('arrow').replace('<svg', '<svg class="arrow"')}</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="custom" data-reveal>
      <div>
        ${p.e('span', 'home.custom.kicker', 'class="eyebrow"')}
        ${p.e('h2', 'home.custom.title', 'class="title title--sm" style="margin-top:18px"')}
        ${p.e('p', 'home.custom.body')}
        ${p.e('p', 'home.custom.existing')}
        <div class="actions">
          <a class="btn btn--dark" href="${url('contact')}">${p.t('home.custom.cta')}</a>
          <a class="btn btn--ghost" href="${url('services')}#work">${p.t('home.custom.work')}</a>
        </div>
      </div>
      <div class="chips-grid">
        ${['custom', 'web', 'mobile', 'data', 'ai', 'integrations'].map((k) => `<span class="chip">${p.t(`services.capabilities.${k}.title`)}</span>`).join('')}
      </div>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="founder" data-reveal>
      <span class="eyebrow">${p.t('home.founder.title')}</span>
      <blockquote style="margin-top:22px">${p.e('span', 'index.founder.message', 'style="display:block"')}</blockquote>
      <div class="by"><span>${p.t('home.founder.by')}</span><a href="https://www.linkedin.com/in/aaryan-j-3895541a7/" target="_blank" rel="noopener noreferrer">LinkedIn</a></div>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="sec-head center" style="margin-inline:auto">
      ${p.e('h2', 'home.faq.title', 'class="title" data-reveal="wipe"')}
    </div>
    <div class="faq">${faq}</div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="endcard" data-reveal="scale">
      <span class="glow glow--violet" style="width:520px;height:520px;left:-10%;top:-40%;opacity:.5"></span><span class="glow glow--peach" style="width:420px;height:420px;right:-8%;bottom:-40%;opacity:.35"></span>
      ${p.e('h2', 'home.final.title', 'class="title"')}
      ${p.e('p', 'home.final.lead', 'class="lead"')}
      ${storeButtons(p)}
      ${p.e('p', 'home.hero.note', 'class="note"')}
    </div>
  </div>
</section>
${androidDialog(p)}
`;
}
