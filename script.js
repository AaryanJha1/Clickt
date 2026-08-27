(function () {
    const featureStacksController = initFeatureStacks();
    initScrollReveal();
    initFeatureSlider(featureStacksController);
    initHeroConversation();
    initOverviewPhoneStory();
    initConnectedWork();
    initPersonaMatch();
    initDeviceExperience();
    initWorkflowCounters();
    initPlaybookPipelineStory();
    initShowcaseChapters();
    initCopilotDemo();
    initShowcaseCopilotLinks();
    initHomepageSectionOrder();
    initGooglePlayPlaceholder();
})();

function initHomepageSectionOrder() {
    const copilotSection = document.querySelector(".copilot-section");
    const workflowSection = document.querySelector(".home-context");
    if (copilotSection && workflowSection) {
        workflowSection.before(copilotSection);
        workflowSection.remove();
    }
}

function initConnectedWork() {
    const root = document.querySelector("[data-connected-work]");
    if (!root) return;

    const content = {
        teams: { label: "Teams outcome", title: "Clear owners, deadlines, and live progress.", copy: "Everyone sees what they own and what needs attention next." },
        checklist: { label: "Checklist outcome", title: "A ready-to-run process for the work that repeats.", copy: "Important steps stay visible and consistent every time." },
        builder: { label: "Builder outcome", title: "A useful answer from the numbers your team already has.", copy: "Turn raw data into a clear chart and a decision-ready view." },
        presentation: { label: "Presentation outcome", title: "A leadership update that connects work to the decision.", copy: "Bring progress, data, and next steps into one story people can act on." }
    };
    const title = root.querySelector("[data-connected-title]");
    const copy = root.querySelector("[data-connected-copy]");
    const label = root.querySelector(".connected-work-result-label");

    root.querySelectorAll("[data-connected-module]").forEach((button) => {
        button.addEventListener("click", () => {
            const module = button.dataset.connectedModule;
            const detail = content[module];
            if (!detail) return;
            root.querySelectorAll("[data-connected-module]").forEach((node) => node.classList.toggle("is-active", node === button));
            if (title) title.textContent = detail.title;
            if (copy) copy.textContent = detail.copy;
            if (label) label.textContent = detail.label;
        });
    });
}

function initOverviewPhoneStory() {
    const root = document.querySelector("[data-overview-phone-story]");
    if (!root) return;

    const steps = [
        { title: "Start with the request, not another blank screen.", copy: "Capture the work that needs to happen, then make the next step clear for the team.", outcome: "A shared starting point for the work ahead." },
        { title: "Give every important task a clear owner.", copy: "Teams keeps membership, direct work, claimable tasks, decisions, and updates together in the workspace.", outcome: "People can see what they own and what still needs attention." },
        { title: "Make recurring work easier to run well.", copy: "Turn the process into a Checklist with priorities, deadlines, recurring items, and progress that stays visible.", outcome: "Important steps are easier to repeat without losing the detail." },
        { title: "Turn the data you have into a useful answer.", copy: "Builder helps organize a dataset, work through analysis, and prepare deliverables you can review or carry forward.", outcome: "The team gets a clearer view before making the decision." },
        { title: "Share the work as a decision-ready story.", copy: "Presentation brings the update together in a deck you can edit, preview, and export when it is ready.", outcome: "Progress, context, and next steps are easier to communicate." }
    ];
    const title = root.querySelector("[data-overview-story-title]");
    const copy = root.querySelector("[data-overview-story-copy]");
    const outcome = root.querySelector("[data-overview-story-outcome] span");
    const count = root.querySelector("[data-overview-story-count]");
    const controls = Array.from(root.querySelectorAll("[data-overview-story-step]"));
    const images = Array.from(root.querySelectorAll("[data-overview-story-image]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let active = -1;

    function setActive(index) {
        const next = Math.max(0, Math.min(steps.length - 1, index));
        if (next === active && title && title.textContent) return;
        active = next;
        const detail = steps[next];
        if (title) title.textContent = detail.title;
        if (copy) copy.textContent = detail.copy;
        if (outcome) outcome.textContent = detail.outcome;
        if (count) count.textContent = String(next + 1).padStart(2, "0") + " / " + String(steps.length).padStart(2, "0");
        controls.forEach((control, i) => control.classList.toggle("is-active", i === next));
        images.forEach((image, i) => image.classList.toggle("is-active", i === next));
    }

    controls.forEach((control, index) => {
        const button = control.querySelector("button");
        if (!button) return;
        button.addEventListener("click", () => {
            setActive(index);
            if (window.matchMedia("(max-width: 760px)").matches) {
                root.querySelector(".overview-phone-story-device")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
            }
        });
    });

    if (reduced) {
        setActive(steps.length - 1);
        return;
    }

    let ticking = false;
    function updateFromScroll() {
        ticking = false;
        if (window.matchMedia("(max-width: 760px)").matches) return;
        const rect = root.getBoundingClientRect();
        const available = Math.max(1, root.offsetHeight - window.innerHeight);
        const progress = Math.max(0, Math.min(1, -rect.top / available));
        setActive(Math.round(progress * (steps.length - 1)));
    }
    window.addEventListener("scroll", () => {
        if (!ticking) { ticking = true; window.requestAnimationFrame(updateFromScroll); }
    }, { passive: true });
    window.addEventListener("resize", updateFromScroll);
    setActive(0);
}

function initGooglePlayPlaceholder() {
    const button = document.querySelector("[data-google-play-placeholder]");
    const message = document.getElementById("google-play-message");
    if (!button || !message) return;

    button.addEventListener("click", () => {
        message.hidden = false;
        message.classList.remove("is-visible");
        void message.offsetWidth;
        message.classList.add("is-visible");
        button.setAttribute("aria-describedby", "google-play-message");
    });
}

function initHeroConversation() {
    const root = document.querySelector("[data-hero-conversation]");
    if (!root) return;

    const question = root.querySelector("[data-hero-chat-question]");
    const questionText = question ? question.querySelector("p") : null;
    const typing = root.querySelector("[data-hero-chat-typing]");
    const answer = root.querySelector("[data-hero-chat-answer]");
    const status = root.querySelector("[data-hero-chat-status]");
    const announcement = root.querySelector("[data-hero-chat-announcement]");
    const proposalItems = Array.from(root.querySelectorAll("[data-hero-proposal-item]"));
    const messagesEl = root.querySelector("[data-hero-chat-messages]");
    if (!question || !questionText || !answer) return;

    let fullQuestionText = questionText.textContent.trim();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // phase: 0 = typing the question, 1 = thinking (typing dots), 2 = answered
    let phase = 0;
    let timer = 0;
    let charTimer = 0;
    let typedChars = 0;
    let started = false;
    let paused = false;
    let statusKey = "index.hero.status.ready";
    let announcementActive = false;
    const t = (key) => (window.ClicktI18n ? window.ClicktI18n.t(key) : key);
    const setStatus = (key) => {
        statusKey = key;
        if (status) status.textContent = t(key);
    };
    document.addEventListener("clickt:langchange", () => {
        if (status) status.textContent = t(statusKey);
        if (announcement && announcementActive) announcement.textContent = t("index.hero.announcement");
        fullQuestionText = t("index.hero.chatUserMessage");
        if (phase === 0 && started) {
            typedChars = 0;
            questionText.textContent = "";
        } else {
            questionText.textContent = fullQuestionText;
            typedChars = fullQuestionText.length;
        }
    });

    // Reserve the fully-grown height up front so the reply filling in below
    // the question uses already-allocated space instead of growing the card
    // and pushing everything below the hero down the page as it animates in.
    const lockChatHeight = () => {
        if (!messagesEl) return;
        messagesEl.style.minHeight = "";
        const wasAnswerHidden = answer.hidden;
        const wasQuestionRevealed = question.classList.contains("is-revealed");
        const priorText = questionText.textContent;
        answer.hidden = false;
        questionText.textContent = fullQuestionText;
        question.classList.add("is-revealed");
        messagesEl.style.minHeight = messagesEl.scrollHeight + "px";
        answer.hidden = wasAnswerHidden;
        questionText.textContent = priorText;
        if (!wasQuestionRevealed) question.classList.remove("is-revealed");
    };

    lockChatHeight();
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(lockChatHeight).catch(() => {});
    }
    let resizeTimer = 0;
    window.addEventListener("resize", () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(lockChatHeight, 150);
    });

    const revealProposalItems = () => {
        proposalItems.forEach((item, index) => {
            window.setTimeout(() => {
                item.hidden = false;
                window.requestAnimationFrame(() => item.classList.add("is-revealed"));
            }, index * 200);
        });
    };

    const showAnswer = () => {
        phase = 2;
        root.classList.remove("is-thinking");
        answer.hidden = false;
        window.requestAnimationFrame(() => root.classList.add("is-answered"));
        setStatus("index.hero.status.proposalReady");
        revealProposalItems();
        announcementActive = true;
        if (announcement) announcement.textContent = t("index.hero.announcement");
    };

    const showCompleteState = () => {
        window.clearTimeout(timer);
        window.clearTimeout(charTimer);
        questionText.textContent = fullQuestionText;
        question.classList.add("is-revealed");
        answer.hidden = false;
        proposalItems.forEach((item) => {
            item.hidden = false;
            item.classList.add("is-revealed");
        });
        root.classList.add("is-answered");
        setStatus("index.hero.status.proposalReady");
        announcementActive = true;
        if (announcement) announcement.textContent = t("index.hero.announcement");
    };

    if (reducedMotion) {
        showCompleteState();
        return;
    }

    root.classList.add("is-animated");
    proposalItems.forEach((item) => {
        item.hidden = true;
        item.classList.remove("is-revealed");
    });
    answer.hidden = true;
    questionText.textContent = "";

    const schedule = (delay, next) => {
        window.clearTimeout(timer);
        if (paused) return;
        timer = window.setTimeout(next, delay);
    };

    const showThinking = () => {
        phase = 1;
        root.classList.add("is-thinking");
        setStatus("index.hero.status.preparing");
        schedule(700, showAnswer);
    };

    const typeQuestion = () => {
        if (paused) return;
        if (typedChars >= fullQuestionText.length) {
            root.classList.remove("is-typing-question");
            schedule(500, showThinking);
            return;
        }
        typedChars += 1;
        questionText.textContent = fullQuestionText.slice(0, typedChars);
        charTimer = window.setTimeout(typeQuestion, 16);
    };

    const start = () => {
        if (started) return;
        started = true;
        question.classList.add("is-revealed");
        root.classList.add("is-typing-question");
        setStatus("index.hero.status.understanding");
        typeQuestion();
    };

    // Pause-on-hover is a mouse-only affordance (lets a desktop user stop
    // to read). Touch fires the same pointerenter/pointerleave events, but a
    // scroll gesture that starts over the card enters without ever leaving
    // until the finger lifts elsewhere - freezing the animation mid-scroll.
    const pause = () => {
        paused = true;
        window.clearTimeout(timer);
        window.clearTimeout(charTimer);
    };
    const resume = () => {
        paused = false;
        if (!started || phase === 2) return;
        if (phase === 0 && typedChars < fullQuestionText.length) {
            typeQuestion();
            return;
        }
        schedule(400, phase === 0 ? showThinking : showAnswer);
    };
    root.addEventListener("pointerenter", (event) => {
        if (event.pointerType === "touch") return;
        pause();
    });
    root.addEventListener("pointerleave", (event) => {
        if (event.pointerType === "touch") return;
        resume();
    });
    root.addEventListener("focusin", pause);
    root.addEventListener("focusout", (event) => {
        if (root.contains(event.relatedTarget)) return;
        resume();
    });

    if (!("IntersectionObserver" in window)) {
        start();
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                start();
                observer.disconnect();
            }
        });
    }, { threshold: 0.16 });
    observer.observe(root);
}

