import { icon } from '../lib/icons.mjs';
import { url } from '../lib/shell.mjs';

const GROUPS = [
  ['dataInfra', 'data', ['stored', 'encrypted', 'backups', 'dedicated', 'audit']],
  ['access', 'lock', ['who', 'sso', 'delete']],
  ['ai', 'sparkle', ['training', 'providers', 'disable', 'byok']],
];
export default function security(p) {
  const groups = GROUPS.map(([g, ico, qs]) => `<section class="sec-group" data-reveal>
    <div class="sec-group-head"><span class="ico-box" style="--c:var(--blue)">${icon(ico)}</span><div>${p.e('h2', `security.${g}.heading`, 'class="h-serif" style="font-size:clamp(1.8rem,3vw,2.5rem);font-weight:400;line-height:1.1"')}${p.e('p', `security.${g}.lead`, 'class="muted" style="margin-top:8px"')}</div></div>
    <div class="qa">${qs.map((q) => `<div class="qa-row">${p.e('h3', `security.${g}.${q}.q`)}${p.e('p', `security.${g}.${q}.a`)}</div>`).join('')}</div>
  </section>`).join('');
  return `
<section class="page-hero">
  <span class="glow glow--blue" style="width:600px;height:600px;left:-10%;top:-35%"></span><span class="glow glow--teal" style="width:480px;height:480px;right:-8%;top:-10%"></span>
  <div class="wrap" style="position:relative;z-index:1">
    ${p.e('span', 'security.hero.kicker', 'class="eyebrow" data-reveal')}
    ${p.e('h1', 'security.hero.heading', 'class="title" style="font-size:clamp(2.6rem,6vw,5rem)" data-reveal="wipe"')}
    ${p.e('p', 'security.hero.body', 'class="lead" data-reveal style="--d:2"')}
    <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:30px" data-reveal><a class="btn btn--dark btn--lg" href="${url('contact')}">${p.t('security.hero.ctaTalk')}</a><a class="btn btn--ghost btn--lg" href="${url('privacy')}">${p.t('security.hero.ctaPrivacy')}</a></div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap wrap--narrow">
    ${groups}
    <section class="sec-group" data-reveal>
      <div class="sec-group-head"><span class="ico-box" style="--c:var(--blue)">${icon('shield')}</span><div>${p.e('h2', 'security.incident.heading', 'class="h-serif" style="font-size:clamp(1.8rem,3vw,2.5rem);font-weight:400;line-height:1.1"')}</div></div>
      <div class="qa"><div class="qa-row">${p.e('p', 'security.incident.lead')}${p.e('p', 'security.incident.note', 'class="muted" style="margin-top:12px"')}</div></div>
    </section>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="endcard" data-reveal="scale">
      <span class="glow glow--violet" style="width:520px;height:520px;left:-10%;top:-40%;opacity:.5"></span>
      ${p.e('h2', 'security.cta.heading', 'class="title" style="max-width:20ch"')}
      ${p.e('p', 'security.cta.body', 'class="lead"')}
      <div class="store-row"><a class="btn btn--dark btn--lg" href="${url('contact')}">${p.t('security.cta.button')}</a></div>
    </div>
  </div>
</section>
`;
}
