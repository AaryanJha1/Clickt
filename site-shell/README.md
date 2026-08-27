# Clickt shared shell

This directory is the single source of truth for the shared platform strip,
header, footer, and their vocabulary. It is deliberately a tiny Node build
step so Clickt can remain a static-site deployment.

The generator does not rewrite a page's `<head>`, metadata, main content,
images, or page-specific scripts. It only replaces these explicit slots:

```html
<body class="example-page">
    <!-- site-shell:utility -->
    <div class="container">
        <!-- site-shell:header -->
        <main>
            <!-- page-specific content -->
        </main>
    </div>
    <!-- site-shell:footer -->

    <!-- i18n/en.js and i18n/ne.js stay first -->
    <script src="i18n/en.js"></script>
    <script src="i18n/ne.js"></script>
    <script src="site-shell/shell-i18n.js"></script>
    <script src="i18n.js"></script>
    <script src="site-shell/shell-runtime.js"></script>
</body>
```

The `utility` slot belongs outside `.container`; the `header` slot belongs
inside it. This mirrors the existing page structure and keeps the strip
full-width without introducing nested containers.

## What it generates

- The exact Product dropdown: Overview, Teams, Checklist, Builder,
  Presentation, ClicktAI, and Plans.
- Direct desktop links for Solutions, Services, About Click T, and Contact.
- A mobile navigation equivalent with the same destinations.
- The existing `Apple · Android` strip and compact `EN` / `ने` controls in
  the same strip. The accompanying CSS should position `.shared-platform-language`
  at the strip's right edge without increasing the header width.
- Footer groups for Product, Solutions (including all industry pages), Click T,
  Help, and Legal; contact details; and the normal-flow `Download Clickt` CTA.
  Support and User Guide appear only in the Help group, never in the header or
  Product dropdown.

The templates retain established classes such as `.platform-strip`,
`.page-header-nav`, `.nav-dropdown`, `.header-dropdown`, `.footer-columns`,
and `.footer-download-cta` so the existing stylesheet remains usable while
the shared-shell responsive styles are added.

## Commands

Run from `clickt-main`:

```sh
# Non-mutating readiness report for all planned marketing pages.
node site-shell/build-shell.js --check --all

# See a rendered partial before using it.
node site-shell/build-shell.js --print header solutions-schools.html

# Generate only pages that already contain all three markers.
node site-shell/build-shell.js --write --with-scripts --all

# Generate a selected page or page set.
node site-shell/build-shell.js --write --with-scripts solutions.html solutions-schools.html
```

`--write` is conservative: a page without a marker or a prior generated block
is reported as `MISSING` and is left unchanged. `--with-scripts` adds
`shell-i18n.js` immediately before the page's existing `i18n.js`, and adds
`shell-runtime.js` before `</body>`. It never adds i18n to a page that does
not already load `i18n.js`; add the existing i18n stack to such a new page
first.

## Migration rules

1. Replace each page's copied platform strip/header/footer markup with the
   three slots above. Keep its current surrounding `.container` where shown.
2. Delete the old per-page dropdown listener after the page has the generated
   shell. `shell-runtime.js` owns the Product dropdown, Escape handling, and
   mobile-menu close behavior. It has capture-phase protection during staged
   migration, but removing duplicate legacy code is still the clean end state.
3. Run the `--write --with-scripts` command and inspect the resulting diff.
4. Add the shared responsive styling in `styles.css` as a separate styling
   change. The required intent is: language toggle right-aligned in the utility
   strip, direct links never overflow, product menu is keyboard usable, and
   footer groups collapse cleanly at phone widths.
5. Run `--check --all` in CI or immediately before deployment. Every published
   marketing page should report `READY` for utility, header, and footer.

## Updating navigation or footer links

Edit only `shell-data.json`, then run the generator. `shell-i18n.js` contains
the matching English and Nepali strings used by the generated markup; update
both in the same change. Do not edit generated page shell blocks by hand.

`at-work.html` is intentionally not in the marketing-page manifest because it
should be a redirect to `solutions.html`, not another marketing-page shell.
