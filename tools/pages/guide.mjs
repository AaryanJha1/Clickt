import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from '../lib/core.mjs';

export default function guide(p) {
  const html = p.scan(fs.readFileSync(path.join(ROOT, 'tools/content/user-guide.main.html'), 'utf8'));
  return `<section class="legal legal--guide"><div class="wrap">${html.replace('<main class="guide-layout">', '').replace(/<\/main>\s*$/, '')}</div></section>`.replace(/^(<section[^>]*><div class="wrap">)/, '$1<div class="guide-layout">') + '</div>';
}
