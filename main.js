/* ==========================================================================
   RAO.DEV V3 — HIGHLEVEL GOLD EXECUTIVE 3D, VIDEO TESTIMONIALS & AI ENGINE
   ========================================================================== */

let lenisInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initSmoothScroll();
    initCustomCursor();
    initNavigation();
    initKineticHeadline();
    initGlobalWebGL();
    initHero3DCore();
    initWorkflowSimulator();
    initComparisonSlider();
    initPortfolioFilters();
    initDevicePreviewModal();
    initVideoTestimonials();
    init3DTiltCards();
    initScrollRevealsAndCounters();
    initAIAssistant();
    initContactSystem();
});

/* ==================== 1. LUXURY PRELOADER ==================== */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const fill = document.getElementById('preloader-fill');
    const percentEl = document.getElementById('preloader-percent');
    const statusEl = document.getElementById('preloader-status');
    if (!preloader) return;

    let progress = 0;
    const stages = [
        'MOUNTING 3D HIGHLEVEL STAGE...',
        'LOADING GHL WORKFLOW ENGINE...',
        'SYNCING CLIENT VIDEO VAULT...',
        'READY // RAO.DEV'
    ];

    const timer = setInterval(() => {
        progress += Math.floor(Math.random() * 20) + 14;
        if (progress >= 100) {
            progress = 100;
            clearInterval(timer);
            if (fill) fill.style.width = '100%';
            if (percentEl) percentEl.textContent = '100%';
            if (statusEl) statusEl.textContent = stages[3];

            setTimeout(() => {
                preloader.classList.add('loaded');
                document.querySelectorAll('.hero-section .reveal-up, .hero-section .reveal-scale').forEach(el => {
                    el.classList.add('is-visible');
                });
            }, 200);
        } else {
            if (fill) fill.style.width = `${progress}%`;
            if (percentEl) percentEl.textContent = `${progress}%`;
            const idx = Math.min(Math.floor(progress / 30), stages.length - 1);
            if (statusEl) statusEl.textContent = stages[idx];
        }
    }, 75);
}

/* ==================== 2. LENIS SMOOTH INERTIA SCROLL + PROGRESS ==================== */
function initSmoothScroll() {
    const progressBar = document.getElementById('scroll-progress-bar');

    function updateProgress() {
        if (!progressBar) return;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
        progressBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    if (typeof Lenis !== 'undefined') {
        lenisInstance = new Lenis({
            duration: 1.12,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true
        });

        function raf(time) {
            lenisInstance.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (!targetId || targetId === '#') return;
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    lenisInstance.scrollTo(targetEl, { offset: -75 });
                }
            });
        });
    }
}

