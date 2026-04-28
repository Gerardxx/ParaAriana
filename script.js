// Esperar a que todo el documento cargue para evitar errores de elementos no encontrados
document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DEL OVERLAY (MENSAJE DE DESEO) ---
    const overlay = document.getElementById('wish-overlay');
    const closeX = document.getElementById('close-wish-x'); // Cambiado a la X

    if (closeX && overlay) {
        closeX.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            overlay.classList.remove('active');
        });
    }

    // --- LÓGICA DE LA TORTA ---
    const cakeEmoji = document.getElementById('cake-emoji');
    const candleGlow = document.getElementById('candle-glow');

    if (cakeEmoji) {
        cakeEmoji.addEventListener('click', () => {
            if (cakeEmoji.textContent === '🎉') return;

            cakeEmoji.textContent = '🎉';
            if (candleGlow) candleGlow.style.display = 'none';
            
            if (typeof launchConfetti === 'function') launchConfetti();
            
            setTimeout(() => {
                if (overlay) overlay.classList.add('active');
            }, 800);
        });
    }
    
    // --- SCROLL HACIA LA TORTA ---
    const scrollCta = document.getElementById('sc');
    if (scrollCta) {
        scrollCta.addEventListener('click', () => {
            const cakeSection = document.getElementById('cake-section');
            if (cakeSection) cakeSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
});

// --- EL RESTO DEL CÓDIGO (PARTÍCULAS Y CURSOR) FUERA DEL DOMContentLoaded ---

// Cursor
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animateCursor() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    if(cur && ring) {
        cur.style.left = mx + 'px'; cur.style.top = my + 'px';
        ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    }
    requestAnimationFrame(animateCursor);
})();

// Canvas Partículas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];
function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = Math.random() * 1.5 + 0.3;
        this.speed = Math.random() * 0.3 + 0.05;
        this.opacity = Math.random() * 0.6 + 0.1;
        this.drift = (Math.random() - 0.5) * 0.2;
        this.type = Math.random() < 0.15 ? 'heart' : 'star';
    }
    update() {
        this.y -= this.speed;
        this.x += this.drift;
        if (this.y < -10) this.reset();
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        if (this.type === 'heart') {
            ctx.font = `${this.r * 8}px serif`;
            ctx.fillText('♡', this.x, this.y);
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = Math.random() < 0.3 ? '#d4a853' : '#f4a0b0';
            ctx.fill();
        }
        ctx.restore();
    }
}
for (let i = 0; i < 160; i++) particles.push(new Particle());
(function animateParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
})();

// Confetti
const cc = document.getElementById('confetti-canvas');
const cctx = cc.getContext('2d');
let confettiPieces = [];
let confettiRunning = false;
function launchConfetti() {
    cc.width = window.innerWidth; cc.height = window.innerHeight;
    confettiPieces = [];
    for (let i = 0; i < 200; i++) {
        confettiPieces.push({
            x: Math.random() * cc.width,
            y: -20 - Math.random() * 200,
            r: Math.random() * 8 + 4,
            color: ['#e8607a','#d4a853','#f4a0b0','#e8c97a','#ffffff','#c084fc'][Math.floor(Math.random()*6)],
            speed: Math.random() * 3 + 2,
            drift: (Math.random() - 0.5) * 2,
            rot: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 6,
            shape: Math.random() < 0.4 ? 'circle' : 'rect'
        });
    }
    confettiRunning = true;
    animateConfetti();
}
function animateConfetti() {
    cctx.clearRect(0, 0, cc.width, cc.height);
    if (!confettiRunning && confettiPieces.every(p => p.y > cc.height + 20)) return;
    confettiPieces.forEach(p => {
        p.y += p.speed;
        p.x += p.drift;
        p.rot += p.rotSpeed;
        cctx.save();
        cctx.translate(p.x, p.y);
        cctx.rotate(p.rot * Math.PI / 180);
        cctx.fillStyle = p.color;
        if (p.shape === 'circle') {
            cctx.beginPath(); cctx.arc(0, 0, p.r / 2, 0, Math.PI * 2); cctx.fill();
        } else {
            cctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
        }
        cctx.restore();
    });
    requestAnimationFrame(animateConfetti);
}

// Abrir Intro
const introElement = document.getElementById('intro');
const introBtnElement = document.getElementById('intro-btn');
if (introBtnElement) {
    introBtnElement.onclick = () => {
        introElement.classList.add('hidden');
        const main = document.getElementById('main');
        setTimeout(() => {
            main.classList.add('visible');
            ['ey','ht','hn','hd','hq','sc'].forEach((id,i) => {
                const el = document.getElementById(id);
                if(el) setTimeout(() => el.classList.add('show'), i * 150);
            });
        }, 400);
    };
}

// Click Hearts
document.addEventListener('click', (e) => {
    if (e.target.closest('#intro') || e.target.closest('.wish-overlay') || e.target.closest('#intro-btn')) return;
    const hearts = ['❤️','💕','💖','💗','🌹','✨','💫'];
    for (let i = 0; i < 6; i++) {
        const h = document.createElement('div');
        h.classList.add('heart-explode');
        h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        const angle = (Math.PI * 2 * i / 6) + Math.random() * 0.5;
        const dist = 60 + Math.random() * 60;
        h.style.left = e.clientX + 'px';
        h.style.top = e.clientY + 'px';
        h.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
        h.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
        document.body.appendChild(h);
        h.addEventListener('animationend', () => h.remove());
    }
});

// Fade In Sections
const observers = document.querySelectorAll('.fade-in-section');
const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.15 });
observers.forEach(el => io.observe(el));
