/* Privacy-preserving interaction hooks.
   This file does not send data anywhere. It dispatches a browser event and,
   only when a consented analytics integration has created window.dataLayer,
   adds a minimal event object for that integration to collect. */
(function () {
    "use strict";

    function track(name, detail) {
        var event = { event: name, page: window.location.pathname };
        if (detail) Object.keys(detail).forEach(function (key) { event[key] = detail[key]; });
        document.dispatchEvent(new CustomEvent("clickt:analytics", { detail: event }));
        if (Array.isArray(window.dataLayer)) window.dataLayer.push(event);
    }

    document.addEventListener("click", function (event) {
        var link = event.target.closest && event.target.closest("a");
        if (!link) return;
        var href = link.getAttribute("href") || "";
        if (href.indexOf("apps.apple.com") !== -1) track("download_click");
        else if (href.indexOf("contact.html#project") !== -1 || href === "#project") track("project_brief_cta_click");
        else if (href.indexOf("services.html") !== -1) track("services_cta_click");
        else if (href.indexOf("clicktai.html") !== -1) track("clicktai_cta_click");
    });

    document.addEventListener("focusin", function (event) {
        var form = event.target.closest && event.target.closest("form");
        if (form && !form.dataset.analyticsStarted) {
            form.dataset.analyticsStarted = "true";
            track("project_brief_start", { form: form.id || "form" });
        }
    });

    document.addEventListener("submit", function (event) {
        var form = event.target;
        if (form && form.matches && form.matches("form")) track("project_brief_submit", { form: form.id || "form" });
    });

    window.ClicktAnalytics = { track: track };
}());
