document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('guide-search-input');
    const noResults = document.getElementById('guide-no-results');
    const sections = Array.from(document.querySelectorAll('.guide-section[id]'));
    const tocLinks = Array.from(document.querySelectorAll('.toc a[href^="#"]'));

    function setActiveLink(id) {
        tocLinks.forEach((link) => {
            const isMatch = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', isMatch);
            if (isMatch) {
                link.setAttribute('aria-current', 'true');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    function applySearchFilter(query) {
        const q = query.trim().toLowerCase();
        let found = false;

        sections.forEach((section) => {
            const matches = !q || section.textContent.toLowerCase().includes(q);
            section.hidden = !matches;
            if (matches) {
                found = true;
            }
        });

        if (noResults) {
            noResults.hidden = found || q === '';
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            applySearchFilter(event.target.value || '');
        });
    }

    tocLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const id = (link.getAttribute('href') || '').replace('#', '').trim();
            const target = id ? document.getElementById(id) : null;
            if (!target) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.replaceState(null, '', `#${id}`);
            setActiveLink(id);
        });
    });

    if ('IntersectionObserver' in window && sections.length) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.target.hidden && entry.isIntersecting) {
                        setActiveLink(entry.target.id);
                    }
                });
            },
            { rootMargin: '-20% 0px -70% 0px' }
        );

        sections.forEach((section) => observer.observe(section));
    }

    if (window.location.hash) {
        setActiveLink(window.location.hash.replace('#', ''));
    } else if (sections[0]) {
        setActiveLink(sections[0].id);
    }

    window.addEventListener('hashchange', () => {
        const id = window.location.hash.replace('#', '');
        if (id) {
            setActiveLink(id);
        }
    });

    document.querySelectorAll('.anchor-copy').forEach((anchor) => {
        anchor.addEventListener('click', async (event) => {
            event.preventDefault();
            const href = anchor.getAttribute('href') || '';
            const id = href.replace('#', '').trim();
            if (!id) {
                return;
            }

            const fullLink = `${window.location.origin}${window.location.pathname}#${id}`;
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(fullLink);
                    const originalText = anchor.textContent;
                    anchor.textContent = '✅';
                    window.setTimeout(() => {
                        anchor.textContent = originalText;
                    }, 1400);
                } else {
                    window.location.hash = id;
                }
            } catch (_) {
                window.location.hash = id;
            }
        });
    });
});
