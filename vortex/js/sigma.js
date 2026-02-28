export function computeSigma(text) {

  const length = text.length;

  const words = text
    .trim()
    .split(/\s+/)
    .filter(w => w.length > 0).length;

  const hasQuestion = text.includes("?");
  const hasWhy = /why|how|explain|čo|prečo|ako/i.test(text);

  // ŠÍRKA — kontext
  const W = Math.min(1, words / 12);

  // HĹBKA — otázkovosť
  const H = Math.min(
    1,
    hasQuestion ? 0.8 :
    hasWhy ? 0.6 :
    0.4
  );

  // ROZSAH — informačná hustota
  const D = Math.min(1, length / 100);

  return {
    W: Number(W.toFixed(3)),
    H: Number(H.toFixed(3)),
    D: Number(D.toFixed(3))
  };
}
