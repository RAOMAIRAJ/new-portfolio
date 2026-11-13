/* ==========================================================================
   RAO.DEV — EXECUTIVE STUDIO INTERACTION ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollReveals();
    initPortfolioFilters();
    initDevicePreviewModal();
    initVideoTestimonials();
    initWorkflowExplorer();
    initLeadEstimator();
    initContactSystem();
});

/* ==================== NAVIGATION & MOBILE DRAWER ==================== */
function initNavigation() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section[id]');

    if (mobileToggle && mobileDrawer) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = mobileDrawer.classList.toggle('open');
            mobileToggle.setAttribute('aria-expanded', String(isOpen));
        });

        mobileDrawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileDrawer.classList.remove('open');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    function updateActiveNav() {
        const scrollY = window.scrollY;
        let currentId = '';

        sections.forEach(sec => {
            if (scrollY >= sec.offsetTop - 220) {
                currentId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const target = link.getAttribute('href');
            link.classList.toggle('active', target === `#${currentId}`);
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
}

/* ==================== SUBTLE SCROLL REVEAL ==================== */
function initScrollReveals() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
        els.forEach(el => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    els.forEach(el => observer.observe(el));
}

/* ==================== PORTFOLIO CATEGORY FILTERS ==================== */
function initPortfolioFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');
    if (!buttons.length || !cards.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            cards.forEach(card => {
                const match = filter === 'all' || card.dataset.category === filter;
                card.classList.toggle('is-hidden', !match);
                if (match) card.classList.add('is-visible');
            });
        });
    });
}

/* ==================== RESPONSIVE DEVICE PREVIEW MODAL ==================== */
function initDevicePreviewModal() {
    const modal = document.getElementById('preview-modal');
    const backdrop = document.getElementById('pm-backdrop');
    const closeBtn = document.getElementById('pm-close');
    const titleEl = document.getElementById('pm-title');
    const tagEl = document.getElementById('pm-tag');
    const externalLink = document.getElementById('pm-external-link');
    const frameWrap = document.getElementById('pm-viewport-frame');
    const iframe = document.getElementById('pm-iframe');
    const loader = document.getElementById('pm-loader');
    const fallback = document.getElementById('pm-fallback');
    const fallbackImg = document.getElementById('pm-fallback-img');
    const devBtns = document.querySelectorAll('.pm-dev-btn');

    if (!modal || !iframe) return;

    let loadTimeout = null;

    function openPreview({ title, url, img, tag }) {
        document.querySelectorAll('.vt-video').forEach(v => {
            if (!v.paused) v.pause();
        });

        titleEl.textContent = title;
        tagEl.textContent = tag || 'Live Site';
        externalLink.href = url;
        fallbackImg.src = img || '';

        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Avoid blocking plain-HTTP sites inside HTTPS preview iframes
        const isMixedContent = window.location.protocol === 'https:' && url.startsWith('http://');
        if (isMixedContent) {
            loader.classList.add('hidden');
            iframe.src = 'about:blank';
            fallback.classList.add('visible');
            return;
        }

        fallback.classList.remove('visible');
        loader.classList.remove('hidden');
        iframe.src = url;

        clearTimeout(loadTimeout);
        loadTimeout = setTimeout(() => {
            loader.classList.add('hidden');
        }, 3200);

        iframe.onload = () => {
            clearTimeout(loadTimeout);
            loader.classList.add('hidden');
        };
    }

    function closePreview() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        iframe.src = 'about:blank';
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.project-preview-trigger').forEach(btn => {
        btn.addEventListener('click', () => {
            openPreview({
                title: btn.dataset.title,
                url: btn.dataset.url,
                img: btn.dataset.img,
                tag: btn.dataset.tag
            });
        });
    });

    devBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            devBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            frameWrap.classList.remove('vp-desktop', 'vp-tablet', 'vp-mobile');
            frameWrap.classList.add(`vp-${btn.dataset.viewport}`);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closePreview);
    if (backdrop) backdrop.addEventListener('click', closePreview);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closePreview();
        }
    });
}

