/* =========================================
   VECTAETOS — Epistemic Tension Mapper
   Canonical, non-semantic
   ========================================= */

export function deriveTensionVector(text) {
  // text may be any string
  if (!text || typeof text !== "string") {
    return null;
  }

  // Normalize length influence
  const lenNorm = Math.min(text.length / 500, 1);

  // Count punctuation as structural breaks
  const punctuationCount = (text.match(/[!?.,;]/g) || []).length;
  const puncNorm = Math.min(punctuationCount / 20, 1);

  // Derive 8 weighting values
  const weights = Array.from({ length: 8 }, (_, i) => {
    return Math.abs(
      Math.sin((i + 1) * (lenNorm + 0.3)) +
      Math.cos((i + 2) * (puncNorm + 0.2))
    );
  });

  // Normalize to max 1
  const maxW = Math.max(...weights);
  return weights.map(w => w / maxW);
}
