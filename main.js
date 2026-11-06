/* ==========================================================================
   RAO.DEV — 3D WEBGL, WORKFLOW SIMULATOR & INTERACTION ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCustomCursor();
    initNavigation();
    initKineticHeadline();
    initGlobalWebGL();
    initHero3DCore();
    initWorkflowSimulator();
    initPortfolioFilters();
    init3DTiltCards();
    initScrollRevealsAndCounters();
    initContactSystem();
});

/* ==================== 1. CYBER PRELOADER ==================== */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const fill = document.getElementById('preloader-fill');
    const percentEl = document.getElementById('preloader-percent');
    const statusEl = document.getElementById('preloader-status');
    if (!preloader) return;

    let progress = 0;
    const stages = [
        'MOUNTING THREE.JS WEBGL STAGE...',
        'LOADING GHL WORKFLOW BLUEPRINTS...',
        'SYNCING LIVE CLIENT DEPLOYMENTS...',
        'SYSTEM READY // RAO.DEV'
    ];

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 18) + 12;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            if (fill) fill.style.width = '100%';
            if (percentEl) percentEl.textContent = '100%';
            if (statusEl) statusEl.textContent = stages[3];

            setTimeout(() => {
                preloader.classList.add('loaded');
                document.querySelectorAll('.hero-section .reveal-up, .hero-section .reveal-scale').forEach(el => {
                    el.classList.add('is-visible');
                });
            }, 220);
        } else {
            if (fill) fill.style.width = `${progress}%`;
            if (percentEl) percentEl.textContent = `${progress}%`;
            const idx = Math.min(Math.floor(progress / 30), stages.length - 1);
            if (statusEl) statusEl.textContent = stages[idx];
        }
    }, 85);
}