/* ==================== CLIENT VIDEO TESTIMONIALS ==================== */
function initVideoTestimonials() {
    const shells = document.querySelectorAll('[data-video-card]');
    if (!shells.length) return;

    shells.forEach(shell => {
        const video = shell.querySelector('.vt-video');
        const overlay = shell.querySelector('.vt-poster-overlay');
        const playBtn = shell.querySelector('.vt-play-btn');
        if (!video || !overlay) return;

        function startPlayback() {
            shells.forEach(otherShell => {
                if (otherShell === shell) return;
                const otherVideo = otherShell.querySelector('.vt-video');
                if (otherVideo && !otherVideo.paused) otherVideo.pause();
            });

            shell.classList.add('playing');
            video.controls = true;
            video.play().catch(() => {});
        }

        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                startPlayback();
            });
        }

        overlay.addEventListener('click', startPlayback);

        video.addEventListener('ended', () => {
            video.controls = false;
            video.currentTime = 0;
            shell.classList.remove('playing');
        });
    });
}

/* ==================== CLEAN GHL WORKFLOW EXPLORER ==================== */
function initWorkflowExplorer() {
    const nodesContainer = document.getElementById('wf-nodes');
    const svgLayer = document.getElementById('wf-svg');
    const stateLabel = document.getElementById('wf-exec-state');
    const summaryEl = document.getElementById('wf-active-summary');
    const runBtn = document.getElementById('run-workflow-btn');
    const kpi1 = document.getElementById('kpi-1');
    const kpi1Lbl = document.getElementById('kpi-1-lbl');
    const kpi2 = document.getElementById('kpi-2');
    const kpi2Lbl = document.getElementById('kpi-2-lbl');

    if (!nodesContainer || !summaryEl) return;

    const blueprints = {
        speed: {
            kpi1: ['0.4 sec', 'Instant First Touch'],
            kpi2: ['+340%', 'Calendar Booking Lift'],
            nodes: [
                { type: 'Trigger', title: 'Lead Form / Ad', desc: 'Form or ad submission captured', note: 'New inquiry enters GoHighLevel immediately from your website, funnel, or ad lead form.' },
                { type: 'CRM', title: 'Tag & Stage', desc: 'Create pipeline opportunity', note: 'Contact is tagged by source, assigned to the sales owner, and added to the "New Inquiry" column.' },
                { type: 'SMS + Email', title: 'AI First Touch', desc: 'Personalized 2-way outreach', note: 'Conversational SMS and branded confirmation email fire within 0.4 seconds to start qualification.' },
                { type: 'Branch', title: 'Intent Check', desc: 'Reads positive replies', note: 'AI detects booking intent, handles common questions, and branches out disinterested replies cleanly.' },
                { type: 'Goal', title: 'Auto-Book Call', desc: 'Calendar + Zoom + Slack', note: 'Prospect books directly onto the synced calendar, generating a Zoom link and internal rep alert.' }
            ]
        },
        missed: {
            kpi1: ['100%', 'Missed Calls Rescued'],
            kpi2: ['3.8x', 'Recovered Local Leads'],
            nodes: [
                { type: 'Trigger', title: 'Call Missed', desc: 'No-answer or busy line', note: 'Tracking number detects an unanswered inbound call before the caller dials a competitor.' },
                { type: 'SMS', title: 'Auto Text-Back', desc: 'Reaches out in seconds', note: 'Sends a natural text: "Sorry we missed your call — how can we help get this sorted today?"' },
                { type: 'Qualify', title: 'Capture Scope', desc: 'Collects service & zip', note: 'Automated two-way SMS asks quick qualifying questions so your team already has job context.' },
                { type: 'Routing', title: 'Assign Specialist', desc: 'Round-robin rep alert', note: 'Qualified request moves straight into the estimate stage and notifies the available rep.' },
                { type: 'Goal', title: 'Quote Booked', desc: 'Calendar slot confirmed', note: 'Customer locks in an estimate slot on your calendar without waiting on manual callbacks.' }
            ]
        },
        reviews: {
            kpi1: ['4.9 Stars', 'Avg Google Rating'],
            kpi2: ['+210%', 'Monthly Review Volume'],
            nodes: [
                { type: 'Trigger', title: 'Job Completed', desc: 'Pipeline stage -> Won', note: 'Moving a client card to Completed or Paid triggers the reputation workflow automatically.' },
                { type: 'Timing', title: 'Wait 2 Hours', desc: 'Optimal feedback window', note: 'Waits two hours post-service while customer satisfaction is highest before sending outreach.' },
                { type: 'Outreach', title: 'Quick Check-In', desc: '1-tap SMS & email poll', note: 'Polite branded request asks how their experience went using a frictionless tap response.' },
                { type: 'Filter', title: 'Feedback Routing', desc: 'Separates support vs public', note: 'Happy clients route to Google Business Profile; any issues open an internal resolution ticket.' },
                { type: 'Goal', title: 'Google Review', desc: 'Direct GMB review link', note: 'Direct one-click link boosts verified 5-star Google reviews every week without nagging clients.' }
            ]
        },
        wpsync: {
            kpi1: ['Real-Time', 'Webhook Payload Sync'],
            kpi2: ['Zero', 'Manual CSV Exports'],
            nodes: [
                { type: 'WordPress', title: 'WP / Woo Event', desc: 'Order or Elementor form', note: 'Customer places a WooCommerce order or submits a custom WordPress quote form.' },
                { type: 'Bridge', title: 'Zapier / Make', desc: 'JSON webhook payload', note: 'Structured payload is validated and routed cleanly without clunky CSV imports.' },
                { type: 'Mapping', title: 'Custom Fields', desc: 'Syncs SKU, LTV & UTM', note: 'Order value, service tier, and ad tracking parameters map directly into GHL custom fields.' },
                { type: 'Sequence', title: 'VIP Onboarding', desc: 'Tailored welcome flow', note: 'Triggers instant order confirmation SMS, onboarding portal access, and follow-up tasks.' },
                { type: 'Goal', title: 'Retention Flow', desc: '30-day repeat campaign', note: 'Enrolls buyers in timed check-in and cross-sell sequences to grow lifetime customer value.' }
            ]
        }
    };

    let activeKey = 'speed';
    let timers = [];

    function clearTimers() {
        timers.forEach(t => clearTimeout(t));
        timers = [];
    }

    function drawConnections() {
        if (!svgLayer) return;
        svgLayer.innerHTML = '';
        if (window.innerWidth <= 860) return;

        const stageEl = document.getElementById('wf-stage');
        if (!stageEl) return;
        const stageRect = stageEl.getBoundingClientRect();
        const nodeEls = nodesContainer.querySelectorAll('.wf-node');

        for (let i = 0; i < nodeEls.length - 1; i++) {
            const a = nodeEls[i].getBoundingClientRect();
            const b = nodeEls[i + 1].getBoundingClientRect();
            const x1 = a.right - stageRect.left;
            const y1 = a.top + a.height / 2 - stageRect.top;
            const x2 = b.left - stageRect.left;
            const y2 = b.top + b.height / 2 - stageRect.top;
            const cx = (x1 + x2) / 2;

            const pathStr = `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;

            const base = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            base.setAttribute('d', pathStr);
            base.setAttribute('class', 'wf-edge-base');

            const active = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            active.setAttribute('d', pathStr);
            active.setAttribute('class', 'wf-edge-active');

            svgLayer.appendChild(base);
            svgLayer.appendChild(active);
        }
    }

    function selectStep(stepIndex) {
        const bp = blueprints[activeKey];
        const node = bp && bp.nodes[stepIndex];
        if (!node) return;

        const nodeEls = nodesContainer.querySelectorAll('.wf-node');
        const edgeEls = svgLayer.querySelectorAll('.wf-edge-active');

        nodeEls.forEach((el, idx) => {
            el.classList.toggle('active-step', idx === stepIndex);
            el.classList.toggle('completed-step', idx < stepIndex);
        });

        edgeEls.forEach((edge, idx) => {
            edge.classList.toggle('lit', idx < stepIndex);
        });

        if (stateLabel) stateLabel.textContent = `Step 0${stepIndex + 1} · ${node.title}`;
        summaryEl.textContent = node.note;
    }

    function renderBlueprint(key, autoWalk) {
        clearTimers();
        activeKey = key;
        const bp = blueprints[key];
        if (!bp) return;

        if (kpi1) kpi1.textContent = bp.kpi1[0];
        if (kpi1Lbl) kpi1Lbl.textContent = bp.kpi1[1];
        if (kpi2) kpi2.textContent = bp.kpi2[0];
        if (kpi2Lbl) kpi2Lbl.textContent = bp.kpi2[1];

        nodesContainer.innerHTML = bp.nodes.map((node, idx) => `
            <div class="wf-node" data-step="${idx}" tabindex="0" role="button">
                <div class="wf-node-head">
                    <span class="wf-step-num">0${idx + 1}</span>
                    <span class="wf-node-type">${node.type}</span>
                </div>
                <h4>${node.title}</h4>
                <p>${node.desc}</p>
            </div>
        `).join('');

        nodesContainer.querySelectorAll('.wf-node').forEach((el, idx) => {
            el.addEventListener('click', () => {
                clearTimers();
                selectStep(idx);
            });
        });

        requestAnimationFrame(() => {
            drawConnections();
            selectStep(0);
            if (autoWalk) runWalkthrough();
        });
    }

    function runWalkthrough() {
        clearTimers();
        const bp = blueprints[activeKey];
        if (!bp) return;

        bp.nodes.forEach((_, idx) => {
            const t = setTimeout(() => {
                selectStep(idx);
            }, idx * 750);
            timers.push(t);
        });
    }

    document.querySelectorAll('.wf-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.wf-tab').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            renderBlueprint(tab.dataset.wf, false);
        });
    });

    if (runBtn) runBtn.addEventListener('click', runWalkthrough);
    window.addEventListener('resize', drawConnections);

    renderBlueprint('speed', false);
}

/* ==================== LEAD VOLUME ESTIMATOR ==================== */
function initLeadEstimator() {
    const slider = document.getElementById('lead-volume-slider');
    const volVal = document.getElementById('lead-volume-val');
    const manualEl = document.getElementById('roi-manual-calls');
    const autoEl = document.getElementById('roi-auto-calls');
    const hoursEl = document.getElementById('roi-hours-saved');

    if (!slider) return;

    function updateEstimate() {
        const leads = parseInt(slider.value, 10) || 200;
        const manualCalls = Math.round(leads * 0.06);
        const autoCalls = Math.round(leads * 0.28);
        const hoursSaved = Math.max(8, Math.round(leads * 0.165));

        if (volVal) volVal.textContent = `${leads.toLocaleString()} Leads / mo`;
        if (manualEl) manualEl.textContent = `${manualCalls} Calls/mo`;
        if (autoEl) autoEl.textContent = `${autoCalls} Calls/mo`;
        if (hoursEl) hoursEl.textContent = `${hoursSaved} Hrs/mo`;
    }

    slider.addEventListener('input', updateEstimate);
    updateEstimate();
}

/* ==================== CONTACT FORM & COPY EMAIL ==================== */
function initContactSystem() {
    const chips = document.querySelectorAll('.svc-chip');
    const hiddenInput = document.getElementById('selected-service');

    function selectService(serviceName) {
        chips.forEach(chip => {
            chip.classList.toggle('active', chip.dataset.service === serviceName);
        });
        if (hiddenInput) hiddenInput.value = serviceName;
    }

    chips.forEach(chip => {
        chip.addEventListener('click', () => selectService(chip.dataset.service));
    });

    document.querySelectorAll('[data-select-service]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            selectService(trigger.dataset.selectService);
        });
    });

    const copyBtn = document.getElementById('copy-email-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            const email = copyBtn.dataset.email || 'mmairajsa123@gmail.com';
            try {
                await navigator.clipboard.writeText(email);
            } catch (_) {}
            const label = copyBtn.querySelector('span');
            if (!label) return;
            const prev = label.textContent;
            label.textContent = 'Copied';
            setTimeout(() => { label.textContent = prev; }, 2000);
        });
    }

    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submit-btn');
    if (form && submitBtn) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const fd = new FormData(form);
            const name = fd.get('name');
            const email = fd.get('email');
            const service = fd.get('service');
            const message = fd.get('message');

            const prevHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Opening Email Draft...</span>';

            setTimeout(() => {
                const subject = encodeURIComponent(`[Portfolio Inquiry] ${service} — from ${name}`);
                const body = encodeURIComponent(
                    `Hi Rao,\n\nName: ${name}\nEmail: ${email}\nEngagement Type: ${service}\n\nProject Brief:\n${message}\n`
                );
                window.location.href = `mailto:mmairajsa123@gmail.com?subject=${subject}&body=${body}`;

                submitBtn.innerHTML = '<span>Email Draft Opened</span> <i class="fa-solid fa-check"></i>';
                form.reset();

                setTimeout(() => {
                    submitBtn.innerHTML = prevHTML;
                }, 3200);
            }, 350);
        });
    }
}
