/* =========================================
   VECTAETOS — RUNES VISUAL PROJECTION
   File: runes.js
   Role: Non-semantic visual pattern generator
   ========================================= */

const RUNE_COLORS = [
  "#7bbaf7", "#f7a87b", "#baf77b", "#f77bbf",
  "#7bf7ba", "#f7db7b", "#db7bf7", "#7bdff7"
];

export function generateRunes(axioms, tensionWeights) {
  const runes = [];

  axioms.forEach((a, i) => {
    const intensity = tensionWeights ? tensionWeights[i] : 0.3;
    const count = Math.floor(2 + intensity * 8);

    for (let j = 0; j < count; j++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 12 * intensity;

      runes.push({
        x: a.x + Math.cos(angle) * radius,
        y: a.y + Math.sin(angle) * radius,
        alpha: 0.4 + intensity * 0.6,
        color: RUNE_COLORS[i % RUNE_COLORS.length],
        size: 1.5 + 2.5 * intensity
      });
    }
  });

  return runes;
}

export function drawRunes(ctx, runes) {
  if (!runes || !runes.length) return;

  runes.forEach(r => {
    ctx.beginPath();
    ctx.fillStyle = `rgba(${parseInt(r.color.slice(1,3), 16)}, 
                         ${parseInt(r.color.slice(3,5), 16)}, 
                         ${parseInt(r.color.slice(5,7), 16)}, 
                         ${r.alpha})`;
    ctx.arc(r.x, r.y, r.size, 0, Math.PI * 2);
    ctx.fill();
  });
}