/* ==================== 2. CUSTOM PRECISION CURSOR & MAGNETIC BTNS ==================== */
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

    function renderCursor() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    const hoverTargets = document.querySelectorAll('a, button, .wf-node, .project-3d-card, input, textarea');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('is-hovering'));
        el.addEventListener('mouseleave', () => ring.classList.remove('is-hovering'));
    });

    // Subtle magnetic pull on .magnetic buttons
    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.22;
            const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
            btn.style.transform = `translate(${dx}px, ${dy}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

/* ==================== 3. NAVIGATION & SCROLL SPY ==================== */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section[id]');

    if (mobileToggle && mobileDrawer) {
        mobileToggle.addEventListener('click', () => {
            mobileDrawer.classList.toggle('open');
        });
        mobileDrawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => mobileDrawer.classList.remove('open'));
        });
    }

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (navbar) {
            navbar.classList.toggle('scrolled', y > 40);
        }

        let currentId = 'home';
        sections.forEach(sec => {
            if (y >= sec.offsetTop - 220) {
                currentId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
        });
    }, { passive: true });
}

/* ==================== 4. KINETIC SCRAMBLE HEADLINE ==================== */
function initKineticHeadline() {
    const target = document.getElementById('kinetic-word');
    if (!target) return;

    const phrases = [
        'GHL Ecosystems',
        'AI Workflows',
        'WordPress Sites',
        'Revenue Engines'
    ];
    const glyphs = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
    let index = 0;

    function scrambleTo(newText) {
        const length = newText.length;
        let frame = 0;
        const totalFrames = 20;

        const tick = setInterval(() => {
            let output = '';
            for (let i = 0; i < length; i++) {
                const revealAt = Math.floor((i / length) * totalFrames);
                if (frame >= revealAt + 6) {
                    output += newText[i] || '';
                } else {
                    output += glyphs[Math.floor(Math.random() * glyphs.length)];
                }
            }
            target.textContent = output;
            frame++;
            if (frame > totalFrames + 6) {
                clearInterval(tick);
                target.textContent = newText;
            }
        }, 32);
    }

    setInterval(() => {
        index = (index + 1) % phrases.length;
        scrambleTo(phrases[index]);
    }, 3200);
}

/* ==================== 5. GLOBAL THREE.JS 3D DEPTH FIELD ==================== */
function initGlobalWebGL() {
    const canvas = document.getElementById('bg-webgl');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030604, 0.022);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 160);
    camera.position.set(0, 1.5, 22);

    // 3D Cyber Horizon Grid
    const gridHelper = new THREE.GridHelper(130, 56, 0x0df043, 0x0b2914);
    gridHelper.position.y = -11;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.24;
    scene.add(gridHelper);

    // 3D Floating Data Particles
    const count = 1100;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const emerald = new THREE.Color(0x0df043);
    const cyan = new THREE.Color(0x00e0ff);

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 90;
        positions[i3 + 1] = (Math.random() - 0.5) * 55;
        positions[i3 + 2] = (Math.random() - 0.5) * 80;

        const c = Math.random() > 0.22 ? emerald : cyan;
        colors[i3] = c.r;
        colors[i3 + 1] = c.g;
        colors[i3 + 2] = c.b;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
        size: 0.14,
        vertexColors: true,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    let targetMouseX = 0;
    let targetMouseY = 0;
    let scrollOffset = 0;

    window.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2.5;
        targetMouseY = (e.clientY / window.innerHeight - 0.5) * 1.8;
    }, { passive: true });

    window.addEventListener('scroll', () => {
        scrollOffset = window.scrollY * 0.006;
    }, { passive: true });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const clock = new THREE.Clock();
    function animate() {
        const elapsed = clock.getElapsedTime();

        particles.rotation.y = elapsed * 0.025;
        particles.position.z = (scrollOffset % 20);
        gridHelper.position.z = (elapsed * 1.6 + scrollOffset * 2) % (130 / 56);

        camera.position.x += (targetMouseX - camera.position.x) * 0.04;
        camera.position.y += ((1.5 - targetMouseY) - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();
}

/* ==================== 6. HERO 3D AUTOMATION GYROSCOPE CORE ==================== */
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
        const w = stage.clientWidth || 500;
        const h = stage.clientHeight || 500;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
    resizeHero();
    window.addEventListener('resize', resizeHero);
    if (typeof ResizeObserver !== 'undefined') {
        new ResizeObserver(resizeHero).observe(stage);
    }

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);

    const neonLight = new THREE.PointLight(0x0df043, 2.8, 18);
    neonLight.position.set(4, 4, 5);
    scene.add(neonLight);

    const cyanLight = new THREE.PointLight(0x00e0ff, 1.9, 18);
    cyanLight.position.set(-4, -3, 4);
    scene.add(cyanLight);

    // Master Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Faceted Obsidian Metallic Inner Core
    const innerGeo = new THREE.IcosahedronGeometry(1.18, 1);
    const innerMat = new THREE.MeshStandardMaterial({
        color: 0x07140c,
        roughness: 0.22,
        metalness: 0.88,
        flatShading: true,
        emissive: 0x042610,
        emissiveIntensity: 0.7
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // 2. Glowing Neon Wireframe Exoskeleton
    const wireGeo = new THREE.IcosahedronGeometry(1.26, 1);
    const wireMat = new THREE.MeshBasicMaterial({
        color: 0x0df043,
        wireframe: true,
        transparent: true,
        opacity: 0.72
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    coreGroup.add(wireMesh);

    // 3. Concentric 3D Gyroscope Rings
    const ringConfigs = [
        { radius: 1.85, tube: 0.018, color: 0x0df043, opacity: 0.75, rx: 1.1, ry: 0.3 },
        { radius: 2.28, tube: 0.014, color: 0x00e0ff, opacity: 0.52, rx: -0.7, ry: 0.9 },
        { radius: 2.68, tube: 0.012, color: 0x0df043, opacity: 0.35, rx: 0.4, ry: -1.1 }
    ];

    const rings = ringConfigs.map((cfg) => {
        const rGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 100);
        const rMat = new THREE.MeshBasicMaterial({
            color: cfg.color,
            transparent: true,
            opacity: cfg.opacity
        });
        const ring = new THREE.Mesh(rGeo, rMat);
        ring.rotation.x = cfg.rx;
        ring.rotation.y = cfg.ry;

        // Attach orbiting node crystal on each ring
        const satGeo = new THREE.OctahedronGeometry(0.11, 0);
        const satMat = new THREE.MeshBasicMaterial({ color: cfg.color });
        const sat = new THREE.Mesh(satGeo, satMat);
        sat.position.set(cfg.radius, 0, 0);
        ring.add(sat);

        coreGroup.add(ring);
        return ring;
    });

    // Interactive mouse rotation on stage
    let targetRotX = 0;
    let targetRotY = 0;

    window.addEventListener('mousemove', (e) => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        targetRotY = nx * 0.65;
        targetRotX = ny * 0.45;
    }, { passive: true });

    const clock = new THREE.Clock();
    function animateHero() {
        const t = clock.getElapsedTime();

        innerMesh.rotation.y = t * 0.35;
        innerMesh.rotation.x = t * 0.2;
        wireMesh.rotation.y = -t * 0.28;
        wireMesh.rotation.z = t * 0.18;

        // Subtle breathing pulse
        const pulse = 1 + Math.sin(t * 2.4) * 0.035;
        innerMesh.scale.setScalar(pulse);
        wireMesh.scale.setScalar(pulse);

        rings[0].rotation.z = t * 0.65;
        rings[0].rotation.x = 1.1 + Math.sin(t * 0.7) * 0.25;

        rings[1].rotation.z = -t * 0.48;
        rings[1].rotation.y = 0.9 + Math.cos(t * 0.6) * 0.3;

        rings[2].rotation.z = t * 0.32;
        rings[2].rotation.x = 0.4 + Math.cos(t * 0.5) * 0.25;

        coreGroup.rotation.y += (targetRotY - coreGroup.rotation.y) * 0.06;
        coreGroup.rotation.x += (targetRotX - coreGroup.rotation.x) * 0.06;

        renderer.render(scene, camera);
        requestAnimationFrame(animateHero);
    }
    animateHero();
}

/* ==================== 7. INTERACTIVE GHL WORKFLOW SIMULATOR ==================== */
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
            uri: 'workflow://ghl/ai-speed-to-lead.v2',
            kpi1: ['0.4 sec', 'Instant First Touch'],
            kpi2: ['+340%', 'Calendar Booking Lift'],
            nodes: [
                { type: 'Trigger', cls: '', icon: 'fa-bolt', title: 'Lead Form / FB Ad', desc: 'Webhook & form capture' },
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
                ['00.05s', 'INFO', 'Inbound call missed on tracking number (+61-4XX)'],
                ['00.24s', 'OK', 'Instant SMS sent: "Sorry we missed your call..."'],
                ['00.68s', 'INFO', 'AI Receptionist parsed reply: "Need urgent quote"'],
                ['00.95s', 'OK', 'Opportunity assigned to on-duty technician'],
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
            uri: 'workflow://bridge/wordpress-woo-to-ghl',
            kpi1: ['Real-Time', 'Webhook Payload Sync'],
            kpi2: ['Zero', 'Manual CSV Exports'],
            nodes: [
                { type: 'WP Trigger', cls: 'type-ai', icon: 'fa-wordpress-simple', title: 'WP / Woo Event', desc: 'Order or Elementor form' },
                { type: 'Webhook', cls: '', icon: 'fa-plug', title: 'Inbound Hook', desc: 'JSON payload validation' },
                { type: 'Mapper', cls: 'type-cond', icon: 'fa-database', title: 'Custom Fields', desc: 'Map SKU, LTV & UTM tags' },
                { type: 'Automation', cls: '', icon: 'fa-envelope-open-text', title: 'VIP Onboarding', desc: 'Order SMS + Email sequence' },
                { type: 'Goal', cls: '', icon: 'fa-chart-line', title: 'Upsell & LTV', desc: '30-day reorder campaign' }
            ],
            logs: [
                ['00.06s', 'INFO', 'POST Webhook received from WooCommerce Storefront'],
                ['00.22s', 'OK', '200 OK: JSON validated (Order #4829 + UTM Source)'],
                ['00.49s', 'OK', 'GHL Contact mapped with Custom Fields & VIP Tag'],
                ['00.81s', 'INFO', 'Triggered WhatsApp/SMS order confirmation'],
                ['01.14s', 'OK', 'SUCCESS: Enrolled in 30-day automated repeat-buyer flow!']
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

        const stageRect = document.getElementById('wf-stage').getBoundingClientRect();
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
            energyPath.dataset.edgeIndex = i;

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

        if (stateBadge) stateBadge.textContent = 'RUNNING ⚡';

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
                    const finishTimer = setTimeout(() => {
                        nodeEls[idx].classList.remove('active-step');
                        nodeEls[idx].classList.add('completed-step');
                        if (stateBadge) stateBadge.textContent = '200 OK ✓';
                    }, 650);
                    simTimers.push(finishTimer);
                }
            }, idx * 520);

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

    if (runBtn) {
        runBtn.addEventListener('click', () => runSimulation());
    }

    window.addEventListener('resize', drawConnections);

    // Initial render without running until scrolled into view
    renderBlueprint('speed', false);

    const wfSection = document.getElementById('workflows');
    if (wfSection) {
        const wfObs = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                runSimulation();
                wfObs.disconnect();
            }
        }, { threshold: 0.25 });
        wfObs.observe(wfSection);
    }
}

/* ==================== 8. PORTFOLIO CATEGORY FILTER ==================== */
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
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
                        card.style.opacity = '1';
                        card.style.transform = '';
                    }, (i % 6) * 55);
                } else {
                    card.classList.add('is-hidden');
                }
            });
        });
    });
}

/* ==================== 9. 3D PERSPECTIVE TILT & SPECULAR GLARE ==================== */
function init3DTiltCards() {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('.tilt-3d');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const pctX = (x / rect.width) * 100;
            const pctY = (y / rect.height) * 100;

            const rotY = ((x - rect.width / 2) / (rect.width / 2)) * 6.5;
            const rotX = ((rect.height / 2 - y) / (rect.height / 2)) * 6.5;

            card.style.setProperty('--glare-x', `${pctX}%`);
            card.style.setProperty('--glare-y', `${pctY}%`);
            card.style.transition = 'border-color 0.3s, box-shadow 0.3s';
            card.style.transform = `perspective(1100px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, box-shadow 0.3s';
            card.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
}

