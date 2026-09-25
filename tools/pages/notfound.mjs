import { url } from '../lib/shell.mjs';
export default function notfound(p) {
  return `<section class="page-hero"><div class="wrap center" style="min-height:52vh;display:grid;align-content:center;justify-items:center">
  <span class="kpi" style="font-size:clamp(5rem,14vw,10rem);background:var(--ai);-webkit-background-clip:text;background-clip:text;color:transparent">404</span>
  <h1 class="title title--sm" style="margin-top:12px">${p.t('nf.title')}</h1>
  <p class="lead" style="margin-top:16px">${p.t('nf.body')}</p>
  <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:28px"><a class="btn btn--dark btn--lg" href="/">${p.t('nf.home')}</a><a class="btn btn--ghost btn--lg" href="${url('support')}">${p.t('siteShell.footer.support')}</a></div>
</div></section>`;
}
