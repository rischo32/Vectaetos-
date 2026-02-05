/* =========================================
   VECTAETOS — Epistemic Field Projection
   File: field.js
   Role: Pure visual geometry (no semantics)

   - no meaning
   - no interpretation
   - no decision logic
   - no data persistence
   ========================================= */

/* ---------- Canvas Setup ---------- */

const canvas = document.getElementById("field-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* ---------- Field Configuration ---------- */

const AXIOM_COUNT = 8;
const CENTER_PULL = 0.0005;
const DRIFT = 0.15;
const NOISE = 0.2;
const CONNECTION_DISTANCE = 260;

/* ---------- Axiom Initialization ---------- */

const axioms = [];

for (let i = 0; i < AXIOM_COUNT; i++) {
  const angle = (Math.PI * 2 / AXIOM_COUNT) * i;
  const radius = Math.min(canvas.width, canvas.height) * 0.25;

  axioms.push({
    x: canvas.width / 2 + Math.cos(angle) * radius,
    y: canvas.height / 2 + Math.sin(angle) * radius,
    vx: (Math.random() - 0.5) * DRIFT,
    vy: (Math.random() - 0.5) * DRIFT
  });
}

/* ---------- Utility ---------- */

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/* ---------- Update Dynamics ---------- */

function updateField() {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  axioms.forEach(a => {
    // Gentle drift
    a.vx += (Math.random() - 0.5) * NOISE * 0.01;
    a.vy += (Math.random() - 0.5) * NOISE * 0.01;

    // Soft pull toward center (coherence)
    a.vx += (cx - a.x) * CENTER_PULL;
    a.vy += (cy - a.y) * CENTER_PULL;

    a.x += a.vx;
    a.y += a.vy;

    // Boundary reflection (non-escaping)
    if (a.x < 0 || a.x > canvas.width) a.vx *= -1;
    if (a.y < 0 || a.y > canvas.height) a.vy *= -1;
  });
}

/* ---------- Rendering ---------- */

function drawConnections() {
  for (let i = 0; i < AXIOM_COUNT; i++) {
    for (let j = i + 1; j < AXIOM_COUNT; j++) {
      const d = distance(axioms[i], axioms[j]);
      if (d < CONNECTION_DISTANCE) {
        const alpha = 1 - d / CONNECTION_DISTANCE;
        ctx.strokeStyle = `rgba(180, 180, 180, ${alpha * 0.25})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(axioms[i].x, axioms[i].y);
        ctx.lineTo(axioms[j].x, axioms[j].y);
        ctx.stroke();
      }
    }
  }
}

function drawAxioms() {
  axioms.forEach(a => {
    ctx.beginPath();
    ctx.arc(a.x, a.y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "#e6e6e6";
    ctx.fill();
  });
}

/* ---------- Animation Loop ---------- */

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateField();
  drawConnections();
  drawAxioms();

  requestAnimationFrame(animate);
}

animate();