/* ==================== 10. SCROLL REVEALS & STAT COUNTERS ==================== */
function initScrollRevealsAndCounters() {
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-scale');
    const revObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revObs.observe(el));

    // Number Counters
    const counters = document.querySelectorAll('.counter');
    const countObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10) || 0;
            const duration = 1400;
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

/* ==================== 11. CONTACT SYSTEM & COPY EMAIL ==================== */
function initContactSystem() {
    // Service Chips
    const chips = document.querySelectorAll('.svc-chip');
    const hiddenInput = document.getElementById('selected-service');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            if (hiddenInput) hiddenInput.value = chip.dataset.service;
        });
    });

    // One-click Copy Email
    const copyBtn = document.getElementById('copy-email-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            const email = copyBtn.dataset.email || 'mmairajsa123@gmail.com';
            try {
                await navigator.clipboard.writeText(email);
            } catch (_) {
                // Fallback if clipboard blocked
            }
            const span = copyBtn.querySelector('span');
            const prev = span.textContent;
            span.textContent = 'Copied!';
            setTimeout(() => { span.textContent = prev; }, 2200);
        });
    }

    // Contact Form Submission
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

            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Encrypting &amp; Preparing...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>';

            setTimeout(() => {
                const subject = encodeURIComponent(`[Portfolio Inquiry] ${service} — from ${name}`);
                const body = encodeURIComponent(
                    `Hi Rao,\n\nName: ${name}\nEmail: ${email}\nProject Type: ${service}\n\nDetails:\n${message}\n`
                );
                window.location.href = `mailto:mmairajsa123@gmail.com?subject=${subject}&body=${body}`;

                submitBtn.innerHTML = '<span>Inquiry Ready — Email Opened!</span> <i class="fa-solid fa-check"></i>';
                form.reset();

                setTimeout(() => {
                    submitBtn.innerHTML = originalHTML;
                }, 3500);
            }, 700);
        });
    }
}
