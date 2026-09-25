#!/usr/bin/env node
// Verifies the built site: every local link/asset exists, in-page anchors resolve,
// and reports assets nothing references.   node tools/check.mjs
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './lib/core.mjs';

const walk = (d, out = []) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'tools' || e.name === 'node_modules') continue;
    const f = path.join(d, e.name);
    e.isDirectory() ? walk(f, out) : out.push(f);
  }
  return out;
};
const files = walk(ROOT);
const html = files.filter((f) => f.endsWith('.html'));
const text = files.filter((f) => /\.(html|css|js)$/.test(f));
const referenced = new Set();
const problems = [];

const resolve = (from, ref) => {
  const clean = decodeURIComponent(ref.split('#')[0].split('?')[0]);
  if (!clean) return null;
  return clean.startsWith('/') ? path.join(ROOT, clean) : path.resolve(path.dirname(from), clean);
};
for (const f of text) {
  const s = fs.readFileSync(f, 'utf8');
  for (const m of s.matchAll(/(?:href|src)=["']([^"']+)["']|url\(["']?([^"')]+)["']?\)/g)) {
    const ref = m[1] || m[2];
    if (!ref || /^(https?:|mailto:|tel:|data:|javascript:|#|%23)/.test(ref)) continue;
    let target = resolve(f, ref);
    if (!target) continue;
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    referenced.add(target);
    if (!fs.existsSync(target)) problems.push(`${path.relative(ROOT, f)} → missing ${ref}`);
  }
}
// JS-built image paths and the Nepali bundles
for (const f of text) {
  const s = fs.readFileSync(f, 'utf8');
  for (const m of s.matchAll(/\/assets\/[A-Za-z0-9_\-./]+/g)) referenced.add(path.join(ROOT, m[0]));
}
// anchors
for (const f of html) {
  const s = fs.readFileSync(f, 'utf8');
  const ids = new Set([...s.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const m of s.matchAll(/href="#([^"]+)"/g)) if (!ids.has(m[1])) problems.push(`${path.relative(ROOT, f)} → anchor #${m[1]} not found`);
  for (const m of s.matchAll(/href="([^"#]+\.html)#([^"]+)"/g)) {
    const t = resolve(f, m[1]);
    if (t && fs.existsSync(t)) {
      const ts = fs.readFileSync(t, 'utf8');
      if (!new RegExp(`\\sid="${m[2]}"`).test(ts)) problems.push(`${path.relative(ROOT, f)} → ${m[1]}#${m[2]} not found`);
    }
  }
}
const unused = files.filter((f) => /\/assets\/(img|media|fonts)\//.test(f) && !referenced.has(f));
console.log(`${html.length} pages, ${referenced.size} references checked.`);
if (problems.length) { console.log('\nPROBLEMS:'); [...new Set(problems)].forEach((p) => console.log('  ' + p)); }
if (unused.length) { console.log('\nUNUSED ASSETS:'); unused.forEach((u) => console.log('  ' + path.relative(ROOT, u))); }
if (!problems.length) console.log('No broken links.');
process.exit(problems.length ? 1 : 0);
