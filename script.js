(function () {
    const featureStacksController = initFeatureStacks();
    initScrollReveal();
    initFeatureSlider(featureStacksController);
    initTypingHeadline();
    initDeviceExperience();
    initWorkflowCounters();
})();

function initScrollReveal() {
    const observedItems = Array.from(document.querySelectorAll("[data-observe]"));
    if (!observedItems.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        observedItems.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, io) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                io.unobserve(entry.target);
            });
        },
        {
            threshold: 0.24,
            rootMargin: "0px 0px -12% 0px",
        }
    );

    observedItems.forEach((item) => observer.observe(item));
}

function initFeatureSlider(featureStacksController) {
    const sliderFrame = document.querySelector("[data-feature-slider]");
    if (!sliderFrame) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let rafId = 0;
    let direction = 1;
    let lastTime = 0;
    let reachedEndInCycle = false;
    const speedPxPerMs = 0.018;
    const canHoverPause = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const maxScroll = () => Math.max(0, sliderFrame.scrollWidth - sliderFrame.clientWidth);

    const tick = (time) => {
        if (!lastTime) lastTime = time;
        const delta = time - lastTime;
        lastTime = time;

        const max = maxScroll();
        if (max <= 0) {
            rafId = window.requestAnimationFrame(tick);
            return;
        }

        let next = sliderFrame.scrollLeft + direction * speedPxPerMs * delta;
        if (next >= max - 0.5) {
            next = max;
            direction = -1;
            reachedEndInCycle = true;
        } else if (next <= 0.5) {
            next = 0;
            direction = 1;
            if (reachedEndInCycle && featureStacksController?.nextDevice) {
                featureStacksController.nextDevice();
            }
            reachedEndInCycle = false;
        }

        sliderFrame.scrollLeft = next;
        rafId = window.requestAnimationFrame(tick);
    };

    const start = () => {
        if (rafId) return;
        lastTime = 0;
        rafId = window.requestAnimationFrame(tick);
    };

    const stop = () => {
        if (!rafId) return;
        window.cancelAnimationFrame(rafId);
        rafId = 0;
        lastTime = 0;
    };

    if (canHoverPause) {
        sliderFrame.addEventListener("pointerenter", stop);
        sliderFrame.addEventListener("pointerleave", start);
    }
    sliderFrame.addEventListener("focusin", stop);
    sliderFrame.addEventListener("focusout", (event) => {
        if (sliderFrame.contains(event.relatedTarget)) return;
        start();
    });

    window.addEventListener("resize", () => {
        const max = maxScroll();
        if (sliderFrame.scrollLeft > max) sliderFrame.scrollLeft = max;
    });

    start();
}

function initFeatureStacks() {
    const stacks = Array.from(document.querySelectorAll("[data-feature-stack]"));
    const switchButton = document.querySelector("[data-feature-device-switch]");
    if (!stacks.length) return null;

    const deviceOrder = ["iphone", "ipad", "mac"];
    let activeIndex = 0;

    const setDevice = (device) => {
        stacks.forEach((stack) => {
            const images = Array.from(stack.querySelectorAll(".feature-stack-image"));
            images.forEach((image) => {
                image.classList.toggle("is-active", image.dataset.device === device);
            });

            const label = stack.querySelector("[data-feature-device]");
            if (label) label.textContent = device.charAt(0).toUpperCase() + device.slice(1);
        });
    };

    const nextDevice = () => {
        activeIndex = (activeIndex + 1) % deviceOrder.length;
        setDevice(deviceOrder[activeIndex]);
    };

    setDevice(deviceOrder[0]);

    if (switchButton) {
        switchButton.addEventListener("click", nextDevice);
    }

    return { nextDevice };
}

function initTypingHeadline() {
    const headline = document.getElementById("typing-headline");
    if (!headline) return;

    const phrases = (headline.dataset.phrases || "")
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean);
    if (!phrases.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        headline.textContent = phrases[0];
        return;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeSpeed = 85;
    const deleteSpeed = 45;
    const holdAfterType = 1250;
    const holdAfterDelete = 250;

    const tick = () => {
        const currentPhrase = phrases[phraseIndex];

        if (!isDeleting) {
            charIndex += 1;
            headline.textContent = currentPhrase.slice(0, charIndex);
            if (charIndex === currentPhrase.length) {
                isDeleting = true;
                window.setTimeout(tick, holdAfterType);
                return;
            }
            window.setTimeout(tick, typeSpeed);
            return;
        }

        charIndex -= 1;
        headline.textContent = currentPhrase.slice(0, Math.max(0, charIndex));
        if (charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            window.setTimeout(tick, holdAfterDelete);
            return;
        }
        window.setTimeout(tick, deleteSpeed);
    };

    headline.textContent = "";
    window.setTimeout(tick, 220);
}

