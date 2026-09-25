// Shared document shell: <head>, header, mobile menu, footer.
import { icon } from './icons.mjs';
import { SITE, APP_STORE, EMAIL, esc } from './core.mjs';

export const url = (name) => (name === 'home' ? '/' : `/pages/${name}.html`);

const PRODUCT = [
  ['teams', 'teams', '--teams'],
  ['checklist', 'checklist', '--checklist'],
  ['builder', 'builder', '--builder'],
  ['presentation', 'presentation', '--presentation'],
  ['clicktai', 'ai', '--blue'],
  ['pricing', 'plans', '--ink'],
];
const INDUSTRIES = ['schools', 'healthcare', 'banks', 'ngos', 'hotels', 'restaurants', 'construction'];

export function header(p, current) {
  const cur = (name) => (current === name ? ' aria-current="page"' : '');
  const tiles = PRODUCT.map(([name, ico, col]) => {
    const key = name === 'pricing' ? 'plans' : name;
    return `<a class="mega-tile" href="${url(name)}"${cur(name)} style="--c:var(${col})"><span class="mega-ico">${icon(ico)}</span><span class="mega-txt"><b>${p.t(`siteShell.product.${key}`)}</b>${p.e('span', `shell.menu.${key}`)}</span></a>`;
  }).join('');
  const mobileTiles = PRODUCT.map(([name, ico, col]) => {
    const key = name === 'pricing' ? 'plans' : name;
    return `<a href="${url(name)}" style="--c:var(${col})"><span class="mega-ico">${icon(ico)}</span>${p.e('span', `siteShell.product.${key}`)}</a>`;
  }).join('');

  return `<header class="site-header" data-header>
  <div class="wrap header-in">
    <a class="brand" href="/" aria-label="Clickt"><img src="/assets/img/brand/logo.webp" alt="Clickt" width="120" height="39" decoding="async"></a>
    <nav class="nav" ${p.at({ 'aria-label': 'siteShell.header.navigation' })}>
      <div class="nav-item" data-menu>
        <button class="nav-link" type="button" aria-expanded="false" aria-haspopup="true">${p.e('span', 'siteShell.header.product')}${icon('chevron')}</button>
        <div class="mega" role="menu">${tiles}</div>
      </div>
      <a class="nav-link" href="${url('solutions')}"${cur('solutions')}>${p.t('siteShell.header.solutions')}</a>
      <a class="nav-link" href="${url('services')}"${cur('services')}>${p.t('siteShell.header.services')}</a>
      <a class="nav-link" href="${url('about')}"${cur('about')}>${p.t('siteShell.header.about')}</a>
      <a class="nav-link" href="${url('contact')}"${cur('contact')}>${p.t('siteShell.header.contact')}</a>
    </nav>
    <div class="header-actions">
      <div class="lang" role="group" ${p.at({ 'aria-label': 'siteShell.utility.languageLabel' })}>
        <button type="button" data-lang="en" class="is-active" aria-pressed="true">EN</button>
        <button type="button" data-lang="ne" aria-pressed="false" lang="ne">ने</button>
      </div>
      <a class="btn btn--dark btn--sm" href="${APP_STORE}" target="_blank" rel="noopener noreferrer">${p.e('span', 'siteShell.footer.download')}</a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="mobile-sheet" ${p.at({ 'aria-label': 'siteShell.header.openMenu' })}><span></span></button>
    </div>
  </div>
</header>
<div class="mobile-sheet" id="mobile-sheet" data-sheet>
  <h4>${p.t('siteShell.header.product')}</h4>
  ${mobileTiles}
  <h4>Click T</h4>
  <a href="${url('solutions')}">${p.e('span', 'siteShell.header.solutions')}</a>
  <a href="${url('services')}">${p.e('span', 'siteShell.header.services')}</a>
  <a href="${url('about')}">${p.e('span', 'siteShell.header.about')}</a>
  <a href="${url('contact')}">${p.e('span', 'siteShell.header.contact')}</a>
  <div style="margin-top:28px;display:grid;gap:12px">
    <a class="btn btn--primary btn--lg" href="${APP_STORE}" target="_blank" rel="noopener noreferrer" style="border:0">${p.e('span', 'siteShell.footer.download')}</a>
  </div>
</div>`;
}

