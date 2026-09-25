#!/usr/bin/env node
// Static site generator for click-t.com.
//   node tools/build.mjs          builds every page, the Nepali bundles, sitemap and robots
// Output is plain HTML/CSS/JS committed to the repo; GitHub Pages serves it as-is.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, SITE, loadDictionaries, createPage } from './lib/core.mjs';
import { document_ } from './lib/shell.mjs';
import { splashHead, splashBody } from './lib/splash.mjs';

const dict = await loadDictionaries(['shell', 'home', 'product', 'meta', 'fixes']);
// Root-absolute links (/assets/…, /pages/…, /) become relative to the page, so the site
// also works when index.html is opened straight from disk, not only from a web root.
const relativize = (rel, html) => {
  const up = '../'.repeat(rel.split('/').length - 1);
  const fix = (v) => (v === '/' ? `${up}index.html` : `${up}${v.slice(1)}`);
  return html
    .replace(/(\s(?:href|src))="(\/(?!\/)[^"]*)"/g, (m, a, v) => `${a}="${fix(v)}"`)
    .replace(/url\((['"]?)(\/(?!\/)[^)'"]*)\1\)/g, (m, q, v) => `url(${q}${fix(v)}${q})`)
    .replace(/(location\.replace\(')\/(pages\/[^']*)'/g, (m, a, v) => `${a}${up}${v}'`);
};
const write = (rel, content) => {
  // 404.html keeps absolute paths: GitHub Pages serves it at whatever missing URL was requested.
  if (rel.endsWith('.html') && rel !== '404.html') content = relativize(rel, content);
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};

const pages = [];
const allUsed = new Set();
async function build(def) {
  const p = createPage(dict, def.id);
  const mod = (await import(`./pages/${def.module}.mjs`)).default;
  const main = mod(p, def);
  const html = document_({ p, id: def.id, path: def.path, current: def.current, title: def.title, desc: def.desc, main, css: def.css, scripts: def.scripts, bodyClass: def.bodyClass, og: def.og, noindex: def.noindex, jsonld: def.jsonld, head: (def.splash ? splashHead : '') + (def.head || ''), bodyStart: def.splash ? splashBody : '' });
  write(def.file, html);
  for (const k of p.used.keys()) allUsed.add(k);
  const ne = p.neBundle();
  write(`assets/i18n/${def.id}.ne.js`, `window.ClicktI18nNe=window.ClicktI18nNe||{};Object.assign(window.ClicktI18nNe,${JSON.stringify(ne)});\n`);
  if (p.missing.size) console.warn(`  ! ${def.id}: missing keys → ${[...p.missing].join(', ')}`);
  if (!def.noindex) pages.push({ path: def.path, priority: def.priority ?? 0.7 });
  console.log(`  ✓ ${def.file}`);
}

const defs = (await import('./pages.config.mjs')).default;
for (const d of defs) await build(d);

// pitch deck (kept as a standalone page) + redirect stubs for URLs the apps and store listings already use
write('pages/pitch-deck.html', fs.readFileSync(path.join(ROOT, 'tools/content/pitch-deck.html'), 'utf8'));
pages.push({ path: '/pages/pitch-deck.html', priority: 0.4 });
for (const name of ['privacy', 'terms', 'user-guide', 'support']) {
  const to = `${SITE}/pages/${name}.html`;
  write(`${name}.html`, `<!DOCTYPE html>\n<html lang="en"><head><meta charset="utf-8"><title>Redirecting…</title><meta name="robots" content="noindex"><link rel="canonical" href="${to}"><meta http-equiv="refresh" content="0; url=pages/${name}.html"><script>location.replace('/pages/${name}.html'+location.search+location.hash)</script></head><body><p>Moved to <a href="/pages/${name}.html">${to}</a>.</p></body></html>\n`);
}

// sitemap + robots
const today = new Date().toISOString().slice(0, 10);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((pg) => `  <url>\n    <loc>${SITE}${pg.path}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${pg.priority}</priority>\n  </url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
if (process.argv.includes('--dump-used')) fs.writeFileSync(process.argv[process.argv.indexOf('--dump-used') + 1], JSON.stringify([...allUsed]));
console.log(`Built ${defs.length} pages.`);
