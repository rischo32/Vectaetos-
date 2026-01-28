const canvas = document.getElementById("field");
const ctx = canvas.getContext("2d");
const runeEl = document.getElementById("rune");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

let state = {
  E: 0.5, C: 0.5, T: 0.5, M: 0.5, S: 0.5,
  rune: "ᚨ"
};

async function fetchState() {
  try {
    const res = await fetch("field_state.json?"+Date.now());
    const data = await res.json();
    state = { ...data.phi, rune: data.rune };
  } catch(e) {}
}

function drawField() {
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  const intensity = state.T * 300;
  const coherence = state.C;

  for (let i=0;i<200;i++){
    const x = Math.random()*canvas.width;
    const y = Math.random()*canvas.height;
    const r = Math.random()*intensity;

    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fillStyle = `rgba(120,200,255,${0.03*coherence})`;
    ctx.fill();
  }

  runeEl.textContent = state.rune;
}

setInterval(fetchState, 100);
setInterval(drawField, 60);