function initCopilotDemo() {
    const root = document.querySelector("[data-copilot-demo]");
    if (!root) return;

    const screens = {
        teams: "IOS Promotion/Clickt Images/iphone-team1.png",
        builder: "IOS Promotion/Clickt Images/iphone-builder1.png",
        presentation: "IOS Promotion/Clickt Images/iphone-presentation.png",
        checklist: "IOS Promotion/Clickt Images/iphone-checklist.png",
    };
    const moduleIds = ["teams", "builder", "presentation", "checklist"];
    const t = (key, vars) => (window.ClicktI18n ? window.ClicktI18n.t(key, vars) : key);
    const moduleData = (id) => ({
        label: t(`index.copilotDemo.${id}.label`),
        title: t(`index.copilotDemo.${id}.title`),
        description: t(`index.copilotDemo.${id}.description`),
        screen: screens[id],
        screenAlt: t(`index.copilotDemo.${id}.screenAlt`),
        device: t(`index.copilotDemo.${id}.device`),
        prompt: t(`index.copilotDemo.${id}.prompt`),
        proposal: t(`index.copilotDemo.${id}.proposal`),
        applied: t(`index.copilotDemo.${id}.applied`),
    });

    const tabs = Array.from(root.querySelectorAll("[data-copilot-module]"));
    const stage = root.querySelector("[data-copilot-stage]");
    const label = root.querySelector("[data-copilot-label]");
    const title = root.querySelector("[data-copilot-title]");
    const description = root.querySelector("[data-copilot-description]");
    const image = root.querySelector("[data-copilot-image]");
    const deviceTitle = root.querySelector("[data-copilot-device-title]");
    const prompt = root.querySelector("[data-copilot-prompt]");
    const output = root.querySelector("[data-copilot-output]");
    const state = root.querySelector("[data-copilot-state]");
    const action = root.querySelector("[data-copilot-action]");
    const next = root.querySelector("[data-copilot-next]");
    const approve = root.querySelector("[data-copilot-approve]");
    const steps = Array.from(root.querySelectorAll("[data-copilot-step]"));
    const stageOrder = ["ask", "preview", "apply"];
    let selected = "teams";
    let activeStage = "ask";

    const render = () => {
        const config = moduleData(selected);
        if (!config) return;
        label.textContent = config.label;
        title.textContent = config.title;
        description.textContent = config.description;
        image.src = config.screen;
        image.alt = config.screenAlt;
        deviceTitle.textContent = config.device;
        prompt.textContent = config.prompt;
        output.replaceChildren(...config.proposal.map((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            return li;
        }));
        stage.dataset.copilotStage = activeStage;
        const stepIndex = stageOrder.indexOf(activeStage);
        steps.forEach((item, index) => item.classList.toggle("is-active", index <= stepIndex));
        tabs.forEach((tab) => {
            const isActive = tab.dataset.copilotModule === selected;
            tab.classList.toggle("is-active", isActive);
            tab.setAttribute("aria-selected", isActive ? "true" : "false");
        });

        if (activeStage === "ask") {
            state.textContent = t("index.copilotDemo.stage.ask.state");
            action.textContent = t("index.copilotDemo.stage.ask.action");
            approve.textContent = t("index.copilotDemo.stage.ask.approve");
            next.innerHTML = t("index.copilotDemo.stage.ask.next") + ' <span aria-hidden="true">→</span>';
        } else if (activeStage === "preview") {
            state.textContent = t("index.copilotDemo.stage.preview.state");
            action.textContent = t("index.copilotDemo.stage.preview.action");
            approve.textContent = t("index.copilotDemo.stage.preview.approve");
            next.innerHTML = t("index.copilotDemo.stage.preview.next") + ' <span aria-hidden="true">→</span>';
        } else {
            state.textContent = t("index.copilotDemo.stage.apply.state");
            action.textContent = config.applied;
            approve.textContent = t("index.copilotDemo.stage.apply.approve");
            next.innerHTML = t("index.copilotDemo.stage.apply.next") + ' <span aria-hidden="true">→</span>';
        }
    };

    const advance = () => {
        const currentIndex = stageOrder.indexOf(activeStage);
        if (currentIndex === stageOrder.length - 1) {
            activeStage = "ask";
            const currentModuleIndex = moduleIds.indexOf(selected);
            selected = moduleIds[(currentModuleIndex + 1) % moduleIds.length];
        } else {
            activeStage = stageOrder[currentIndex + 1];
        }
        render();
    };

    tabs.forEach((tab) => tab.addEventListener("click", () => {
        selected = tab.dataset.copilotModule || "teams";
        activeStage = "ask";
        render();
    }));
    next?.addEventListener("click", advance);
    approve?.addEventListener("click", () => {
        activeStage = activeStage === "ask" ? "preview" : "apply";
        render();
    });
    document.addEventListener("clickt:langchange", render);
    render();
}

