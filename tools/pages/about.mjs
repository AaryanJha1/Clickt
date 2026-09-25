import { icon } from '../lib/icons.mjs';
import { url } from '../lib/shell.mjs';

export default function about(p) {
  const principles = ['one', 'two', 'three', 'four'].map((n, i) => `<article class="card" data-reveal style="--d:${i % 2}"><span class="num">0${i + 1}</span>${p.e('h3', `about.principles.${n}Title`)}${p.e('p', `about.principles.${n}Body`)}</article>`).join('');
  return `
<section class="page-hero">
  <span class="glow glow--blue" style="width:600px;height:600px;left:-10%;top:-35%"></span><span class="glow glow--peach" style="width:520px;height:520px;right:-8%;top:-10%"></span>
  <div class="wrap" style="position:relative;z-index:1">
    ${p.e('span', 'about.hero.kicker', 'class="eyebrow" data-reveal')}
    ${p.e('h1', 'about.hero.title', 'class="title" style="font-size:clamp(2.6rem,6vw,5.2rem);max-width:17ch" data-reveal="wipe"')}
    ${p.e('p', 'about.hero.lead', 'class="lead" data-reveal style="--d:2"')}
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="grid grid--2">
      <article class="card story" data-reveal>${p.e('span', 'about.story.oneKicker', 'class="eyebrow"')}${p.e('h2', 'about.story.oneTitle', 'class="h-serif" style="font-size:clamp(1.8rem,3vw,2.6rem);font-weight:400;margin:18px 0 14px;line-height:1.08"')}${p.e('p', 'about.story.oneBody')}</article>
      <article class="card story" data-reveal style="--d:1">${p.e('span', 'about.story.twoKicker', 'class="eyebrow"')}${p.e('h2', 'about.story.twoTitle', 'class="h-serif" style="font-size:clamp(1.8rem,3vw,2.6rem);font-weight:400;margin:18px 0 14px;line-height:1.08"')}${p.e('p', 'about.story.twoBody')}<a class="link-arrow" style="margin-top:20px" href="${url('services')}">${p.t('about.story.twoLink')}${icon('arrow')}</a></article>
    </div>
  </div>
</section>

<section class="section section--paper2">
  <div class="wrap wrap--narrow center">
    ${p.e('span', 'about.founder.kicker', 'class="eyebrow"')}
    ${p.e('h2', 'about.founder.title', 'class="title" style="margin-top:18px" data-reveal="wipe"')}
    ${p.e('p', 'about.founder.body', 'class="lead" style="margin:22px auto 0"')}
    <div class="founder"><div class="by"><a href="https://www.linkedin.com/in/aaryan-j-3895541a7/" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="mailto:clickt@click-t.com">clickt@click-t.com</a></div></div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="sec-head">${p.e('span', 'about.principles.kicker', 'class="eyebrow"')}${p.e('h2', 'about.principles.title', 'class="title title--sm" data-reveal="wipe"')}</div>
    <div class="grid grid--2">${principles}</div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="endcard" data-reveal="scale">
      <span class="glow glow--violet" style="width:520px;height:520px;left:-10%;top:-40%;opacity:.5"></span>
      ${p.e('span', 'about.paths.kicker', 'class="eyebrow" style="color:rgba(255,255,255,.7)"')}
      ${p.e('h2', 'about.paths.title', 'class="title" style="margin-top:18px;max-width:18ch"')}
      <div class="store-row"><a class="btn btn--dark btn--lg" href="/">${p.t('about.paths.ctaExplore')}</a><a class="btn btn--ghost btn--lg" href="${url('contact')}#project">${p.t('about.paths.ctaBrief')}</a></div>
      <p class="note"><a href="${url('pitch-deck')}" style="text-decoration:underline">${p.t('shell.footer.pitchDeck')}</a></p>
    </div>
  </div>
</section>
`;
}
