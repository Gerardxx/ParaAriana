// ── CURSOR ──────────────────────────────────────
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animateCursor() {
  rx += (mx - rx) * 0.15;
  ry += (my - ry) * 0.15;
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animateCursor);
})();

// ── CANVAS PARTÍCULAS ───────────────────────────
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

// ── CONFETTI ────────────────────────────────────
const cc = document.getElementById('confetti-canvas');
const cctx = cc.getContext('2d');
cc.width = window.innerWidth; cc.height = window.innerHeight;
window.addEventListener('resize', () => { cc.width = window.innerWidth; cc.height = window.innerHeight; });
let confettiPieces = [];
let confettiRunning = false;

function launchConfetti() {
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
  setTimeout(() => { confettiRunning = false; }, 4000);
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
    cctx.globalAlpha = 0.85;
    if (p.shape === 'circle') {
      cctx.beginPath();
      cctx.arc(0, 0, p.r / 2, 0, Math.PI * 2);
      cctx.fill();
    } else {
      cctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
    }
    cctx.restore();
  });
  requestAnimationFrame(animateConfetti);
}

// ── INTRO ────────────────────────────────────────
document.getElementById('intro-btn').addEventListener('click', openMain);
function openMain() {
  document.getElementById('intro').classList.add('hidden');
  const main = document.getElementById('main');
  setTimeout(() => {
    main.classList.add('visible');
    ['ey','ht','hn','hd','hq','sc'].forEach((id,i) => {
      setTimeout(() => document.getElementById(id).classList.add('show'), i * 150);
    });
  }, 400);
}

// ── TORTA / VELAS ────────────────────────────────
let blown = false;
function blowCandles() {
  if (blown) return;
  blown = true;
  const cake = document.getElementById('cake-emoji');
  const glow = document.getElementById('candle-glow');
  cake.style.animation = 'none';
  cake.textContent = '🎉';
  cake.style.transform = 'scale(1.2)';
  glow.style.display = 'none';
  setTimeout(() => {
    cake.style.transform = 'scale(1)';
    cake.style.animation = 'cake-float 4s ease-in-out infinite';
  }, 300);
  launchConfetti();
  setTimeout(() => document.getElementById('wish-overlay').classList.add('active'), 800);
}

function closeWish() {
  document.getElementById('wish-overlay').classList.remove('active');
}

// ── CARD HOVER EFFECT ────────────────────────────
function openCard(el) {
  el.style.borderColor = 'rgba(212,168,83,0.5)';
  el.style.boxShadow = '0 0 40px rgba(232,96,122,0.15)';
  setTimeout(() => {
    el.style.borderColor = '';
    el.style.boxShadow = '';
  }, 600);
}

// ── CLICK HEARTS ────────────────────────────────
document.addEventListener('click', spawnHearts);
function spawnHearts(e) {
  if (e.target.closest('#intro') || e.target.closest('.wish-overlay') || e.target.closest('.wish-close') || e.target.closest('#intro-btn')) return;
  const hearts = ['❤️','💕','💖','💗','🌹','✨','💫'];
  const count = 6;
  for (let i = 0; i < count; i++) {
    const h = document.createElement('div');
    h.classList.add('heart-explode');
    h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    const angle = (Math.PI * 2 * i / count) + Math.random() * 0.5;
    const dist = 60 + Math.random() * 60;
    h.style.left = e.clientX + 'px';
    h.style.top = e.clientY + 'px';
    h.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    h.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    h.style.animationDelay = (Math.random() * 0.1) + 's';
    document.body.appendChild(h);
    h.addEventListener('animationend', () => h.remove());
  }
}

// ── SCROLL ANIMATIONS ────────────────────────────
const observers = document.querySelectorAll('.fade-in-section');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.15 });
observers.forEach(el => io.observe(el));

function scrollToCake() {
  document.getElementById('cake-section').scrollIntoView({ behavior: 'smooth' });
}