// Lets any "Ask ClicktAI" chip elsewhere on the page (e.g. the device
// showcase) jump straight to the Copilot demo with the matching module
// tab pre-selected, by simulating a click on that tab's own button.
function initShowcaseCopilotLinks() {
    const links = Array.from(document.querySelectorAll("[data-copilot-jump]"));
    links.forEach((link) => {
        link.addEventListener("click", () => {
            const tab = document.querySelector('[data-copilot-module="' + link.dataset.copilotJump + '"]');
            if (tab) tab.click();
        });
    });
}

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

function initHomeWorkflow() {
    const root = document.querySelector("[data-home-workflow]");
    if (!root) return;

    const scenarioRoot = document.querySelector("[data-workflow-scenarios]");
    const scenarioButtons = scenarioRoot
        ? Array.from(scenarioRoot.querySelectorAll("[data-workflow-scenario]"))
        : [];
    const buttons = Array.from(root.querySelectorAll("[data-workflow-step-btn]"));
    const scenarioSelect = root.querySelector("[data-workflow-scenario-select]");
    const stepSelect = root.querySelector("[data-workflow-step-select]");
    const panel = root.querySelector("[data-workflow-dynamic-panel]");
    const stepCountEl = root.querySelector("[data-workflow-step-count]");
    const scenarioLabelEl = root.querySelector("[data-workflow-scenario-label]");
    const titleEl = root.querySelector("[data-workflow-title]");
    const descriptionEl = root.querySelector("[data-workflow-description]");
    const youDoEl = root.querySelector("[data-workflow-you-do]");
    const clicktDoesEl = root.querySelector("[data-workflow-clickt-does]");
    const outputListEl = root.querySelector("[data-workflow-output-list]");
    const benefitEl = root.querySelector("[data-workflow-benefit]");
    const beforeEl = root.querySelector("[data-workflow-before]");
    const afterEl = root.querySelector("[data-workflow-after]");
    const moduleLinkEl = root.querySelector("[data-workflow-module-link]");
    const nextButton = root.querySelector("[data-workflow-next]");

    if (
        !buttons.length ||
        !panel ||
        !stepCountEl ||
        !scenarioLabelEl ||
        !titleEl ||
        !descriptionEl ||
        !youDoEl ||
        !clicktDoesEl ||
        !outputListEl ||
        !benefitEl ||
        !beforeEl ||
        !afterEl ||
        !moduleLinkEl ||
        !nextButton
    ) {
        return;
    }

    const stepOrder = ["goal", "assign", "execute", "analyze", "present"];
    const scenarioIds = ["sprint", "onboarding", "weekly", "project"];
    const t = (key, vars) => (window.ClicktI18n ? window.ClicktI18n.t(key, vars) : key);
    const moduleHrefs = {
        sprint: { goal: "playbook.html#teams", assign: "playbook.html#checklist", execute: "#showcase-iphone", analyze: "playbook.html#builder", present: "playbook.html#presentation" },
        onboarding: { goal: "playbook.html#checklist", assign: "playbook.html#teams", execute: "#showcase-ipad", analyze: "playbook.html#builder", present: "playbook.html#presentation" },
        weekly: { goal: "playbook.html#builder", assign: "playbook.html#checklist", execute: "playbook.html#teams", analyze: "playbook.html#builder", present: "playbook.html#presentation" },
        project: { goal: "playbook.html#teams", assign: "playbook.html#checklist", execute: "#showcase-mac", analyze: "playbook.html#builder", present: "playbook.html#presentation" },
    };
    const stepData = (scenario, step) => {
        const base = `index.workflow.${scenario}.steps.${step}`;
        return {
            title: t(`${base}.title`),
            description: t(`${base}.description`),
            youDo: t(`${base}.youDo`),
            clicktDoes: t(`${base}.clicktDoes`),
            outputs: t(`${base}.outputs`),
            benefit: t(`${base}.benefit`),
            before: t(`${base}.before`),
            after: t(`${base}.after`),
            moduleLabel: t(`${base}.moduleLabel`),
            moduleHref: moduleHrefs[scenario][step],
        };
    };

    const state = {
        scenario:
            scenarioButtons.find((button) => button.classList.contains("is-active"))?.dataset.workflowScenario ||
            "sprint",
        step:
            buttons.find((button) => button.classList.contains("is-active"))?.dataset.workflowStepBtn ||
            "goal",
    };

    const render = () => {
        const scenario = scenarioIds.includes(state.scenario) ? state.scenario : "sprint";
        const step = stepOrder.includes(state.step) ? state.step : "goal";
        const currentStepData = stepData(scenario, step);
        const stepIndex = Math.max(0, stepOrder.indexOf(state.step));

        scenarioButtons.forEach((button) => {
            const isActive = button.dataset.workflowScenario === state.scenario;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-selected", isActive ? "true" : "false");
        });

        if (scenarioSelect) scenarioSelect.value = state.scenario;

        buttons.forEach((button) => {
            const isActive = button.dataset.workflowStepBtn === state.step;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-selected", isActive ? "true" : "false");
        });

        if (stepSelect) stepSelect.value = state.step;

        panel.classList.remove("is-swap");
        // Restart small content transition on each update.
        void panel.offsetWidth;
        panel.classList.add("is-swap");
        panel.setAttribute("data-workflow-step-panel", state.step);

        stepCountEl.textContent = `${stepIndex + 1}/${stepOrder.length}`;
        scenarioLabelEl.textContent = t(`index.workflow.${scenario}.label`);
        titleEl.textContent = currentStepData.title;
        descriptionEl.textContent = currentStepData.description;
        youDoEl.textContent = currentStepData.youDo;
        clicktDoesEl.textContent = currentStepData.clicktDoes;
        benefitEl.textContent = currentStepData.benefit;
        beforeEl.textContent = currentStepData.before;
        afterEl.textContent = currentStepData.after;

        outputListEl.innerHTML = "";
        (currentStepData.outputs || []).forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            outputListEl.appendChild(li);
        });

        moduleLinkEl.textContent = t("index.workflow.seeInModuleTemplate", { module: currentStepData.moduleLabel });
        moduleLinkEl.setAttribute("href", currentStepData.moduleHref);

        const nextStep = stepOrder[(stepIndex + 1) % stepOrder.length];
        const nextStepLabel = buttons.find((button) => button.dataset.workflowStepBtn === nextStep)?.textContent || "Next";
        nextButton.textContent = t("index.workflow.nextStepTemplate", { step: nextStepLabel.replace(/^\d+\.\s*/, "") });
        nextButton.dataset.nextStep = nextStep;
    };

    const setStep = (step, shouldFocus = false) => {
        if (!stepOrder.includes(step)) return;
        state.step = step;
        render();

        if (!shouldFocus) return;
        const activeButton = buttons.find((button) => button.dataset.workflowStepBtn === step);
        activeButton?.focus();
    };

    const setScenario = (scenario) => {
        if (!scenarioIds.includes(scenario)) return;
        state.scenario = scenario;
        render();
    };

    scenarioButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const scenario = button.dataset.workflowScenario;
            if (!scenario) return;
            setScenario(scenario);
        });
    });

    if (scenarioSelect) {
        scenarioSelect.addEventListener("change", (event) => {
            const nextScenario = event.target.value;
            if (!nextScenario) return;
            setScenario(nextScenario);
        });
    }

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const step = button.dataset.workflowStepBtn;
            if (!step) return;
            setStep(step);
        });
    });

    if (stepSelect) {
        stepSelect.addEventListener("change", (event) => {
            const nextStep = event.target.value;
            if (!nextStep) return;
            setStep(nextStep, true);
        });
    }

    nextButton.addEventListener("click", () => {
        const nextStep = nextButton.dataset.nextStep;
        if (!nextStep) return;
        setStep(nextStep, true);
    });

    root.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
        if (event.metaKey || event.ctrlKey || event.altKey) return;
        event.preventDefault();

        const currentIndex = Math.max(0, stepOrder.indexOf(state.step));
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const nextIndex = (currentIndex + direction + stepOrder.length) % stepOrder.length;
        setStep(stepOrder[nextIndex], true);
    });

    document.addEventListener("clickt:langchange", render);
    render();
}

