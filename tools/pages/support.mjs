import { icon } from '../lib/icons.mjs';
import { url } from '../lib/shell.mjs';
import { EMAIL } from '../lib/core.mjs';

export default function support(p) {
  const issues = [
    ['exportFailed', 'builder', '/pages/user-guide.html#exports'],
    ['notificationNotArriving', 'bell', '/pages/user-guide.html#settings'],
    ['teamActionsUnavailable', 'teams', '/pages/user-guide.html#teams'],
    ['moduleWalkthrough', 'play', '/pages/user-guide.html#start-paths'],
  ].map(([k, ico, href], i) => `<a class="card rel" href="${href}" data-reveal style="--d:${i % 2};--c:var(--blue)"><span class="ico-box">${icon(ico)}</span>${p.e('h3', `support.${k}.heading`)}${p.e('p', `support.${k}.body`)}<span class="link-arrow">${p.t(`support.${k}.link`)}${icon('arrow')}</span></a>`).join('');
  const items = [1, 2, 3, 4, 5].map((n) => `<li>${p.t(`support.beforeYouWrite.item${n}`)}</li>`).join('');
  return `
<section class="page-hero">
  <span class="glow glow--blue" style="width:600px;height:600px;left:-10%;top:-35%"></span>
  <div class="wrap" style="position:relative;z-index:1">
    ${p.e('span', 'support.hero.kicker', 'class="eyebrow" data-reveal')}
    ${p.e('h1', 'support.hero.heading', 'class="title" style="font-size:clamp(2.6rem,6vw,5rem)" data-reveal="wipe"')}
    ${p.e('p', 'support.hero.subtitle', 'class="lead" data-reveal style="--d:2"')}
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="sec-head">${p.e('h2', 'support.commonIssues.heading', 'class="title title--sm" data-reveal="wipe"')}</div>
    <div class="grid grid--2">${issues}</div>
  </div>
</section>

<section class="section section--paper2">
  <div class="wrap">
    <div class="split">
      <div>
        ${p.e('h2', 'support.beforeYouWrite.heading', 'class="title title--sm" data-reveal="wipe"')}
        ${p.e('p', 'support.beforeYouWrite.body', 'class="lead" style="margin-top:18px"')}
        <ul class="tick-list" style="margin-top:26px">${items}</ul>
      </div>
      <div class="endcard" data-reveal="scale" style="padding:clamp(32px,4vw,56px);text-align:left">
        ${p.e('h2', 'support.contactSupport.heading', 'class="title title--sm"')}
        ${p.e('p', 'support.contactSupport.body', 'class="lead" style="font-size:1rem;margin-left:0"')}
        <div class="chips-grid" style="margin-top:20px">${['Ios', 'Ipados', 'Macos', 'Android'].map((k) => `<span class="chip" style="background:rgba(255,255,255,.14);color:#fff;border-color:rgba(255,255,255,.25)">${p.t(`support.contactSupport.platform${k}`)}</span>`).join('')}</div>
        <div class="store-row" style="justify-content:flex-start"><a class="btn btn--dark btn--lg" href="mailto:${EMAIL}">${icon('mail')}${p.t('support.contactSupport.cta')}</a></div>
        ${p.e('p', 'support.contactSupport.response', 'class="note" style="text-align:left"')}
      </div>
    </div>
  </div>
</section>
`;
}
