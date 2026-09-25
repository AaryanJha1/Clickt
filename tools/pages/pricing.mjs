import { icon } from '../lib/icons.mjs';
import { url, storeButtons, androidDialog } from '../lib/shell.mjs';
import { APP_STORE, EMAIL } from '../lib/core.mjs';

export default function pricing(p) {
  p.js('pricing.currency.perUser.business.npr'); p.js('pricing.currency.perUser.business.usd');
  p.js('pricing.currency.showingNepal'); p.js('pricing.currency.showingIntl');
  const list = (tier, n) => Array.from({ length: n }, (_, i) => `<li>${p.t(`pricing.tiers.${tier}.feature${i + 1}`)}</li>`).join('');
  const faq = [1, 2, 3, 4, 5, 7].map((i) => `<details data-reveal><summary>${p.t(`pricing.faq.q${i}.question`)}</summary>${p.e('div', `pricing.faq.q${i}.answer`, 'class="ans"')}</details>`).join('');
  const funds = ['workspace', 'ai', 'sync', 'support'].map((k) => `<div class="fund" data-reveal><span>${p.t(`pricing.vs.col${k.charAt(0).toUpperCase() + k.slice(1)}`)}</span><b>${p.t(`pricing.vs.business.${k}`)}</b></div>`).join('');

  return `
<section class="page-hero">
  <span class="glow glow--blue" style="width:600px;height:600px;left:-10%;top:-35%"></span><span class="glow glow--peach" style="width:520px;height:520px;right:-8%;top:-10%"></span>
  <div class="wrap center" style="position:relative;z-index:1">
    ${p.e('span', 'pricing.hero.kicker', 'class="eyebrow" data-reveal')}
    ${p.e('h1', 'pricing.hero.heading', 'class="title" style="font-size:clamp(2.6rem,6vw,5rem);max-width:16ch;margin-inline:auto" data-reveal="wipe"')}
    ${p.e('p', 'pricing.hero.lead', 'class="lead" style="margin-inline:auto" data-reveal')}
    <p class="region-pill" data-reveal data-cur-note><span class="region-dot"></span><span data-cur-text>${p.t('pricing.currency.showingIntl')}</span></p>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="plans">
      <article class="plan" data-reveal>
        ${p.e('span', 'pricing.tiers.free.label', 'class="plan-label"')}
        <div class="plan-price"><span class="kpi" data-price data-npr="NPR 0" data-usd="USD 0">USD 0</span></div>
        ${p.e('p', 'pricing.tiers.free.period', 'class="plan-period"')}
        ${p.e('p', 'pricing.tiers.free.users', 'class="plan-users"')}
        ${p.e('p', 'pricing.tiers.free.tagline', 'class="plan-tag"')}
        <a class="btn btn--dark btn--lg" href="${APP_STORE}" target="_blank" rel="noopener noreferrer">${p.t('pricing.tiers.free.cta')}</a>
        <ul class="tick-list">${list('free', 6)}</ul>
      </article>
      <article class="plan plan--pro" data-reveal style="--d:1">
        <span class="badge">${p.t('pricing.tiers.business.badge')}</span>
        ${p.e('span', 'pricing.tiers.business.label', 'class="plan-label"')}
        <div class="plan-price"><span class="kpi" data-price data-npr="NPR 1,000" data-usd="USD 10">USD 10</span></div>
        <p class="plan-period" data-seat-line>${p.t('pricing.currency.perUser.business.usd')}</p>
        ${p.e('p', 'pricing.tiers.business.period', 'class="plan-users"')}
        ${p.e('p', 'pricing.tiers.business.tagline', 'class="plan-tag"')}
        <a class="btn btn--primary btn--lg" href="${url('contact')}">${p.t('pricing.tiers.business.cta')}</a>
        <ul class="tick-list">${list('business', 12)}</ul>
        <p class="plan-setup"><b>${p.t('pricing.tiers.business.setupFeeLabel')}</b> ${p.t('pricing.tiers.business.setupFeeAmount')}</p>
      </article>
    </div>
  </div>
</section>

<section class="section section--paper2">
  <div class="wrap">
    <div class="split">
      <div>
        ${p.e('span', 'pricing.companyEdition.kicker', 'class="eyebrow"')}
        ${p.e('h2', 'pricing.companyEdition.heading', 'class="title title--sm" style="margin-top:18px" data-reveal="wipe"')}
        ${p.e('p', 'pricing.companyEdition.body', 'class="lead" style="margin-top:20px"')}
        ${p.e('p', 'pricing.companyEdition.note', 'class="muted" style="margin-top:16px;max-width:60ch"')}
      </div>
      <div>
        <p class="funds-label">${p.t('pricing.vs.label')}</p>
        <div class="funds">${funds}</div>
        ${p.e('p', 'pricing.vs.note', 'class="muted" style="margin-top:16px;font-size:.88rem"')}
      </div>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap wrap--narrow">
    <div class="guarantee" data-reveal>
      <div class="guarantee-num"><span class="kpi">90</span><small>${p.t('pricing.guarantee.kicker')}</small></div>
      <div>
        ${p.e('h2', 'pricing.guarantee.heading', 'class="title title--sm"')}
        ${p.e('p', 'pricing.guarantee.body', 'style="margin-top:14px;color:var(--ink-2)"')}
        ${p.e('p', 'pricing.guarantee.note', 'class="muted" style="margin-top:12px;font-size:.88rem"')}
      </div>
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="sec-head center" style="margin-inline:auto">${p.e('h2', 'pricing.faq.heading', 'class="title" data-reveal="wipe"')}</div>
    <div class="faq">${faq}</div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="endcard" data-reveal="scale">
      <span class="glow glow--violet" style="width:520px;height:520px;left:-10%;top:-40%;opacity:.5"></span>
      ${p.e('span', 'pricing.enterpriseCta.kicker', 'class="eyebrow" style="color:rgba(255,255,255,.7)"')}
      ${p.e('h2', 'pricing.enterpriseCta.heading', 'class="title" style="margin-top:18px"')}
      ${p.e('p', 'pricing.enterpriseCta.body', 'class="lead"')}
      <div class="store-row"><a class="btn btn--dark btn--lg" href="${url('contact')}">${p.t('pricing.enterpriseCta.cta')}</a></div>
    </div>
  </div>
</section>
${androidDialog(p)}
`;
}