/* ==================== 3. CUSTOM PRECISION CURSOR & MAGNETIC ==================== */
function initCustomCursor() {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    }, { passive: true });

    function tick() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    const interactiveSelector = 'a, button, input, textarea, video, .wf-node, .project-3d-card, .video-testi-card';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveSelector)) {
            ring.classList.add('is-hovering');
        }
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveSelector)) {
            ring.classList.remove('is-hovering');
        }
    });

    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.2;
            const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.2;
            btn.style.transform = `translate(${dx}px, ${dy}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

/* ==================== 4. NAVIGATION & SCENE TELEMETRY ==================== */
let currentSceneMode = 'core';

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section[id]');

    if (mobileToggle && mobileDrawer) {
        mobileToggle.addEventListener('click', () => mobileDrawer.classList.toggle('open'));
        mobileDrawer.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => mobileDrawer.classList.remove('open'));
        });
    }

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (navbar) navbar.classList.toggle('scrolled', y > 40);

        let activeId = 'home';
        let detectedMode = 'core';

        sections.forEach(sec => {
            if (y >= sec.offsetTop - 260) {
                activeId = sec.getAttribute('id');
                detectedMode = sec.dataset.scene || 'core';
            }
        });

        currentSceneMode = detectedMode;

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
        });
    }, { passive: true });
}

/* ==================== 5. KINETIC HEADLINE SCRAMBLE ==================== */
function initKineticHeadline() {
    const target = document.getElementById('kinetic-word');
    if (!target) return;

    const phrases = [
        'GHL Ecosystems',
        'AI Chatbots',
        'Sales Funnels',
        'WordPress Sites'
    ];
    const glyphs = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
    let index = 0;

    function scrambleTo(newText) {
        const length = newText.length;
        let frame = 0;
        const totalFrames = 18;

        const tick = setInterval(() => {
            let output = '';
            for (let i = 0; i < length; i++) {
                const revealAt = Math.floor((i / length) * totalFrames);
                if (frame >= revealAt + 5) {
                    output += newText[i] || '';
                } else {
                    output += glyphs[Math.floor(Math.random() * glyphs.length)];
                }
            }
            target.textContent = output;
            frame++;
            if (frame > totalFrames + 5) {
                clearInterval(tick);
                target.textContent = newText;
            }
        }, 30);
    }

    setInterval(() => {
        index = (index + 1) % phrases.length;
        scrambleTo(phrases[index]);
    }, 3400);
}

/* ==================== 6. SCROLL-MORPHING GLOBAL THREE.JS STAGE ==================== */
function initGlobalWebGL() {
    const canvas = document.getElementById('bg-webgl');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050507, 0.02);

    const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 160);
    camera.position.set(0, 1.5, 24);

    // Subtle Horizon Grid (Dark Bronze / Gold)
    const gridHelper = new THREE.GridHelper(130, 52, 0xb45309, 0x1c1508);
    gridHelper.position.y = -12;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.2;
    scene.add(gridHelper);

    // Background Scroll-Morphing Ambient Wireframe Sculpture
    const morphGroup = new THREE.Group();
    morphGroup.position.set(0, 0, -14);
    scene.add(morphGroup);

    const torusKnotGeo = new THREE.TorusKnotGeometry(5.5, 1.2, 110, 14);
    const torusKnotMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        wireframe: true,
        transparent: true,
        opacity: 0.038
    });
    const morphMesh = new THREE.Mesh(torusKnotGeo, torusKnotMat);
    morphGroup.add(morphMesh);

    // Deep-Space Starfield (HighLevel Gold + Champagne + Sky Blue)
    const count = 920;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const cGold = new THREE.Color(0xfbbf24);
    const cCyan = new THREE.Color(0x38bdf8);
    const cChampagne = new THREE.Color(0xfde68a);

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 95;
        positions[i3 + 1] = (Math.random() - 0.5) * 60;
        positions[i3 + 2] = (Math.random() - 0.5) * 80;

        const r = Math.random();
        const picked = r < 0.52 ? cGold : (r < 0.8 ? cChampagne : cCyan);
        colors[i3] = picked.r;
        colors[i3 + 1] = picked.g;
        colors[i3 + 2] = picked.b;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
        size: 0.13,
        vertexColors: true,
        transparent: true,
        opacity: 0.54,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    let targetMouseX = 0;
    let targetMouseY = 0;
    let scrollYVal = 0;

    window.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2.2;
        targetMouseY = (e.clientY / window.innerHeight - 0.5) * 1.5;
    }, { passive: true });

    window.addEventListener('scroll', () => {
        scrollYVal = window.scrollY;
    }, { passive: true });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const clock = new THREE.Clock();
    let targetMorphScale = 1;
    let targetCamZ = 24;
    let targetMorphOpacity = 0.036;

    function animate() {
        const elapsed = clock.getElapsedTime();
        const scrollFactor = scrollYVal * 0.004;

        if (currentSceneMode === 'core') {
            targetMorphScale = 0.9;
            targetCamZ = 24;
            targetMorphOpacity = 0.032;
        } else if (currentSceneMode === 'neural') {
            targetMorphScale = 1.35;
            targetCamZ = 19.5;
            targetMorphOpacity = 0.068;
        } else {
            targetMorphScale = 1.05;
            targetCamZ = 22;
            targetMorphOpacity = 0.038;
        }

        const currentScale = morphGroup.scale.x + (targetMorphScale - morphGroup.scale.x) * 0.035;
        morphGroup.scale.setScalar(currentScale);
        torusKnotMat.opacity += (targetMorphOpacity - torusKnotMat.opacity) * 0.04;

        morphMesh.rotation.x = elapsed * 0.08 + scrollFactor * 0.25;
        morphMesh.rotation.y = elapsed * 0.11;

        particles.rotation.y = elapsed * 0.02;
        particles.position.z = (scrollFactor % 18);
        gridHelper.position.z = (elapsed * 1.2 + scrollFactor * 2) % (130 / 52);

        camera.position.z += (targetCamZ - camera.position.z) * 0.035;
        camera.position.x += (targetMouseX - camera.position.x) * 0.04;
        camera.position.y += ((1.5 - targetMouseY) - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();
}

/* ==================== 7. HERO 3D HIGHLEVEL GOLD GYROSCOPE CORE ==================== */
function initHero3DCore() {
    const canvas = document.getElementById('hero-canvas');
    const stage = document.getElementById('hero-3d-stage');
    if (!canvas || !stage || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);
    camera.position.set(0, 0, 7.6);

    function resizeHero() {
        const w = stage.clientWidth || 480;
        const h = stage.clientHeight || 480;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
    resizeHero();
    window.addEventListener('resize', resizeHero);
    if (typeof ResizeObserver !== 'undefined') {
        new ResizeObserver(resizeHero).observe(stage);
    }

    // Luxury Liquid Gold + HighLevel Sky Blue Studio Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));

    const goldLight = new THREE.PointLight(0xf59e0b, 3.4, 20);
    goldLight.position.set(4, 4, 5);
    scene.add(goldLight);

    const cyanLight = new THREE.PointLight(0x38bdf8, 2.2, 20);
    cyanLight.position.set(-4, -3, 5);
    scene.add(cyanLight);

    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Faceted Obsidian-Bronze Crystal Core
    const innerGeo = new THREE.IcosahedronGeometry(1.16, 1);
    const innerMat = new THREE.MeshStandardMaterial({
        color: 0x171209,
        roughness: 0.22,
        metalness: 0.92,
        flatShading: true,
        emissive: 0x3b2304,
        emissiveIntensity: 0.75
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // 2. Molten Gold Wireframe Exoskeleton
    const wireGeo = new THREE.IcosahedronGeometry(1.25, 1);
    const wireMat = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        wireframe: true,
        transparent: true,
        opacity: 0.7
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    coreGroup.add(wireMesh);

    // 3. Concentric Gyroscope Rings (Official HighLevel 3-Arrow Colors: Gold, Blue, Emerald)
    const ringConfigs = [
        { radius: 1.84, tube: 0.017, color: 0xfbbf24, opacity: 0.82, rx: 1.1, ry: 0.3 },
        { radius: 2.26, tube: 0.014, color: 0x38bdf8, opacity: 0.58, rx: -0.7, ry: 0.9 },
        { radius: 2.66, tube: 0.012, color: 0x22c55e, opacity: 0.44, rx: 0.4, ry: -1.1 }
    ];

    const rings = ringConfigs.map(cfg => {
        const rGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 100);
        const rMat = new THREE.MeshBasicMaterial({
            color: cfg.color,
            transparent: true,
            opacity: cfg.opacity
        });
        const ring = new THREE.Mesh(rGeo, rMat);
        ring.rotation.x = cfg.rx;
        ring.rotation.y = cfg.ry;

        const sat = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.1, 0),
            new THREE.MeshBasicMaterial({ color: cfg.color })
        );
        sat.position.set(cfg.radius, 0, 0);
        ring.add(sat);

        coreGroup.add(ring);
        return ring;
    });

    let targetRotX = 0;
    let targetRotY = 0;

    window.addEventListener('mousemove', (e) => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        targetRotY = nx * 0.6;
        targetRotX = ny * 0.42;
    }, { passive: true });

    const clock = new THREE.Clock();
    function animateHero() {
        const t = clock.getElapsedTime();

        innerMesh.rotation.y = t * 0.32;
        innerMesh.rotation.x = t * 0.18;
        wireMesh.rotation.y = -t * 0.24;
        wireMesh.rotation.z = t * 0.16;

        const pulse = 1 + Math.sin(t * 2.1) * 0.03;
        innerMesh.scale.setScalar(pulse);
        wireMesh.scale.setScalar(pulse);

        rings[0].rotation.z = t * 0.6;
        rings[0].rotation.x = 1.1 + Math.sin(t * 0.65) * 0.22;

        rings[1].rotation.z = -t * 0.44;
        rings[1].rotation.y = 0.9 + Math.cos(t * 0.55) * 0.28;

        rings[2].rotation.z = t * 0.3;
        rings[2].rotation.x = 0.4 + Math.cos(t * 0.48) * 0.22;

        coreGroup.rotation.y += (targetRotY - coreGroup.rotation.y) * 0.06;
        coreGroup.rotation.x += (targetRotX - coreGroup.rotation.x) * 0.06;

        renderer.render(scene, camera);
        requestAnimationFrame(animateHero);
    }
    animateHero();
}

/* ==================== 8. LIVE GHL WORKFLOW SIMULATOR ==================== */
function initWorkflowSimulator() {
    const nodesContainer = document.getElementById('wf-nodes');
    const svgLayer = document.getElementById('wf-svg');
    const logsContainer = document.getElementById('wf-terminal-logs');
    const titleEl = document.getElementById('wf-blueprint-title');
    const stateBadge = document.getElementById('wf-exec-state');
    const runBtn = document.getElementById('run-workflow-btn');
    const kpi1 = document.getElementById('kpi-1');
    const kpi1Lbl = document.getElementById('kpi-1-lbl');
    const kpi2 = document.getElementById('kpi-2');
    const kpi2Lbl = document.getElementById('kpi-2-lbl');

    if (!nodesContainer || !logsContainer) return;

    const blueprints = {
        speed: {
            uri: 'workflow://ghl/ai-speed-to-lead.v3',
            kpi1: ['0.4 sec', 'Instant First Touch'],
            kpi2: ['+340%', 'Calendar Booking Lift'],
            nodes: [
                { type: 'Trigger', cls: '', icon: 'fa-bolt', title: 'Lead Form / Ad', desc: 'Webhook & form capture' },
                { type: 'CRM Action', cls: '', icon: 'fa-tags', title: 'Tag & Pipeline', desc: 'Create Hot Lead stage' },
                { type: 'AI Agent', cls: 'type-ai', icon: 'fa-robot', title: 'AI SMS + Email', desc: 'Personalized 2-way outreach' },
                { type: 'If / Else', cls: 'type-cond', icon: 'fa-code-branch', title: 'Intent Qualified?', desc: 'Positive reply branch' },
                { type: 'Goal', cls: '', icon: 'fa-calendar-check', title: 'Auto-Book Call', desc: 'Calendar + Zoom + Slack' }
            ],
            logs: [
                ['00.08s', 'INFO', 'Trigger fired: Lead Form submitted by Sarah K.'],
                ['00.21s', 'OK', 'GHL Contact upserted + Pipeline -> "New Inquiry"'],
                ['00.39s', 'INFO', 'AI Conversational Bot dispatched SMS via Twilio'],
                ['01.05s', 'OK', 'Branch matched: Positive booking intent detected'],
                ['01.32s', 'OK', 'SUCCESS: Strategy Call booked + Slack alert sent!']
            ]
        },
        missed: {
            uri: 'workflow://ghl/missed-call-textback.pro',
            kpi1: ['100%', 'Missed Calls Rescued'],
            kpi2: ['3.8x', 'Recovered Local Leads'],
            nodes: [
                { type: 'Trigger', cls: '', icon: 'fa-phone-slash', title: 'Call Unanswered', desc: 'No-answer / busy status' },
                { type: 'Instant SMS', cls: '', icon: 'fa-comment-sms', title: 'Auto Text-Back', desc: '"Hey! How can we help?"' },
                { type: 'AI Bot', cls: 'type-ai', icon: 'fa-comments', title: 'Capture Need', desc: 'Qualifies service & zip' },
                { type: 'CRM Sync', cls: 'type-cond', icon: 'fa-filter-circle-dollar', title: 'Assign Rep', desc: 'Round-robin + push alert' },
                { type: 'Goal', cls: '', icon: 'fa-circle-check', title: 'Quote Scheduled', desc: 'Booking link confirmed' }
            ],
            logs: [
                ['00.05s', 'INFO', 'Inbound call missed on tracking number (+1-555-019)'],
                ['00.24s', 'OK', 'Instant SMS sent: "Sorry we missed your call..."'],
                ['00.68s', 'INFO', 'AI Receptionist parsed reply: "Need urgent quote"'],
                ['00.95s', 'OK', 'Opportunity assigned to on-duty specialist'],
                ['01.20s', 'OK', 'SUCCESS: Customer booked 2:00 PM slot via link!']
            ]
        },
        reviews: {
            uri: 'workflow://ghl/5star-reputation-engine',
            kpi1: ['4.9 ★', 'Avg Google Rating'],
            kpi2: ['+210%', 'Monthly Review Volume'],
            nodes: [
                { type: 'Trigger', cls: '', icon: 'fa-file-invoice-dollar', title: 'Job Completed', desc: 'Stage -> Won / Paid' },
                { type: 'Smart Wait', cls: '', icon: 'fa-clock', title: 'Wait 2 Hours', desc: 'Optimal timing window' },
                { type: 'Outreach', cls: 'type-ai', icon: 'fa-star', title: 'Rating Check', desc: 'SMS + Email 1-click poll' },
                { type: 'Sentiment', cls: 'type-cond', icon: 'fa-scale-balanced', title: 'Score >= 4 Stars?', desc: 'Filter unhappy feedback' },
                { type: 'Goal', cls: '', icon: 'fa-google', title: 'Google Review', desc: 'Direct GMB review link' }
            ],
            logs: [
                ['00.10s', 'INFO', 'Opportunity moved to "Completed" ($1,450 Invoice)'],
                ['00.32s', 'OK', 'Smart Wait timer completed (2h optimal window)'],
                ['00.58s', 'INFO', 'Personalized SMS review check delivered'],
                ['00.90s', 'OK', 'Sentiment check: Client tapped 5-Star rating!'],
                ['01.18s', 'OK', 'SUCCESS: Redirected to Google Business Profile!']
            ]
        },
        wpsync: {
            uri: 'workflow://bridge/zapier-make-wp-to-ghl',
            kpi1: ['Real-Time', 'Webhook Payload Sync'],
            kpi2: ['Zero', 'Manual CSV Exports'],
            nodes: [
                { type: 'WP Trigger', cls: 'type-ai', icon: 'fa-wordpress-simple', title: 'WP / Woo Event', desc: 'Order or Elementor form' },
                { type: 'Webhook', cls: '', icon: 'fa-puzzle-piece', title: 'Zapier / Make', desc: 'JSON payload validation' },
                { type: 'Mapper', cls: 'type-cond', icon: 'fa-database', title: 'Custom Fields', desc: 'Map SKU, LTV & UTM tags' },
                { type: 'Automation', cls: '', icon: 'fa-envelope-open-text', title: 'VIP Onboarding', desc: 'Order SMS + Email sequence' },
                { type: 'Goal', cls: '', icon: 'fa-chart-line', title: 'Upsell & LTV', desc: '30-day reorder campaign' }
            ],
            logs: [
                ['00.06s', 'INFO', 'POST Webhook received from WooCommerce Storefront'],
                ['00.22s', 'OK', '200 OK: JSON validated (Order #4829 + UTM Source)'],
                ['00.49s', 'OK', 'GHL Contact mapped with Custom Fields & VIP Tag'],
                ['00.81s', 'INFO', 'Triggered automated order confirmation SMS'],
                ['01.14s', 'OK', 'SUCCESS: Enrolled in 30-day repeat-buyer flow!']
            ]
        }
    };

    let activeKey = 'speed';
    let simTimers = [];

    function clearSimTimers() {
        simTimers.forEach(t => clearTimeout(t));
        simTimers = [];
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

            const d = `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;

            const basePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            basePath.setAttribute('d', d);
            basePath.setAttribute('class', 'wf-edge-base');

            const energyPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            energyPath.setAttribute('d', d);
            energyPath.setAttribute('class', 'wf-edge-energy');

            svgLayer.appendChild(basePath);
            svgLayer.appendChild(energyPath);
        }
    }

    function renderBlueprint(key, autoRun = true) {
        clearSimTimers();
        activeKey = key;
        const bp = blueprints[key];
        if (!bp) return;

        if (titleEl) titleEl.textContent = bp.uri;
        if (kpi1) kpi1.textContent = bp.kpi1[0];
        if (kpi1Lbl) kpi1Lbl.textContent = bp.kpi1[1];
        if (kpi2) kpi2.textContent = bp.kpi2[0];
        if (kpi2Lbl) kpi2Lbl.textContent = bp.kpi2[1];

        nodesContainer.innerHTML = bp.nodes.map((n, idx) => `
            <div class="wf-node" data-step="${idx}">
                <span class="wf-node-type ${n.cls}">${n.type}</span>
                <div class="wf-node-ico"><i class="${n.icon.includes('wordpress') || n.icon.includes('google') ? 'fa-brands' : 'fa-solid'} ${n.icon}"></i></div>
                <h4>${n.title}</h4>
                <p>${n.desc}</p>
            </div>
        `).join('');

        logsContainer.innerHTML = `<div class="log-line"><span class="log-time">[READY]</span><span class="log-info">Blueprint loaded.</span></div>`;
        if (stateBadge) stateBadge.textContent = 'IDLE';

        requestAnimationFrame(() => {
            drawConnections();
            if (autoRun) runSimulation();
        });
    }

    function runSimulation() {
        clearSimTimers();
        const bp = blueprints[activeKey];
        const nodeEls = nodesContainer.querySelectorAll('.wf-node');
        const edgeEls = svgLayer.querySelectorAll('.wf-edge-energy');

        nodeEls.forEach(n => n.classList.remove('active-step', 'completed-step'));
        edgeEls.forEach(e => e.classList.remove('energized'));
        logsContainer.innerHTML = '';

        if (stateBadge) stateBadge.textContent = 'RUNNING';

        bp.nodes.forEach((_, idx) => {
            const t = setTimeout(() => {
                nodeEls.forEach((el, j) => {
                    el.classList.toggle('active-step', j === idx);
                    if (j < idx) el.classList.add('completed-step');
                });

                if (idx > 0 && edgeEls[idx - 1]) {
                    edgeEls[idx - 1].classList.add('energized');
                }

                const [time, level, msg] = bp.logs[idx];
                const line = document.createElement('div');
                line.className = 'log-line';
                line.innerHTML = `
                    <span class="log-time">[${time}]</span>
                    <span class="${level === 'OK' ? 'log-ok' : 'log-info'}">${level}</span>
                    <span class="log-msg">${msg}</span>
                `;
                logsContainer.appendChild(line);
                logsContainer.scrollTop = logsContainer.scrollHeight;

                if (idx === bp.nodes.length - 1) {
                    const doneTimer = setTimeout(() => {
                        nodeEls[idx].classList.remove('active-step');
                        nodeEls[idx].classList.add('completed-step');
                        if (stateBadge) stateBadge.textContent = '200 OK ✓';
                    }, 600);
                    simTimers.push(doneTimer);
                }
            }, idx * 500);
            simTimers.push(t);
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
            renderBlueprint(tab.dataset.wf, true);
        });
    });

    if (runBtn) runBtn.addEventListener('click', runSimulation);
    window.addEventListener('resize', drawConnections);

    renderBlueprint('speed', false);

    const wfSection = document.getElementById('workflows');
    if (wfSection) {
        const obs = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setTimeout(() => {
                    drawConnections();
                    runSimulation();
                }, 250);
                obs.disconnect();
            }
        }, { threshold: 0.25 });
        obs.observe(wfSection);
    }
}

