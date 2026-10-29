(() => {
    document.documentElement.classList.add('js-enabled');

    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');

    if (hamburger && navMenu) {
        const closeMenu = () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('show-menu');
            hamburger.setAttribute('aria-expanded', 'false');
        };

        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.classList.toggle('active');
            navMenu.classList.toggle('show-menu', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
        });

        navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
        document.addEventListener('click', event => {
            if (!navMenu.contains(event.target) && !hamburger.contains(event.target)) closeMenu();
        });
    }

/*     Made a change here
    Moved report filtering to another File
    But this still works for all elements with 'data-team' attribute */
    document.querySelectorAll('[data-team]').forEach(button => {
        button.addEventListener('click', () => {
            const key = button.dataset.team;
            document.querySelectorAll('.team-gallery').forEach(gallery => {
                gallery.classList.toggle('active', gallery.id === key);
            });
        });
    });


    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.setAttribute('aria-hidden', 'true');
    document.body.append(progressBar);

    const updateProgress = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.transform = `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`;
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    const revealItems = document.querySelectorAll('.events-section-heading, .event-card, .feature-box, .sector-container, .team-member, .report');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealItems.forEach(item => {
            item.classList.add('reveal-item');
            revealObserver.observe(item);
        });
    }

    document.querySelectorAll('.event-filter').forEach(filter => {
        filter.setAttribute('aria-pressed', String(filter.classList.contains('is-active')));
        filter.addEventListener('click', () => {
            const category = filter.dataset.filter;
            document.querySelectorAll('.event-filter').forEach(item => {
                const isActive = item === filter;
                item.classList.toggle('is-active', isActive);
                item.setAttribute('aria-pressed', String(isActive));
            });
            document.querySelectorAll('.event-card[data-category]').forEach(card => {
                const visible = category === 'all' || card.dataset.category === category;
                card.classList.toggle('is-hidden', !visible);
            });
        });
    });

    if (window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('.event-card').forEach(card => {
            card.addEventListener('pointermove', event => {
                const bounds = card.getBoundingClientRect();
                const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -5;
                const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 5;
                card.style.setProperty('--rotate-x', `${rotateX}deg`);
                card.style.setProperty('--rotate-y', `${rotateY}deg`);
            });
            card.addEventListener('pointerleave', () => {
                card.style.setProperty('--rotate-x', '0deg');
                card.style.setProperty('--rotate-y', '0deg');
            });
        });
    }

    const reportModal = document.querySelector('.report-modal');
    const reportFrame = reportModal?.querySelector('iframe');
    const reportTitle = reportModal?.querySelector('#report-modal-title');
    const closeReport = () => {
        if (!reportModal) return;
        reportModal.close();
        if (reportFrame) reportFrame.src = 'about:blank';
    };
    document.querySelectorAll('.preview-report').forEach(link => {
        link.addEventListener('click', event => {
            if (!reportModal || !reportFrame) return;
            event.preventDefault();
            reportFrame.src = link.href;
            reportTitle.textContent = link.dataset.title || 'Report preview';
            reportModal.showModal();
        });
    });
    document.querySelector('.close-report')?.addEventListener('click', closeReport);
    reportModal?.addEventListener('click', event => {
        if (event.target === reportModal) closeReport();
    });
    reportModal?.addEventListener('close', () => {
        if (reportFrame) reportFrame.src = 'about:blank';
    });

    const form = document.getElementById('contactForm');
    if (form && window.emailjs) {
        emailjs.init('pU8RlrAmLHMLf6IpW');
        form.addEventListener('submit', event => {
            event.preventDefault();
            const params = {
                from_name: form.elements.name.value,
                from_email: form.elements.email.value,
                message: form.elements.message.value
            };
            emailjs.send('service_d0gl2v8', 'template_7oyp37i', params)
                .then(() => {
                    alert('Email sent successfully!');
                    form.reset();
                })
                .catch(error => alert(`Failed to send email: ${error.text}`));
        });
    }
})();
