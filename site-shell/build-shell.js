#!/usr/bin/env node
/*
 * Minimal static partial builder for Clickt's shared utility strip, header,
 * and footer. It intentionally changes only explicit shell markers (or prior
 * generated shell blocks), never metadata or page-specific main content.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const shellDir = __dirname;
const siteRoot = path.resolve(shellDir, "..");
const data = JSON.parse(fs.readFileSync(path.join(shellDir, "shell-data.json"), "utf8"));
const templates = {
    utility: fs.readFileSync(path.join(shellDir, "utility.html"), "utf8").trim(),
    header: fs.readFileSync(path.join(shellDir, "header.html"), "utf8").trim(),
    footer: fs.readFileSync(path.join(shellDir, "footer.html"), "utf8").trim()
};

function usage(exitCode) {
    const message = `
Usage:
  node site-shell/build-shell.js --check [--all | page.html ...]
  node site-shell/build-shell.js --write [--with-scripts] [--all | page.html ...]
  node site-shell/build-shell.js --print utility|header|footer [page.html]

Markers expected in a page:
  <!-- site-shell:utility -->  outside the page's .container
  <!-- site-shell:header -->   inside the page's .container
  <!-- site-shell:footer -->   after page content

--check          Default. Reports shell-marker readiness without writing.
--write          Replaces only the markers (or existing generated blocks).
--with-scripts   Installs the i18n/en.js → i18n/ne.js → shell-i18n.js →
                 i18n.js stack when needed, then adds shell-runtime.js before
                 </body>. Existing scripts stay in place.
--all            Checks or writes every top-level marketing page in the manifest.
--print          Prints one rendered partial; useful while composing a new page.
`;
    process.stdout.write(message);
    process.exit(exitCode);
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function pageNameFor(file) {
    return path.basename(file);
}

function isCurrent(item, pageName) {
    return path.basename(item.href) === pageName;
}

function renderLink(item, pageName, options) {
    const opts = options || {};
    const classes = [];
    if (opts.className) classes.push(opts.className);
    if (isCurrent(item, pageName)) classes.push("is-current");
    const attributes = [
        `href="${escapeHtml(item.href)}"`,
        `data-i18n="${escapeHtml(item.key)}"`
    ];
    if (classes.length) attributes.push(`class="${classes.join(" ")}"`);
    if (opts.role) attributes.push(`role="${opts.role}"`);
    if (isCurrent(item, pageName)) attributes.push('aria-current="page"');
    return `<a ${attributes.join(" ")}>${escapeHtml(item.en)}</a>`;
}

function indent(value, spaces) {
    const prefix = " ".repeat(spaces);
    return value.split("\n").map((line) => line ? prefix + line : line).join("\n");
}

function replaceTokens(template, values) {
    return template.replace(/\{\{([A-Z_]+)\}\}/g, function (match, key) {
        if (!Object.prototype.hasOwnProperty.call(values, key)) {
            throw new Error(`No renderer value supplied for ${match}`);
        }
        return values[key];
    });
}

function renderUtility() {
    return templates.utility;
}

function renderHeader(pageName) {
    const productLinks = data.header.product
        .map((item) => indent(renderLink(item, pageName, { role: "menuitem" }), 20))
        .join("\n");
    const directLinks = data.header.direct
        .map((item) => indent(renderLink(item, pageName, { className: "shared-site-header-link" }), 8))
        .join("\n");
    const mobileProductLinks = data.header.product
        .map((item) => indent(renderLink(item, pageName), 12))
        .join("\n");
    const mobileDirectLinks = data.header.direct
        .map((item) => indent(renderLink(item, pageName), 12))
        .join("\n");

    return replaceTokens(templates.header, {
        PRODUCT_LINKS: productLinks,
        DIRECT_LINKS: directLinks,
        MOBILE_PRODUCT_LINKS: mobileProductLinks,
        MOBILE_DIRECT_LINKS: mobileDirectLinks
    });
}

function renderFooterGroups(pageName) {
    return data.footer.groups.map(function (group) {
        const titleId = `site-shell-footer-${group.id}`;
        const links = group.links.map(function (item) {
            return `        <li>${renderLink(item, pageName)}</li>`;
        }).join("\n");
        return [
            `    <section class="shared-footer-group shared-footer-group--${escapeHtml(group.id)}" aria-labelledby="${titleId}">`,
            `        <h2 id="${titleId}" data-i18n="${escapeHtml(group.key)}">${escapeHtml(group.en)}</h2>`,
            "        <ul>",
            links,
            "        </ul>",
            "    </section>"
        ].join("\n");
    }).join("\n");
}

function renderFooter(pageName) {
    return replaceTokens(templates.footer, {
        FOOTER_GROUPS: indent(renderFooterGroups(pageName), 0)
    });
}

function blockStart(type) {
    return `<!-- SITE-SHELL:${type.toUpperCase()}:START -->`;
}

function blockEnd(type) {
    return `<!-- SITE-SHELL:${type.toUpperCase()}:END -->`;
}

function marker(type) {
    return `<!-- site-shell:${type} -->`;
}

function block(type, markup) {
    return `${blockStart(type)}\n${markup}\n${blockEnd(type)}`;
}

function countOccurrences(value, needle) {
    return value.split(needle).length - 1;
}

function replaceShellBlock(html, type, markup) {
    const start = blockStart(type);
    const end = blockEnd(type);
    const blockPattern = new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`, "g");
    const blocks = html.match(blockPattern) || [];
    if (blocks.length > 1) {
        return { html, changed: false, status: "error", message: `multiple generated ${type} blocks` };
    }
    if (blocks.length === 1) {
        const next = html.replace(blockPattern, block(type, markup));
        return { html: next, changed: next !== html, status: "managed", message: "updated managed block" };
    }

    const token = marker(type);
    const markerCount = countOccurrences(html, token);
    if (markerCount > 1) {
        return { html, changed: false, status: "error", message: `multiple ${token} markers` };
    }
    if (markerCount === 1) {
        return { html: html.replace(token, block(type, markup)), changed: true, status: "marker", message: "inserted generated block" };
    }
    return { html, changed: false, status: "missing", message: "no marker or generated block" };
}

function hasScript(html, srcPart) {
    return new RegExp(`<script\\b[^>]*\\bsrc=(['\"])${escapeRegExp(srcPart)}(?:\\?[^'\"]*)?\\1[^>]*>\\s*<\\/script>`, "i").test(html);
}

function scriptTag(src) {
    return `<script src="${src}"></script>`;
}

function insertBeforeBodyClose(html, markup) {
    if (!/<\/body>/i.test(html)) return null;
    return html.replace(/<\/body>/i, `${markup}\n</body>`);
}

function ensureI18nStack(html) {
    let next = html;
    const notes = [];
    const stack = [
        { name: "i18n/en.js", source: data.assets.i18nEnglish, match: "i18n/en.js" },
        { name: "i18n/ne.js", source: data.assets.i18nNepali, match: "i18n/ne.js" },
        { name: "shell-i18n.js", source: `site-shell/shell-i18n.js?v=${data.version}`, match: "site-shell/shell-i18n.js" }
    ];
    const coreSource = data.assets.i18nCore;

    if (hasScript(next, "i18n.js")) {
        const missing = stack.filter(function (entry) { return !hasScript(next, entry.match); });
        if (missing.length) {
            const corePattern = /<script\b[^>]*\bsrc=(['"])i18n\.js(?:\?[^'"]*)?\1[^>]*>\s*<\/script>/i;
            next = next.replace(corePattern, `${missing.map((entry) => scriptTag(entry.source)).join("\n    ")}\n    $&`);
            notes.push(`inserted ${missing.map((entry) => entry.name).join(", ")} before existing i18n.js`);
        }
        return { html: next, changed: next !== html, notes };
    }

    const missing = stack.filter(function (entry) { return !hasScript(next, entry.match); });
    const additions = missing.map(function (entry) { return scriptTag(entry.source); });
    additions.push(scriptTag(coreSource));
    const withStack = insertBeforeBodyClose(next, `    ${additions.join("\n    ")}`);
    if (withStack === null) {
        notes.push("could not install i18n stack (no closing body tag found)");
    } else {
        next = withStack;
        notes.push(`installed ${missing.map((entry) => entry.name).concat(["i18n.js"]).join(", ")}`);
    }
    return { html: next, changed: next !== html, notes };
}

function ensureShellScripts(html) {
    let next = html;
    const notes = [];

    if (!hasScript(next, "site-shell/shell-i18n.js")) {
        const i18nCore = /<script\b[^>]*\bsrc=(['"])i18n\.js(?:\?[^'"]*)?\1[^>]*>\s*<\/script>/i;
        if (i18nCore.test(next)) {
            next = next.replace(i18nCore, `<script src="site-shell/shell-i18n.js?v=${data.version}"></script>\n    $&`);
            notes.push("inserted shell-i18n.js");
        } else {
            notes.push("could not insert shell-i18n.js (no i18n.js script found)");
        }
    }

    if (!hasScript(next, "site-shell/shell-runtime.js")) {
        if (/<\/body>/i.test(next)) {
            next = next.replace(/<\/body>/i, `    <script src="site-shell/shell-runtime.js?v=${data.version}"></script>\n</body>`);
            notes.push("inserted shell-runtime.js");
        } else {
            notes.push("could not insert shell-runtime.js (no closing body tag found)");
        }
    }

    return { html: next, changed: next !== html, notes };
}

function resolvePage(input) {
    const absolute = path.resolve(siteRoot, input);
    if (!absolute.startsWith(siteRoot + path.sep)) {
        throw new Error(`Page must be inside clickt-main: ${input}`);
    }
    if (path.extname(absolute).toLowerCase() !== ".html") {
        throw new Error(`Page must be an .html file: ${input}`);
    }
    return absolute;
}

function parseArgs(argv) {
    const state = { mode: "check", all: false, withScripts: false, print: null, pages: [] };
    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === "--help" || arg === "-h") usage(0);
        if (arg === "--check") { state.mode = "check"; continue; }
        if (arg === "--write") { state.mode = "write"; continue; }
        if (arg === "--all") { state.all = true; continue; }
        if (arg === "--with-scripts") { state.withScripts = true; continue; }
        if (arg === "--print") {
            const type = argv[index + 1];
            if (!["utility", "header", "footer"].includes(type)) {
                throw new Error("--print requires utility, header, or footer");
            }
            state.print = type;
            index += 1;
            continue;
        }
        if (arg.startsWith("-")) throw new Error(`Unknown option: ${arg}`);
        state.pages.push(arg);
    }
    return state;
}

function main() {
    const state = parseArgs(process.argv.slice(2));
    if (state.print) {
        const page = pageNameFor(state.pages[0] || "index.html");
        const output = state.print === "utility"
            ? renderUtility()
            : state.print === "header"
                ? renderHeader(page)
                : renderFooter(page);
        process.stdout.write(`${output}\n`);
        return;
    }

    const namedPages = state.all || state.pages.length === 0 ? data.marketingPages : state.pages;
    const pages = namedPages.map(resolvePage);
    let hasError = false;
    let writeCount = 0;

    pages.forEach(function (absolute) {
        const relative = path.relative(siteRoot, absolute);
        if (!fs.existsSync(absolute)) {
            process.stdout.write(`MISSING  ${relative}\n`);
            hasError = true;
            return;
        }

        let html = fs.readFileSync(absolute, "utf8");
        const original = html;
        const pageName = pageNameFor(absolute);
        const results = [
            ["utility", renderUtility()],
            ["header", renderHeader(pageName)],
            ["footer", renderFooter(pageName)]
        ].map(function (entry) {
            const result = replaceShellBlock(html, entry[0], entry[1]);
            html = result.html;
            return [entry[0], result];
        });

        if (state.mode === "write" && state.withScripts) {
            const scriptResult = ensureShellScripts(html);
            html = scriptResult.html;
            scriptResult.notes.forEach(function (note) {
                process.stdout.write(`NOTE     ${relative} ${note}\n`);
            });
        }

        results.forEach(function (entry) {
            const type = entry[0];
            const result = entry[1];
            const label = result.status === "error" ? "ERROR" : result.status === "missing" ? "MISSING" : "READY";
            process.stdout.write(`${label.padEnd(8)} ${relative} ${type}: ${result.message}\n`);
            if (result.status === "error") hasError = true;
        });

        if (state.mode === "write" && html !== original) {
            fs.writeFileSync(absolute, html);
            writeCount += 1;
        }
    });

    if (state.mode === "write") process.stdout.write(`\nUpdated ${writeCount} page(s).\n`);
    if (hasError) process.exitCode = 1;
}

try {
    main();
} catch (error) {
    process.stderr.write(`site-shell: ${error.message}\n`);
    process.exitCode = 1;
}
