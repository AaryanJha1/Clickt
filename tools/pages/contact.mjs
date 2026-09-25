import { icon } from '../lib/icons.mjs';
import { url } from '../lib/shell.mjs';
import { EMAIL } from '../lib/core.mjs';

export default function contact(p) {
  const list = (base, n) => Array.from({ length: n }, (_, i) => `<li>${p.t(`${base}${i + 1}`)}</li>`).join('');
  const opt = (k, html = false) => `<option ${html ? `data-i18n-html="contact.brief.${k}"` : `data-i18n="contact.brief.${k}"`}>${p.tx(`contact.brief.${k}`)}</option>`;
  p.used.set('contact.brief.budget.range1', 'html'); p.used.set('contact.brief.budget.range2', 'html'); p.used.set('contact.brief.budget.range3', 'html');
  return `
<section class="page-hero">
  <span class="glow glow--blue" style="width:600px;height:600px;left:-10%;top:-35%"></span><span class="glow glow--peach" style="width:520px;height:520px;right:-8%;top:-10%"></span>
  <div class="wrap" style="position:relative;z-index:1">
    ${p.e('span', 'contact.hero.kicker', 'class="eyebrow" data-reveal')}
    ${p.e('h1', 'contact.hero.heading', 'class="title" style="font-size:clamp(2.6rem,6vw,5.2rem)" data-reveal="wipe"')}
    ${p.e('p', 'contact.hero.body', 'class="lead" data-reveal style="--d:2"')}
    <div class="chips-grid" style="margin-top:24px" data-reveal><span class="chip">${icon('pin').replace('<svg','<svg style="width:14px;height:14px"')}${p.t('contact.hero.chip1')}</span><span class="chip">${p.t('contact.hero.chip2')}</span></div>
    <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:30px" data-reveal><a class="btn btn--dark btn--lg" href="#project">${p.t('contact.hero.ctaBrief')}</a><a class="btn btn--ghost btn--lg" href="mailto:${EMAIL}">${icon('mail')}${EMAIL}</a></div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="sec-head">${p.e('h2', 'contact.before.heading', 'class="title title--sm" data-reveal="wipe"')}${p.e('p', 'contact.before.lead', 'class="lead"')}</div>
    <div class="grid grid--2">
      <article class="card" data-reveal><h3>${p.t('contact.before.support.title')}</h3><ul class="tick-list" style="margin-top:18px">${list('contact.before.support.item', 3)}</ul></article>
      <article class="card" data-reveal style="--d:1"><h3>${p.t('contact.before.projects.title')}</h3><ul class="tick-list" style="margin-top:18px">${list('contact.before.projects.item', 3)}</ul></article>
    </div>
  </div>
</section>

<section class="section section--tight" id="project">
  <div class="wrap">
    <div class="split split--top">
      <div>
        ${p.e('h2', 'contact.brief.heading', 'class="title title--sm" data-reveal="wipe"')}
        ${p.e('p', 'contact.brief.lead', 'class="lead" style="margin-top:18px"')}
        <div class="card" style="margin-top:32px;background:var(--paper-2);box-shadow:none"><h3>${p.t('contact.pricing.heading')}</h3>${p.e('p', 'contact.pricing.body')}${p.e('p', 'contact.pricing.note', 'style="font-size:.9rem"')}</div>
      </div>
      <div class="card form-card" data-reveal>
        <p class="form-ok" data-form-ok hidden>${p.t('contact.brief.success')}</p>
        <form class="form" id="project-enquiry-form" action="https://formsubmit.co/${EMAIL}" method="POST">
          <input type="hidden" name="_subject" value="New Click T project brief">
          <input type="hidden" name="_template" value="table">
          <input type="hidden" name="_next" value="https://click-t.com/pages/contact.html?submitted=project">
          <input type="text" name="_honey" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">
          <div class="row">
            <div class="field"><label for="pe-name">${p.t('contact.brief.labelName')}</label><input type="text" id="pe-name" name="name" required></div>
            <div class="field"><label for="pe-org">${p.t('contact.brief.labelOrg')}</label><input type="text" id="pe-org" name="organization"></div>
          </div>
          <div class="field"><label for="pe-email">${p.t('contact.brief.labelEmail')}</label><input type="email" id="pe-email" name="email" required></div>
          <div class="row">
            <div class="field"><label for="pe-type">${p.t('contact.brief.labelType')}</label><select id="pe-type" name="type" required><option value="" data-i18n="contact.brief.chooseOne">${p.tx('contact.brief.chooseOne')}</option>${['website', 'webApp', 'mobileApp', 'internal', 'data', 'ai', 'integration', 'upgrade', 'unsure'].map((t) => opt('type.' + t)).join('')}</select></div>
            <div class="field"><label for="pe-budget">${p.t('contact.brief.labelBudget')}</label><select id="pe-budget" name="budget"><option value="" data-i18n="contact.brief.chooseOne">${p.tx('contact.brief.chooseOne')}</option>${opt('budget.under100k')}${opt('budget.range1', true)}${opt('budget.range2', true)}${opt('budget.range3', true)}${opt('budget.over1m')}${opt('budget.help')}</select></div>
          </div>
          <div class="field"><label for="pe-existing">${p.t('contact.brief.labelExisting')}</label><input type="text" id="pe-existing" name="existingSoftware" ${p.at({ placeholder: 'contact.brief.placeholderExisting' })}></div>
          <div class="field"><label for="pe-problem">${p.t('contact.brief.labelProblem')}</label><textarea id="pe-problem" name="problem" required></textarea></div>
          <div class="field"><label for="pe-timeline">${p.t('contact.brief.labelTimeline')}</label><input type="text" id="pe-timeline" name="timeline" ${p.at({ placeholder: 'contact.brief.placeholderTimeline' })}></div>
          <div><button type="submit" class="btn btn--primary btn--lg">${p.t('contact.brief.submit')}</button></div>
          ${p.e('p', 'contact.brief.note', 'class="form-note"')}
        </form>
      </div>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="grid grid--3">
      <a class="card rel" href="${url('support')}" data-reveal style="--c:var(--blue)"><span class="ico-box">${icon('shield')}</span><h3>${p.t('siteShell.footer.support')}</h3><span class="link-arrow">${p.t('siteShell.footer.support')}${icon('arrow')}</span></a>
      <a class="card rel" href="${url('services')}" data-reveal style="--c:var(--violet)"><span class="ico-box">${icon('code')}</span><h3>${p.t('siteShell.header.services')}</h3><span class="link-arrow">${p.t('siteShell.header.services')}${icon('arrow')}</span></a>
      <a class="card rel" href="${url('pricing')}" data-reveal style="--c:var(--checklist)"><span class="ico-box">${icon('plans')}</span><h3>${p.t('siteShell.product.plans')}</h3><span class="link-arrow">${p.t('siteShell.product.plans')}${icon('arrow')}</span></a>
    </div>
    <p class="muted center" style="margin-top:32px;font-size:.92rem">${p.t('contact.company.lead')}</p>
  </div>
</section>
`;
}
