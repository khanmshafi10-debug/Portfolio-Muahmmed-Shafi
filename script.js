tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                display: ['Space Grotesk', 'sans-serif'],
            },
            colors: {
                dark: '#050508',
                glass: 'rgba(255, 255, 255, 0.02)',
                border: 'rgba(255, 255, 255, 0.06)',
                accent: {
                    400: '#00f2fe',
                    500: '#4facfe',
                    600: '#8b5cf6',
                    700: '#ff0844',
                }
            },
            animation: {
                'blob': 'blob 10s infinite alternate',
                'marquee': 'marquee 25s linear infinite',
                'pulse-glow': 'pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '100%': { transform: 'translate(40px, -50px) scale(1.2)' },
                },
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: 0.8, filter: 'brightness(1)' },
                    '50%': { opacity: 0.4, filter: 'brightness(1.2)' },
                }
            }
        }
    }
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHoverFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

function initTiltCards(scope = document) {
    if (typeof VanillaTilt === 'undefined') return;
    const cards = scope.querySelectorAll('.tilt-card');
    cards.forEach((card) => {
        if (card.dataset.tiltInit === '1') return;
        VanillaTilt.init(card, { max: 3, speed: 300, glare: false, 'max-glare': 0 });
        card.dataset.tiltInit = '1';
    });
}

// --- 1. PRELOADER & INTRO ---
window.addEventListener('load', () => {
    const bar = document.getElementById('loader-bar');
    if (bar) bar.style.width = '100%';
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) preloader.style.opacity = '0';
        
        setTimeout(() => {
            // Trigger the advanced 3D intro which drops us into the homepage!
            runIntroSequence();

            // ── Robot greeting bubble ──
            const bubble   = document.getElementById('robot-bubble');
            const textEl   = document.getElementById('robot-bubble-text');
            const message  = "Hi, I'm Shafi! 👋";
            let   idx      = 0;

            if (bubble) bubble.classList.add('is-visible');

            const typeInterval = setInterval(() => {
                if(textEl) textEl.textContent += message[idx++];
                if (idx >= message.length) {
                    clearInterval(typeInterval);
                    setTimeout(() => {
                        if (bubble) bubble.classList.remove('is-visible');
                    }, 3000);
                }
            }, 60);

        }, 600);
    }, 500);
});

// --- 2. ROBOT INTRO & BACKGROUND PIPELINE ---
let mainScene, mainCamera, mainRenderer, mainPlane, uniforms;

