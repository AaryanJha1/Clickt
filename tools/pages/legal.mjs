import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from '../lib/core.mjs';

// Privacy and Terms: the legal text is kept exactly as written; only the page frame is new.
export default function legal(p, def) {
  const html = p.scan(fs.readFileSync(path.join(ROOT, `tools/content/${def.id}.main.html`), 'utf8'));
  return `<section class="legal"><div class="wrap wrap--prose"><article class="prose">${html}</article></div></section>`;
}
