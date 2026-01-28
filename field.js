const canvas = document.getElementById("field");
const ctx = canvas.getContext("2d");
const runeEl = document.getElementById("rune");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// vstupný stav ako vektor
let state = {
  E: 0.5,
  C: 0.5,
  T: 0.3,
  M: 0.2,
  S: 0.25,
  rune: "ᚨ"
};

// pomocná funkcia pre jemný prechod
function lerp(a, b, t) {
  return a + (b - a) * t;
}

function drawField() {
  // jemné pozadie (fade)
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // vypočítaj farebné zóny
  const baseHue = lerp(180, 260, state.C);       // modré k fialovej
  const tensionHue = lerp(0, 60, state.T);       // červené žlté ako kontrast
  const entropyAlpha = Math.min(0.3 + state.S * 0.7, 1.0);

  // jemne kresli polia
  for (let i = 0; i < 100; i++) {
    const x = (Math.sin(i + state.M * 10) + 1) * canvas.width / 2;
    const y = (Math.cos(i + state.M * 7) + 1) * canvas.height / 2;

    // mix farieb
    const hue = (baseHue * (1 - state.T)) + (tensionHue * state.T);
    const saturation = 50 + 50 * state.C;
    const lightness = 30 + 20 * (1 - state.S);

    ctx.beginPath();
    ctx.arc(x, y, 60 * (0.3 + state.C * 0.7), 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${entropyAlpha})`;
    ctx.fill();
  }

  // runa (stav poľa)
  runeEl.textContent = state.rune;
}

async function fetchState() {
  try {
    const res = await fetch("field_state.json?" + Date.now());
    const data = await res.json();
    state = { ...data.phi, rune: data.rune };
  } catch (e) {
    // ignoruj chyby (napr. keď JSON nie je pripravený)
  }
}

// updaty s pomalšou frekvenciou
setInterval(fetchState, 400);
setInterval(drawField, 100);