/* ==================== 9. INTERACTIVE ROI IMPACT SLIDER ==================== */
function initComparisonSlider() {
    const slider = document.getElementById('lead-volume-slider');
    const volVal = document.getElementById('lead-volume-val');
    const manualEl = document.getElementById('roi-manual-calls');
    const autoEl = document.getElementById('roi-auto-calls');
    const hoursEl = document.getElementById('roi-hours-saved');

    if (!slider) return;

    function updateROI() {
        const leads = parseInt(slider.value, 10) || 200;
        const manualCalls = Math.round(leads * 0.06);
        const autoCalls = Math.round(leads * 0.28);
        const hoursSaved = Math.max(8, Math.round(leads * 0.165));

        if (volVal) volVal.textContent = `${leads.toLocaleString()} Leads / mo`;
        if (manualEl) manualEl.textContent = `${manualCalls} Calls/mo`;
        if (autoEl) autoEl.textContent = `${autoCalls} Calls/mo`;
        if (hoursEl) hoursEl.textContent = `${hoursSaved} Hrs/mo`;
    }

    slider.addEventListener('input', updateROI);
    updateROI();
}

/* ==================== 10. PORTFOLIO CATEGORY FILTERS ==================== */
function initPortfolioFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-3d-card');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            cards.forEach((card, i) => {
                const match = filter === 'all' || card.dataset.category === filter;
                if (match) {
                    card.classList.remove('is-hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(16px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = '';
                    }, (i % 6) * 50);
                } else {
                    card.classList.add('is-hidden');
                }
            });
        });
    });
}

