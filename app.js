document.addEventListener('DOMContentLoaded', async () => {
    let data = null;

    async function loadData() {
        try {
            const response = await fetch('data-2m.json?v=' + Date.now());
            if (!response.ok) throw new Error('Failed to load data');
            data = await response.json();
            renderContent();
        } catch (error) {
            console.error('Error loading data:', error);
            showFallbackContent();
        }
    }

    function renderContent() {
        if (!data) return;

        // Navigation Menu
        renderNavigation();

        // Cover Section
        renderCover();

        // Agenda
        renderAgenda();

        // Timeline
        renderTimeline();

        // Mentoring
        renderMentoring();

        // Soft Skills
        renderSoftSkills();

        // Micro Trainings
        renderMicroTrainings();

        // Metrics
        renderMetrics();

        // Rewards
        renderRewards();

        // Next Steps
        renderNextSteps();

        // Initialize scroll animations
        initScrollAnimations();
    }

    function renderNavigation() {
        const navMenu = document.getElementById('navMenu');
        const sections = [
            { label: 'Главная', href: '#cover' },
            { label: 'Повестка', href: '#agenda' },
            { label: 'График', href: '#timeline' },
            { label: 'Наставники', href: '#mentoring' },
            { label: 'Soft Skills', href: '#soft-skills' },
            { label: 'Метрики', href: '#metrics' },
            { label: 'Итоги', href: '#next-steps' }
        ];

        navMenu.innerHTML = sections.map(section =>
            `<a href="${section.href}" class="nav-link">${section.label}</a>`
        ).join('');

        // Smooth scroll and active state
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Update active nav on scroll
        window.addEventListener('scroll', () => {
            let current = '';
            document.querySelectorAll('.section').forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= sectionTop - 100) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    function renderCover() {
        if (!data.cover) return;

        const title = document.querySelector('.cover-title');
        const subtitle = document.querySelector('.cover-subtitle');
        const cta = document.querySelector('.cover-cta');

        title.textContent = data.cover.title;
        subtitle.textContent = data.cover.subtitle;

        cta.innerHTML = data.cover.cta.map(button =>
            `<a href="${button.href}">${button.label}</a>`
        ).join('');
    }

    function renderAgenda() {
        if (!data.agenda) return;

        const grid = document.querySelector('.agenda-grid');
        grid.innerHTML = data.agenda.map((item, index) => `
            <div class="agenda-item">
                <div class="agenda-item-icon">
                    <span style="font-size: 24px; color: var(--accent);">${index + 1}</span>
                </div>
                <div class="agenda-item-text">${item}</div>
            </div>
        `).join('');
    }

    function renderTimeline() {
        if (!data.timeline) return;

        const container = document.querySelector('.timeline-container');

        // For desktop view
        if (window.innerWidth > 768) {
            const tracks = ['Основа', 'Buddy', 'Наставники', 'Soft Skills', 'Контроль'];

            let html = '<div class="timeline-header"></div>';
            data.timeline.forEach(week => {
                html += `<div class="timeline-header week-header">${week.week}</div>`;
            });

            tracks.forEach(track => {
                const trackKey = track.toLowerCase().replace('основа', 'core').replace('buddy', 'buddy').replace('наставники', 'mentors').replace('soft skills', 'soft').replace('контроль', 'control');
                html += `<div class="timeline-header">${track}</div>`;

                data.timeline.forEach(week => {
                    const items = week[trackKey] || [];
                    html += `<div class="timeline-cell">
                        <ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>
                    </div>`;
                });
            });

            container.innerHTML = html;
        } else {
            // Mobile view with horizontal scroll
            container.innerHTML = data.timeline.map(week => `
                <div class="timeline-week">
                    <h3 style="color: var(--accent); margin-bottom: 16px;">${week.week}</h3>
                    ${week.core && week.core.length > 0 ? `
                        <div style="margin-bottom: 12px;">
                            <strong style="color: var(--text-primary);">Основа:</strong>
                            <ul style="list-style: none; padding: 0; margin-top: 8px;">
                                ${week.core.map(item => `<li style="padding: 4px 0; color: var(--text-secondary);">• ${item}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${week.buddy && week.buddy.length > 0 ? `
                        <div style="margin-bottom: 12px;">
                            <strong style="color: var(--text-primary);">Buddy:</strong>
                            <ul style="list-style: none; padding: 0; margin-top: 8px;">
                                ${week.buddy.map(item => `<li style="padding: 4px 0; color: var(--text-secondary);">• ${item}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${week.mentors && week.mentors.length > 0 ? `
                        <div style="margin-bottom: 12px;">
                            <strong style="color: var(--text-primary);">Наставники:</strong>
                            <ul style="list-style: none; padding: 0; margin-top: 8px;">
                                ${week.mentors.map(item => `<li style="padding: 4px 0; color: var(--text-secondary);">• ${item}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${week.soft && week.soft.length > 0 ? `
                        <div style="margin-bottom: 12px;">
                            <strong style="color: var(--text-primary);">Soft Skills:</strong>
                            <ul style="list-style: none; padding: 0; margin-top: 8px;">
                                ${week.soft.map(item => `<li style="padding: 4px 0; color: var(--text-secondary);">• ${item}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    ${week.control && week.control.length > 0 ? `
                        <div>
                            <strong style="color: var(--text-primary);">Контроль:</strong>
                            <ul style="list-style: none; padding: 0; margin-top: 8px;">
                                ${week.control.map(item => `<li style="padding: 4px 0; color: var(--text-secondary);">• ${item}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            `).join('');
        }
    }

    function renderMentoring() {
        if (!data.mentoring) return;

        const buddyContent = document.querySelector('.buddy-content');
        const mentorContent = document.querySelector('.mentor-content');

        if (data.mentoring.buddy) {
            buddyContent.innerHTML = `
                <p style="margin-bottom: 16px; color: var(--text-secondary);">
                    <strong>Длительность:</strong> ${data.mentoring.buddy.duration}
                </p>
                <ul style="list-style: none; padding: 0;">
                    ${data.mentoring.buddy.tasks.map(task =>
                        `<li style="padding: 8px 0; display: flex; align-items: center; gap: 12px;">
                            <span style="color: var(--accent); font-weight: bold;">✓</span>
                            ${task}
                        </li>`
                    ).join('')}
                </ul>
            `;
        }

        if (data.mentoring.mentor) {
            mentorContent.innerHTML = `
                <p style="margin-bottom: 16px; color: var(--text-secondary);">
                    <strong>Роль:</strong> ${data.mentoring.mentor.role}
                </p>
                <ul style="list-style: none; padding: 0;">
                    ${data.mentoring.mentor.tasks.map(task =>
                        `<li style="padding: 8px 0; display: flex; align-items: center; gap: 12px;">
                            <span style="color: var(--accent); font-weight: bold;">✓</span>
                            ${task}
                        </li>`
                    ).join('')}
                </ul>
            `;
        }
    }

    function renderSoftSkills() {
        if (!data.softSkills) return;

        const grid = document.querySelector('.skills-grid');
        grid.innerHTML = data.softSkills.map((skill, index) => `
            <div class="skill-card">
                <div class="skill-number">${index + 1}</div>
                <p>${skill}</p>
            </div>
        `).join('');
    }

    function renderMicroTrainings() {
        if (!data.microTrainings) return;

        const formatText = document.querySelector('.micro-format-text');
        const examples = document.querySelector('.micro-examples');

        formatText.textContent = data.microTrainings.format;

        examples.innerHTML = `
            <h3 style="margin-bottom: 16px; color: var(--text-primary);">Примеры тем:</h3>
            ${data.microTrainings.examples.map(example =>
                `<div class="micro-example">${example}</div>`
            ).join('')}
        `;
    }

    function renderMetrics() {
        if (!data.metrics) return;

        const grid = document.querySelector('.metrics-grid');
        const metricTypes = [
            { key: 'knowledge', title: 'Знание' },
            { key: 'skill', title: 'Навык' },
            { key: 'result', title: 'Результат' },
            { key: 'engagement', title: 'Вовлечённость' }
        ];

        grid.innerHTML = metricTypes.map(type => `
            <div class="metric-card">
                <h3>${type.title}</h3>
                <ul>
                    ${data.metrics[type.key].map(item =>
                        `<li>${item}</li>`
                    ).join('')}
                </ul>
            </div>
        `).join('');
    }

    function renderRewards() {
        if (!data.rewards) return;

        const grid = document.querySelector('.rewards-grid');
        const icons = ['🏆', '⭐', '👏', '🎯'];

        grid.innerHTML = data.rewards.map((reward, index) => `
            <div class="reward-card">
                <div class="reward-icon">${icons[index % icons.length]}</div>
                <div class="reward-title">${reward}</div>
            </div>
        `).join('');
    }

    function renderNextSteps() {
        if (!data.nextSteps) return;

        const section = document.querySelector('#next-steps .content');

        // Добавляем заголовок секции если есть
        if (data.nextSteps.title) {
            const titleEl = document.querySelector('#next-steps h2');
            if (titleEl) titleEl.textContent = data.nextSteps.title;
        }

        // Рендерим действия
        const list = document.querySelector('.next-steps-list');
        const actions = data.nextSteps.actions || data.nextSteps; // Поддержка старого формата
        list.innerHTML = Array.isArray(actions) ? actions.map((step, index) => `
            <div class="next-step">
                <div class="next-step-number">${index + 1}</div>
                <div>${step}</div>
            </div>
        `).join('') : '';

        // Добавляем блок с результатами если есть
        if (data.nextSteps.results) {
            const resultsHtml = `
                <div class="results-section">
                    <h3 class="results-title">${data.nextSteps.results.title}</h3>
                    <div class="results-grid">
                        ${data.nextSteps.results.items.map((result, index) => `
                            <div class="result-item">
                                <div class="result-icon">✓</div>
                                <div class="result-text">${result}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            list.insertAdjacentHTML('afterend', resultsHtml);
        }
    }

    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationDelay = '0.1s';
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });
    }

    function showFallbackContent() {
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2>Не удалось загрузить данные</h2>
                    <p>Проверьте наличие файла data-2m.json</p>
                </div>
            `;
        }
    }

    // Start loading data
    loadData();

    // Handle window resize for timeline
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (data && data.timeline) {
                renderTimeline();
            }
        }, 250);
    });
});