function initPersonaMatch() {
    const root = document.querySelector("[data-persona-match]");
    if (!root) return;

    const buttons = Array.from(root.querySelectorAll("[data-persona]"));
    const select = root.querySelector("[data-persona-select]");
    const titleOutput = root.querySelector("[data-persona-title-output]");
    const copyOutput = root.querySelector("[data-persona-copy-output]");
    const pointsOutput = root.querySelector("[data-persona-points-output]");
    if (!buttons.length || !titleOutput || !copyOutput || !pointsOutput) return;

    const setPersona = (button) => {
        buttons.forEach((node) => {
            const isActive = node === button;
            node.classList.toggle("is-active", isActive);
            node.setAttribute("aria-selected", isActive ? "true" : "false");
        });

        if (select && button.dataset.persona) {
            select.value = button.dataset.persona;
        }

        const nextTitle = button.dataset.personaTitle || "";
        const nextCopy = button.dataset.personaCopy || "";
        const pointsRaw = button.dataset.personaPoints || "";
        const points = pointsRaw
            .split("|")
            .map((item) => item.trim())
            .filter(Boolean);

        if (nextTitle) titleOutput.textContent = nextTitle;
        if (nextCopy) copyOutput.textContent = nextCopy;

        pointsOutput.innerHTML = "";
        points.forEach((point) => {
            const item = document.createElement("li");
            item.textContent = point;
            pointsOutput.appendChild(item);
        });
    };

    buttons.forEach((button) => {
        button.addEventListener("click", () => setPersona(button));
    });

    if (select) {
        select.addEventListener("change", (event) => {
            const persona = event.target.value;
            if (!persona) return;
            const match = buttons.find((button) => button.dataset.persona === persona);
            if (!match) return;
            setPersona(match);
        });
    }
}