/* ==================== 11. IN-PAGE INTERACTIVE DEVICE PREVIEW MODAL ==================== */
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
        // Pause any playing testimonial videos while modal is open
        document.querySelectorAll('.vt-video').forEach(v => {
            if (!v.paused) v.pause();
        });

        titleEl.textContent = title;
        tagEl.textContent = tag || 'Live Build';
        externalLink.href = url;
        fallbackImg.src = img || '';

        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        if (lenisInstance) lenisInstance.stop();

        const isMixedContent = window.location.protocol === 'https:' && url.startsWith('http://');

        if (isMixedContent) {
            loader.classList.add('hidden');
            iframe.src = 'about:blank';
            fallback.classList.add('visible');
        } else {
            fallback.classList.remove('visible');
            loader.classList.remove('hidden');
            iframe.src = url;

            clearTimeout(loadTimeout);
            loadTimeout = setTimeout(() => {
                loader.classList.add('hidden');
            }, 3500);

            iframe.onload = () => {
                clearTimeout(loadTimeout);
                loader.classList.add('hidden');
            };
        }
    }

    function closePreview() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        iframe.src = 'about:blank';
        if (lenisInstance) lenisInstance.start();
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

/* ==================== 12. REAL CLIENT VIDEO TESTIMONIALS PLAYER ==================== */
function initVideoTestimonials() {
    const shells = document.querySelectorAll('[data-video-card]');
    if (!shells.length) return;

    shells.forEach(shell => {
        const video = shell.querySelector('.vt-video');
        const overlay = shell.querySelector('.vt-poster-overlay');
        const playBtn = shell.querySelector('.vt-play-btn');
        const parentCard = shell.closest('.video-testi-card');
        if (!video || !overlay) return;

        function startPlayback() {
            // Pause any other playing testimonial video first
            shells.forEach(otherShell => {
                if (otherShell !== shell) {
                    const otherVid = otherShell.querySelector('.vt-video');
                    if (otherVid && !otherVid.paused) {
                        otherVid.pause();
                    }
                }
            });

            shell.classList.add('playing');
            if (parentCard) parentCard.classList.add('is-playing');
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
            if (parentCard) parentCard.classList.remove('is-playing');
        });

        video.addEventListener('pause', () => {
            if (parentCard && video.ended) {
                parentCard.classList.remove('is-playing');
            }
        });
    });
}

