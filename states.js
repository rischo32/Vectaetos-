/* =========================================
   VECTAETOS — UI State Machine
   Canonical, Non-Agentic, Non-Persistent
   ========================================= */

/*
States:

IDLE        — pole existuje, žiadna interakcia
INVITE      — úvodná veta
INPUT       — povolený jednorazový vstup
GATE_1      — stabilizácia významu (vizuálna)
MIRROR      — projekcia napätia (bez textu)
SILENT      — ticho po projekcii
PAYWALL     — kolaps poľa (riešené inde)
*/

const STATES = {
  IDLE: "IDLE",
  INVITE: "INVITE",
  INPUT: "INPUT",
  GATE_1: "GATE_1",
  MIRROR: "MIRROR",
  SILENT: "SILENT",
  PAYWALL: "PAYWALL"
};

let currentState = STATES.IDLE;

/* ---------- DOM ---------- */

const projectionStates = document.querySelectorAll(".projection-state");
const inputLayer = document.getElementById("input-layer");

/* ---------- Internal Flags ---------- */

let interactionConsumed = false;

/* ---------- Helpers ---------- */

function showProjectionState(stateName) {
  projectionStates.forEach(el => {
    el.classList.toggle(
      "active",
      el.dataset.state === stateName
    );
  });
}

function hideAllProjections() {
  projectionStates.forEach(el => el.classList.remove("active"));
}

/* ---------- State Transition ---------- */

export function setState(nextState) {
  if (currentState === nextState) return;

  currentState = nextState;

  switch (nextState) {

    case STATES.IDLE:
      hideAllProjections();
      inputLayer.hidden = true;
      break;

    case STATES.INVITE:
      showProjectionState("INVITE");
      inputLayer.hidden = true;
      break;

    case STATES.INPUT:
      hideAllProjections();
      inputLayer.hidden = false;
      break;

    case STATES.GATE_1:
      showProjectionState("GATE_1");
      inputLayer.hidden = true;
      break;

    case STATES.MIRROR:
      hideAllProjections();
      inputLayer.hidden = true;
      interactionConsumed = true;
      break;

    case STATES.SILENT:
      hideAllProjections();
      inputLayer.hidden = true;
      break;

    case STATES.PAYWALL:
      hideAllProjections();
      inputLayer.hidden = true;
      break;
  }
}

/* ---------- Public Queries ---------- */

export function getState() {
  return currentState;
}

export function isInteractionConsumed() {
  return interactionConsumed;
}

/* ---------- Canonical Flow ---------- */

/*
Initial boot sequence:
IDLE → INVITE (after short delay)
*/

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    setState(STATES.INVITE);
  }, 1200);
});

/*
User intent to interact:
INVITE → INPUT
Handled externally (main.js)
*/

/*
After input submission:
INPUT → GATE_1 → MIRROR → SILENT
Timing handled externally
*/

/*
Any interaction attempt after SILENT:
→ PAYWALL
Handled externally
*/

/* ---------- Export States ---------- */

export { STATES };
