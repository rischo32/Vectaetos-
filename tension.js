/* =========================================
   VECTAETOS — Epistemic Tension Mapper
   File: tension.js
   Role: Non-semantic deformation only
   ========================================= */

/*
  The mapper does NOT understand text.
  It only derives structural asymmetries.
*/

export function deriveTensionVector(text) {
  if (!text || typeof text !== "string") {
    return null;
  }

  const length = text.length;
  const breaks = (text.match(/\n/g) || []).length;
  const punctuation = (text.match(/[!?.,;]/g) || []).length;

  // Normalize
  const l = Math.min(length / 500, 1);
  const b = Math.min(breaks / 10, 1);
  const p = Math.min(punctuation / 20, 1);

  // Generate asymmetric weights for 8 axioms
  const weights = Array.from({ length: 8 }, (_, i) => {
    return Math.abs(
      Math.sin((i + 1) * (l + 0.3)) +
      Math.cos((i + 2) * (b + p))
    );
  });

  // Normalize weights
  const max = Math.max(...weights);
  return weights.map(w => w / max);
}
