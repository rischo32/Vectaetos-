/* =========================================
   VECTAETOS — Field Visualization
   Deep Space Nebula + Ontological Collapse
   ========================================= */

import { drawRunes } from "./runes.js";

/* ---------- Canvas ---------- */

const canvas = document.getElementById("field-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* ---------- Field State ---------- */

let tensionData = null;
let runesData = [];
let collapsed = false;
let collapseProgress = 0; // 0 → 1

/* ---------- Axiomatic Points ---------- */

const AXIOMS = Array.from({ length: 8 }, () => ({
  x: canvas.width / 2,
  y: canvas.height / 2,
  vx: (Math.random() - 0.5) * 0.4,
  vy: (Math.random() - 0.5) * 0.4
}));

/* ---------- Public API ---------- */

export function applyTension(weights) {
  if (collapsed) return;
  tensionData = weights || null;
  if (weights) {
    runesData = drawRunes(weights, AXIOMS);
  }
}

export function clearTension() {
  tensionData = null;
  runesData = [];
}

/* ---- ONTOLOGICAL COLLAPSE ---- */

export function collapseField() {
  collapsed = true;
  tensionData = null;
  runesData = [];
}

/* ---------- Update Logic ---------- */

function updateAxioms() {
  AXIOMS.forEach(a => {
    if (!collapsed) {
      a.vx += (Math.random() - 0.5) * 0.02;
      a.vy += (Math.random() - 0.5) * 0.02;
    } else {
      // during collapse: lose coherence
      a.vx *= 0.92;
      a.vy *= 0.92;
      a.vx += (Math.random() - 0.5) * 0.15;
      a.vy += (Math.random() - 0.5) * 0.15;
    }

    a.x += a.vx;
    a.y += a.vy;
  });
}

/* ---------- Nebula Fade ---------- */

function nebulaFade() {
  let alpha = collapsed
    ? 0.15 + collapseProgress * 0.35
    : 0.06;

  ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/* ---------- Connections ---------- */

function drawConnections() {
  if (collapsed && collapseProgress > 0.6) return;

  for (let i = 0; i < AXIOMS.length; i++) {
    for (let j = i + 1; j < AXIOMS.length; j++) {
      const dx = AXIOMS[j].x - AXIOMS[i].x;
      const dy = AXIOMS[j].y - AXIOMS[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 300) {
        let alpha = 0.04;
        if (tensionData) {
          alpha *= (tensionData[i] + tensionData[j]) / 2;
        }
        if (collapsed) {
          alpha *= (1 - collapseProgress);
        }

        ctx.strokeStyle = `rgba(70, 70, 80, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(AXIOMS[i].x, AXIOMS[i].y);
        ctx.lineTo(AXIOMS[j].x, AXIOMS[j].y);
        ctx.stroke();
      }
    }
  }
}

/* ---------- Axioms ---------- */

function drawAxioms() {
  AXIOMS.forEach(a => {
    let radius = 2.8;
    let alpha = 0.7;

    if (collapsed) {
      radius *= (1 - collapseProgress);
      alpha *= (1 - collapseProgress);
    }

    ctx.beginPath();
    ctx.fillStyle = `rgba(90, 90, 100, ${alpha})`;
    ctx.arc(a.x, a.y, Math.max(radius, 0.1), 0, Math.PI * 2);
    ctx.fill();
  });
}

/* ---------- Render Loop ---------- */

function render() {
  nebulaFade();

  // runes dissolve first
  if (!collapsed && runesData.length) {
    runesData.forEach(r => {
      ctx.beginPath();
      ctx.globalAlpha = r.alpha * 0.7;
      ctx.fillStyle = r.color;
      ctx.arc(r.x, r.y, r.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  drawConnections();
  drawAxioms();
  updateAxioms();

  if (collapsed && collapseProgress < 1) {
    collapseProgress += 0.006;
  }

  requestAnimationFrame(render);
}

render();