/* ==================== 13. 3D TILT & SPECULAR GLARE ==================== */
function init3DTiltCards() {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    document.querySelectorAll('.tilt-3d').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            // Skip tilt if a video inside this card is actively playing so video controls stay rock-steady
            if (card.classList.contains('is-playing')) {
                card.style.transform = 'none';
                return;
            }

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const pctX = (x / rect.width) * 100;
            const pctY = (y / rect.height) * 100;

            const rotY = ((x - rect.width / 2) / (rect.width / 2)) * 4.6;
            const rotX = ((rect.height / 2 - y) / (rect.height / 2)) * 4.6;

            card.style.setProperty('--glare-x', `${pctX}%`);
            card.style.setProperty('--glare-y', `${pctY}%`);
            card.style.transition = 'border-color 0.3s, box-shadow 0.3s';
            card.style.transform = `perspective(1150px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-3px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, box-shadow 0.3s';
            card.style.transform = 'perspective(1150px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
}

/* ==================== 14. SCROLL REVEALS & COUNTERS ==================== */
function initScrollRevealsAndCounters() {
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-scale');
    const revObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealEls.forEach(el => revObs.observe(el));

    const counters = document.querySelectorAll('.counter');
    const countObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10) || 0;
            const duration = 1350;
            const start = performance.now();

            function step(now) {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(target * eased);
                if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
            countObs.unobserve(el);
        });
    }, { threshold: 0.4 });

    counters.forEach(c => countObs.observe(c));
}

/* ==================== 15. GHL AI ASSISTANT DEMO WIDGET ==================== */
function initAIAssistant() {
    const pill = document.getElementById('ai-launcher-pill');
    const panel = document.getElementById('ai-chat-panel');
    const closeBtn = document.getElementById('ai-close-btn');
    const wlOpenBtn = document.getElementById('open-ai-from-wl');
    const messagesEl = document.getElementById('ai-chat-messages');
    const form = document.getElementById('ai-chat-form');
    const input = document.getElementById('ai-user-input');
    const chips = document.querySelectorAll('.ai-prompt-chip');

    if (!pill || !panel || !messagesEl) return;

    function togglePanel(forceOpen) {
        const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !panel.classList.contains('open');
        panel.classList.toggle('open', shouldOpen);
        panel.setAttribute('aria-hidden', String(!shouldOpen));
        if (shouldOpen && input) setTimeout(() => input.focus(), 150);
    }

    pill.addEventListener('click', () => togglePanel());
    if (closeBtn) closeBtn.addEventListener('click', () => togglePanel(false));

    if (wlOpenBtn) {
        wlOpenBtn.addEventListener('click', () => {
            togglePanel(true);
            handleUserQuestion('Do you work white-label with agencies?');
        });
    }

    function getBotResponse(q) {
        const text = q.toLowerCase();
        if (text.includes('white') || text.includes('agency') || text.includes('retainer')) {
            return 'Yes! With 3+ years of multi-industry experience, Rao partners white-label with US, UK & Australian agencies — handling GHL websites, snapshots, AI chatbots, and WordPress builds directly under your brand.';
        }
        if (text.includes('what') || text.includes('service') || text.includes('offer') || text.includes('ghl') || text.includes('bot')) {
            return 'Rao covers all 8 pillars: GHL Setup & CRM, AI Chatbots, Funnels & Websites, Lead Gen & Nurturing, Workflow Automation, Pipeline & Appointments, Email/SMS Automation, and Zapier/Make/Webhooks!';
        }
        if (text.includes('zapier') || text.includes('make') || text.includes('webhook') || text.includes('integration') || text.includes('wordpress') || text.includes('woo')) {
            return 'Rao connects WordPress, WooCommerce, Stripe, Slack, and custom REST APIs directly into GoHighLevel via Zapier, Make, and custom JSON webhooks — zero manual CSV work.';
        }
        if (text.includes('review') || text.includes('testimonial') || text.includes('client')) {
            return 'Check out the Testimonials section! US business owners Diane & Shanna shared unscripted video reviews praising Rao for working faster than they can send content and reading their minds on GoHighLevel.';
        }
        if (text.includes('start') || text.includes('hire') || text.includes('price') || text.includes('call') || text.includes('contact')) {
            return 'Ready when you are! Email Rao directly at mmairajsa123@gmail.com or submit your brief in the Contact section below — he is open to new projects, collaborations & retainers.';
        }
        return 'Rao is a GoHighLevel Expert & Digital Automation Specialist (3+ yrs experience) helping businesses build smarter systems & close more deals. Want to watch client video reviews or send a project brief below?';
    }

    function appendMessage(role, content) {
        const div = document.createElement('div');
        div.className = `ai-msg ${role}`;
        div.textContent = content;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        return div;
    }

    function handleUserQuestion(question) {
        if (!question.trim()) return;
        appendMessage('user', question);
        const typingEl = appendMessage('bot', 'Typing...');

        setTimeout(() => {
            typingEl.textContent = getBotResponse(question);
            messagesEl.scrollTop = messagesEl.scrollHeight;
        }, 520);
    }

    chips.forEach(chip => {
        chip.addEventListener('click', () => handleUserQuestion(chip.dataset.q));
    });

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = input.value;
            input.value = '';
            handleUserQuestion(val);
        });
    }
}

/* ==================== 16. CONTACT SYSTEM & WHITE-LABEL PREFILL ==================== */
function initContactSystem() {
    const chips = document.querySelectorAll('.svc-chip');
    const hiddenInput = document.getElementById('selected-service');

    function selectServiceByName(name) {
        chips.forEach(c => {
            const match = c.dataset.service === name;
            c.classList.toggle('active', match);
        });
        if (hiddenInput) hiddenInput.value = name;
    }

    chips.forEach(chip => {
        chip.addEventListener('click', () => selectServiceByName(chip.dataset.service));
    });

    document.querySelectorAll('[data-select-service]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            selectServiceByName(trigger.dataset.selectService);
        });
    });

    const copyBtn = document.getElementById('copy-email-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            const email = copyBtn.dataset.email || 'mmairajsa123@gmail.com';
            try {
                await navigator.clipboard.writeText(email);
            } catch (_) {}
            const span = copyBtn.querySelector('span');
            const prev = span.textContent;
            span.textContent = 'Copied!';
            setTimeout(() => { span.textContent = prev; }, 2200);
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
            submitBtn.innerHTML = '<span>Preparing Inquiry...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>';

            setTimeout(() => {
                const subject = encodeURIComponent(`[Portfolio Inquiry] ${service} — from ${name}`);
                const body = encodeURIComponent(
                    `Hi Rao,\n\nName: ${name}\nEmail: ${email}\nEngagement Type: ${service}\n\nProject Brief:\n${message}\n`
                );
                window.location.href = `mailto:mmairajsa123@gmail.com?subject=${subject}&body=${body}`;

                submitBtn.innerHTML = '<span>Inquiry Ready — Email Opened!</span> <i class="fa-solid fa-check"></i>';
                form.reset();

                setTimeout(() => {
                    submitBtn.innerHTML = prevHTML;
                }, 3500);
            }, 600);
        });
    }
}
