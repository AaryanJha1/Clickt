/* Shared-shell interaction layer. See site-shell/README.md for load order. */
(function () {
    "use strict";

    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback, { once: true });
        } else {
            callback();
        }
    }

    ready(function () {
        var dropdowns = Array.prototype.slice.call(document.querySelectorAll("[data-site-shell-dropdown]"));
        if (!dropdowns.length) return;

        function triggerFor(dropdown) {
            return dropdown.querySelector("[data-site-shell-dropdown-trigger]");
        }

        function linksFor(dropdown) {
            return Array.prototype.slice.call(dropdown.querySelectorAll(".nav-dropdown-menu a"));
        }

        function close(dropdown) {
            dropdown.classList.remove("is-open");
            var trigger = triggerFor(dropdown);
            if (trigger) trigger.setAttribute("aria-expanded", "false");
        }

        function open(dropdown) {
            dropdowns.forEach(function (other) {
                if (other !== dropdown) close(other);
            });
            dropdown.classList.add("is-open");
            var trigger = triggerFor(dropdown);
            if (trigger) trigger.setAttribute("aria-expanded", "true");
        }

        function toggle(dropdown) {
            if (dropdown.classList.contains("is-open")) {
                close(dropdown);
            } else {
                open(dropdown);
            }
        }

        /*
         * Capture phase deliberately isolates the new shared shell from the
         * legacy, per-page dropdown snippets that still exist while pages are
         * being migrated. It can be removed once those snippets are deleted.
         */
        document.addEventListener("click", function (event) {
            var trigger = event.target.closest && event.target.closest("[data-site-shell-dropdown-trigger]");
            if (trigger) {
                var dropdown = trigger.closest("[data-site-shell-dropdown]");
                if (!dropdown) return;
                event.preventDefault();
                event.stopPropagation();
                toggle(dropdown);
                return;
            }

            var withinOpenShell = event.target.closest && event.target.closest("[data-site-shell-dropdown].is-open");
            if (!withinOpenShell) dropdowns.forEach(close);
        }, true);

        document.addEventListener("keydown", function (event) {
            var trigger = event.target.closest && event.target.closest("[data-site-shell-dropdown-trigger]");
            if (event.key === "Escape") {
                dropdowns.forEach(close);
                return;
            }
            if (!trigger) return;

            var dropdown = trigger.closest("[data-site-shell-dropdown]");
            if (!dropdown) return;
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                open(dropdown);
                var links = linksFor(dropdown);
                var target = event.key === "ArrowDown" ? links[0] : links[links.length - 1];
                if (target) target.focus();
            }
        });

        document.querySelectorAll("[data-site-shell-mobile-nav] a").forEach(function (link) {
            link.addEventListener("click", function () {
                var details = link.closest("details");
                if (details) details.open = false;
            });
        });
    });
}());
