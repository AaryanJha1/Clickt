/* Scroll-reveal for content pages that don't load the full script.js.
   Mirrors initScrollReveal() in script.js — same [data-observe] / .is-visible
   contract, same CSS in styles.css — so behavior matches the homepage. */
(function () {
    "use strict";

    var observedItems = Array.prototype.slice.call(document.querySelectorAll("[data-observe]"));
    if (!observedItems.length) return;

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        observedItems.forEach(function (item) { item.classList.add("is-visible"); });
        return;
    }

    if (!("IntersectionObserver" in window)) {
        observedItems.forEach(function (item) { item.classList.add("is-visible"); });
        return;
    }

    // threshold is a fraction of the *target's own* area, so a section taller
    // than ~4x the viewport (e.g. a long card grid) can scroll past without
    // ever reaching 0.24 and would stay invisible forever. A low threshold
    // fires as soon as any sliver enters view, regardless of target height.
    var observer = new IntersectionObserver(
        function (entries, io) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                io.unobserve(entry.target);
            });
        },
        {
            threshold: 0.01,
            rootMargin: "0px 0px -8% 0px",
        }
    );

    observedItems.forEach(function (item) { observer.observe(item); });
})();