function initDeviceExperience() {
    const experience = document.getElementById("hero-device-experience");
    const track = document.getElementById("device-track");
    if (!experience || experience.hidden || !track) return;

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
            homepage: "Ipad-Images/ipad-homepage.png",
            teams: "Ipad-Images/ipad-teams1.png",
            teams2: "Ipad-Images/ipad-teams2.png",
            teams3: "Ipad-Images/ipad-teams3.png",
            builder: "Ipad-Images/ipad-builder1.png",
            builder2: "Ipad-Images/ipad-builder2.png",
            presentation: "Ipad-Images/ipad-presentation1.png",
            presentation2: "Ipad-Images/ipad-presentation2.png",
            checklist: "Ipad-Images/ipad-checklist1.png",
            checklist2: "Ipad-Images/ipad-checklist2.png",
            calendar: "Ipad-Images/ipad-calendar.png",
        },
        mac: {
            homepage: "IOS Promotion/Clickt Images/mac-homepage.png",
            teams: "IOS Promotion/Clickt Images/mac-team1.png",
            teams2: "IOS Promotion/Clickt Images/mac-team2.png",
            teams3: "IOS Promotion/Clickt Images/mac-team3.png",
            builder: "IOS Promotion/Clickt Images/mac-builder1.png",
            builder2: "IOS Promotion/Clickt Images/mac-builder2.png",
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

function initPlaybookPipelineStory() {
    const root = document.querySelector("[data-pipeline-root]");
    if (!root) return;

    const state = {
        manifest: null,
        selectedPersona: "founder",
        activeScenario: null,
    };

    bindPipelineScrollState(root);
    bindPersonaSwitch(root, state, () => applyScenarioToPipeline(root, state));
    bindDemoLinksTracking(root);

    loadPipelineManifest()
        .then((manifest) => {
            state.manifest = manifest;
            state.activeScenario = resolveScenarioForPersona(
                manifest,
                state.selectedPersona
            );
            applyScenarioToPipeline(root, state);
        })
        .catch(() => {
            state.manifest = createFallbackManifestFromDOM(root, state.selectedPersona);
            applyScenarioToPipeline(root, state);
            showDemoFallback(root, true);
        });
}

async function loadPipelineManifest() {
    const response = await fetch("demos/manifest.json", { cache: "no-cache" });
    if (!response.ok) {
        throw new Error("Manifest fetch failed");
    }
    const manifest = await response.json();
    if (!manifest || !Array.isArray(manifest.scenarios) || !manifest.scenarios.length) {
        throw new Error("Manifest is empty");
    }
    return manifest;
}

function createFallbackManifestFromDOM(root, persona) {
    const promptText = root.querySelector('[data-pipeline-chapter="clicktai"] p')?.textContent || "";
    const summaryText = root.querySelector(".pb-pipeline-summary")?.textContent || "";
    const builderLink = root.querySelector("#demo-builder-png-link")?.getAttribute("href") || "";
    const presHTMLLink = root.querySelector("#demo-pres-html-link")?.getAttribute("href") || "";
    const presPDFLink = root.querySelector("#demo-pres-pdf-link")?.getAttribute("href") || "";
    return {
        latest: "local-fallback",
        scenarios: [
            {
                scenario_id: "local-fallback",
                title: "Local Fallback",
                persona: persona || "founder",
                clicktai_prompt: promptText.replace(/^"|"$/g, "").trim(),
                summary: summaryText.trim(),
                builder_png_url: builderLink,
                presentation_html_url: presHTMLLink,
                presentation_pdf_url: presPDFLink,
                updated_at: "",
                modules: ["teams", "checklist", "builder", "presentation"],
            },
        ],
    };
}

function resolveScenarioForPersona(manifest, persona) {
    const scenarios = Array.isArray(manifest?.scenarios) ? manifest.scenarios : [];
    const latestID = typeof manifest?.latest === "string" ? manifest.latest : "";
    const latestScenario =
        scenarios.find((scenario) => scenario?.scenario_id === latestID) || scenarios[0] || null;

    if (!persona) return latestScenario;

    const matched = scenarios.find((scenario) => {
        const rawPersona = scenario?.persona;
        if (Array.isArray(rawPersona)) {
            return rawPersona.some(
                (entry) => String(entry).trim().toLowerCase() === String(persona).trim().toLowerCase()
            );
        }
        return String(rawPersona || "").trim().toLowerCase() === String(persona).trim().toLowerCase();
    });

    return matched || latestScenario;
}

function applyScenarioToPipeline(root, state) {
    const scenario = resolveScenarioForPersona(state.manifest, state.selectedPersona);
    state.activeScenario = scenario;
    if (!scenario) {
        showDemoFallback(root, true);
        return;
    }

    const summaryEl = root.querySelector(".pb-pipeline-summary");
    if (summaryEl && scenario.summary) {
        summaryEl.textContent = scenario.summary;
    }

    const promptEl = root.querySelector('[data-pipeline-chapter="clicktai"] p');
    if (promptEl && scenario.clicktai_prompt) {
        promptEl.textContent = `"${scenario.clicktai_prompt}"`;
    }

    const builderLink = root.querySelector("#demo-builder-png-link");
    const presHTMLLink = root.querySelector("#demo-pres-html-link");
    const presPDFLink = root.querySelector("#demo-pres-pdf-link");

    if (builderLink && scenario.builder_png_url) {
        builderLink.href = scenario.builder_png_url;
    }
    if (presHTMLLink && scenario.presentation_html_url) {
        presHTMLLink.href = scenario.presentation_html_url;
    }
    if (presPDFLink && scenario.presentation_pdf_url) {
        presPDFLink.href = scenario.presentation_pdf_url;
    }

    const updatedEl = root.querySelector("#demo-updated-at");
    if (updatedEl) {
        const iso = typeof scenario.updated_at === "string" ? scenario.updated_at : "";
        if (iso) {
            const parsed = new Date(iso);
            const label = Number.isNaN(parsed.valueOf())
                ? iso
                : parsed.toLocaleString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                });
            updatedEl.textContent = label;
            updatedEl.setAttribute("datetime", iso);
        } else {
            const isFallback = scenario.scenario_id === "local-fallback";
            updatedEl.textContent = isFallback ? "Offline preview" : "Unknown";
            updatedEl.setAttribute("datetime", "");
        }
    }

    bindDemoLinksValidation(root);
}

function bindPersonaSwitch(root, state, onChange) {
    const buttons = Array.from(root.querySelectorAll("[data-persona]"));
    if (!buttons.length) return;

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const persona = button.dataset.persona;
            if (!persona) return;

            state.selectedPersona = persona;
            buttons.forEach((node) =>
                node.classList.toggle("is-active", node.dataset.persona === persona)
            );

            trackPlaybookEvent("persona_switch", {
                persona,
            });

            onChange();
        });
    });
}