function initDeviceExperience() {
    const experience = document.getElementById("hero-device-experience");
    const track = document.getElementById("device-track");
    if (!experience || !track) return;

    const platformOrder = ["iphone", "ipad", "mac"];
    const platformButtons = Array.from(experience.querySelectorAll(".platform-pill"));
    const hotspotButtons = Array.from(experience.querySelectorAll("[data-module-target]"));
    const homeHotspots = Array.from(experience.querySelectorAll("[data-hotspots-home]"));
    const detailHotspots = Array.from(experience.querySelectorAll("[data-hotspots-detail]"));
    const detailHotspotButtons = Array.from(experience.querySelectorAll("[data-when-module]"));
    const screenImages = Array.from(experience.querySelectorAll("[data-platform-screen]"));
    const helpToggle = experience.querySelector(".device-help-inline");

    const imageMap = {
        iphone: {
            homepage: "IOS Promotion/Clickt Images/iphone-homepage.png",
            teams: "IOS Promotion/Clickt Images/iphone-team1.png",
            teams2: "IOS Promotion/Clickt Images/iphone-team2.png",
            teams3: "IOS Promotion/Clickt Images/iphone-team3.png",
            builder: "IOS Promotion/Clickt Images/iphone-builder1.png",
            builder2: "IOS Promotion/Clickt Images/iphone-builder2.png",
            presentation: "IOS Promotion/Clickt Images/iphone-presentation1.png",
            presentation2: "IOS Promotion/Clickt Images/iphone-presentation2.png",
            checklist: "IOS Promotion/Clickt Images/iphone-checklist.png",
            checklist2: "IOS Promotion/Clickt Images/iphone-checklist1.png",
            calendar: "IOS Promotion/Clickt Images/iphone-calendar1.png",
        },
        ipad: {
            homepage: "IOS Promotion/Clickt Images/ipad-homepage.png",
            teams: "IOS Promotion/Clickt Images/ipad-team1.png",
            teams2: "IOS Promotion/Clickt Images/ipad-team2.png",
            teams3: "IOS Promotion/Clickt Images/ipad-team3.png",
            builder: "IOS Promotion/Clickt Images/ipad-builder1.png",
            builder2: "IOS Promotion/Clickt Images/ipad-builder2.png",
            presentation: "IOS Promotion/Clickt Images/ipad-presentation1.png",
            presentation2: "IOS Promotion/Clickt Images/ipad-presentation2.png",
            checklist: "IOS Promotion/Clickt Images/ipad-checklist.png",
            checklist2: "IOS Promotion/Clickt Images/ipad-checklist.png",
            calendar: "IOS Promotion/Clickt Images/ipad-calendar.png",
        },
        mac: {
            homepage: "IOS Promotion/Clickt Images/Mac-homepage.png",
            teams: "IOS Promotion/Clickt Images/Mac-team1.png",
            teams2: "IOS Promotion/Clickt Images/Mac-team2.png",
            teams3: "IOS Promotion/Clickt Images/Mac-team3.png",
            builder: "IOS Promotion/Clickt Images/Mac-builder1.png",
            builder2: "IOS Promotion/Clickt Images/Mac-builder2.png",
            presentation: "IOS Promotion/Clickt Images/mac-presentation1.png",
            presentation2: "IOS Promotion/Clickt Images/mac-presentation2.png",
            checklist: "IOS Promotion/Clickt Images/Mac-checklist.png",
            checklist2: "IOS Promotion/Clickt Images/Mac-checklist.png",
            calendar: "IOS Promotion/Clickt Images/mac-calendar1.png",
        },
    };

    let activePlatformIndex = 0;
    let activeModule = "homepage";
    let autoplayTimerId = 0;

    const autoplaySequence = [
        { module: "teams", delay: 3500 },
        { module: "teams2", delay: 3500 },
        { module: "teams3", delay: 3500 },
        { module: "homepage", delay: 3500 },
        { module: "checklist", delay: 2200 },
        { module: "checklist2", delay: 2600 },
        { module: "homepage", delay: 3500 },
        { module: "builder", delay: 2200 },
        { module: "builder2", delay: 3500 },
        { module: "homepage", delay: 3500 },
        { module: "presentation", delay: 2200 },
        { module: "presentation2", delay: 2600 },
        { module: "homepage", delay: 3500 },
        { module: "calendar", delay: 2600 },
        { module: "homepage", delay: 3500 },
    ];
    const autoplayEnabled = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nextStepByModule = {
        homepage: 0,
        teams: 1,
        teams2: 2,
        teams3: 3,
        checklist: 5,
        checklist2: 6,
        builder: 8,
        builder2: 9,
        presentation: 11,
        presentation2: 12,
        calendar: 14,
    };
    let autoplayStepIndex = 0;

    const updatePlatformUI = () => {
        track.style.transform = `translateX(-${activePlatformIndex * 100}%)`;
        platformButtons.forEach((button) => {
            const isActive = button.dataset.platform === platformOrder[activePlatformIndex];
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });
    };

    const updateHotspotUI = () => {
        const isHomepage = activeModule === "homepage";
        homeHotspots.forEach((overlay) => {
            overlay.hidden = !isHomepage;
        });
        detailHotspots.forEach((overlay) => {
            overlay.hidden = isHomepage;
        });
        detailHotspotButtons.forEach((button) => {
            const onlyFor = button.dataset.whenModule;
            button.hidden = !onlyFor || onlyFor !== activeModule;
        });
    };

    const updateVariantUI = () => {
        experience.classList.remove("is-iphone-builder2");
    };

    const updateScreens = () => {
        screenImages.forEach((image) => {
            const platform = image.dataset.platformScreen;
            const platformImages = imageMap[platform] || {};
            const src = platformImages[activeModule] || platformImages.homepage;
            if (!src) return;
            image.src = src;
            image.alt = `Clickt ${platform} ${activeModule} preview`;
        });
    };

    const setPlatform = (platform) => {
        const nextIndex = platformOrder.indexOf(platform);
        if (nextIndex < 0) return;
        activePlatformIndex = nextIndex;
        updatePlatformUI();
        updateVariantUI();
    };

    const setModule = (module) => {
        if (!module) return;
        if (!["homepage", "teams", "teams2", "teams3", "builder", "builder2", "presentation", "presentation2", "checklist", "checklist2", "calendar"].includes(module)) return;
        activeModule = module;
        updateHotspotUI();
        updateVariantUI();
        updateScreens();
    };

    const stopAutoplay = () => {
        if (!autoplayTimerId) return;
        window.clearTimeout(autoplayTimerId);
        autoplayTimerId = 0;
    };

    const scheduleAutoplayStep = () => {
        if (!autoplayEnabled) return;
        stopAutoplay();
        const step = autoplaySequence[autoplayStepIndex] || autoplaySequence[0];
        autoplayTimerId = window.setTimeout(() => {
            setModule(step.module);
            autoplayStepIndex = (autoplayStepIndex + 1) % autoplaySequence.length;
            scheduleAutoplayStep();
        }, step.delay);
    };

    const restartAutoplay = (fromModule = activeModule, delayMs = 2800) => {
        if (!autoplayEnabled) return;
        stopAutoplay();
        autoplayStepIndex = nextStepByModule[fromModule] ?? 0;
        autoplayTimerId = window.setTimeout(scheduleAutoplayStep, delayMs);
    };

    platformButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setPlatform(button.dataset.platform);
            restartAutoplay();
        });
    });

    hotspotButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const module = button.dataset.moduleTarget;
            if (!module) return;
            setModule(module);
            restartAutoplay(module);
        });
    });

    if (helpToggle) {
        const closeHelp = () => {
            helpToggle.classList.remove("is-open");
            helpToggle.setAttribute("aria-expanded", "false");
        };

        helpToggle.addEventListener("click", (event) => {
            event.stopPropagation();
            const shouldOpen = !helpToggle.classList.contains("is-open");
            if (!shouldOpen) {
                closeHelp();
                return;
            }
            helpToggle.classList.add("is-open");
            helpToggle.setAttribute("aria-expanded", "true");
        });

        helpToggle.addEventListener("keydown", (event) => {
            if (event.key !== "Escape") return;
            closeHelp();
            helpToggle.blur();
        });

        document.addEventListener("click", (event) => {
            if (helpToggle.contains(event.target)) return;
            closeHelp();
        });
    }

    updatePlatformUI();
    updateHotspotUI();
    updateVariantUI();
    updateScreens();

    if (autoplayEnabled) {
        scheduleAutoplayStep();
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stopAutoplay();
                return;
            }
            restartAutoplay(activeModule, 500);
        });
    }
}

function initWorkflowCounters() {
    const targets = Array.from(document.querySelectorAll("[data-count-to]"));
    if (!targets.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
        targets.forEach((target) => {
            target.textContent = target.dataset.countTo || target.textContent;
        });
        return;
    }

    const animateValue = (el) => {
        if (el.dataset.counted === "true") return;
        const maxValue = Number(el.dataset.countTo || "0");
        if (!Number.isFinite(maxValue) || maxValue <= 0) {
            el.dataset.counted = "true";
            return;
        }

        const durationMs = 1100;
        const startTime = performance.now();

        const tick = (now) => {
            const progress = Math.min(1, (now - startTime) / durationMs);
            const value = Math.round(maxValue * progress);
            el.textContent = String(value);
            if (progress < 1) {
                window.requestAnimationFrame(tick);
                return;
            }
            el.textContent = String(maxValue);
            el.dataset.counted = "true";
        };

        el.textContent = "0";
        window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                animateValue(entry.target);
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.4,
        }
    );

    targets.forEach((target) => observer.observe(target));
}
