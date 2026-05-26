(function () {
    const featureStacksController = initFeatureStacks();
    initScrollReveal();
    initFeatureSlider(featureStacksController);
    initTypingHeadline();
    initHomeWorkflow();
    initPersonaMatch();
    initDeviceExperience();
    initWorkflowCounters();
    initPlaybookPipelineStory();
    initShowcaseChapters();
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
    const scenarios = {
        sprint: {
            label: "Sprint",
            steps: {
                goal: {
                    title: "Define the sprint objective clearly",
                    description: "Set the sprint goal, completion criteria, and review checkpoint before execution starts.",
                    youDo: "Capture sprint target, timeline, and definition of done.",
                    clicktDoes: "Creates one shared objective across Teams and Checklist.",
                    outputs: ["Goal brief", "Sprint timeline", "Execution scope"],
                    benefit: "Everyone starts aligned on the same finish line.",
                    before: "Scope drift and unclear sprint outcomes.",
                    after: "One objective with visible success criteria.",
                    moduleLabel: "Teams",
                    moduleHref: "playbook.html#teams",
                },
                assign: {
                    title: "Assign owners and due dates",
                    description: "Break down the goal into action items and assign every task to a responsible owner.",
                    youDo: "Map deliverables, owners, and deadlines.",
                    clicktDoes: "Tracks accountability with clear assignee visibility.",
                    outputs: ["Owner map", "Task queue", "Deadline tracker"],
                    benefit: "Fewer dropped tasks and less follow-up overhead.",
                    before: "Tasks bounce between teammates without ownership.",
                    after: "Each item has one owner and due date.",
                    moduleLabel: "Checklist",
                    moduleHref: "playbook.html#checklist",
                },
                execute: {
                    title: "Run execution with live status",
                    description: "Track progress updates in one place and resolve blockers before they impact delivery.",
                    youDo: "Update status and flag risks during the sprint.",
                    clicktDoes: "Surfaces blockers and completion changes in real time.",
                    outputs: ["Progress board", "Blocker alerts", "Daily status view"],
                    benefit: "Teams move faster with fewer status meetings.",
                    before: "Updates are scattered across messages and calls.",
                    after: "Live execution view with clear momentum.",
                    moduleLabel: "Interactive Showcase",
                    moduleHref: "#showcase-iphone",
                },
                analyze: {
                    title: "Analyze sprint outcomes quickly",
                    description: "Import delivery metrics and compare planned vs actual performance in Builder.",
                    youDo: "Upload sprint exports and inspect completion trends.",
                    clicktDoes: "Generates understandable visuals from raw data.",
                    outputs: ["Velocity chart", "Completion summary", "Gap analysis"],
                    benefit: "Retrospectives are based on evidence, not guesswork.",
                    before: "Hard to interpret sprint data quickly.",
                    after: "Clear insight on what improved and what slipped.",
                    moduleLabel: "Builder",
                    moduleHref: "playbook.html#builder",
                },
                present: {
                    title: "Present learnings and next actions",
                    description: "Convert sprint insights into a concise update deck for leaders and stakeholders.",
                    youDo: "Select key outcomes and next sprint actions.",
                    clicktDoes: "Turns analysis into polished presentation-ready narratives.",
                    outputs: ["Sprint review deck", "Action plan slide", "PDF export"],
                    benefit: "Faster closeout and better stakeholder confidence.",
                    before: "Sprint reviews take hours to compile.",
                    after: "Decision-ready updates shared in minutes.",
                    moduleLabel: "Presentation",
                    moduleHref: "playbook.html#presentation",
                },
            },
        },
        onboarding: {
            label: "Onboarding",
            steps: {
                goal: {
                    title: "Set onboarding success outcomes",
                    description: "Define what a successful client onboarding looks like for day 1, week 1, and month 1.",
                    youDo: "Document milestones and expected handoff points.",
                    clicktDoes: "Structures onboarding goals into shared operational steps.",
                    outputs: ["Onboarding success map", "Milestone timeline", "Shared kickoff plan"],
                    benefit: "Clients and teams align on expectations immediately.",
                    before: "Different teams define onboarding differently.",
                    after: "One standardized onboarding target for every client.",
                    moduleLabel: "Checklist",
                    moduleHref: "playbook.html#checklist",
                },
                assign: {
                    title: "Assign onboarding responsibilities",
                    description: "Assign each onboarding step to a specific owner across operations, support, and account teams.",
                    youDo: "Set owners for setup, training, and follow-up tasks.",
                    clicktDoes: "Makes ownership visible across the full onboarding journey.",
                    outputs: ["Owner assignments", "Task handoff list", "SLA checkpoints"],
                    benefit: "Fewer onboarding delays and smoother handoffs.",
                    before: "Important setup steps are assumed, not assigned.",
                    after: "Everyone knows exactly what they own and when.",
                    moduleLabel: "Teams",
                    moduleHref: "playbook.html#teams",
                },
                execute: {
                    title: "Execute with consistency",
                    description: "Run each onboarding with repeatable checklist flows while tracking real-time completion.",
                    youDo: "Complete and verify onboarding tasks in sequence.",
                    clicktDoes: "Keeps repeatable workflow quality consistent client to client.",
                    outputs: ["Live completion view", "At-risk task flags", "Client readiness status"],
                    benefit: "Onboarding quality scales without extra chaos.",
                    before: "Every onboarding feels custom and error-prone.",
                    after: "Reliable onboarding outcomes with less rework.",
                    moduleLabel: "Interactive Showcase",
                    moduleHref: "#showcase-ipad",
                },
                analyze: {
                    title: "Measure onboarding performance",
                    description: "Use Builder to inspect time-to-value, completion rates, and bottlenecks.",
                    youDo: "Import onboarding data and compare cohorts.",
                    clicktDoes: "Highlights process bottlenecks and completion gaps visually.",
                    outputs: ["Cycle-time chart", "Completion dashboard", "Bottleneck summary"],
                    benefit: "Improve onboarding speed with measurable insight.",
                    before: "It is unclear where onboarding slows down.",
                    after: "You can pinpoint and fix recurring delays quickly.",
                    moduleLabel: "Builder",
                    moduleHref: "playbook.html#builder",
                },
                present: {
                    title: "Report onboarding impact",
                    description: "Share onboarding outcomes, risks, and improvements with clients or leadership.",
                    youDo: "Summarize what improved and what needs attention.",
                    clicktDoes: "Builds clean stakeholder-ready reports from workflow data.",
                    outputs: ["Onboarding report deck", "Risk summary", "Improvement roadmap"],
                    benefit: "Stronger client trust and faster internal decision-making.",
                    before: "Reporting takes too long and lacks consistency.",
                    after: "Clear onboarding impact updates delivered quickly.",
                    moduleLabel: "Presentation",
                    moduleHref: "playbook.html#presentation",
                },
            },
        },
        weekly: {
            label: "Weekly Report",
            steps: {
                goal: {
                    title: "Define the weekly reporting question",
                    description: "Start from the decisions the meeting needs, not from a pile of raw metrics.",
                    youDo: "Choose KPIs and define the story you need to explain.",
                    clicktDoes: "Anchors reporting around decisions and outcomes.",
                    outputs: ["Reporting objective", "KPI focus list", "Audience goals"],
                    benefit: "Reports become strategic instead of purely descriptive.",
                    before: "Weekly updates are metric dumps without direction.",
                    after: "Every chart and slide maps to a decision.",
                    moduleLabel: "Builder",
                    moduleHref: "playbook.html#builder",
                },
                assign: {
                    title: "Assign data and review owners",
                    description: "Delegate who pulls data, validates numbers, and reviews narrative quality.",
                    youDo: "Set ownership for data prep and presentation review.",
                    clicktDoes: "Keeps report preparation accountable and transparent.",
                    outputs: ["Owner checklist", "Data QA tasks", "Review timeline"],
                    benefit: "Faster prep with fewer last-minute issues.",
                    before: "Reporting prep is rushed and hard to coordinate.",
                    after: "The weekly process runs like a repeatable system.",
                    moduleLabel: "Checklist",
                    moduleHref: "playbook.html#checklist",
                },
                execute: {
                    title: "Execute report production flow",
                    description: "Track progress from data import through insight drafting and meeting prep.",
                    youDo: "Run the weekly reporting routine and close open items.",
                    clicktDoes: "Shows where the workflow is blocked before deadlines.",
                    outputs: ["Prep status board", "Open issue list", "Meeting readiness view"],
                    benefit: "Predictable report delivery week after week.",
                    before: "Status is unclear until the last minute.",
                    after: "Report readiness is visible throughout the week.",
                    moduleLabel: "Teams",
                    moduleHref: "playbook.html#teams",
                },
                analyze: {
                    title: "Generate insights from exports",
                    description: "Use Builder to transform weekly CSV exports into digestible insights and trend visuals.",
                    youDo: "Import files and compare this week versus prior periods.",
                    clicktDoes: "Builds charts and summaries quickly from raw exports.",
                    outputs: ["Trend chart", "Variance analysis", "KPI table"],
                    benefit: "Teams reach insight faster with less manual formatting.",
                    before: "Manual spreadsheet analysis is slow and error-prone.",
                    after: "Insights are ready in minutes, not hours.",
                    moduleLabel: "Builder",
                    moduleHref: "playbook.html#builder",
                },
                present: {
                    title: "Present clear weekly recommendations",
                    description: "Convert analysis into slides that explain what happened, why it matters, and what to do next.",
                    youDo: "Highlight key changes and next actions for stakeholders.",
                    clicktDoes: "Creates narrative-friendly slides directly from analyzed output.",
                    outputs: ["Weekly deck", "Decision summary", "Next-week action list"],
                    benefit: "Meetings focus on action, not data interpretation.",
                    before: "Stakeholders spend time decoding metrics.",
                    after: "Stakeholders can act immediately on recommendations.",
                    moduleLabel: "Presentation",
                    moduleHref: "playbook.html#presentation",
                },
            },
        },
        project: {
            label: "Class Project",
            steps: {
                goal: {
                    title: "Set project scope and deliverables",
                    description: "Define the final outcome, grading criteria, and submission timeline from day one.",
                    youDo: "Break the project into clear milestones and outcomes.",
                    clicktDoes: "Converts broad project ideas into actionable workflow structure.",
                    outputs: ["Project scope", "Milestone plan", "Due-date map"],
                    benefit: "Teams avoid last-minute crunch and confusion.",
                    before: "Project direction stays vague for too long.",
                    after: "Everyone knows what must be delivered and by when.",
                    moduleLabel: "Teams",
                    moduleHref: "playbook.html#teams",
                },
                assign: {
                    title: "Assign roles and contribution areas",
                    description: "Allocate research, writing, analysis, and design tasks to each teammate.",
                    youDo: "Assign owners for each part of the project workload.",
                    clicktDoes: "Tracks accountability and ownership across the team.",
                    outputs: ["Role matrix", "Task assignments", "Deadline checklist"],
                    benefit: "Balanced contribution and clearer accountability.",
                    before: "Work distribution is uneven and unclear.",
                    after: "Contribution expectations are explicit and trackable.",
                    moduleLabel: "Checklist",
                    moduleHref: "playbook.html#checklist",
                },
                execute: {
                    title: "Execute and monitor progress",
                    description: "Track completion and blockers while collaborators work in parallel.",
                    youDo: "Update progress and unblock tasks during project week.",
                    clicktDoes: "Maintains one live view of project health.",
                    outputs: ["Live progress status", "Blocker list", "Completion tracker"],
                    benefit: "Fewer deadline surprises and smoother collaboration.",
                    before: "Team only realizes gaps close to submission.",
                    after: "Risks are visible early enough to fix.",
                    moduleLabel: "Interactive Showcase",
                    moduleHref: "#showcase-mac",
                },
                analyze: {
                    title: "Analyze project findings",
                    description: "Use Builder to summarize collected data or experiment results into clear visuals.",
                    youDo: "Import findings and test different chart views.",
                    clicktDoes: "Transforms research data into presentation-ready insights.",
                    outputs: ["Result chart", "Findings summary", "Evidence table"],
                    benefit: "Stronger arguments backed by clear evidence.",
                    before: "Raw data is hard to communicate in final presentations.",
                    after: "Findings become easy to explain and defend.",
                    moduleLabel: "Builder",
                    moduleHref: "playbook.html#builder",
                },
                present: {
                    title: "Present and submit confidently",
                    description: "Build polished slides with a logical story and export final materials for submission.",
                    youDo: "Organize findings, storyline, and final recommendations.",
                    clicktDoes: "Creates clean, coherent presentation output quickly.",
                    outputs: ["Final deck", "Submission-ready PDF", "Q&A prep notes"],
                    benefit: "Higher-quality delivery with less final-night stress.",
                    before: "Presentation polishing happens too late.",
                    after: "Submission is ready early and polished.",
                    moduleLabel: "Presentation",
                    moduleHref: "playbook.html#presentation",
                },
            },
        },
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
        const scenarioData = scenarios[state.scenario] || scenarios.sprint;
        const stepData = scenarioData.steps[state.step] || scenarioData.steps.goal;
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
        scenarioLabelEl.textContent = scenarioData.label;
        titleEl.textContent = stepData.title;
        descriptionEl.textContent = stepData.description;
        youDoEl.textContent = stepData.youDo;
        clicktDoesEl.textContent = stepData.clicktDoes;
        benefitEl.textContent = stepData.benefit;
        beforeEl.textContent = stepData.before;
        afterEl.textContent = stepData.after;

        outputListEl.innerHTML = "";
        (stepData.outputs || []).forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item;
            outputListEl.appendChild(li);
        });

        moduleLinkEl.textContent = `See this in ${stepData.moduleLabel}`;
        moduleLinkEl.setAttribute("href", stepData.moduleHref);

        const nextStep = stepOrder[(stepIndex + 1) % stepOrder.length];
        const nextStepLabel = buttons.find((button) => button.dataset.workflowStepBtn === nextStep)?.textContent || "Next";
        nextButton.textContent = `Next step: ${nextStepLabel.replace(/^\d+\.\s*/, "")} \u2192`;
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
        if (!scenarios[scenario]) return;
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
    const P = "IOS Promotion/Clickt Images/";
    const SHARED_SHOWCASE_BG = "#ffffff";
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCompactMobile = window.matchMedia("(max-width: 640px)").matches;
    const hasMotionStack = Boolean(window.gsap && window.ScrollTrigger);
    const allowShowcaseMotion = hasMotionStack && (!prefersReducedMotion || isCompactMobile);
    const platformButtons = Array.from(document.querySelectorAll("[data-showcase-platform-btn]"));
    const platformSections = Array.from(document.querySelectorAll("[data-showcase-platform-section]"));

    if (!platformSections.length) return;

    // ── Stop tables: each entry defines the device state at that
    //    scroll-progress threshold.  Between stops GSAP interpolates
    //    position/rotation/scale; image + copy swap discretely.
    const iphoneStops = [
        { from: 0,    x:   0, ry:   0, rz:  0, scale: 0.84, module: null,           img: P+"iphone-homepage.png",        satA: null,                        satB: null,                         bg: SHARED_SHOWCASE_BG },
        { from: 0.13, x: -24, ry: -10, rz:  0, scale: 1,    module: "teams",        img: P+"iphone-team1.png",           satA: P+"iphone-team2.png",        satB: P+"iphone-team3.png",         bg: SHARED_SHOWCASE_BG },
        { from: 0.38, x: -22, ry: -9,  rz:  0, scale: 1,    module: "builder",      img: P+"iphone-builder1.png",        satA: P+"iphone-builder2.png",     satB: P+"iphone-builder3.png",      bg: SHARED_SHOWCASE_BG },
        { from: 0.60, x: -20, ry: -7,  rz: -2, scale: 1,    module: "presentation", img: P+"iphone-presentation.png",    satA: P+"iphone-presentation1.png",satB: P+"iphone-presentation2.png", bg: SHARED_SHOWCASE_BG },
        { from: 0.78, x: -22, ry: -8,  rz:  0, scale: 1,    module: "checklist",    img: P+"iphone-checklist.png",       satA: P+"iphone-checklist1.png",   satB: P+"iphone-checklist2.png",    bg: SHARED_SHOWCASE_BG },
        { from: 0.93, x:   0, ry:   0, rz:  0, scale: 0.9,  module: null,           img: P+"iphone-calendar1.png",       satA: null,                        satB: null,                         bg: SHARED_SHOWCASE_BG },
    ];

    const ipadStops = [
        { from: 0,    x:   0, ry:   0, rz:  0, scale: 0.84, module: null,           img: P+"ipad-homepage.png",          satA: null,                        satB: null,                         bg: SHARED_SHOWCASE_BG },
        { from: 0.14, x: -24, ry: -8,  rz:  0, scale: 1,    module: "teams",        img: P+"ipad-team1.png",             satA: P+"ipad-team2.png",          satB: P+"ipad-team3.png",           bg: SHARED_SHOWCASE_BG },
        { from: 0.39, x: -22, ry: -7,  rz: -2, scale: 1,    module: "builder",      img: P+"ipad-builder1.png",          satA: P+"ipad-builder2.png",       satB: P+"ipad-builder3.png",        bg: SHARED_SHOWCASE_BG },
        { from: 0.62, x: -20, ry: -5,  rz:  0, scale: 1,    module: "presentation", img: P+"ipad-presentation.png",      satA: P+"ipad-presentation1.png",  satB: P+"ipad-presentation2.png",   bg: SHARED_SHOWCASE_BG },
        { from: 0.80, x: -22, ry: -5,  rz:  0, scale: 0.94, module: "checklist",    img: P+"ipad-checklist.png",         satA: P+"ipad-calendar.png",       satB: P+"ipad-setting.png",         bg: SHARED_SHOWCASE_BG },
        { from: 0.93, x:   0, ry:   0, rz:  0, scale: 0.84, module: null,           img: P+"ipad-login.png",             satA: null,                        satB: null,                         bg: SHARED_SHOWCASE_BG },
    ];

    const macStops = [
        { from: 0,    x:  0, ry:   0, rz: 0, scale: 0.82, module: null,           img: P+"mac-homepage.png",           satA: null,                      satB: null,                    bg: SHARED_SHOWCASE_BG },
        { from: 0.16, x: -14, ry:  -6, rz: 0, scale: 1,    module: "teams",        img: P+"mac-Team1.png",              satA: P+"mac-Team2.png",         satB: P+"mac-Team3.png",       bg: SHARED_SHOWCASE_BG },
        { from: 0.40, x: -12, ry:  -4, rz: 0, scale: 1,    module: "builder",      img: P+"mac-Builder1.png",           satA: P+"mac-Builder2.png",      satB: null,                    bg: SHARED_SHOWCASE_BG },
        { from: 0.63, x: -14, ry:  -5, rz: 0, scale: 1,    module: "presentation", img: P+"mac-presentation1.png",      satA: P+"mac-presentation2.png", satB: null,                    bg: SHARED_SHOWCASE_BG },
        { from: 0.82, x: -12, ry:  -3, rz: 0, scale: 0.95, module: "checklist",    img: P+"mac-checklist.png",          satA: P+"mac-calendar1.png",     satB: P+"Mac-setting.png",     bg: SHARED_SHOWCASE_BG },
        { from: 0.95, x:  0, ry:   0, rz: 0, scale: 0.86, module: null,           img: P+"Mac-login.png",              satA: null,                      satB: null,                    bg: SHARED_SHOWCASE_BG },
    ];

    const tuneStopsForCompactMobile = (stops) => {
        return stops.map((stop) => {
            const isSingleFrameStop = !stop.module && !stop.satA && !stop.satB;
            const scaledStop = {
                ...stop,
                x: Math.round(stop.x * 0.68),
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
    if (satA) gsap.set(satA, { opacity: 0 });
    if (satB) gsap.set(satB, { opacity: 0 });
    // Mac: start lid closed
    if (lidEl) gsap.set(lidEl, { clipPath: "inset(95% 0 0 0)" });

    let prevStopIdx = -1;
    const stops = cfg.stops;
    const applyVisualState = (visualStop, xValue) => {
        if (!visualStop) return;
        scSwapImage(img, visualStop.img);

        if (!visualStop.satA && !visualStop.satB) {
            if (satA) gsap.to(satA, { opacity: 0, duration: 0.3 });
            if (satB) gsap.to(satB, { opacity: 0, duration: 0.3 });
        } else {
            if (satA) {
                if (visualStop.satA) { satA.src = visualStop.satA; gsap.to(satA, { opacity: 1, duration: 0.45, delay: 0.05 }); }
                else                 { gsap.to(satA, { opacity: 0, duration: 0.3 }); }
            }
            if (satB) {
                if (visualStop.satB) { satB.src = visualStop.satB; gsap.to(satB, { opacity: 1, duration: 0.45, delay: 0.12 }); }
                else                 { gsap.to(satB, { opacity: 0, duration: 0.3 }); }
            }
        }

        if (wrap) wrap.classList.toggle("sat-left", xValue > 5);
        copySlots.forEach(function(slot) {
            slot.classList.toggle("is-active", slot.dataset.scStop === visualStop.module);
        });
        if (copyEl) copyEl.classList.toggle("copy-left", xValue > 5);
        pillEls.forEach(function(pill) {
            pill.classList.toggle("is-active", pill.dataset.scPill === visualStop.module);
        });

        section.classList.toggle(
            "is-single-frame",
            !visualStop.module && !visualStop.satA && !visualStop.satB
        );
        section.classList.toggle(
            "has-satellites",
            Boolean(visualStop.satA || visualStop.satB)
        );
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

            // Background color (per-stop, not interpolated)
            if (bgEl) bgEl.style.backgroundColor = activeStop.bg;

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
            const targetStop = stops.find((entry) => entry.module === module);
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
