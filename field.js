/* =========================================
   VECTAETOS — Field Visualization (ALPHA dark)
   Canonical & Non-semantic
   ========================================= */

import { drawRunes } from "./runes.js";

/* ---------- Canvas Setup ---------- */

const canvas = document.getElementById("field-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* ---------- Axiomatic Points ---------- */

const AXIOMS = Array.from({ length: 8 }, (_, i) => ({
  x: canvas.width / 2 + Math.cos(i * Math.PI * 2 / 8) * 180,
  y: canvas.height / 2 + Math.sin(i * Math.PI * 2 / 8) * 180,
  vx: (Math.random() - 0.5) * 0.5,
  vy: (Math.random() - 0.5) * 0.5
}));

let tensionData = null;
let runesData = [];

/* ---------- Exported Functions ---------- */

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

/* ---------- Internal Updates ---------- */

function updateAxioms() {
  AXIOMS.forEach(a => {
    a.vx += (Math.random() - 0.5) * 0.02;
    a.vy += (Math.random() - 0.5) * 0.02;

    a.x += a.vx;
    a.y += a.vy;

    if (a.x < 0 || a.x > canvas.width)  a.vx *= -1;
    if (a.y < 0 || a.y > canvas.height) a.vy *= -1;
  });
}

function drawConnections() {
  for (let i = 0; i < AXIOMS.length; i++) {
    for (let j = i + 1; j < AXIOMS.length; j++) {
      const dx = AXIOMS[j].x - AXIOMS[i].x;
      const dy = AXIOMS[j].y - AXIOMS[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 300) {
        let alpha = 0.06;

        if (tensionData) {
          alpha *= (tensionData[i] + tensionData[j]) / 2;
        }

        ctx.strokeStyle = `rgba(80, 80, 80, ${alpha})`; 
        ctx.lineWidth = tensionData ? 1.2 : 0.9;
        ctx.beginPath();
        ctx.moveTo(AXIOMS[i].x, AXIOMS[i].y);
        ctx.lineTo(AXIOMS[j].x, AXIOMS[j].y);
        ctx.stroke();
      }
    }
  }
}

function drawAxioms() {
  AXIOMS.forEach(a => {
    ctx.beginPath();
    ctx.fillStyle = "rgba(120, 120, 120, 0.8)";
    ctx.arc(a.x, a.y, 3.2, 0, Math.PI * 2);
    ctx.fill();
  });
}

/* ---------- Main Render Loop ---------- */

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (runesData.length) {
    runesData.forEach(r => {
      ctx.beginPath();
      ctx.globalAlpha = r.alpha * 0.8;
      ctx.fillStyle = r.color;
      ctx.arc(r.x, r.y, r.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  drawConnections();
  drawAxioms();
  updateAxioms();

  requestAnimationFrame(render);
}

render();
