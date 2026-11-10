import { icon } from '../lib/icons.mjs';
import { url, storeButtons, androidDialog } from '../lib/shell.mjs';
import { approve } from '../lib/scenes.mjs';
import { APP_STORE, EMAIL } from '../lib/core.mjs';

const img = (src, alt, w, h, extra = '') => `<img src="/assets/img/${src}" alt="${alt}" width="${w}" height="${h}" decoding="async" ${extra}>`;
const phoneEl = (src, alt, style = '', cls = '') => `<div class="phone ${cls}" style="${style}"><div class="screen">${img(src, alt, 640, 1391, 'loading="lazy"')}</div></div>`;

export default function home(p) {
  // The module story: one scroll animation. Each step pairs a real app screen with a
  // small card that plays the step's key moment once when the step becomes active
  // (claiming, reminders, extract work, a recurring checklist, charts, themes, approval).
  // Its default style is the card's final state, so it reads without motion too.
  const T = (k) => p.t(k);
  const pill = (c, key, extra = '') => `<span class="sc-pill" style="--c:var(--${c})"${extra}>${T(key)}</span>`;
  const cards = {
    teams: `<div class="sc sc--claim">
        <div class="sc-top">${T('home.ch2.claimK')}</div>
        <div class="sc-title">${T('scene.claim.task')}</div>
        <div class="sc-sub">${T('scene.claim.sub')}</div>
        <div class="sc-rows">
          <div class="sc-row"><i class="sc-av" style="--c:var(--teams)">${T('scene.claim.i1')}</i><span class="sc-name">${T('scene.claim.n1')}</span><span class="sc-swap"><b class="sc-a sc-btn">${T('scene.claim.claim')}</b><b class="sc-b sc-btn sc-btn--off">${T('scene.claim.claim')}</b></span></div>
          <div class="sc-row sc-row--win"><i class="sc-av" style="--c:var(--violet)">${T('scene.claim.i2')}</i><span class="sc-name">${T('scene.claim.n2')}</span><span class="sc-swap"><b class="sc-a sc-btn">${T('scene.claim.claim')}</b><b class="sc-b sc-ok">✓ ${T('scene.claim.claimed')}</b></span></div>
        </div>
        <p class="sc-foot">${T('scene.claim.server')}</p>
      </div>`,
    calendar: `<div class="sc sc--rem">
        <div class="sc-top">${T('home.ch2.reminderK')}</div>
        <ol class="sc-time">
          <li style="--i:0;--c:var(--blue)">${T('scene.reminder.pre')}</li>
          <li style="--i:1;--c:var(--calendar)">${T('scene.reminder.atDue')}</li>
          <li style="--i:2;--c:var(--builder)">${T('scene.reminder.follow')}</li>
          <li class="sc-quiet" style="--i:3;--c:var(--mute)">${T('scene.reminder.quiet')}</li>
          <li style="--i:4;--c:var(--checklist)">${T('scene.reminder.digest')}</li>
        </ol>
      </div>`,
    notes: `<div class="sc sc--notes">
        <div class="sc-top">${T('scene.notes.head')}</div>
        ${[['d1', 'teams', 'scene.notes.teams'], ['d2', 'teams', 'scene.notes.teams'], ['d3', 'checklist', 'scene.notes.checklist']].map(([d, c, key], i) => `<div class="sc-draft" style="--i:${i}"><span>${T('scene.notes.' + d)}</span><span class="sc-swap"><span class="sc-a sc-pill" style="--c:var(--mute)">${T('scene.notes.leave')}</span><span class="sc-b sc-pill" style="--c:var(--${c})">${T(key)}</span></span></div>`).join('')}
        <p class="sc-foot">${T('scene.notes.receiptSub')}</p>
      </div>`,
    checklist: `<div class="sc sc--check">
        <div class="sc-top">${T('scene.checklist.title')}</div>
        <div class="sc-sub">${T('scene.checklist.recurring')}</div>
        <ul class="sc-items">${[1, 2, 3, 4].map((i) => `<li style="--i:${i - 1}"><i class="sc-box">✓</i><span>${T('scene.checklist.i' + i)}</span></li>`).join('')}</ul>
        <div class="sc-bar"><i></i></div>
        <p class="sc-foot sc-done">${T('scene.checklist.next')}</p>
      </div>`,
    builder: `<div class="sc sc--chart">
        <div class="sc-top">${T('scene.chart.dataset')}</div>
        <div class="sc-bars">${[['kathmandu', 148], ['pokhara', 74], ['lalitpur', 92], ['biratnagar', 52], ['butwal', 54]].map(([c, v], i) => `<div style="--i:${i};--h:${(v / 148 * 100).toFixed(1)}%"><b>${v}</b><i></i><span>${T('scene.chart.' + c)}</span></div>`).join('')}</div>
        <div class="sc-pills">${pill('builder', 'scene.chart.bar', ' data-on')}${pill('mute', 'scene.chart.line')}${pill('mute', 'scene.chart.donut')}${pill('mute', 'scene.chart.more')}</div>
        <p class="sc-foot">${T('scene.chart.types')} · ${T('scene.chart.export')}</p>
      </div>`,
    presentation: `<div class="sc sc--deck">
        <div class="sc-slide">
          <span class="sc-slide-sub">${T('scene.deck.sub')}</span>
          <b class="sc-slide-title">${T('scene.deck.title')}</b>
          <div class="sc-kpis">${[1, 2, 3].map((i) => `<div><b>${T('scene.deck.k' + i)}</b><span>${T('scene.deck.k' + i + 'l')}</span></div>`).join('')}</div>
        </div>
        <div class="sc-pills sc-themes"><span class="sc-pill sc-th1">${T('scene.deck.spotlight')}</span><span class="sc-pill sc-th2">${T('scene.deck.story')}</span><span class="sc-pill sc-th3">${T('scene.deck.editorial')}</span></div>
        <p class="sc-foot">${T('scene.deck.themes')}</p>
      </div>`,
    ai: `<div class="sc sc--ai">
        <div class="sc-top">ClicktAI</div>
        <p class="sc-ask">${T('scene.trust.previewAsk')}</p>
        <div class="sc-preview">
          <span class="sc-label">${T('scene.trust.previewCard')}</span>
          <span>${T('scene.trust.pr1')}</span><span class="sc-muted">${T('scene.trust.pr2')}</span><span class="sc-muted">${T('scene.trust.pr3')}</span>
          <div class="sc-actions"><b class="sc-btn sc-approve">${T('scene.trust.previewApprove')}</b><b class="sc-btn sc-btn--off">${T('scene.trust.previewCancel')}</b></div>
        </div>
        <p class="sc-receipt">✓ ${T('scene.trust.previewReceipt')}</p>
        <p class="sc-foot"><b>${T('scene.key.title')}</b><br>${T('scene.key.openai')} · ${T('scene.key.anthropic')} · ${T('scene.key.gemini')} · ${T('scene.key.nvidia')}</p>
      </div>`,
  };
  // One team's week, in the order the work happens (the same story as the Open Day Week
  // videos): each step names its day, its module, what changed for the team, and links on.
  // [card, screen, colour, link page, label class, keys {k, h, b, l}]
  const steps = [
    ['notes', 'phone/notes.webp', 'var(--notes)', 'notes', 'mod--notes'],
    ['teams', 'phone/teams-tasks.webp', 'var(--teams)', 'teams', 'mod--teams'],
    ['calendar', 'phone/calendar.webp', 'var(--calendar)', 'clicktai', 'mod--calendar'],
    ['checklist', 'phone/checklist.webp', 'var(--checklist)', 'checklist', 'mod--checklist'],
    ['builder', 'phone/builder.webp', 'var(--builder)', 'builder', 'mod--builder'],
    ['presentation', 'phone/presentation.webp', 'var(--presentation)', 'presentation', 'mod--presentation'],
    ['ai', 'phone/ai-teams.webp', 'var(--blue)', 'clicktai', '', { k: 'home.story.ai.k', h: 'home.ch5.title', b: ['home.ch5.lead'], l: 'home.story.ai.l' }],
  ];
  const storyHtml = steps.map(([k, src, col, page, modCls, keys = {}], i) => `<article class="story-step${i === 0 ? ' is-active' : ''}" data-step data-color="${col}">
      <span class="step-tag"><span class="mod ${modCls}"${modCls ? '' : ` style="--c:${col}"`}>${p.t(keys.k || `home.ch1.${k}.k`)}</span>${p.e('span', `home.week.${k}.when`, 'class="step-when"')}</span>
      ${p.e('h3', keys.h || `home.week.${k}.h`, 'class="h-serif"')}
      ${keys.b ? `<p>${keys.b.map((b) => p.t(b)).join(' ')}</p>` : p.e('p', `home.week.${k}.b`)}
      <a class="link-arrow" href="${url(page)}">${p.t(keys.l || `home.ch1.${k}.l`)}${icon('arrow')}</a>
      <div class="step-shot">${phoneEl(src, k, '', '')}${cards[k]}</div>
    </article>`).join('');
  const cardHtml = steps.map(([k], i) => `<div class="story-card${i === 0 ? ' is-active' : ''}" data-card>${cards[k]}</div>`).join('');
  const shots = steps.map(([k, src], i) => `<div class="shot${i === 0 ? ' is-active' : ''}" data-shot>${img(src, k, 640, 1391, i === 0 ? '' : 'loading="lazy"')}</div>`).join('');

  const droid = (src, alt) => phoneEl(src, alt, '--w:min(230px,44vw)', 'phone--android');
  // [platform, markup]
  const panels = [
    ['apple', `<div class="dev-pair dev-pair--3">${phoneEl('phone/notes.webp', p.text('home.devices.notesAlt'), '--w:min(230px,44vw)')}<div class="tablet" style="--w:min(330px,60vw)"><div class="screen">${img('tablet/ipad-home.webp', p.text('home.devices.ipadAltHome'), 900, 1306, 'loading="lazy"')}</div></div>${phoneEl('phone/ai-connect.webp', p.text('home.devices.iphoneAlt'), '--w:min(230px,44vw)')}</div>`],
    ['android', `<div class="dev-pair dev-pair--3">${droid('android/android_homepage.webp', p.text('home.devices.androidAlt'))}${droid('android/android_team2.webp', p.text('home.devices.androidAlt'))}${droid('android/android_builder3.webp', p.text('home.devices.androidAlt'))}</div>`],
  ];

  // Hero background: work drifts in, ClicktAI turns it into draft tasks around the
  // headline, the Clickt cursor clicks "call" and every card is applied. Each loop is
  // a different kind of organisation (no label is shown). The script reads every line by key, so the
  // cards follow the language toggle (assets/js/hero-fx.js).
  const fxLoop = [
    ['siteShell.industry.schools', 'schools', [['hall', 'teams', 'sam', 'fri'], ['invig', 'teams', 'priya', 'thu'], ['papers', 'checklist', 'you', 'mon'], ['parents', 'presentation', 'alex', 'wed'], ['attend', 'builder', 'you', 'today'], ['staff', 'notes', 'you', 'today']]],
    ['siteShell.industry.hotels', 'hotels', [['ac', 'teams', 'ramesh', 'today'], ['wedding', 'checklist', 'sita', 'sat'], ['owners', 'presentation', 'you', 'mon'], ['reviews', 'builder', 'alex', 'fri'], ['handover', 'notes', 'maya', 'tonight'], ['minibar', 'teams', 'open', 'today']]],
    ['siteShell.industry.banks', 'banks', [['ready', 'checklist', 'daily', ''], ['loans', 'teams', 'bikash', 'thu'], ['board', 'presentation', 'you', 'fri'], ['deposits', 'builder', 'anita', 'wed'], ['audit', 'notes', 'you', 'today'], ['atm', 'teams', 'open', 'mon']]],
    ['home.heroFx.anyTeam', 'team', [['kickoff', 'notes', 'you', 'today'], ['setup', 'teams', 'sam', 'fri'], ['joiners', 'checklist', 'priya', 'mon'], ['usage', 'builder', 'alex', 'thu'], ['leaders', 'presentation', 'you', 'fri'], ['invites', 'teams', 'priya', 'wed']]],
  ];
  const whoKey = (w) => (w === 'you' ? 'scene.approve.you' : w === 'open' ? 'home.heroFx.open' : w === 'daily' ? 'home.heroFx.day.daily' : `home.heroFx.who.${w}`);
  const fxData = {
    labels: { draft: 'scene.approve.draft', applied: 'scene.approve.applied' },
    modules: Object.fromEntries(['teams', 'notes', 'checklist', 'builder', 'presentation'].map((m) => [m, `home.ch1.${m}.k`])),
    loop: fxLoop.map(([name, key, tasks]) => ({ name, tasks: tasks.map(([id, mod, who, due]) => ({ r: `home.heroFx.${key}.${id}.r`, t: `home.heroFx.${key}.${id}.t`, mod, who: whoKey(who), due: due ? `home.heroFx.day.${due}` : '' })) })),
  };
  // Register every key, so English ships in the page and Nepali in its bundle.
  [...Object.values(fxData.labels), ...Object.values(fxData.modules), ...fxData.loop.flatMap((l) => [l.name, ...l.tasks.flatMap((t) => [t.r, t.t, t.who, t.due].filter(Boolean))])].forEach((k) => p.js(k));
  const fxLayer = `<div class="hfx" aria-hidden="true">
      <span class="hfx-glow hfx-glow--a"></span><span class="hfx-glow hfx-glow--b"></span><span class="hfx-glow hfx-glow--c"></span>
      <div class="hfx-field"></div>
      <div class="hfx-origin">${'<span class="hfx-ring"></span>'.repeat(3)}${[0, 45, 90, 135, 180, 225, 270, 315].map((r) => `<span class="hfx-ray" style="transform:rotate(${r}deg)"><i></i></span>`).join('')}<span class="hfx-cursor"><svg viewBox="0 0 24 24"><path d="M3 2.5 L20 11 L12.2 12.8 L9 20.5 Z"/></svg></span></div>
    </div>
    <script type="application/json" id="hero-fx-data">${JSON.stringify(fxData).replace(/</g, '\\u003c')}</script>`;

  const faq = [1, 2, 3, 4, 5, 6].map((i) => `<details data-reveal><summary>${p.t(`home.faq.q${i}`)}</summary>${p.e('div', `home.faq.a${i}`, 'class="ans"')}</details>`).join('');

  // Four plain assurances under the hero demo, in place of feature counts: what a team
  // deciding whether to adopt Clickt needs to hear first.
  const assure = [['approve', 'check'], ['own', 'lock'], ['days', 'calendar'], ['local', 'pin']]
    .map(([k, ico], i) => `<div class="assure-item" data-reveal style="--d:${i}"><span class="ico-box" style="--c:var(--blue)">${icon(ico)}</span><div>${p.e('h3', `home.assure.${k}.h`)}${p.e('p', `home.assure.${k}.b`)}</div></div>`).join('');
  const demoHref = `mailto:${EMAIL}?subject=${encodeURIComponent(p.text('home.hero.demoSubject'))}`;
  const compare = [1, 2, 3, 4, 5].map((i) => `<div class="cmp-row" data-reveal>${p.e('p', `home.compare.r${i}.a`, 'class="cmp-a"')}<span class="cmp-arrow" aria-hidden="true">${icon('arrow')}</span>${p.e('p', `home.compare.r${i}.b`, 'class="cmp-b"')}</div>`).join('');
  const startSteps = [1, 2, 3].map((i) => `<li data-reveal style="--d:${i}"><span class="start-n">0${i}</span>${p.e('h3', `home.start.s${i}.h`)}${p.e('p', `home.start.s${i}.b`)}</li>`).join('');

  return `
<section class="hero">
  <div class="hero-bg" aria-hidden="true"><span class="glow glow--blue"></span><span class="glow glow--peach"></span><span class="glow glow--violet"></span></div>
  <div class="hero-top" data-hero-fx>
  ${fxLayer}
  <div class="wrap hero-in">
    <span class="slate" data-reveal><i class="rec"></i><b>Clickt</b>${p.e('span', 'home.hero.platforms')}</span>
    ${p.e('h1', 'home.hero.title', 'class="display" data-reveal="wipe" style="--d:1"')}
    ${p.e('p', 'home.hero.lead', 'class="lead" data-reveal style="--d:3"')}
    <div class="hero-cta" data-reveal style="--d:4">
      ${storeButtons(p)}
    </div>
    <p class="hero-demo" data-reveal style="--d:5">${p.t('home.hero.demo')} <a class="link-arrow" href="${demoHref}">${p.t('home.hero.demoCta')}${icon('arrow')}</a></p>
  </div>
  </div>
  <div class="hero-pin" data-hero-pin>
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
  </div>
  <div class="wrap"><div class="assure">${assure}</div></div>
</section>

<section class="section" id="workspaces">
  <div class="wrap">
    <div class="story-head" data-story-head>
      <span class="slate" data-reveal><b>${p.t('home.ch1.name')}</b></span>
      ${p.e('h2', 'home.ch1.title', 'class="title" data-reveal="wipe"')}
      ${p.e('p', 'home.ch1.lead', 'class="lead" data-reveal style="--d:2"')}
    </div>
    <div class="story-body" data-story>
      <div class="story-viewport">
      <div class="story-steps">${storyHtml}</div>
      <div class="story-stage" aria-hidden="true">
        <span class="story-glow" data-glow></span>
        <div class="story-dots" data-dots>${steps.map((_, i) => `<i${i === 0 ? ' class="is-active"' : ''}></i>`).join('')}</div>
        <div class="phone"><div class="screen">${shots}</div></div>
        <div class="story-cards">${cardHtml}</div>
      </div>
      </div>
    </div>
  </div>
</section>

<section class="section section--tight" id="compare">
  <div class="wrap">
    <div class="sec-head">
      ${p.e('span', 'home.compare.kicker', 'class="eyebrow"')}
      ${p.e('h2', 'home.compare.title', 'class="title title--sm" data-reveal="wipe"')}
    </div>
    <div class="cmp">
      <div class="cmp-row cmp-head"><span>${p.t('home.compare.today')}</span><span></span><span>${p.t('home.compare.with')}</span></div>
      ${compare}
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
      ${panels.map(([pl, html], i) => `<div class="dev-panel${i === 0 ? ' is-active' : ''}" data-platform="${pl}">${html}</div>`).join('')}
    </div>
  </div>
</section>

<section class="section" id="start">
  <div class="wrap">
    <!-- How to start, and who it is built for (the industries are in the header's Solutions menu). -->
    <div class="start" data-reveal>
      <div class="start-main">
        ${p.e('span', 'home.start.kicker', 'class="eyebrow"')}
        ${p.e('h2', 'home.start.title', 'class="title start-title"')}
        ${p.e('p', 'home.start.lead', 'class="start-lead"')}
        <ol class="start-steps">${startSteps}</ol>
        <div class="actions">
          <a class="btn btn--dark" href="${demoHref}">${p.t('home.start.demo')}</a>
          <a class="btn btn--ghost" href="${url('security')}">${icon('shield')}${p.t('home.start.security')}</a>
        </div>
        <p class="start-guarantee">${icon('check')}${p.t('home.start.note')} <a href="${url('pricing')}">${p.t('home.nepal.priceCta')}</a></p>
      </div>
      <figure class="start-founder">
        <span class="eyebrow">${p.t('home.founder.title')}</span>
        <blockquote>${p.e('span', 'index.founder.message', 'style="display:block"')}</blockquote>
        <figcaption class="by"><span>${p.t('home.founder.by')}</span><a href="https://www.linkedin.com/in/aaryan-j-3895541a7/" target="_blank" rel="noopener noreferrer">LinkedIn</a></figcaption>
      </figure>
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
      <div class="final-demo"><a class="btn btn--ghost" href="${demoHref}">${p.t('home.start.demo')}</a></div>
    </div>
  </div>
</section>
${androidDialog(p)}
`;
}
