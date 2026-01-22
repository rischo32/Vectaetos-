/* =========================================================
   VECTAETOS — AMBIENT VORTEX
   Fireflies: green / violet
   Non-interactive, low-energy, continuous presence
   ========================================================= */

const canvas = document.getElementById("fireflies");
if (!canvas) return;

const ctx = canvas.getContext("2d");

let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

/* ---------- PARAMETERS ---------- */

const FIREFLY_COUNT = 28;        // jemná hustota
const BASE_SPEED = 0.12;         // pomalosť
const DRIFT = 0.05;              // náhodný dych
const PHASE_SPEED = 0.008;       // pomalá oscilácia

const COLORS = [
  "rgba(120, 255, 180, 0.75)",   // zelená
  "rgba(180, 120, 255, 0.75)"    // fialová
];

/* ---------- STATE ---------- */

const flies = Array.from({ length: FIREFLY_COUNT }, () => ({
  x: Math.random() * w,
  y: Math.random() * h,
  r: Math.random() * 1.6 + 0.4,
  vx: (Math.random() - 0.5) * BASE_SPEED,
  vy: (Math.random() - 0.5) * BASE_SPEED,
  phase: Math.random() * Math.PI * 2,
  color: COLORS[Math.floor(Math.random() * COLORS.length)]
}));

/* ---------- LOOP ---------- */

function step() {
  ctx.clearRect(0, 0, w, h);

  for (const f of flies) {
    f.phase += PHASE_SPEED;

    f.x += f.vx + Math.sin(f.phase) * DRIFT;
    f.y += f.vy + Math.cos(f.phase) * DRIFT;

    // wrap edges (nekonečné pole)
    if (f.x < 0) f.x = w;
    if (f.x > w) f.x = 0;
    if (f.y < 0) f.y = h;
    if (f.y > h) f.y = 0;

    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fillStyle = f.color;
    ctx.fill();
  }

  requestAnimationFrame(step);
}

step();

/* =========================================================
   END — ambient presence, not animation
   ========================================================= */
