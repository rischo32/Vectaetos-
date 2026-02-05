/* =========================================
   VECTAETOS — Main Control Logic
   Orchestration only (no meaning, no answers)
   ========================================= */

import { STATES, setState, getState, isInteractionConsumed } from "./states.js";
import { computeTension } from "./tension.js";
import { applyTension, clearTension, collapseField } from "./field.js";

/* ---------- DOM ---------- */

const inputLayer = document.getElementById("input-layer");
const inputField = document.getElementById("epistemic-input");
const paywall = document.getElementById("paywall");

/* ---------- Internal Flags ---------- */

let gateLocked = false;

/* ---------- Helpers ---------- */

function openInput() {
  inputLayer.hidden = false;
  inputField.value = "";
  inputField.focus();
}

function closeInput() {
  inputLayer.hidden = true;
  inputField.blur();
}

/* ---------- Initial Flow ---------- */

/*
INVITE → INPUT
User signals intent by click
*/

document.addEventListener("click", () => {
  const state = getState();

  // First interaction: allow input
  if (state === STATES.INVITE) {
    setState(STATES.INPUT);
    openInput();
    return;
  }

  // Any further interaction after SILENT → collapse + paywall
  if (isInteractionConsumed() && state !== STATES.PAYWALL) {
    triggerCollapseAndPaywall();
  }
});

/* ---------- Input Handling ---------- */

inputField.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  e.preventDefault();

  if (gateLocked) return;

  const text = inputField.value.trim();
  if (!text) return;

  gateLocked = true;
  closeInput();

  runGateSequence(text);
});

/* ---------- Gate Sequence ---------- */

function runGateSequence(text) {
  // GATE 1 — Linear stabilization
  setState(STATES.GATE_1);

  setTimeout(() => {
    // MIRROR — project tension
    const tension = computeTension(text);
    applyTension(tension);
    setState(STATES.MIRROR);

    // SILENT — withdraw projection
    setTimeout(() => {
      clearTension();
      setState(STATES.SILENT);
    }, 2200);

  }, 900);
}

/* ---------- Collapse + Paywall ---------- */

function triggerCollapseAndPaywall() {
  setState(STATES.PAYWALL);

  collapseField();

  // allow visual collapse to finish before showing paywall
  setTimeout(() => {
    paywall.hidden = false;
  }, 2400);
}
