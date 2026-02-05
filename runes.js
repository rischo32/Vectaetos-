/* =========================================
   VECTAETOS — Rune Visual Projection
   Canonical & non-semantic
   ========================================= */

/*
  Runic visuals are not symbols with meaning.
  They are simply ephemeral shapes distributed
  around axiomatic positions to intensify
  visual tension.
*/

const RUNE_BASE_COLORS = [
  "rgba(220, 120, 255,",
  "rgba(120, 220, 255,",
  "rgba(255, 200, 120,",
  "rgba(200, 120, 255,",
  "rgba(120, 255, 180,",
  "rgba(180, 120, 255,",
  "rgba(255, 120, 180,",
  "rgba(120, 180, 255,"
];

/**
 * Generates a rune data list based on tension weights
 * and positions of axiomatic points.
 */
export function drawRunes(tensionWeights, axioms) {
  if (!tensionWeights || !axioms) return [];

  const runes = [];

  for (let i = 0; i < axioms.length; i++) {
    const a = axioms[i];
    const weight = tensionWeights[i] || 0.2;

    // number of runes around this point
    const count = Math.max(2, Math.floor(weight * 8));

    for (let j = 0; j < count; j++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 6 + Math.random() * (12 * weight);

      const x = a.x + Math.cos(angle) * radius;
      const y = a.y + Math.sin(angle) * radius;

      const colorIndex = i % RUNE_BASE_COLORS.length;
      const base = RUNE_BASE_COLORS[colorIndex];

      runes.push({
        x,
        y,
        size: 1.5 + weight * 2.5,
        color: `${base} ${0.4 + weight * 0.4})`,
        alpha: 1
      });
    }
  }

  return runes;
}