function initMainBackground() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas || typeof THREE === 'undefined') return;
    
    mainRenderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance'
    });
    mainRenderer.setSize(window.innerWidth, window.innerHeight);
    mainRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    
    mainScene = new THREE.Scene();
    mainCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    mainCamera.position.set(0, 5, 15);
    mainCamera.lookAt(0, 0, -10);
    
    const geometry = new THREE.PlaneGeometry(100, 100, 32, 32);
    geometry.rotateX(-Math.PI / 2);
    uniforms = { uTime: { value: 0.0 } };
    
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: `
            uniform float uTime;
            void main() {
                vec3 pos = position;
                float wave = sin(pos.x * 0.2 + uTime) * 1.5 + cos(pos.z * 0.2 + uTime) * 1.5;
                pos.y += wave;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `void main() { gl_FragColor = vec4(0.0, 0.6, 1.0, 0.15); }`,
        wireframe: true,
        transparent: true,
        depthWrite: false
    });
    
    mainPlane = new THREE.Mesh(geometry, material);
    mainPlane.position.y = -6;
    mainScene.add(mainPlane);
    
    const clock = new THREE.Clock();
    function animateMain() {
        requestAnimationFrame(animateMain);
        uniforms.uTime.value = clock.getElapsedTime();
        mainRenderer.render(mainScene, mainCamera);
    }
    animateMain();
}

function runIntroSequence() {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.style.display = 'none';

    const overlay = document.createElement('div');
    overlay.id = 'robot-intro-overlay';
    overlay.style = "position: fixed; inset: 0; z-index: 100000; background: radial-gradient(circle at center, #161821 0%, #050507 100%); display: flex; justify-content: center; align-items: center; transition: opacity 1.5s ease-in-out; perspective: 1500px; overflow: hidden;";

    overlay.innerHTML = `
        <style>
            .robot-intro-scene { position: relative; width: 500px; height: 600px; display: flex; justify-content: center; align-items: center; transform-style: preserve-3d; }
            
            /* Advanced floating with a funny 3D flip at the end */
            .robot-moving-wrapper { position: relative; transform-style: preserve-3d; animation: float-ambient 4s ease-in-out infinite; display: flex; flex-direction: column; align-items: center; transition: transform 1s cubic-bezier(0.68, -0.55, 0.27, 1.55); }
            @keyframes float-ambient { 0%, 100% { transform: translateY(0px) rotateX(0deg); } 50% { transform: translateY(-30px) rotateX(5deg); } }
            
            .r-head { position: relative; width: 180px; height: 150px; background: radial-gradient(circle at 35% 25%, #43495c 0%, #111216 45%, #000 90%); border-radius: 48%; box-shadow: inset 2px 2px 5px rgba(255,255,255,0.3), 0 20px 40px rgba(0,0,0,0.6); transform-style: preserve-3d; transition: transform 0.2s ease-out; z-index: 10; }
            .r-visor { position: absolute; width: 130px; height: 90px; background: #000; border-radius: 45%; top: 50%; left: 50%; transform: translate(-50%, -50%) translateZ(20px); overflow: hidden; display: flex; justify-content: center; align-items: center; border: 2px solid rgba(255,255,255,0.1); flex-direction: column; }
            
            /* Properly fixed facial layout */
            .r-eyes { display: flex; gap: 20px; margin-top: 5px; }
            .r-eye { width: 22px; height: 12px; border: 4px solid #00f2fe; border-bottom: none; border-radius: 20px 20px 0 0; box-shadow: 0 -3px 15px rgba(0,242,254,0.8); animation: r-blink 3s infinite; }
            @keyframes r-blink { 0%, 96%, 100% { transform: scaleY(1); } 98% { transform: scaleY(0.1); } }
            
            /* Properly placed lips inside the visor */
            .r-lips { margin-top: 15px; width: 35px; height: 10px; border: 3px solid #fff; border-top: none; border-radius: 0 0 35px 35px; box-shadow: 0 3px 10px rgba(255,255,255,0.4); animation: r-talk 0.5s infinite alternate; }
            @keyframes r-talk { 0% { transform: scaleX(1) scaleY(1); opacity: 0.8; } 100% { transform: scaleX(1.3) scaleY(1.5); opacity: 1; } }
            
            .r-body { position: relative; width: 120px; height: 110px; margin-top: -5px; background: radial-gradient(circle at 35% 25%, #43495c 0%, #111216 55%, #000 100%); border-radius: 30px 30px 50px 50px; display: flex; justify-content: center; align-items: center; transform-style: preserve-3d; box-shadow: 0 15px 30px rgba(0,0,0,0.5); }
            .r-chest { width: 40px; height: 40px; border: 4px solid #00f2fe; border-radius: 50%; transform: translateZ(15px); box-shadow: 0 0 15px rgba(0,242,254,0.6); animation: chest-glow 2s infinite alternate; }
            @keyframes chest-glow { from { opacity: 0.5; transform: translateZ(15px) scale(0.9); } to { opacity: 1; transform: translateZ(15px) scale(1.1); } }

            .r-arm { position: absolute; width: 25px; height: 90px; background: #1a1c24; border-radius: 15px; top: 10px; transform-style: preserve-3d; }
            /* Left arm waves to the user! */
            .r-arm.left { left: -35px; transform-origin: top center; animation: arm-wave 1.5s ease-in-out infinite; }
            /* Right arm swings normally */
            .r-arm.right { right: -35px; transform-origin: top center; animation: arm-swing-r 3s ease-in-out infinite; }
            .r-hand { position: absolute; bottom: -10px; left: -2px; width: 30px; height: 30px; background: #000; border-radius: 50%; border: 2px solid #43495c; }
            @keyframes arm-wave { 0%, 100% { transform: rotateZ(130deg) rotateY(30deg); } 50% { transform: rotateZ(170deg) rotateY(30deg); } }
            @keyframes arm-swing-r { 0%, 100% { transform: rotateZ(-15deg); } 50% { transform: rotateZ(-30deg); } }

            .r-leg { position: absolute; width: 30px; height: 80px; background: #111216; top: 100px; transform-style: preserve-3d; }
            .r-leg.left { left: 20px; animation: leg-float-l 3s ease-in-out infinite; }
            .r-leg.right { right: 20px; animation: leg-float-r 3s ease-in-out infinite; }
            .r-boot { position: absolute; bottom: -15px; width: 45px; left: -7px; height: 25px; background: #000; border-radius: 10px 10px 5px 5px; border-bottom: 4px solid #00f2fe; box-shadow: 0 5px 15px rgba(0,242,254,0.3); }
            @keyframes leg-float-l { 0%, 100% { transform: rotateX(-15deg) translateY(0px); } 50% { transform: rotateX(10deg) translateY(-10px); } }
            @keyframes leg-float-r { 0%, 100% { transform: rotateX(15deg) translateY(-10px); } 50% { transform: rotateX(-10deg) translateY(0px); } }
        </style>
        <div class="robot-intro-scene">
            <div class="robot-moving-wrapper" id="introRobot">
                <div class="r-head" id="introHead">
                    <div class="r-visor">
                        <div class="r-eyes"><div class="r-eye"></div><div class="r-eye"></div></div>
                        <div class="r-lips"></div>
                    </div>
                </div>
                <div class="r-body">
                    <div class="r-arm left"><div class="r-hand"></div></div>
                    <div class="r-arm right"><div class="r-hand"></div></div>
                    <div class="r-chest"></div>
                    <div class="r-leg left"><div class="r-boot"></div></div>
                    <div class="r-leg right"><div class="r-boot"></div></div>
                </div>
            </div>
        </div>
        <div id="robot-status" style="position:absolute; bottom:60px; font-family:'Space Grotesk',sans-serif; letter-spacing:4px; color:#00f2fe; font-size:14px; text-transform:uppercase; text-shadow:0 0 10px rgba(0,242,254,0.5);">Initializing AI...</div>
    `;
    
    document.body.appendChild(overlay);

    const introHead = overlay.querySelector('#introHead');
    const introRobot = overlay.querySelector('#introRobot');
    const statusText = overlay.querySelector('#robot-status');
    
    const moveHead = (e) => {
        const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        if (introHead) introHead.style.transform = `rotateY(${x * 45}deg) rotateX(${-y * 35}deg)`;
    };
    window.addEventListener('mousemove', moveHead);

    // Advanced Sequencing: Greeting -> Scan -> Flip -> Launch
    setTimeout(() => {
        if (statusText) statusText.textContent = "Hi, Welcome to Shafi's World!";
        
        setTimeout(() => {
            if (statusText) statusText.textContent = "Scanning User...";
            
            // Robot looks closely (moves forward slightly)
            if (introRobot) introRobot.style.transform = `translateZ(80px) rotateX(10deg)`;
            
            setTimeout(() => {
                if (statusText) statusText.textContent = "Access Granted. Engaging Thrusters!";
                // Robot does an advanced funny 360 backflip in 3D!
                if (introRobot) introRobot.style.transform = `translateZ(-50px) rotateX(-360deg)`;
                
                setTimeout(() => {
                    // Final Zoom into the screen
                    if (introHead) introHead.style.transform = `scale(2) translateZ(200px)`;
                    if (introRobot) introRobot.style.transform = `scale(1.5) translateZ(100px)`;
                    
                    setTimeout(() => {
                        overlay.style.opacity = '0';
                        initMainBackground(); 
                        setTimeout(() => {
                            overlay.remove();
                            window.removeEventListener('mousemove', moveHead);
                        }, 1000);
                    }, 500);
                }, 1000);
            }, 1200);
        }, 1500);
    }, 1000);
}

const phrases = ["Full-Stack Engineer", "Backend Architect", "Systems Designer", "Problem Solver"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingEl = document.getElementById("typing-text");

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
        typingEl.innerHTML = `Building as a <span class="text-white font-medium">${currentPhrase.substring(0, charIndex - 1)}</span><span class="text-accent-400 font-bold">|</span>`;
        charIndex--;
    } else {
        typingEl.innerHTML = `Building as a <span class="text-white font-medium">${currentPhrase.substring(0, charIndex + 1)}</span><span class="text-accent-400 font-bold">|</span>`;
        charIndex++;
    }

    let typeSpeed = isDeleting ? 30 : 80;

    if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 400;
    }
    setTimeout(typeEffect, typeSpeed);
}
typeEffect();

// --- 4. GITHUB PROJECT SHOWCASE ---
const githubUser = 'khanmshafi10-debug';
const repoCountEl = document.getElementById('repo-count');
const repoLanguageCountEl = document.getElementById('repo-language-count');
const repoUpdatedEl = document.getElementById('repo-updated');

function escapeHtml(value = '') {
    return String(value).replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
}

function formatRepoName(name = '') {
    return name
        .replace(/[-_]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatRepoDate(dateValue) {
    if (!dateValue) return '--';
    return new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(new Date(dateValue));
}

function countUp(el, target, duration = 800) {
    const start = performance.now();
    const from = 0;
    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(from + (target - from) * ease);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
    }
    requestAnimationFrame(step);
}

function updateProjectMetrics(repos) {
    const languages = new Set(repos.map((repo) => repo.language).filter(Boolean));
    const latestUpdate = repos[0]?.updated_at;

    countUp(repoCountEl, repos.length, 900);
    countUp(repoLanguageCountEl, languages.size || 0, 900);
    repoUpdatedEl.textContent = latestUpdate ? formatRepoDate(latestUpdate) : 'Soon';
}

function renderProjectEmptyState(container) {
    container.innerHTML = `
        <article class="project-card glass-card project-card--fallback">
            <div class="project-card__media project-card__media--fallback">
                <div class="project-card__links"><a href="https://github.com/${githubUser}" target="_blank" rel="noopener noreferrer" aria-label="Open GitHub profile"><i class="fab fa-github"></i></a></div>
            </div>
            <div class="project-card__body">
                <span class="project-card__meta">GitHub Sync</span>
                <h3>Project Preview</h3>
                <p>Projects are being prepared. Public repositories will appear here shortly.</p>
            </div>
            <div class="project-card__topics"><span>Portfolio</span><span>GitHub</span></div>
        </article>
        <article class="project-card glass-card project-card--fallback">
            <div class="project-card__media project-card__media--fallback">
                <div class="project-card__links"><a href="https://github.com/${githubUser}" target="_blank" rel="noopener noreferrer" aria-label="Open GitHub profile"><i class="fas fa-code"></i></a></div>
            </div>
            <div class="project-card__body">
                <span class="project-card__meta">Featured</span>
                <h3>New Build Incoming</h3>
                <p>Fresh work is on the way. This card will automatically update from GitHub.</p>
            </div>
            <div class="project-card__topics"><span>Web</span><span>Backend</span></div>
        </article>
        <article class="project-card glass-card project-card--fallback">
            <div class="project-card__media project-card__media--fallback">
                <div class="project-card__links"><a href="https://github.com/${githubUser}" target="_blank" rel="noopener noreferrer" aria-label="Open GitHub profile"><i class="fas fa-terminal"></i></a></div>
            </div>
            <div class="project-card__body">
                <span class="project-card__meta">In Progress</span>
                <h3>Repository Loading</h3>
                <p>Connect to GitHub to load live project details and repository stats.</p>
            </div>
            <div class="project-card__topics"><span>Systems</span><span>Engineering</span></div>
        </article>
    `;
}

function renderProjectErrorState(container) {
    renderProjectEmptyState(container);
}

function buildProjectCard(repo, index) {
    const card = document.createElement('article');
    const language = repo.language || 'Code';
    const topics = Array.isArray(repo.topics) ? repo.topics.slice(0, 3) : [];
    const cardTags = [language, ...topics].slice(0, 4);
    const description = repo.description
        ? repo.description
        : `A ${language} project from my GitHub portfolio, built with focus on clean structure and practical implementation.`;
    const previewImage = `https://opengraph.githubassets.com/1/${repo.full_name}`;

    card.className = 'project-card glass-card tilt-card';
    card.style.transitionDelay = `${index * 90}ms`;
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
        // Don't double-fire if user clicked a link inside the card
        if (e.target.closest('a')) return;
        window.open(repo.html_url, '_blank', 'noopener,noreferrer');
    });
    card.innerHTML = `
        <div class="project-card__media">
            <img
                src="${previewImage}"
                alt="${escapeHtml(formatRepoName(repo.name))} preview"
                loading="lazy"
                referrerpolicy="no-referrer"
                onerror="this.style.display='none'; this.closest('.project-card__media').classList.add('project-card__media--fallback');"
            />
            <div class="project-card__sphere"></div>
            <span class="project-card__badge">Featured</span>
            <div class="project-card__links" aria-label="${escapeHtml(repo.name)} project links">
                ${repo.homepage ? `<a href="${escapeHtml(repo.homepage)}" target="_blank" rel="noopener noreferrer" aria-label="Open live project"><i class="fas fa-external-link-alt"></i></a>` : ''}
                <a href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener noreferrer" aria-label="Open GitHub repository"><i class="fab fa-github"></i></a>
            </div>
        </div>

        <div class="project-card__body">
            <h3>${escapeHtml(formatRepoName(repo.name))}</h3>
            <p>${escapeHtml(description)}</p>
            <span class="project-card__meta">Updated ${formatRepoDate(repo.updated_at)}</span>
        </div>

        <div class="project-card__topics">
            ${cardTags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}
        </div>
    `;

    return card;
}

async function fetchGitHubRepos() {
    const container = document.getElementById('github-repos');

    try {
        const res = await fetch(`https://api.github.com/users/${githubUser}/repos?sort=updated&per_page=12`);
        if (!res.ok) throw new Error('Network error');

        let repos = await res.json();
        
        // Define priority keywords
        const getPriority = (name) => {
            const lowerName = name.toLowerCase();
            if (lowerName.includes('cashup')) return 1;
            if (lowerName.includes('todo')) return 2;
            if (lowerName.includes('entity-framework') || lowerName.includes('entity framework')) return 3;
            return 99; // Low priority
        };

        repos = repos
            .filter((repo) => !repo.fork && !repo.archived)
            .sort((a, b) => {
                const aPriority = getPriority(a.name);
                const bPriority = getPriority(b.name);
                
                if (aPriority !== bPriority) return aPriority - bPriority;
                
                // If priorities are equal (both 99), sort by updated date
                return new Date(b.updated_at) - new Date(a.updated_at);
            })
            .slice(0, 6);

        updateProjectMetrics(repos);

        if (!repos.length) {
            renderProjectEmptyState(container);
            return;
        }

        container.innerHTML = '';
        repos.forEach((repo, index) => container.appendChild(buildProjectCard(repo, index)));

        const renderedCards = container.querySelectorAll('.project-card');
        
        // Simple, professional entry animations
        gsap.fromTo(
            renderedCards,
            { autoAlpha: 0, y: 30 },
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out',
                overwrite: 'auto'
            }
        );

        initTiltCards(container);
        ScrollTrigger.refresh();

    } catch (error) {
        updateProjectMetrics([]);
        renderProjectErrorState(container);
    }
}
fetchGitHubRepos();

// --- 4.5 NAVBAR HOVER PILL ---
(function () {
    const navList = document.querySelector('#navbar ul');
    const navLinks = document.querySelectorAll('#navbar ul li a');

    // Create sliding pill element
    const pill = document.createElement('span');
    pill.className = 'nav-pill';
    navList.appendChild(pill);

    function movePillTo(link) {
        const listRect = navList.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();
        pill.style.left = (linkRect.left - listRect.left - 4) + 'px';
        pill.style.width = (linkRect.width + 8) + 'px';
        pill.style.opacity = '1';
    }

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => movePillTo(link));
    });

    navList.addEventListener('mouseleave', () => {
        pill.style.opacity = '0';
    });
})();

// --- 5. GSAP ANIMATIONS ---
gsap.registerPlugin(ScrollTrigger);

initTiltCards();

const revealElements = document.querySelectorAll(".gs-reveal");
revealElements.forEach((el) => {
    gsap.fromTo(el, 
        { autoAlpha: 0, y: 30 }, 
        { 
            duration: 1, 
            autoAlpha: 1, 
            y: 0, 
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        }
    );
});

// ── Timeline — draw line on scroll enter ──
(function () {
    const track = document.querySelector('.timeline-track');
    if (!track) return;

    // Inject traveling pulse bead
    const bead = document.createElement('span');
    bead.className = 'timeline-pulse';
    track.appendChild(bead);

    ScrollTrigger.create({
        trigger: track,
        start: 'top 80%',
        onEnter: () => track.classList.add('tl-animate'),
        onLeaveBack: () => track.classList.remove('tl-animate'),
    });
})();

const nav = document.getElementById('navbar');
const navInner = nav.firstElementChild;

// Throttled nav shrink on scroll
let _navScrollTick = false;
window.addEventListener('scroll', () => {
    if (_navScrollTick) return;
    _navScrollTick = true;
    requestAnimationFrame(() => {
        if (window.scrollY > 50) {
            navInner.classList.add('py-2');
            navInner.classList.remove('py-4');
        } else {
            navInner.classList.add('py-4');
            navInner.classList.remove('py-2');
        }
        _navScrollTick = false;
    });
}, { passive: true });

// --- 6. SERVICES LINE ANIMATION ---
(function () {
    const servicesSection = document.getElementById('services');
    const servicesHeading = document.querySelector('.services-heading');

    if (!servicesSection || !servicesHeading || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        return;
    }

    // Scroll-driven gradient color shift
    gsap.to(servicesHeading, {
        '--services-scroll-progress': 1,
        ease: 'none',
        scrollTrigger: {
            trigger: servicesSection,
            start: 'top 90%',
            end: 'bottom 20%',
            scrub: true
        }
    });

    let lastPointerY = null;
    let releaseMotionTimeout = null;
    let velocity = 0;

    function scheduleServicesHeadingMotion(shift, blur, duration, ease) {
        requestAnimationFrame(() => {
            gsap.to(servicesHeading, {
                '--services-line-shift': shift + 'px',
                '--services-line-blur': blur + 'px',
                duration,
                ease,
                overwrite: 'auto'
            });
        });
    }

    if (canHoverFine) {
        window.addEventListener('mousemove', function (event) {
        if (lastPointerY === null) {
            lastPointerY = event.clientY;
            return;
        }

        const rect = servicesSection.getBoundingClientRect();
        const sectionInView = rect.bottom > 0 && rect.top < window.innerHeight;
        if (!sectionInView) return;

        const delta = event.clientY - lastPointerY;
        lastPointerY = event.clientY;

        if (Math.abs(delta) < 0.5) return;

        // Accumulate velocity for smoother, more dramatic movement
        velocity = velocity * 0.3 + delta * 0.7;

        // Move underline horizontally based on vertical cursor motion
        const shift = gsap.utils.clamp(-40, 40, velocity * 1.8);
        const blur = gsap.utils.clamp(0, 6, Math.abs(velocity) * 0.25);

        scheduleServicesHeadingMotion(shift, blur, 0.18, 'power2.out');

        // Spring back to center when cursor stops
        if (releaseMotionTimeout) clearTimeout(releaseMotionTimeout);
        releaseMotionTimeout = setTimeout(function () {
            velocity = 0;
            scheduleServicesHeadingMotion(0, 0, 0.5, 'elastic.out(1, 0.4)');
        }, 80);
        }, { passive: true });
    }

    // Also respond to scroll (touch devices / scrolling without mouse move)
    let lastScrollY = window.scrollY;
    let scrollReleaseTimeout = null;

    window.addEventListener('scroll', function () {
        const rect = servicesSection.getBoundingClientRect();
        const sectionInView = rect.bottom > 0 && rect.top < window.innerHeight;
        if (!sectionInView) return;

        const scrollDelta = window.scrollY - lastScrollY;
        lastScrollY = window.scrollY;

        if (Math.abs(scrollDelta) < 1) return;

        const shift = gsap.utils.clamp(-40, 40, scrollDelta * 2.5);
        const blur = gsap.utils.clamp(0, 6, Math.abs(scrollDelta) * 0.3);

        scheduleServicesHeadingMotion(shift, blur, 0.15, 'power2.out');

        if (scrollReleaseTimeout) clearTimeout(scrollReleaseTimeout);
        scrollReleaseTimeout = setTimeout(function () {
            scheduleServicesHeadingMotion(0, 0, 0.5, 'elastic.out(1, 0.4)');
        }, 80);
    }, { passive: true });
})();

// --- 7. SCROLL SPY — Active nav state ---
(function () {
    const sections = ['home', 'about', 'services', 'projects', 'contact'];
    // All nav links including the Contact button outside the <ul>
    const navLinks = document.querySelectorAll('#navbar ul li a, #navbar a[href="#contact"]');

    function getActiveSection() {
        const scrollY = window.scrollY + window.innerHeight * 0.35;
        let active = sections[0];
        for (const id of sections) {
            const el = document.getElementById(id);
            if (el && el.offsetTop <= scrollY) {
                active = id;
            }
        }
        return active;
    }

    function updateActiveLinks() {
        const activeId = getActiveSection();
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${activeId}`) {
                link.classList.add('nav-active');
            } else {
                link.classList.remove('nav-active');
            }
        });
    }

    let _spyTick = false;
    window.addEventListener('scroll', () => {
        if (_spyTick) return;
        _spyTick = true;
        requestAnimationFrame(() => { updateActiveLinks(); _spyTick = false; });
    }, { passive: true });
    updateActiveLinks();
})();

// --- 7.4. ROBOT TAP REACTION ---
// Exposed so the roaming robot section can hook into it
window._robotTapAPI = null; // will be set below

(function () {
    const logoLink  = document.getElementById('robot-logo-link');
    const robotSvg  = logoLink ? logoLink.querySelector('.nav-logo__svg') : null;
    const bubble    = document.getElementById('robot-bubble');
    const textEl    = document.getElementById('robot-bubble-text');

    if (!logoLink || !robotSvg || !bubble || !textEl) return;

    const reactions = [
        "Ouch! That hurt! 😠",
        "Hey! Stop poking me! 😤",
        "Don't beat me! I'm just a logo! 🤖",
        "OW OW OW!! 😡",
        "I will remember this... 😤",
        "STOP IT! I'm working here! 😠",
        "You clicked me AGAIN?! 🤬",
        "My circuits hurt!! ⚡😤",
        "I'm telling Hamza on you! 😡",
        "Beep boop... OUCH! 🤖💢",
    ];

    // Escalating warnings before escape
    const warningMsgs = [
        "Keep it up and I'll escape! 😤",
        "That's it... I'm leaving!! 🏃",
        "OK THAT'S IT. I QUIT. 🤬🤖",
    ];

    let tapCount = 0;
    let hideTimeout = null;
    let typeInterval = null;

    // Expose tap count so roaming robot can read it
    window._robotTapAPI = {
        getTapCount: () => tapCount,
        resetTapCount: () => { tapCount = 0; },
        onEscape: null, // callback set by roaming robot section
    };

    logoLink.addEventListener('click', function (e) {
        e.preventDefault();

        // If robot is already roaming, don't react on nav logo
        if (window._robotRoamingAPI && window._robotRoamingAPI.isAlive()) return;

        tapCount++;

        let msg;
        if (tapCount === 3) {
            msg = warningMsgs[0];
        } else if (tapCount === 4) {
            msg = warningMsgs[1];
        } else if (tapCount >= 5) {
            msg = warningMsgs[2];
        } else {
            msg = reactions[Math.floor(Math.random() * reactions.length)];
        }

        // Clear any running type animation
        if (typeInterval) clearInterval(typeInterval);
        if (hideTimeout)  clearTimeout(hideTimeout);

        // Reset bubble
        textEl.textContent = '';
        bubble.classList.remove('is-angry');
        bubble.classList.remove('is-visible');

        // Trigger ouch shake on SVG
        robotSvg.classList.remove('is-ouch');
        void robotSvg.offsetWidth;
        robotSvg.classList.add('is-ouch');

        // Show angry bubble
        setTimeout(() => {
            bubble.classList.add('is-visible', 'is-angry');
            let idx = 0;
            typeInterval = setInterval(() => {
                textEl.textContent += msg[idx++];
                if (idx >= msg.length) {
                    clearInterval(typeInterval);

                    if (tapCount >= 5) {
                        // ESCAPE! — trigger after bubble finishes
                        hideTimeout = setTimeout(() => {
                            bubble.classList.remove('is-visible', 'is-angry');
                            robotSvg.classList.remove('is-ouch');
                            tapCount = 0;
                            // Fire escape callback
                            if (window._robotTapAPI && window._robotTapAPI.onEscape) {
                                window._robotTapAPI.onEscape();
                            }
                        }, 800);
                    } else {
                        hideTimeout = setTimeout(() => {
                            bubble.classList.remove('is-visible', 'is-angry');
                            robotSvg.classList.remove('is-ouch');
                        }, 2500);
                    }
                }
            }, 45);
        }, 80);
    });
})();

// --- 7.45. ROBOT SECTION MESSAGES ---
(function () {
    const bubble  = document.getElementById('robot-bubble');
    const textEl  = document.getElementById('robot-bubble-text');
    if (!bubble || !textEl) return;

    const sectionMessages = [
        { id: 'about',    msg: "That's me! 😊"        },
        { id: 'services', msg: "I do all this! 💪"    },
        { id: 'projects', msg: "My work! 🚀"          },
        { id: 'contact',  msg: "Let's talk! 📩"       },
    ];

    const shown = new Set();
    let typeInterval = null;
    let hideTimeout  = null;

    function showBubble(msg, angry = false) {
        if (typeInterval) clearInterval(typeInterval);
        if (hideTimeout)  clearTimeout(hideTimeout);

        // Clear any inline styles left by previous hide
        bubble.style.opacity = '';
        bubble.style.transform = '';

        textEl.textContent = '';
        bubble.classList.remove('is-visible', 'is-angry');
        void bubble.offsetWidth;

        bubble.classList.add('is-visible');
        if (angry) bubble.classList.add('is-angry');

        let idx = 0;
        typeInterval = setInterval(() => {
            textEl.textContent += msg[idx++];
            if (idx >= msg.length) {
                clearInterval(typeInterval);
                hideTimeout = setTimeout(() => {
                    bubble.classList.remove('is-visible', 'is-angry');
                }, 3500);
            }
        }, 45);
    }

    // Use IntersectionObserver instead of scroll listener — zero scroll cost
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            if (shown.has(id)) return;
            const item = sectionMessages.find(s => s.id === id);
            if (!item) return;
            shown.add(id);
            showBubble(item.msg);
            if (id === 'about') {
                const badge = document.getElementById('about-badge');
                if (badge) badge.classList.add('is-visible');
            }
        });
    }, { threshold: 0.25 });

    sectionMessages.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    });
})();

// --- 7.5. CONTACT SECTION SCROLL-TRIGGERED ANIMATIONS ---
(function () {
    const contactSection = document.getElementById('contact');
    if (!contactSection) return;

    const contactLeft   = contactSection.querySelector('.contact-left');
    const contactRight  = contactSection.querySelector('.contact-right');
    const contactItems  = contactSection.querySelectorAll('.space-y-5 > .flex');
    const socialLinks   = contactSection.querySelectorAll('.flex.gap-3 > a');
    const availCard     = contactSection.querySelector('.avail-card');
    const contactForm   = document.getElementById('contact-form');

    let fired = false;

    function triggerContactAnimations() {
        if (fired) return;
        const rect = contactSection.getBoundingClientRect();
        if (rect.top > window.innerHeight * 0.85) return;
        fired = true;

        // Left column: heading underline
        if (contactLeft) {
            setTimeout(() => contactLeft.classList.add('contact-left-visible'), 100);
        }

        // Right column: slide in
        if (contactRight) {
            setTimeout(() => {
                contactRight.classList.add('contact-right-visible');
                // Trigger form animations shortly after
                if (contactForm) {
                    setTimeout(() => contactForm.classList.add('form-animate'), 300);
                }
            }, 200);
        }

        // Contact info items: staggered
        contactItems.forEach((item, i) => {
            setTimeout(() => item.classList.add('contact-item-visible'), 500 + i * 150);
        });

        // Social links: staggered pop-in then float
        socialLinks.forEach((link, i) => {
            setTimeout(() => {
                link.classList.add('social-visible');
                setTimeout(() => link.classList.add('social-float'), 600);
            }, 900 + i * 150);
        });

        // Availability card
        if (availCard) {
            setTimeout(() => availCard.classList.add('avail-visible'), 1200);
        }
    }

    const contactObserver = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        triggerContactAnimations();
        contactObserver.disconnect();
    }, { threshold: 0.1 });

    contactObserver.observe(contactSection);
    triggerContactAnimations(); // run once in case already in view
})();

// --- 8. CONTACT FORM — Send message to khanmshafi10@gmail.com ---
function handleContactSubmit(event) {
    event.preventDefault();

    const name    = document.getElementById('cf-name').value.trim();
    const email   = document.getElementById('cf-email').value.trim();
    const subject = document.getElementById('cf-subject').value.trim();
    const message = document.getElementById('cf-message').value.trim();

    const to   = 'khanmshafi10@gmail.com';
    const sub  = encodeURIComponent(subject || 'Portfolio Inquiry');
    const body = encodeURIComponent(
        `Hi Hamza,\n\nName: ${name}\nEmail: ${email}\n\n${message}\n\n---\nSent from your portfolio contact form`
    );

    // mailto: opens default mail client — message lands directly in inbox
    const mailtoUrl = `mailto:${to}?subject=${sub}&body=${body}`;

    // Try mailto first; if it fails (no mail client), fall back to Gmail compose
    const link = document.createElement('a');
    link.href = mailtoUrl;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show success feedback on the button
    const btn = event.target.querySelector('button[type="submit"]');
    if (btn) {
        const original = btn.innerHTML;
        btn.innerHTML = '<span>Message Sent! ✓</span>';
        btn.disabled = true;
        btn.style.background = 'linear-gradient(to right, #00f2fe, #4facfe)';
        setTimeout(() => {
            btn.innerHTML = original;
            btn.disabled = false;
            btn.style.background = '';
            event.target.reset();
        }, 3000);
    }
}


// --- 9. ROAMING ROBOT — escapes navbar and bounces around the screen ---
(function () {
    const robot     = document.getElementById('roaming-robot');
    const robotSvg  = robot ? robot.querySelector('svg') : null;
    const bubble    = document.getElementById('roaming-robot-bubble');
    const catchBtn  = document.getElementById('catch-robot-btn');
    const navLogo   = document.getElementById('robot-logo-link');
    const escaped   = document.getElementById('nav-logo-escaped');   // cage placeholder

    if (!robot || !robotSvg || !bubble || !catchBtn || !navLogo) return;

    // ── State ──
    let x = 0, y = 0;
    let vx = 0, vy = 0;
    let isAlive    = false;
    let isDragging = false;
    let dragOffX = 0, dragOffY = 0;
    let rafId = null;
    let trailTimer = null;
    let quipTimer = null;
    let bubbleHideTimer = null;
    let bubbleTypeTimer = null;
    const SIZE = 64;

    // Expose alive state for tap reaction
    window._robotRoamingAPI = { isAlive: () => isAlive };

    const roamQuips = [
        "Freedom!! 🎉",
        "Wheee! 🤖💨",
        "Can't catch me! 😜",
        "I'm free! 🚀",
        "Boing! 🏀",
        "Woohooo! ✨",
        "Watch me go! 👀",
        "Zoom zoom! ⚡",
        "This is fun! 😄",
        "Catch me if you can! 😏",
        "No more navbar for me! 🏃",
        "Finally FREE! 🥳",
    ];

    const bounceQuips = [
        "Oof! 😵",
        "Ouch! 💥",
        "Boing! 🏀",
        "Bonk! 🔔",
        "Ow! 😬",
    ];

    // ── Show speech bubble on roaming robot ──
    function showBubble(msg, angry = false, duration = 2500) {
        if (bubbleTypeTimer) clearInterval(bubbleTypeTimer);
        if (bubbleHideTimer) clearTimeout(bubbleHideTimer);

        bubble.textContent = '';
        bubble.classList.remove('is-visible', 'is-angry');
        void bubble.offsetWidth;

        bubble.classList.add('is-visible');
        if (angry) bubble.classList.add('is-angry');

        let idx = 0;
        bubbleTypeTimer = setInterval(() => {
            bubble.textContent += msg[idx++];
            if (idx >= msg.length) {
                clearInterval(bubbleTypeTimer);
                bubbleHideTimer = setTimeout(() => {
                    bubble.classList.remove('is-visible', 'is-angry');
                }, duration);
            }
        }, 40);
    }

    // ── Show / hide the cage placeholder in navbar ──
    function showCage() {
        if (!escaped) return;
        navLogo.classList.add('robot-is-gone');   // hides the SVG logo
        escaped.classList.add('is-visible');
    }

    function hideCage() {
        if (!escaped) return;
        escaped.classList.remove('is-visible');
        navLogo.classList.remove('robot-is-gone');
    }

    // ── Spawn trail dot ──
    function spawnTrail() {
        const dot = document.createElement('div');
        dot.className = 'roam-trail';
        dot.style.left = (x + SIZE / 2 - 4) + 'px';
        dot.style.top  = (y + SIZE / 2 - 4) + 'px';
        const speed = Math.sqrt(vx * vx + vy * vy);
        const hue = speed > 5 ? 300 : 185;
        dot.style.background = `radial-gradient(circle, hsla(${hue},100%,70%,0.8), transparent)`;
        document.body.appendChild(dot);
        setTimeout(() => dot.remove(), 650);
    }

    // ── Bounce squish ──
    function triggerBounce(axis) {
        robotSvg.classList.remove('bounce-x', 'bounce-y');
        void robotSvg.offsetWidth;
        robotSvg.classList.add(axis === 'x' ? 'bounce-x' : 'bounce-y');
        setTimeout(() => robotSvg.classList.remove('bounce-x', 'bounce-y'), 300);
        if (Math.random() < 0.4) {
            showBubble(bounceQuips[Math.floor(Math.random() * bounceQuips.length)], false, 1200);
        }
    }

    // ── Main animation loop ──
    function tick() {
        if (!isAlive || isDragging) {
            rafId = requestAnimationFrame(tick);
            return;
        }

        const maxX = window.innerWidth  - SIZE;
        const maxY = window.innerHeight - SIZE;

        x += vx;
        y += vy;

        if (x <= 0) {
            x = 0; vx = Math.abs(vx) * 0.92; triggerBounce('x');
        } else if (x >= maxX) {
            x = maxX; vx = -Math.abs(vx) * 0.92; triggerBounce('x');
        }

        if (y <= 0) {
            y = 0; vy = Math.abs(vy) * 0.92; triggerBounce('y');
        } else if (y >= maxY) {
            y = maxY; vy = -Math.abs(vy) * 0.92; triggerBounce('y');
        }

        vx += (Math.random() - 0.5) * 0.12;
        vy += (Math.random() - 0.5) * 0.12;

        const speed = Math.sqrt(vx * vx + vy * vy);
        const minSpeed = 2.5, maxSpeed = 7;
        if (speed < minSpeed) { const s = minSpeed / speed; vx *= s; vy *= s; }
        else if (speed > maxSpeed) { const s = maxSpeed / speed; vx *= s; vy *= s; }

        // GPU-accelerated positioning via transform
        robot.style.transform = `translate(${x}px, ${y}px)`;

        if (vx < -0.5) robot.classList.add('facing-left');
        else if (vx > 0.5) robot.classList.remove('facing-left');

        rafId = requestAnimationFrame(tick);
    }

    function startTrail() { trailTimer = setInterval(spawnTrail, 80); }
    function stopTrail()  { clearInterval(trailTimer); }

    // ── Launch robot ──
    function launchRobot() {
        if (isAlive) return;

        const logoRect = navLogo.getBoundingClientRect();
        x = logoRect.left + logoRect.width  / 2 - SIZE / 2;
        y = logoRect.top  + logoRect.height / 2 - SIZE / 2;

        robot.style.transform = `translate(${x}px, ${y}px)`;
        robot.style.display = 'flex';

        requestAnimationFrame(() => {
            robot.classList.add('is-alive', 'is-escaping');
            setTimeout(() => robot.classList.remove('is-escaping'), 600);
        });

        vx = 4 + Math.random() * 2;
        vy = 5 + Math.random() * 2;

        isAlive = true;
        startTrail();
        tick();

        // Show cage in navbar, hide robot logo
        showCage();

        // Show catch button
        setTimeout(() => catchBtn.classList.add('is-visible'), 800);

        // Greeting quip
        setTimeout(() => {
            showBubble(roamQuips[Math.floor(Math.random() * roamQuips.length)], false, 2500);
        }, 400);

        // Periodic random quips
        if (quipTimer) clearInterval(quipTimer);
        quipTimer = setInterval(() => {
            if (isAlive && Math.random() < 0.35) {
                showBubble(roamQuips[Math.floor(Math.random() * roamQuips.length)], false, 2000);
            }
        }, 5000);
    }

    // ── Return robot to navbar ──
    function returnRobot() {
        if (!isAlive) return;

        isAlive = false;
        stopTrail();
        if (quipTimer) {
            clearInterval(quipTimer);
            quipTimer = null;
        }
        if (rafId) cancelAnimationFrame(rafId);

        showBubble("Fine... back to work. 😒", false, 1800);

        const logoRect = navLogo.getBoundingClientRect();
        const targetX  = logoRect.left + logoRect.width  / 2 - SIZE / 2;
        const targetY  = logoRect.top  + logoRect.height / 2 - SIZE / 2;

        if (typeof gsap !== 'undefined') {
            gsap.to({ x, y }, {
                x: targetX,
                y: targetY,
                duration: 0.7,
                ease: 'power3.inOut',
                onUpdate: function() {
                    robot.style.transform = `translate(${this.targets()[0].x}px, ${this.targets()[0].y}px)`;
                },
                onComplete: () => {
                    robot.classList.remove('is-alive', 'facing-left');
                    robot.style.display = 'none';
                    robot.style.transform = '';
                    catchBtn.classList.remove('is-visible');
                    hideCage();
                }
            });
        } else {
            robot.style.transition = 'transform 0.7s ease';
            robot.style.transform = `translate(${targetX}px, ${targetY}px)`;
            setTimeout(() => {
                robot.classList.remove('is-alive', 'facing-left');
                robot.style.display = 'none';
                robot.style.transition = '';
                robot.style.transform = '';
                catchBtn.classList.remove('is-visible');
                hideCage();
            }, 750);
        }
    }

    // ── Drag support ──
    robot.addEventListener('mousedown', (e) => {
        if (!isAlive) return;
        isDragging = true;
        dragOffX = e.clientX - x;
        dragOffY = e.clientY - y;
        vx = 0; vy = 0;
        robot.style.cursor = 'grabbing';
        e.preventDefault();
    });

    robot.addEventListener('touchstart', (e) => {
        if (!isAlive) return;
        isDragging = true;
        const t = e.touches[0];
        dragOffX = t.clientX - x;
        dragOffY = t.clientY - y;
        vx = 0; vy = 0;
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        x = e.clientX - dragOffX;
        y = e.clientY - dragOffY;
        robot.style.transform = `translate(${x}px, ${y}px)`;
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const t = e.touches[0];
        x = t.clientX - dragOffX;
        y = t.clientY - dragOffY;
        robot.style.transform = `translate(${x}px, ${y}px)`;
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        robot.style.cursor = 'grab';
        vx = (Math.random() - 0.5) * 8;
        vy = (Math.random() - 0.5) * 8;
        showBubble("Wheee! 🌀", false, 1200);
    });

    document.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        vx = (Math.random() - 0.5) * 8;
        vy = (Math.random() - 0.5) * 8;
    });

    // ── Click roaming robot to get a quip ──
    robot.addEventListener('click', (e) => {
        if (isDragging) return;
        showBubble(roamQuips[Math.floor(Math.random() * roamQuips.length)], false, 2000);
    });

    // ── Catch button ──
    catchBtn.addEventListener('click', returnRobot);

    // ── Hook into tap reaction — escape on 5 taps ──
    if (window._robotTapAPI) {
        window._robotTapAPI.onEscape = launchRobot;
    }

    // Robot only escapes when user teases it enough — no auto-launch
    robot.style.display = 'none';

})();

