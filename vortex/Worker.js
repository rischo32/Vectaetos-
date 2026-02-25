// ============================================================
// VECTAETOS :: Cloudflare Worker
// Business Model: 1 Question / 1€ / 100 characters
// Stateless · Deterministic · No Optimization · No Feedback
// ============================================================


// ============================================
// CONFIG
// ============================================

const N = 8;
const STEPS = 500;
const INTERACTION_STRENGTH = 0.02;
const NOISE_LEVEL = 0.01;
const QE_THRESHOLD = 0.15;


// ============================================
// CORS
// ============================================

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
}


// ============================================
// DETERMINISTIC PRNG (Mulberry32)
// ============================================

function mulberry32(seed) {
  return function () {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}


// ============================================
// TEXT → SEED
// ============================================

async function textToSeed(text) {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.slice(0, 4).reduce((a, b) => (a << 8) + b, 0);
}


// ============================================
// INITIAL RELATIONAL MATRIX
// ============================================

function generateInitialRelations(rand) {
  let R = Array.from({ length: N }, () => Array(N).fill(0));

  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const val = rand() * 0.6 - 0.3;
      R[i][j] = val;
      R[j][i] = -val;
    }
  }

  return R;
}


// ============================================
// SINGLE STEP UPDATE
// ============================================

function step(R, rand) {
  let newR = R.map(row => [...row]);

  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {

      let tension = R[i][j];
      let delta = (rand() * 2 - 1) * NOISE_LEVEL;

      let coupling = 0;
      for (let k = 0; k < N; k++) {
        if (k !== i && k !== j) {
          coupling += (R[i][k] - R[j][k]);
        }
      }

      coupling *= INTERACTION_STRENGTH;

      let updated = tension + delta + coupling;
      let bounded = Math.tanh(updated);

      newR[i][j] = bounded;
      newR[j][i] = -bounded;
    }
  }

  return newR;
}


// ============================================
// QE DETECTION (Graph Fragmentation)
// ============================================

function detectQE(R) {

  let visited = new Set();

  function dfs(node) {
    for (let j = 0; j < N; j++) {
      if (Math.abs(R[node][j]) > QE_THRESHOLD && !visited.has(j)) {
        visited.add(j);
        dfs(j);
      }
    }
  }

  visited.add(0);
  dfs(0);

  return visited.size < N;
}


// ============================================
// EPISTEMIC AUDIT
// ============================================

function epistemicAudit(R) {

  let mu_total = 0;
  let asym_total = 0;

  for (let i = 0; i < N; i++) {
    let avg = 0;
    for (let j = 0; j < N; j++) {
      if (i !== j) avg += Math.abs(R[i][j]);
    }
    avg /= (N - 1);
    mu_total += avg;
  }

  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      asym_total += Math.abs(R[i][j]);
    }
  }

  let h_topo = 1;
  if (mu_total + asym_total > 0) {
    h_topo = mu_total / (mu_total + asym_total);
  }

  return {
    mu_total,
    asym_total,
    h_topo
  };
}


// ============================================
// MAIN VORTEX EXECUTION
// ============================================

async function runVortex(question) {

  const seed = await textToSeed(question);
  const rand = mulberry32(seed);

  let R = generateInitialRelations(rand);
  let qe_state = false;

  for (let i = 0; i < STEPS; i++) {
    R = step(R, rand);

    if (detectQE(R)) {
      qe_state = true;
      break;
    }
  }

  const audit = epistemicAudit(R);

  return {
    qe_state,
    ...audit
  };
}


// ============================================
// WORKER ENTRY POINT
// ============================================

export default {
  async fetch(request) {

    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    // ----------------------------------------
    // ANALYZE ENDPOINT
    // ----------------------------------------
    if (url.pathname === "/analyze" && request.method === "POST") {

      const body = await request.json();

      if (!body.question || typeof body.question !== "string") {
        return new Response(
          JSON.stringify({ error: "Question required." }),
          { status: 400, headers: corsHeaders() }
        );
      }

      if (body.question.length > 100) {
        return new Response(
          JSON.stringify({ error: "Max 100 characters allowed." }),
          { status: 400, headers: corsHeaders() }
        );
      }

      const result = await runVortex(body.question);

      return new Response(
        JSON.stringify(result),
        { headers: corsHeaders() }
      );
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: corsHeaders() }
    );
  }
};