export function footer(p) {
  const col = (titleKey, items) =>
    `<div class="footer-col"><h3>${p.t(titleKey)}</h3><ul>${items.map(([href, key]) => `<li><a href="${href}">${p.t(key)}</a></li>`).join('')}</ul></div>`;
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-main">
    <div class="footer-mark" aria-hidden="true"><img src="/assets/img/brand/logo.webp" alt="" loading="lazy" decoding="async"></div>
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="/assets/img/brand/logo.webp" alt="Clickt" width="128" height="42" loading="lazy" decoding="async">
        ${p.e('p', 'shell.footer.tagline')}
        <div class="footer-contact">
          <a href="mailto:${EMAIL}">${EMAIL}</a>
          <a href="tel:+9779801120784">+977 9801120784</a>
          <a href="tel:+17653018290">+1 765 3018290</a>
          ${p.e('span', 'siteShell.footer.officeLocation', 'class="muted"')}
        </div>
      </div>
      ${col('siteShell.footer.groups.product', PRODUCT.map(([n]) => [url(n), `siteShell.product.${n === 'pricing' ? 'plans' : n}`]))}
      ${col('siteShell.footer.groups.solutions', INDUSTRIES.map((n) => [url('solutions-' + n), `siteShell.industry.${n}`]))}
      ${col('siteShell.footer.groups.clickT', [[url('about'), 'siteShell.header.about'], [url('services'), 'siteShell.header.services'], [url('contact'), 'siteShell.header.contact'], [url('pitch-deck'), 'shell.footer.pitchDeck']])}
      ${col('siteShell.footer.groups.help', [[url('support'), 'siteShell.footer.support'], [url('user-guide'), 'siteShell.footer.userGuide'], [url('android'), 'shell.footer.android']])}
      ${col('siteShell.footer.groups.legal', [[url('privacy'), 'siteShell.footer.privacy'], [url('security'), 'siteShell.footer.security'], [url('terms'), 'siteShell.footer.terms']])}
    </div>
    </div>
    <div class="footer-bottom">
      ${p.e('span', 'siteShell.footer.copyright')}
      <span class="lang" role="group" ${p.at({ 'aria-label': 'siteShell.utility.languageLabel' })}>
        <button type="button" data-lang="en" class="is-active" aria-pressed="true">English</button>
        <button type="button" data-lang="ne" aria-pressed="false" lang="ne">नेपाली</button>
      </span>
    </div>
  </div>
</footer>`;
}

// Full document.
export function document_({ p, id, path, current, title, desc, main, css = [], scripts = [], bodyClass = '', og, head = '', bodyStart = '', noindex = false, jsonld }) {
  const canonical = SITE + path;
  const ogImage = SITE + (og || '/assets/img/brand/og.jpg');
  const titleT = title.key ? p.text(title.key) : title;
  const descT = desc.key ? p.text(desc.key) : desc;
  const titleAttr = title.key ? ` data-i18n="${title.key}"` : '';
  const descAttr = desc.key ? ` data-i18n-attr="content:${desc.key}"` : '';
  const jsEn = p.jsEn();
  return `<!DOCTYPE html>
<html lang="en" class="no-js" data-page="${id}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title${titleAttr}>${esc(titleT)}</title>
<meta name="description" content="${esc(descT)}"${descAttr}>
${noindex ? '<meta name="robots" content="noindex">' : ''}
<link rel="canonical" href="${canonical}">
<meta name="theme-color" content="#fbfaf6">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Clickt">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${esc(titleT)}">
<meta property="og:description" content="${esc(descT)}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(titleT)}">
<meta name="twitter:description" content="${esc(descT)}">
<meta name="twitter:image" content="${ogImage}">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/img/brand/favicon-32.png">
<link rel="icon" type="image/png" sizes="512x512" href="/assets/img/brand/icon-512.png">
<link rel="apple-touch-icon" href="/assets/img/brand/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/inter-latin-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/instrument-serif-latin-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/fonts.css">
<link rel="stylesheet" href="/assets/css/base.css">
<link rel="stylesheet" href="/assets/css/ui.css">
${css.map((c) => `<link rel="stylesheet" href="/assets/css/${c}.css">`).join('\n')}
<script>document.documentElement.classList.remove('no-js')</script>
${head}
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
${bodyStart}
<a class="skip-link" href="#main">${p.t('shell.skip')}</a>
${header(p, current)}
<main id="main">
${main}
</main>
${footer(p)}
<script type="application/json" id="i18n-en">${JSON.stringify(jsEn).replace(/</g, '\\u003c')}</script>
<script src="/assets/js/app.js" defer></script>
${scripts.map((s) => `<script src="/assets/js/${s}.js" defer></script>`).join('\n')}
</body>
</html>
`;
}

// Common CTA pieces used across pages.
export const storeButtons = (p, { dialog = true } = {}) => `<div class="store-row">
  <a class="btn btn--dark store-btn" href="${APP_STORE}" target="_blank" rel="noopener noreferrer">${icon('apple')}<span><small>${p.t('shell.store.appleSmall')}</small><strong>${p.t('shell.store.apple')}</strong></span></a>
  <button class="btn btn--ghost store-btn" type="button" data-play-open aria-haspopup="dialog">${icon('android')}<span><small>${p.t('shell.store.androidSmall')}</small><strong>${p.t('shell.store.android')}</strong></span></button>
</div>`;

export const androidDialog = (p) => `<dialog class="dialog" data-play-dialog aria-labelledby="play-title">
  <button class="dialog-x" type="button" data-dialog-close ${p.at({ 'aria-label': 'shell.dialog.close' })}>${icon('x')}</button>
  <span class="eyebrow">${p.t('index.testing.kicker')}</span>
  ${p.e('h2', 'index.testing.title', 'id="play-title" class="title title--sm"')}
  ${p.e('p', 'index.testing.body', 'class="lead"')}
  <div class="dialog-note"><span>01</span><p><strong>${p.t('index.testing.noteTitle')}</strong> ${p.t('index.testing.noteBody')}</p></div>
  <div class="dialog-actions">
    <a class="btn btn--primary" href="https://play.google.com/apps/testing/com.clickt.android" target="_blank" rel="noopener noreferrer" data-play-request>${p.e('span', 'index.testing.continue')}</a>
    <button class="btn btn--ghost" type="button" data-dialog-close>${p.t('index.testing.cancel')}</button>
  </div>
</dialog>`;