function bindPipelineScrollState(root) {
    const chapters = Array.from(root.querySelectorAll("[data-pipeline-chapter]"));
    const steps = Array.from(root.querySelectorAll("[data-step]"));
    if (!chapters.length || !steps.length) return;

    const stepMap = new Map(steps.map((step) => [step.dataset.step, step]));
    const chapterOrder = chapters.map((chapter) => chapter.dataset.pipelineChapter);
    const seenChapterViews = new Set();

    const setStepState = (activeStepName) => {
        const activeIndex = chapterOrder.indexOf(activeStepName);
        steps.forEach((step, index) => {
            const isActive = step.dataset.step === activeStepName;
            step.classList.toggle("is-active", isActive);
            step.classList.toggle("is-complete", activeIndex >= 0 && index < activeIndex);
        });
        chapters.forEach((chapter, index) => {
            const chapterName = chapter.dataset.pipelineChapter;
            const isActive = chapterName === activeStepName;
            chapter.classList.toggle("is-active", isActive);
            chapter.classList.toggle("is-complete", activeIndex >= 0 && index < activeIndex);
            chapter.classList.toggle("is-observed", activeIndex >= 0 && index <= activeIndex);
        });
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const chapterName = entry.target.dataset.pipelineChapter;
                if (!chapterName) return;
                setStepState(chapterName);

                if (!seenChapterViews.has(chapterName)) {
                    seenChapterViews.add(chapterName);
                    trackPlaybookEvent("chapter_view", { step: chapterName });
                }
            });
        },
        {
            threshold: 0.5,
            rootMargin: "-10% 0px -35% 0px",
        }
    );

    chapters.forEach((chapter) => observer.observe(chapter));
    setStepState(chapterOrder[0]);

    steps.forEach((step) => {
        step.addEventListener("click", () => {
            const chapterName = step.dataset.step;
            if (!chapterName) return;
            const chapter = root.querySelector(`[data-pipeline-chapter="${chapterName}"]`);
            chapter?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    const firstMappedStep = stepMap.get(chapterOrder[0]);
    if (firstMappedStep) firstMappedStep.classList.add("is-active");
}

async function bindDemoLinksValidation(root) {
    const links = Array.from(
        root.querySelectorAll(
            "#demo-builder-png-link, #demo-pres-html-link, #demo-pres-pdf-link"
        )
    );
    if (!links.length) return;

    const checks = await Promise.all(
        links.map((link) => checkDemoLinkAvailable(link.getAttribute("href")))
    );

    const allValid = checks.every(Boolean);
    showDemoFallback(root, !allValid);
}

async function checkDemoLinkAvailable(href) {
    if (!href) return false;
    const url = href.trim();
    if (!url) return false;

    try {
        const headResponse = await fetch(url, { method: "HEAD", cache: "no-cache" });
        if (headResponse.ok) return true;
        if (headResponse.status !== 405 && headResponse.status !== 501) return false;
    } catch (_) {
        // Fall through to GET retry.
    }

    try {
        const getResponse = await fetch(url, { method: "GET", cache: "no-cache" });
        return getResponse.ok;
    } catch (_) {
        return false;
    }
}

function showDemoFallback(root, show) {
    const fallback = root.querySelector("#demo-fallback");
    if (!fallback) return;
    fallback.hidden = !show;
}

function bindDemoLinksTracking(root) {
    const links = Array.from(
        root.querySelectorAll(
            "#demo-builder-png-link, #demo-pres-html-link, #demo-pres-pdf-link"
        )
    );
    if (!links.length) return;

    links.forEach((link) => {
        link.addEventListener("click", () => {
            trackPlaybookEvent("demo_click", {
                id: link.id || "",
                href: link.getAttribute("href") || "",
            });
        });
    });
}

function trackPlaybookEvent(eventName, payload) {
    if (!eventName) return;
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
        window.dataLayer.push({
            event: eventName,
            ...payload,
        });
        return;
    }

    if (window.gtag && typeof window.gtag === "function") {
        window.gtag("event", eventName, payload || {});
    }
}

/* ============================================================
   DEVICE SHOWCASE CHAPTERS
   Lusion-style: smooth scroll (Lenis) + scroll-driven 3D device
   motion (GSAP ScrollTrigger).  Three separate sticky sections —
   iPhone, iPad, Mac — each with animated screen/satellite swaps.
   ============================================================ */

function initShowcaseChapters() {
    if (document.body.classList.contains("homepage-v2")) return;
    const P = "IOS Promotion/Clickt Images/";
    const IPAD_P = "Ipad-Images/";
    const rootStyles = window.getComputedStyle(document.documentElement);
    const SHARED_SHOWCASE_BG = (rootStyles.getPropertyValue("--bg") || "").trim() || "#ffffff";
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCompactMobile = window.matchMedia("(max-width: 640px)").matches;
    const hasMotionStack = Boolean(window.gsap && window.ScrollTrigger);
    const allowShowcaseMotion = hasMotionStack && (!prefersReducedMotion || isCompactMobile);
    const platformButtons = Array.from(document.querySelectorAll("[data-showcase-platform-btn]"));
    const platformSections = Array.from(document.querySelectorAll("[data-showcase-platform-section]"));

    if (!platformSections.length) return;

    const normalizePanelText = (text) => {
        if (!text) return "";
        return text
            .replace(/\s+/g, " ")
            .replace(/\s+([,.;!?])/g, "$1")
            .replace(/([,.;!?])(?=\S)/g, "$1 ")
            .trim();
    };

    const showcaseTextNodes = Array.from(
        document.querySelectorAll(".sc-copy-heading, .sc-copy-body")
    );
    showcaseTextNodes.forEach((node) => {
        node.textContent = normalizePanelText(node.textContent);
    });

    // ── Stop tables: each entry defines the device state at that
    //    scroll-progress threshold.  Between stops GSAP interpolates
    //    position/rotation/scale; image + copy swap discretely.
    const iphoneStops = [
        { from: 0,    x:   0, ry:   0, rz:  0, scale: 0.84, module: null,           stopKey: "home",     img: P+"iphone-homepage.png",        satA: null,                        satB: null,                         bg: SHARED_SHOWCASE_BG },
        { from: 0.13, x: -24, ry: -10, rz:  0, scale: 1,    module: "teams",        stopKey: null,       img: P+"iphone-team1.png",           satA: P+"iphone-team2.png",        satB: P+"iphone-team3.png",         bg: SHARED_SHOWCASE_BG },
        { from: 0.38, x: -22, ry: -9,  rz:  0, scale: 1,    module: "builder",      stopKey: null,       img: P+"iphone-builder1.png",        satA: P+"iphone-builder2.png",     satB: P+"iphone-builder3.png",      bg: SHARED_SHOWCASE_BG },
        { from: 0.60, x: -20, ry: -7,  rz: -2, scale: 1,    module: "presentation", stopKey: null,       img: P+"iphone-presentation.png",    satA: P+"iphone-presentation1.png",satB: P+"iphone-presentation2.png", bg: SHARED_SHOWCASE_BG },
        { from: 0.78, x: -22, ry: -8,  rz:  0, scale: 1,    module: "checklist",    stopKey: null,       img: P+"iphone-checklist.png",       satA: P+"iphone-checklist1.png",   satB: P+"iphone-checklist2.png",    bg: SHARED_SHOWCASE_BG },
        { from: 0.93, x:   0, ry:   0, rz:  0, scale: 0.9,  module: null,           stopKey: "calendar", img: P+"iphone-calendar1.png",       satA: null,                        satB: null,                         bg: SHARED_SHOWCASE_BG },
    ];

    const ipadStops = [
        { from: 0,    x:   0, ry:   0, rz:  0, scale: 0.84, module: null,           stopKey: "home",     img: IPAD_P+"ipad-homepage.png",     satA: null,                            satB: null,                             bg: SHARED_SHOWCASE_BG },
        { from: 0.14, x: -24, ry: -8,  rz:  0, scale: 1,    module: "teams",        stopKey: null,       img: IPAD_P+"ipad-teams1.png",       satA: IPAD_P+"ipad-teams2.png",        satB: IPAD_P+"ipad-teams3.png",         bg: SHARED_SHOWCASE_BG },
        { from: 0.39, x: -22, ry: -7,  rz: -2, scale: 1,    module: "builder",      stopKey: null,       img: IPAD_P+"ipad-builder1.png",     satA: IPAD_P+"ipad-builder2.png",      satB: IPAD_P+"ipad-builder3.png",       bg: SHARED_SHOWCASE_BG },
        { from: 0.62, x: -20, ry: -5,  rz:  0, scale: 1,    module: "presentation", stopKey: null,       img: IPAD_P+"ipad-presentation1.png",satA: IPAD_P+"ipad-presentation2.png", satB: IPAD_P+"ipad-presentation3.png",  bg: SHARED_SHOWCASE_BG },
        { from: 0.80, x: -22, ry: -5,  rz:  0, scale: 0.94, module: "checklist",    stopKey: null,       img: IPAD_P+"ipad-checklist1.png",   satA: IPAD_P+"ipad-checklist2.png",    satB: IPAD_P+"ipad-checklistcopilot.png", bg: SHARED_SHOWCASE_BG },
        { from: 0.93, x:   0, ry:   0, rz:  0, scale: 0.84, module: null,           stopKey: "calendar", img: IPAD_P+"ipad-calendar.png",     satA: null,                            satB: null,                             bg: SHARED_SHOWCASE_BG },
    ];

    const macStops = [
        { from: 0,    x:  0, ry:   0, rz: 0, scale: 0.82, module: null,           stopKey: "home",     img: P+"mac-homepage.png",           satA: null,                      satB: null,                    bg: SHARED_SHOWCASE_BG },
        { from: 0.16, x: -14, ry:  -6, rz: 0, scale: 1,    module: "teams",        stopKey: null,       img: P+"mac-Team1.png",              satA: P+"mac-Team2.png",         satB: P+"mac-Team3.png",       bg: SHARED_SHOWCASE_BG },
        { from: 0.40, x: -12, ry:  -4, rz: 0, scale: 1,    module: "builder",      stopKey: null,       img: P+"mac-Builder1.png",           satA: P+"mac-Builder2.png",      satB: null,                    bg: SHARED_SHOWCASE_BG },
        { from: 0.63, x: -14, ry:  -5, rz: 0, scale: 1,    module: "presentation", stopKey: null,       img: P+"mac-presentation1.png",      satA: P+"mac-presentation2.png", satB: null,                    bg: SHARED_SHOWCASE_BG },
        { from: 0.82, x: -12, ry:  -3, rz: 0, scale: 0.95, module: "checklist",    stopKey: null,       img: P+"mac-checklist.png",          satA: P+"mac-calendar1.png",     satB: P+"Mac-setting.png",     bg: SHARED_SHOWCASE_BG },
        { from: 0.95, x:  0, ry:   0, rz: 0, scale: 0.86, module: null,           stopKey: "calendar", img: P+"mac-calendar1.png",          satA: null,                      satB: null,                    bg: SHARED_SHOWCASE_BG },
    ];

    // Per-module background tints — faint brand-color wash on section bg
    const MODULE_BG = {
        teams:        "rgba(37,99,235,0.06)",
        builder:      "rgba(217,119,6,0.06)",
        presentation: "rgba(79,70,229,0.06)",
        checklist:    "rgba(22,163,74,0.06)",
    };
    [iphoneStops, ipadStops, macStops].forEach(function(stops) {
        stops.forEach(function(s) { if (s.module && MODULE_BG[s.module]) s.bg = MODULE_BG[s.module]; });
    });

    const tuneStopsForCompactMobile = (stops) => {
        return stops.map((stop) => {
            const isSingleFrameStop = !stop.module && !stop.satA && !stop.satB;
            const scaledStop = {
                ...stop,
                // Copy moves beneath the frame on phones, so horizontal
                // device motion would only make the visual look off-centre.
                x: 0,
                ry: Number((stop.ry * 0.72).toFixed(2)),
                rz: Number((stop.rz * 0.72).toFixed(2)),
            };

            if (isSingleFrameStop) {
                scaledStop.scale = Math.min(1, Number((stop.scale + 0.03).toFixed(3)));
            }

            return scaledStop;
        });
    };

    const iphoneMotionStops = isCompactMobile ? tuneStopsForCompactMobile(iphoneStops) : iphoneStops;
    const ipadMotionStops = isCompactMobile ? tuneStopsForCompactMobile(ipadStops) : ipadStops;
    const macMotionStops = isCompactMobile ? tuneStopsForCompactMobile(macStops) : macStops;

    const showcaseConfigs = {
        iphone: { sectionId: "showcase-iphone", wrapId: "sc-wrap-iphone", imgId: "sc-img-iphone", satAId: "sc-sat-iphone-a", satBId: "sc-sat-iphone-b", bgId: "sc-bg-iphone", copyId: "sc-copy-iphone", pillsId: "sc-pills-iphone", hintId: "sc-hint-iphone", macLidId: null, perspective: 1000, stops: iphoneMotionStops },
        ipad:   { sectionId: "showcase-ipad",   wrapId: "sc-wrap-ipad",   imgId: "sc-img-ipad",   satAId: "sc-sat-ipad-a",   satBId: "sc-sat-ipad-b",   bgId: "sc-bg-ipad",   copyId: "sc-copy-ipad",   pillsId: "sc-pills-ipad",   hintId: "sc-hint-ipad",   macLidId: null, perspective: 1000, stops: ipadMotionStops },
        mac:    { sectionId: "showcase-mac",    wrapId: "sc-wrap-mac",    imgId: "sc-img-mac",    satAId: "sc-sat-mac-a",    satBId: "sc-sat-mac-b",    bgId: "sc-bg-mac",    copyId: "sc-copy-mac",    pillsId: "sc-pills-mac",    hintId: null,             macLidId: "sc-mac-lid", perspective: 1400, stops: macMotionStops },
    };
    const initializedPlatforms = new Set();

    const setActiveSection = (platform, shouldScroll) => {
        platformSections.forEach((section) => {
            const isActive = section.dataset.showcasePlatformSection === platform;
            section.hidden = !isActive;
            section.classList.toggle("is-active", isActive);
        });

        platformButtons.forEach((button) => {
            const isActive = button.dataset.showcasePlatformBtn === platform;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-selected", isActive ? "true" : "false");
        });

        const targetConfig = showcaseConfigs[platform];
        if (targetConfig && !initializedPlatforms.has(platform) && allowShowcaseMotion) {
            setupShowcaseChapter(targetConfig);
            initializedPlatforms.add(platform);
        }

        if (!allowShowcaseMotion && targetConfig) {
            const staticCopyRoot = document.getElementById(targetConfig.copyId);
            if (staticCopyRoot) {
                const slots = Array.from(staticCopyRoot.querySelectorAll(".sc-copy-slot"));
                slots.forEach((slot, idx) => slot.classList.toggle("is-active", idx === 0));
            }
        }

        const activeSection = platformSections.find((section) => section.dataset.showcasePlatformSection === platform);
        if (activeSection && shouldScroll) {
            activeSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        if (allowShowcaseMotion) {
            window.ScrollTrigger.refresh();
        }
    };

    const initialPlatform = platformButtons.find((button) => button.classList.contains("is-active"))?.dataset.showcasePlatformBtn || "iphone";

    if (allowShowcaseMotion) {
        gsap.registerPlugin(ScrollTrigger);

        // Wire Lenis smooth scroll into GSAP's ticker so ScrollTrigger
        // receives accurate scroll positions with momentum applied.
        if (window.Lenis) {
            const lenis = new Lenis();
            lenis.on("scroll", ScrollTrigger.update);
            gsap.ticker.add((time) => lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(0);
        }
    }

    setActiveSection(initialPlatform, false);

    platformButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const platform = button.dataset.showcasePlatformBtn;
            if (!platform || !showcaseConfigs[platform]) return;
            setActiveSection(platform, false);
        });
    });
}

