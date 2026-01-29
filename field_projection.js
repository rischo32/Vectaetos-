<script>
async function loadField() {
  const res = await fetch('vortex_state.json');
  return await res.json();
}

function drawField(state, ctx, w, h) {
  ctx.clearRect(0, 0, w, h);

  state.poles.forEach((p, i) => {
    const x = w/2 + Math.cos(i) * p.T * 200;
    const y = h/2 + Math.sin(i) * p.T * 200;

    const alpha = Math.max(0.2, p.C);
    ctx.fillStyle = `rgba(120,180,255,${alpha})`;

    ctx.beginPath();
    ctx.arc(x, y, 10 + p.E * 10, 0, Math.PI * 2);
    ctx.fill();
  });
}

const canvas = document.getElementById("field");
const ctx = canvas.getContext("2d");

async function loop() {
  const state = await loadField();
  drawField(state, ctx, canvas.width, canvas.height);
  requestAnimationFrame(loop);
}

loop();
</script>
