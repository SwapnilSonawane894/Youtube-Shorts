const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
const cardWrap = document.getElementById('cardWrap');

function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

const particles = [];
for (let i = 0; i < 55; i++) {
  particles.push({
    x: Math.random() * window.innerWidth,
    life: Math.random(),
    r: 0.5 + Math.random() * 1.8,
    alpha: 0.15 + Math.random() * 0.6,
    hue: 240 + Math.random() * 80,
    speed: 0.0015 + Math.random() * 0.003,
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const p of particles) {
    p.life += p.speed;
    if (p.life > 1) { p.life = 0; p.x = Math.random() * canvas.width; }
    const fade = p.life < 0.08 ? p.life / 0.08 : p.life > 0.88 ? (1 - p.life) / 0.12 : 1;
    ctx.beginPath();
    ctx.arc(
      p.x + Math.sin(p.life * Math.PI * 2) * 22,
      canvas.height - p.life * canvas.height,
      p.r, 0, Math.PI * 2
    );
    ctx.fillStyle = `hsla(${p.hue},80%,70%,${p.alpha * fade})`;
    ctx.fill();
  }
}

let rotX = 0, rotY = 0;
let targetRotX = 0, targetRotY = 0;
let mouseActive = false;
let mouseTimer = null;
let t = 0;

function onMouseMove(cx, cy) {
  mouseActive = true;
  clearTimeout(mouseTimer);
  mouseTimer = setTimeout(() => { mouseActive = false; }, 2000);

  const nx = (cx - window.innerWidth / 2) / (window.innerWidth / 2);
  const ny = (cy - window.innerHeight / 2) / (window.innerHeight / 2);
  targetRotY = nx * 42;
  targetRotX = -ny * 30;
}

document.addEventListener('mousemove', e => onMouseMove(e.clientX, e.clientY));
document.addEventListener('mouseleave', () => {
  mouseActive = false;
  clearTimeout(mouseTimer);
});

document.addEventListener('touchmove', e => {
  e.preventDefault();
  onMouseMove(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: false });
document.addEventListener('touchend', () => {
  mouseActive = false;
  clearTimeout(mouseTimer);
});

function tick() {
  t += 0.04;

  if (mouseActive) {
    rotX += (targetRotX - rotX) * 0.26;
    rotY += (targetRotY - rotY) * 0.26;
  } else {
    const floatY = Math.sin(t * 0.9) * 20 + Math.sin(t * 0.37) * 10;
    const floatX = Math.cos(t * 0.6) * 12 + Math.cos(t * 1.1) * 6;
    rotY += (floatY - rotY) * 0.06;
    rotX += (floatX - rotX) * 0.06;
  }

  cardWrap.style.transform = `rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg)`;
  drawParticles();
  requestAnimationFrame(tick);
}

tick();