function setupShowcaseChapter(cfg) {
    const section = document.getElementById(cfg.sectionId);
    if (!section) return;

    const wrap      = document.getElementById(cfg.wrapId);
    const img       = document.getElementById(cfg.imgId);
    const satA      = document.getElementById(cfg.satAId);
    const satB      = document.getElementById(cfg.satBId);
    const bgEl      = document.getElementById(cfg.bgId);
    const copyEl    = document.getElementById(cfg.copyId);
    const pillsEl   = document.getElementById(cfg.pillsId);
    const hintEl    = document.getElementById(cfg.hintId);
    const lidEl     = cfg.macLidId ? document.getElementById(cfg.macLidId) : null;
    const copySlots = copyEl  ? Array.from(copyEl.querySelectorAll(".sc-copy-slot"))  : [];
    const pillEls   = pillsEl ? Array.from(pillsEl.querySelectorAll(".sc-pill"))      : [];

    if (!wrap || !img) return;

    // Establish 3D rendering context on the device wrap
    gsap.set(wrap, { transformPerspective: cfg.perspective, transformOrigin: "center center" });
    if (satA) gsap.set(satA, { opacity: 0, y: 12 });
    if (satB) gsap.set(satB, { opacity: 0, y: 12 });
    // Mac: start lid closed
    if (lidEl) gsap.set(lidEl, { clipPath: "inset(95% 0 0 0)" });

    let prevStopIdx = -1;
    const stops = cfg.stops;
    const applyVisualState = (visualStop, xValue) => {
        if (!visualStop) return;
        scSwapImage(img, visualStop.img);

        if (!visualStop.satA && !visualStop.satB) {
            // Home/Calendar (and any other single-frame stop) never show
            // satellites — hide instantly so nothing lingers mid-fade if a
            // visitor scrolls quickly past a module stop into this one.
            if (satA) gsap.set(satA, { opacity: 0, y: 12, overwrite: true });
            if (satB) gsap.set(satB, { opacity: 0, y: 12, overwrite: true });
        } else {
            if (satA) {
                if (visualStop.satA) { satA.src = visualStop.satA; gsap.to(satA, { opacity: 1, y: 0, duration: 0.55, ease: "back.out(1.4)", delay: 0.05, overwrite: true }); }
                else                 { gsap.set(satA, { opacity: 0, y: 12, overwrite: true }); }
            }
            if (satB) {
                if (visualStop.satB) { satB.src = visualStop.satB; gsap.to(satB, { opacity: 1, y: 0, duration: 0.55, ease: "back.out(1.4)", delay: 0.15, overwrite: true }); }
                else                 { gsap.set(satB, { opacity: 0, y: 12, overwrite: true }); }
            }
        }

        const stopId = visualStop.stopKey || visualStop.module;

        if (wrap) wrap.classList.toggle("sat-left", xValue > 5);
        copySlots.forEach(function(slot) {
            slot.classList.toggle("is-active", slot.dataset.scStop === stopId);
        });
        if (copyEl) copyEl.classList.toggle("copy-left", xValue > 5);
        pillEls.forEach(function(pill) {
            pill.classList.toggle("is-active", pill.dataset.scPill === stopId);
        });

        section.classList.toggle(
            "is-single-frame",
            !visualStop.module && !visualStop.satA && !visualStop.satB
        );
        section.classList.toggle(
            "has-satellites",
            Boolean(visualStop.satA || visualStop.satB)
        );

        // Animate section background tint
        if (bgEl) gsap.to(bgEl, { backgroundColor: visualStop.bg, duration: 0.6, ease: "power2.out" });

        // Spring-in the activity chip for the newly active stop
        var activeSlot = copySlots.find(function(s) { return s.dataset.scStop === stopId; });
        if (activeSlot) {
            var chip = activeSlot.querySelector(".sc-activity-chip");
            if (chip) gsap.fromTo(chip, { opacity: 0, y: 10, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.4)", delay: 0.35 });
        }
    };

    // Ensure the chapter always starts from its first frame state.
    if (stops.length) {
        applyVisualState(stops[0], stops[0].x);
    }

    const chapterTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.4,
        onUpdate(self) {
            const p = self.progress;

            // Find which stop we're currently inside
            let idx = 0;
            for (let i = stops.length - 1; i >= 0; i--) {
                if (p >= stops[i].from) { idx = i; break; }
            }
            const stop = stops[idx];
            const next = stops[idx + 1];
            const activeStop = stop;

            // Local progress within this stop (0→1), eased
            let t = next ? Math.min(1, (p - stop.from) / (next.from - stop.from)) : 1;
            t = scEaseInOut(t);

            // Interpolate device position + rotation + scale
            gsap.set(wrap, {
                xPercent:  scLerp(stop.x,     next ? next.x     : stop.x,     t),
                rotationY: scLerp(stop.ry,    next ? next.ry    : stop.ry,    t),
                rotationZ: scLerp(stop.rz,    next ? next.rz    : stop.rz,    t),
                scale:     scLerp(stop.scale, next ? next.scale : stop.scale, t),
            });

            // Mac lid: opens during the entry phase (progress 0 → first stop)
            if (lidEl) {
                const firstStopAt = stops[1] ? stops[1].from : 0.16;
                const lidPct = Math.max(0, 95 - 95 * Math.min(1, p / firstStopAt));
                gsap.set(lidEl, { clipPath: "inset(" + lidPct + "% 0 0 0)" });
            }

            // Discrete updates whenever the stop changes
            if (idx !== prevStopIdx) {
                prevStopIdx = idx;
                applyVisualState(activeStop, stop.x);
            }

            // Scroll hint fades out after first movement
            if (hintEl) {
                hintEl.style.opacity = p < 0.04 ? "1"
                    : String(Math.max(0, 1 - (p - 0.04) / 0.06));
            }
        },
    });

    pillEls.forEach((pill) => {
        const module = pill.dataset.scPill;
        if (!module) return;
        pill.setAttribute("role", "button");
        pill.setAttribute("tabindex", "0");
        const jumpToModule = () => {
            const targetStop = stops.find((entry) => (entry.stopKey || entry.module) === module);
            if (!targetStop || !chapterTrigger) return;
            const yStart = Number(chapterTrigger.start) || section.offsetTop || 0;
            const yEnd = Number(chapterTrigger.end) || (yStart + section.offsetHeight - window.innerHeight);
            const targetY = yStart + Math.max(0, Math.min(0.98, targetStop.from + 0.02)) * (yEnd - yStart);
            window.scrollTo({
                top: targetY,
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
            });
        };
        pill.addEventListener("click", jumpToModule);
        pill.addEventListener("keydown", (event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            jumpToModule();
        });
    });
}

function scSwapImage(imgEl, newSrc) {
    if (!imgEl || !newSrc) return;
    if (imgEl.dataset.scSrc === newSrc) return;
    imgEl.dataset.scSrc = newSrc;
    imgEl.style.opacity = "0";
    var onLoad = function() {
        imgEl.style.opacity = "1";
        imgEl.removeEventListener("load", onLoad);
    };
    imgEl.addEventListener("load", onLoad);
    imgEl.src = newSrc;
    // Image may already be cached
    if (imgEl.complete && imgEl.naturalWidth > 0) imgEl.style.opacity = "1";
}

function scLerp(a, b, t) { return a + (b - a) * t; }

function scEaseInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
