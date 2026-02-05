/* =========================================
   VECTAETOS — Rune Projection (ALPHA dark)
   Canonical & non-semantic
   ========================================= */

const RUNE_BASE_COLORS = [
  "rgba(110, 110, 150,",
  "rgba(150, 110, 130,",
  "rgba(130, 150, 110,",
  "rgba(110, 150, 150,",
  "rgba(150, 130, 110,",
  "rgba(130, 110, 150,",
  "rgba(150, 150, 110,",
  "rgba(110, 130, 150,"
];

export function drawRunes(tensionWeights, axioms) {
  if (!tensionWeights || !axioms) return [];

  const runes = [];

  for (let i = 0; i < axioms.length; i++) {
    const a = axioms[i];
    const weight = tensionWeights[i] || 0.15;
    const count = Math.max(1, Math.floor(weight * 6));

    for (let j = 0; j < count; j++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 6 + Math.random() * (10 * weight);

      runes.push({
        x: a.x + Math.cos(angle) * radius,
        y: a.y + Math.sin(angle) * radius,
        size: 1 + weight * 2,
        alpha: 0.3 + weight * 0.4,
        color: `${RUNE_BASE_COLORS[i % RUNE_BASE_COLORS.length]} ${0.25 + weight * 0.35})`
      });
    }
  }

  return runes;
}
