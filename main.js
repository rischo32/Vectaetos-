/* =========================================
   VECTAETOS — Main UI Logic
   Apple-style smooth orchestration
   ========================================= */

import { STATES, TRANSITIONS } from "./states.js";
import { deriveTensionVector } from "./tension.js";
import { applyTension, clearTension } from "./field.js";

/* ---------- DOM REFERENCES ---------- */

const projectionElements = document.querySelectorAll(".projection-state");
const inputLayer = document.getElementById("input-layer");
const inputField = document.getElementById("epistemic-input");

/* ---------- CURRENT STATE ---------- */

let currentState = STATES.IDLE;
let isTransitioning = false;

/* ---------- RENDER STATE ---------- */

function renderState(state) {
  if (isTransitioning) return;
  
  projectionElements.forEach(el => {
    el.classList.toggle("active", el.dataset.state === state);
  });

  inputLayer.hidden = state !== STATES.INPUT;
  if (state === STATES.INPUT) {
    setTimeout(() => {
      inputField.focus();
      inputField.value = "";
    }, 100);
  }

  currentState = state;
}

/* ---------- HANDLE TRANSITION ---------- */

function transitionTo(nextState) {
  const allowed = TRANSITIONS[currentState] || [];
  if (!allowed.includes(nextState)) return;

  renderState(nextState);

  // Clear tension when leaving MIRROR
  if (currentState === STATES.MIRROR && nextState === STATES.EXPLAIN) {
    clearTension();
  }
}

/* ---------- INITIAL LOAD ---------- */

window.addEventListener("load", () => {
  renderState(STATES.INVITE);
});

/* ---------- CLICK ANYWHERE (INVITE → INPUT) ---------- */

let hasClickedOnce = false;

document.addEventListener("click", (e) => {
  // Ignore clicks on input layer
  if (e.target.closest('#input-layer')) return;
  
  if (currentState === STATES.INVITE && !hasClickedOnce) {
    hasClickedOnce = true;
    transitionTo(STATES.INPUT);
  }
});

/* ---------- INPUT SUBMISSION ---------- */

inputField.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && !isTransitioning) {
    e.preventDefault();

    const text = inputField.value.trim();
    if (text.length < 10) {
      return; // Too short, ignore
    }

    isTransitioning = true;

    // Derive tension from input
    const tensionVector = deriveTensionVector(text);

    // Go to gate
    transitionTo(STATES.GATE_1);

    // Stabilization delay → Mirror
    setTimeout(() => {
      if (tensionVector) {
        applyTension(tensionVector);
      }
      transitionTo(STATES.MIRROR);
    }, 1200);

    // Mirror → Explanation
    setTimeout(() => {
      transitionTo(STATES.EXPLAIN);
    }, 4500);

    // Explanation → IDLE (ready for next)
    setTimeout(() => {
      transitionTo(STATES.IDLE);
      isTransitioning = false;
      hasClickedOnce = false;
    }, 7500);
  }
});

/* ---------- ESC KEY RETURNS TO IDLE ---------- */

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    renderState(STATES.IDLE);
    clearTension();
    isTransitioning = false;
    hasClickedOnce = false;
  }
});
