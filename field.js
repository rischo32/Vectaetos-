/* =========================================
   VECTAETOS — Field Visualization
   Fixed: Black canvas background
   ========================================= */

import { drawRunes } from "./runes.js";

// Canvas setup
const canvas = document.getElementById("field-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Axiomatic points
const AXIOMS = Array.from({ length: 8 }, (_, i) => ({
  x: canvas.width / 2 + Math.cos(i * Math.PI * 2 / 8) * 200,
  y: canvas.height / 2 + Math.sin(i * Math.PI * 2 / 8) * 200,
  vx: (Math.random() - 0.5) * 0.8,
  vy: (Math.random() - 0.5) * 0.8
}));

let tensionData = null;
let runesData = [];

// Exposed functions
export function applyTension(weights) {
  tensionData = weights || null;
  if (weights) {
    runesData = drawRunes(weights, AXIOMS);
  }
}

export function clearTension() {
  tensionData = null;
  runesData = [];
}

// Update motion
function updateAxioms() {
  AXIOMS.forEach(a => {
    // random drift
    a.vx += (Math.random() - 0.5) * 0.03;
    a.vy += (Math.random() - 0.5) * 0.03;

    // move
    a.x += a.vx;
    a.y += a.vy;

    // bounds reflection
    if (a.x < 0 || a.x > canvas.width)  a.vx *= -1;
    if (a.y < 0 || a.y > canvas.height) a.vy *= -1;
  });
}

// Draw connections + optional tension
function drawConnections() {
  for (let i = 0; i < AXIOMS.length; i++) {
    for (let j = i + 1; j < AXIOMS.length; j++) {
      const dx = AXIOMS[j].x - AXIOMS[i].x;
      const dy = AXIOMS[j].y - AXIOMS[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 350) {
        let alpha = 0.14;

        if (tensionData) {
          alpha *= (tensionData[i] + tensionData[j]) / 2;
        }

        ctx.strokeStyle = `rgba(190, 190, 190, ${alpha})`;
        ctx.lineWidth   = tensionData ? 1.5 : 1.0;
        ctx.beginPath();
        ctx.moveTo(AXIOMS[i].x, AXIOMS[i].y);
        ctx.lineTo(AXIOMS[j].x, AXIOMS[j].y);
        ctx.stroke();
      }
    }
  }
}

// Draw axioms
function drawAxioms() {
  AXIOMS.forEach(a => {
    ctx.fillStyle = "#e6e6e6";
    ctx.beginPath();
    ctx.arc(a.x, a.y, 3.4, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Main render loop
function render() {
  // CRITICAL FIX: Fill with pure black FIRST
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Optionally draw runes
  if (runesData && runesData.length) {
    runesData.forEach(r => {
      ctx.beginPath();
      ctx.fillStyle = r.color;
      ctx.globalAlpha = r.alpha;
      ctx.arc(r.x, r.y, r.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  }

  drawConnections();
  drawAxioms();

  updateAxioms();
  requestAnimationFrame(render);
}

// Start animating
render();
