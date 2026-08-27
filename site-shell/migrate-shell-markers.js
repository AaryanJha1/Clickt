#!/usr/bin/env node
/*
 * One-time migration helper for the shared Clickt shell.
 *
 * It replaces a page's copied platform strip, first document header, and
 * footer with explicit markers. `build-shell.js` then renders the shared
 * partials. It deliberately leaves <head>, <main>, and page content alone.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const shellDir = __dirname;
const siteRoot = path.resolve(shellDir, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(shellDir, "shell-data.json"), "utf8"));
const write = process.argv.includes("--write");
const requested = process.argv.filter((arg) => arg.endsWith(".html"));
const pages = requested.length ? requested : manifest.marketingPages;

function marker(type) {
    return `<!-- site-shell:${type} -->`;
}

function hasManagedBlock(html, type) {
    return html.includes(`<!-- SITE-SHELL:${type.toUpperCase()}:START -->`) || html.includes(marker(type));
}

function findMatchingDivEnd(html, start) {
    const tags = /<\/?div\b[^>]*>/gi;
    tags.lastIndex = start;
    let depth = 0;
    let match;
    while ((match = tags.exec(html))) {
        if (match[0].startsWith("</")) depth -= 1;
        else depth += 1;
        if (depth === 0) return tags.lastIndex;
    }
    return -1;
}

function replaceUtility(html) {
    if (hasManagedBlock(html, "utility")) return { html, result: "managed" };
    const utility = /<div\s+class=(['"])[^'"]*\bplatform-strip\b[^'"]*\1[^>]*>[\s\S]*?<\/div>\s*/i;
    if (utility.test(html)) return { html: html.replace(utility, `${marker("utility")}\n`), result: "replaced" };
    const body = /<body\b[^>]*>/i;
    if (!body.test(html)) return { html, result: "missing" };
    return { html: html.replace(body, (match) => `${match}\n    ${marker("utility")}`), result: "inserted" };
}

function replaceHeader(html) {
    if (hasManagedBlock(html, "header")) return { html, result: "managed" };
    const start = html.search(/<header\b[^>]*>/i);
    if (start !== -1) {
        const endTag = html.search(/<\/header\s*>/i, start);
        if (endTag === -1) return { html, result: "invalid" };
        const end = html.indexOf(">", endTag) + 1;
        return { html: html.slice(0, start) + marker("header") + html.slice(end), result: "replaced" };
    }
    const main = html.search(/<main\b/i);
    if (main === -1) return { html, result: "missing" };
    return { html: html.slice(0, main) + `    ${marker("header")}\n        ` + html.slice(main), result: "inserted" };
}

function replaceFooter(html) {
    if (hasManagedBlock(html, "footer")) return { html, result: "managed" };
    const footerStart = html.toLowerCase().lastIndexOf("<footer");
    if (footerStart === -1) {
        const bodyEnd = html.search(/<\/body\s*>/i);
        if (bodyEnd === -1) return { html, result: "missing" };
        return { html: html.slice(0, bodyEnd) + `    ${marker("footer")}\n` + html.slice(bodyEnd), result: "inserted" };
    }
    const closing = html.indexOf("</footer>", footerStart);
    if (closing === -1) return { html, result: "invalid" };
    const footerEnd = closing + "</footer>".length;

    // Old pages wrap their footer in .footer-shell. Remove that outer wrapper
    // too: the shared footer template supplies its own full-width container.
    const beforeFooter = html.slice(0, footerStart);
    const wrapperStart = beforeFooter.lastIndexOf("<div");
    if (wrapperStart !== -1) {
        const openerEnd = html.indexOf(">", wrapperStart);
        const opener = html.slice(wrapperStart, openerEnd + 1);
        const wrapperEnd = findMatchingDivEnd(html, wrapperStart);
        if (/\bfooter-shell\b/i.test(opener) && wrapperEnd !== -1 && wrapperEnd >= footerEnd) {
            return { html: html.slice(0, wrapperStart) + marker("footer") + html.slice(wrapperEnd), result: "replaced-wrapper" };
        }
    }
    return { html: html.slice(0, footerStart) + marker("footer") + html.slice(footerEnd), result: "replaced" };
}

let failures = 0;
pages.forEach((name) => {
    const file = path.resolve(siteRoot, name);
    if (!file.startsWith(siteRoot + path.sep) || !fs.existsSync(file)) {
        failures += 1;
        process.stdout.write(`MISSING ${name}\n`);
        return;
    }
    const original = fs.readFileSync(file, "utf8");
    const utility = replaceUtility(original);
    const header = replaceHeader(utility.html);
    const footer = replaceFooter(header.html);
    const changed = footer.html !== original;
    const report = `${name}: utility=${utility.result}, header=${header.result}, footer=${footer.result}`;
    if (write && changed) fs.writeFileSync(file, footer.html);
    process.stdout.write(`${write && changed ? "WROTE" : "READY"} ${report}\n`);
    if ([utility.result, header.result, footer.result].some((result) => result === "missing" || result === "invalid")) failures += 1;
});

if (!write) process.stdout.write("Run again with --write to apply the marker migration.\n");
process.exitCode = failures ? 1 : 0;
