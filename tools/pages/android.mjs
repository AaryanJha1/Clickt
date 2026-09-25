import { icon } from '../lib/icons.mjs';
import { url, androidDialog } from '../lib/shell.mjs';

const G = [
  ['home', ['android_homepage']],
  ['teams', ['android_team1', 'android_team2', 'android_team3', 'android_team4']],
  ['checklist', ['android_checklist1', 'android_checklist2']],
  ['builder', ['android_builder1', 'android_builder2', 'android_builder3']],
  ['presentation', ['android_presentation1', 'android_presentation2', 'android_presentation3']],
  ['calendar', ['android_calendar']],
  ['copilots', ['android_teamcopilot', 'android_checklistcopilot', 'android_buildercopilot', 'android_presentationcopilot', 'android_presentationcopilot1']],
];
export default function android(p) {
  const tabs = G.map(([g], i) => `<button type="button" role="tab" data-g="${g}" aria-selected="${i === 0}">${p.t(`googlePlay.cards.${g}.title`)}</button>`).join('');
  const panels = G.map(([g, imgs], i) => `<div class="ag-panel" data-gp="${g}" ${i ? 'hidden' : ''}>
    ${p.e('p', `googlePlay.cards.${g}.body`, 'class="lead" style="margin:0 auto 36px;text-align:center"')}
    <div class="ag-row">${imgs.map((im, n) => `<figure class="cop"><div class="phone phone--android" style="--w:220px"><div class="screen"><img src="/assets/img/android/${im}.webp" alt="" width="540" height="1202" loading="lazy" decoding="async"></div></div><figcaption><span>${p.t(`googlePlay.modal.captions.${g}.${n}`)}</span></figcaption></figure>`).join('')}</div>
  </div>`).join('');
  return `
<section class="page-hero">
  <span class="glow glow--teal" style="width:600px;height:600px;left:-10%;top:-35%"></span><span class="glow glow--blue" style="width:520px;height:520px;right:-8%;top:-10%;opacity:.4"></span>
  <div class="wrap prod-hero-in" style="position:relative;z-index:1">
    <div class="prod-hero-copy">
      <span class="badge" style="background:var(--checklist)" data-reveal>${p.t('googlePlay.hero.badgeStatus')}</span>
      ${p.e('h1', 'googlePlay.hero.title', 'class="title prod-title" data-reveal="wipe"')}
      ${p.e('p', 'googlePlay.hero.body', 'class="lead" data-reveal style="--d:2"')}
      <div class="actions" data-reveal style="--d:3"><button class="btn btn--dark btn--lg" type="button" data-play-open aria-haspopup="dialog">${icon('android')}${p.t('index.testing.continue')}</button><a class="btn btn--ghost btn--lg" href="#screens">${p.t('googlePlay.hero.ctaExplore')}</a></div>
      <p class="hero-note" style="margin-top:18px;max-width:52ch"><b>${p.t('googlePlay.hero.disclosureStrong')}</b> ${p.t('googlePlay.hero.disclosureRest')}</p>
    </div>
    <figure class="prod-hero-device" style="--mod:var(--checklist)" data-reveal="scale"><div class="phone phone--android" style="--w:min(270px,66vw)"><div class="screen"><img src="/assets/img/android/android_homepage.webp" alt="Clickt on Android" width="540" height="1202" fetchpriority="high"></div></div></figure>
  </div>
</section>

<section class="section" id="screens">
  <div class="wrap">
    <div class="sec-head center" style="margin-inline:auto">${p.e('span', 'googlePlay.proof.kicker', 'class="eyebrow"')}${p.e('h2', 'googlePlay.proof.title', 'class="title" data-reveal="wipe"')}${p.e('p', 'googlePlay.proof.body', 'class="lead"')}</div>
    <div style="display:grid;justify-items:center;margin-bottom:36px"><div class="seg" role="tablist" data-ag-tabs>${tabs}</div></div>
    <div class="frame vignette ag-frame"><i class="mk"></i><i class="mk"></i><i class="mk"></i><i class="mk"></i><span class="glow glow--teal" style="width:420px;height:420px;left:-8%;top:-20%"></span>${panels}</div>
  </div>
</section>
${androidDialog(p)}
`;
}
