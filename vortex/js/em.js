export function computeEM(W, H, D) {

  const EM = (0.4 * W + 0.4 * H + 0.2 * D);

  let state;

  if (EM < 0.33) state = "LOW COHERENCE";
  else if (EM < 0.66) state = "TENSIONAL";
  else state = "EPISTEMICALLY ACTIVE";

  return {
    value: Number(EM.toFixed(3)),
    state
  };
}
