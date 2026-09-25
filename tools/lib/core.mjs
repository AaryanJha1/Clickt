// Build core: content dictionaries, per-page i18n registry, escaping.
//
// Copy lives in tools/content as { en, ne } trees. Pages are written in
// English + Nepali once; the build emits English into the HTML (so it is
// readable without JavaScript and by crawlers) and a small per-page Nepali
// bundle that the language toggle loads on demand.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(here, '../..');
export const SITE = 'https://click-t.com';
export const APP_STORE = 'https://apps.apple.com/us/app/clickt/id6759891499';
export const PLAY_TEST = 'https://play.google.com/apps/testing/com.clickt.android';
export const EMAIL = 'clickt@click-t.com';

const readJson = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/content', f), 'utf8'));

function merge(a, b) {
  for (const k of Object.keys(b)) {
    if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k])) {
      a[k] = merge(a[k] && typeof a[k] === 'object' ? a[k] : {}, b[k]);
    } else a[k] = b[k];
  }
  return a;
}

export async function loadDictionaries(moduleNames) {
  const dict = { en: readJson('legacy.en.json'), ne: readJson('legacy.ne.json') };
  for (const name of moduleNames) {
    const m = (await import(`../content/${name}.mjs`)).default;
    merge(dict.en, m.en || {});
    merge(dict.ne, m.ne || {});
  }
  return dict;
}

// --- text helpers ----------------------------------------------------------
const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”',
  ndash: '–', mdash: '—', hellip: '…', middot: '·', rarr: '→', larr: '←', times: '×', copy: '©', bull: '•',
};
export const decode = (s) =>
  String(s).replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, n) => {
    if (n[0] === '#') {
      const code = n[1].toLowerCase() === 'x' ? parseInt(n.slice(2), 16) : parseInt(n.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[n] ?? m;
  });
export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const isHtml = (v) => /<[a-z!/]/i.test(v);

// Old copy links to pages by their previous flat file names.
const PAGE_NAMES = ['teams', 'checklist', 'builder', 'presentation', 'clicktai', 'pricing', 'solutions', 'services', 'about',
  'contact', 'support', 'security', 'privacy', 'terms', 'user-guide', 'android',
  'solutions-schools', 'solutions-healthcare', 'solutions-banks', 'solutions-ngos', 'solutions-hotels', 'solutions-restaurants', 'solutions-construction'];
export function rewriteLinks(s) {
  return s.replace(/href="(?:\.\/)?([a-z-]+)\.html(#[^"]*)?"/g, (m, name, frag = '') => {
    if (name === 'index') return `href="/${frag}"`;
    if (name === 'google-play-store') return 'href="/pages/android.html"';
    if (name === 'playbook' || name === 'at-work') return 'href="/"';
    return PAGE_NAMES.includes(name) ? `href="/pages/${name}.html${frag}"` : m;
  });
}

// --- per-page registry -----------------------------------------------------
export function createPage(dict, id) {
  const used = new Map(); // key -> 'text' | 'html'
  const jsKeys = new Set();
  const missing = new Set();

  const walk = (lang, key) => {
    let n = dict[lang];
    for (const p of key.split('.')) {
      if (n == null || typeof n !== 'object') return undefined;
      n = n[p];
    }
    return typeof n === 'string' ? rewriteLinks(n) : undefined;
  };
  const raw = (key) => {
    const v = walk('en', key);
    if (v === undefined) { missing.add(key); return key; }
    return v;
  };

  // tx: bare text/HTML for contexts that cannot hold a wrapper (<option>, attributes).
  const tx = (key) => {
    const v = raw(key);
    const m = isHtml(v) ? 'html' : 'text';
    used.set(key, m);
    return m === 'html' ? v : esc(decode(v));
  };
  // t: inline span that the language toggle can translate in place.
  const t = (key) => {
    const v = raw(key);
    const m = isHtml(v) ? 'html' : 'text';
    used.set(key, m);
    return `<span data-i18n${m === 'html' ? '-html' : ''}="${key}">${m === 'html' ? v : esc(decode(v))}</span>`;
  };
  // tl: link label whose trailing arrow (→) is dropped; an icon supplies the arrow instead.
  const tl = (key) => {
    const v = raw(key);
    used.set(key, 'text');
    return `<span data-i18n="${key}" data-trim="1">${esc(decode(v).replace(/\s*[→←]\s*$/, ''))}</span>`;
  };
  const text = (key) => { // plain decoded text for attributes / JSON
    const v = raw(key);
    used.set(key, isHtml(v) ? 'html' : 'text');
    return decode(v.replace(/<[^>]+>/g, ''));
  };
  const e = (tag, key, attrs = '') => {
    const v = raw(key);
    const m = isHtml(v) ? 'html' : 'text';
    used.set(key, m);
    const body = m === 'html' ? v : esc(decode(v));
    return `<${tag}${attrs ? ' ' + attrs : ''} data-i18n${m === 'html' ? '-html' : ''}="${key}">${body}</${tag}>`;
  };
  // at({ 'aria-label': 'key', alt: 'key2' }) -> attribute string with i18n hooks
  const at = (map) => {
    const parts = [];
    const hooks = [];
    for (const [attr, key] of Object.entries(map)) {
      used.set(key, 'text');
      parts.push(`${attr}="${esc(decode(raw(key).replace(/<[^>]+>/g, '')))}"`);
      hooks.push(`${attr}:${key}`);
    }
    return `${parts.join(' ')} data-i18n-attr="${hooks.join(',')}"`;
  };
  // Strings the page's JavaScript needs at runtime (English inlined into the page).
  const js = (key) => { jsKeys.add(key); used.set(key, 'text'); return decode(raw(key)); };

  const neBundle = () => {
    const out = {};
    for (const [key, mode] of used) {
      let v = walk('ne', key);
      if (v === undefined) v = walk('en', key);
      if (v === undefined) continue;
      out[key] = mode === 'html' ? v : decode(v);
    }
    return out;
  };
  const jsEn = () => Object.fromEntries([...jsKeys].map((k) => [k, decode(walk('en', k) ?? k)]));

  // Register keys used inside an extracted HTML fragment (legal pages, guide).
  const scan = (html) => {
    for (const m of html.matchAll(/data-i18n(-html)?="([^"]+)"/g)) used.set(m[2], m[1] ? 'html' : 'text');
    for (const m of html.matchAll(/data-i18n-attr="([^"]+)"/g)) {
      for (const pair of m[1].split(',')) {
        const key = pair.slice(pair.indexOf(':') + 1).trim();
        if (key) used.set(key, 'text');
      }
    }
    return html;
  };

  return { id, t, tx, tl, text, e, at, js, scan, neBundle, jsEn, used, missing, has: (k) => walk('en', k) !== undefined, raw };
}
