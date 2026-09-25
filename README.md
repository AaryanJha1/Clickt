# click-t.com

The Clickt / Click T website. Static HTML, CSS and JavaScript, served by GitHub Pages
(`CNAME` → `click-t.com`). No framework, no runtime dependencies.

## Layout

```
index.html              Home (generated)
404.html                Not-found page; also forwards old flat URLs (/teams.html → /pages/teams.html)
privacy.html            ┐
terms.html              │ Tiny redirects to /pages/… — the iOS/Android apps and store
support.html            │ listings link to these URLs, so they must keep working.
user-guide.html         ┘
CNAME  robots.txt  sitemap.xml  .nojekyll

pages/                  Every other page (generated), plus pitch-deck.html
assets/css/             base · ui · scenes · home · pages
assets/js/              app (header, language, reveal) · scenes · home · pricing · services · …
assets/img/             brand · phone · tablet · desktop · android   (WebP, only what is used)
assets/fonts/           Self-hosted: Instrument Serif, Inter, Noto Sans Devanagari, Tiro Devanagari Hindi
assets/i18n/            One small Nepali bundle per page (generated)
tools/                  The build (see below)
```

## Editing

Pages are generated. Edit the sources, then rebuild:

```sh
node tools/build.mjs     # writes every page, the Nepali bundles, sitemap.xml and robots.txt
node tools/check.mjs     # verifies every link, asset and anchor; lists unused assets
python3 -m http.server 8000   # preview at http://localhost:8000
```

- **Copy** (English + Nepali, side by side): `tools/content/*.mjs`. Older copy that has not been
  rewritten still lives in `tools/content/legacy.{en,ne}.json`. `fixes.mjs` overrides it where
  it was out of date.
- **Page templates**: `tools/pages/*.mjs`. **Shared header/footer**: `tools/lib/shell.mjs`.
- **Interactive scenes** (approve-and-apply, claim, reminders, charts, decks…): markup in
  `tools/lib/scenes.mjs`, behaviour in `assets/js/scenes.js`, styling in `assets/css/scenes.css`.
- **Page list, titles, scripts**: `tools/pages.config.mjs`. **Privacy, Terms and User Guide**
  text is kept verbatim in `tools/content/*.main.html`.
- **New screenshots**: drop optimised WebP files into `assets/img/<device>/` and reference them
  from a template. Run `node tools/check.mjs` afterwards to catch anything unused.

English is written into the HTML (works without JavaScript, good for search). The language
toggle loads the page's Nepali bundle on demand and swaps text in place.

## Deploying

Commit the generated files. There is no build step on the server.
