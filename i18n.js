(function () {
    "use strict";

    var STORAGE_KEY = "clickt-lang";
    var DEFAULT_LANG = "en";
    var SUPPORTED = ["en", "ne"];

    var dicts = (window.ClicktI18nDict = window.ClicktI18nDict || {});
    var currentLang = DEFAULT_LANG;

    function getQueryLang() {
        var match = /[?&]lang=([^&]+)/.exec(window.location.search);
        return match ? decodeURIComponent(match[1]) : null;
    }

    function detectInitialLang() {
        var fromQuery = getQueryLang();
        if (fromQuery && SUPPORTED.indexOf(fromQuery) !== -1) {
            try { localStorage.setItem(STORAGE_KEY, fromQuery); } catch (e) {}
            return fromQuery;
        }
        try {
            var stored = localStorage.getItem(STORAGE_KEY);
            if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
        } catch (e) {}
        return DEFAULT_LANG;
    }

    function resolveKey(dict, key) {
        var parts = key.split(".");
        var node = dict;
        for (var i = 0; i < parts.length; i++) {
            if (node == null || typeof node !== "object") return undefined;
            node = node[parts[i]];
        }
        return node;
    }

    function interpolate(str, vars) {
        if (!vars) return str;
        return str.replace(/\{(\w+)\}/g, function (match, name) {
            return Object.prototype.hasOwnProperty.call(vars, name) ? vars[name] : match;
        });
    }

    function t(key, vars) {
        var value = resolveKey(dicts[currentLang], key);
        if (value === undefined && currentLang !== DEFAULT_LANG) {
            value = resolveKey(dicts[DEFAULT_LANG], key);
        }
        if (value === undefined) {
            console.warn("[i18n] missing key:", key);
            return key;
        }
        return typeof value === "string" ? interpolate(value, vars) : value;
    }

    function applyDom(root) {
        root = root || document.body;

        root.querySelectorAll("[data-i18n]").forEach(function (el) {
            var value = t(el.getAttribute("data-i18n"));
            if (typeof value === "string") el.textContent = value;
        });

        root.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
            el.getAttribute("data-i18n-attr").split(",").forEach(function (pair) {
                var idx = pair.indexOf(":");
                if (idx === -1) return;
                var attr = pair.slice(0, idx).trim();
                var value = t(pair.slice(idx + 1).trim());
                if (typeof value === "string") el.setAttribute(attr, value);
            });
        });

        root.querySelectorAll("[data-i18n-html]").forEach(function (el) {
            var value = t(el.getAttribute("data-i18n-html"));
            if (typeof value === "string") el.innerHTML = value;
        });
    }

    function updateSwitcherUI() {
        document.querySelectorAll("[data-lang]").forEach(function (btn) {
            var active = btn.getAttribute("data-lang") === currentLang;
            btn.classList.toggle("is-active", active);
            btn.setAttribute("aria-pressed", active ? "true" : "false");
        });
    }

    function applyLang(lang, opts) {
        opts = opts || {};
        currentLang = lang;
        document.documentElement.lang = lang;
        applyDom(document.body);
        updateSwitcherUI();
        if (!opts.silent) {
            document.dispatchEvent(new CustomEvent("clickt:langchange", { detail: { lang: lang } }));
        }
    }

    function setLang(lang) {
        if (SUPPORTED.indexOf(lang) === -1 || lang === currentLang) return;
        try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
        applyLang(lang);
    }

    document.addEventListener("click", function (event) {
        var btn = event.target.closest && event.target.closest("[data-lang]");
        if (!btn) return;
        setLang(btn.getAttribute("data-lang"));
    });

    // i18n/en.js and i18n/ne.js are loaded as plain <script> tags before this
    // file, so both dictionaries are already synchronously available here —
    // no fetch/async needed, which guarantees this DOM pass finishes before
    // script.js (loaded right after this file) runs its own init functions.
    currentLang = detectInitialLang();
    if (document.body) {
        applyLang(currentLang, { silent: true });
    } else {
        // This file is loaded in <head> on at least one page — document.body
        // doesn't exist yet during head parsing, so defer the DOM pass.
        document.addEventListener("DOMContentLoaded", function () {
            applyLang(currentLang, { silent: true });
        });
    }

    window.ClicktI18n = {
        t: t,
        lang: function () { return currentLang; },
        setLang: setLang,
        ready: Promise.resolve()
    };
})();
