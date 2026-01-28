// field.js — minimal living field (NO WebGL, guaranteed visible)

const canvas = document.getElementById("glcanvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// pole bodov (epistemické uzly)
const NODES = 120;
const nodes = [];

for (let i = 0; i < NODES; i++) {
  nodes.push({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.0003,
    vy: (Math.random() - 0.5) * 0.0003,
    phase: Math.random() * Math.PI * 2
  });
}

let time = 0;

function step() {
  time += 0.003;

  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const n of nodes) {
    // pomalý pohyb
    n.x += n.vx;
    n.y += n.vy;

    if (n.x < 0 || n.x > 1) n.vx *= -1;
    if (n.y < 0 || n.y > 1) n.vy *= -1;

    n.phase += 0.01;

    const px = n.x * canvas.width;
    const py = n.y * canvas.height;

    const pulse = 0.5 + 0.5 * Math.sin(n.phase + time);
    const r = 2 + pulse * 3;

    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(120,180,255,${0.15 + pulse * 0.25})`;
    ctx.fill();
  }

  // jemné prepojenia (tenzie)
  for (let i = 0; i < NODES; i++) {
    for (let j = i + 1; j < NODES; j++) {
      const a = nodes[i];
      const b = nodes[j];

      const dx = (a.x - b.x) * canvas.width;
      const dy = (a.y - b.y) * canvas.height;
      const d = Math.sqrt(dx * dx + dy * dy);

      if (d < 140) {
        ctx.strokeStyle = `rgba(80,140,220,${0.04})`;
        ctx.beginPath();
        ctx.moveTo(a.x * canvas.width, a.y * canvas.height);
        ctx.lineTo(b.x * canvas.width, b.y * canvas.height);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(step);
}

step();
