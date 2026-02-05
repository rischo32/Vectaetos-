/* =========================================
   VECTAETOS — Main UI Logic
   Canonical orchestration of states
   ========================================= */

import { STATES, TRANSITIONS } from "./states.js";
import { deriveTensionVector } from "./tension.js";
import { applyTension, clearTension } from "./field.js";

/* ---------- DOM REFERENCES ---------- */

const projectionElements = document.querySelectorAll(".projection-state");
const inputLayer = document.getElementById("input-layer");
const inputField = document.getElementById("epistemic-input");

/* ---------- CURRENT STATE ---------- */

let currentState = STATES.INVITE;

/* ---------- RENDER STATE ---------- */

function renderState(state) {
  projectionElements.forEach(el => {
    el.classList.toggle("active", el.dataset.state === state);
  });

  inputLayer.hidden = state !== STATES.INPUT;
  if (state === STATES.INPUT) {
    inputField.focus();
    inputField.value = "";
  }

  currentState = state;
}

/* ---------- HANDLE TRANSITION ---------- */

function transitionTo(nextState) {
  const allowed = TRANSITIONS[currentState] || [];
  if (!allowed.includes(nextState)) return;

  renderState(nextState);

  // If leaving MIRROR, clear tension
  if (currentState === STATES.MIRROR && nextState === STATES.EXPLAIN) {
    clearTension();
  }
}

/* ---------- INITIAL LOAD ---------- */

window.addEventListener("load", () => {
  renderState(STATES.INVITE);
});

/* ---------- CLICK ANYWHERE (INVITE → INPUT) ---------- */

document.addEventListener("click", () => {
  if (currentState === STATES.INVITE) {
    transitionTo(STATES.INPUT);
  }
});

/* ---------- INPUT SUBMISSION ---------- */

inputField.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();

    // derive tension from input text
    const tensionVector = deriveTensionVector(inputField.value);

    // go to gate
    transitionTo(STATES.GATE_1);

    // short delay then mirror state
    setTimeout(() => {
      if (tensionVector) {
        applyTension(tensionVector);
      }
      transitionTo(STATES.MIRROR);
    }, 900);

    // after mirror, go to explanation
    setTimeout(() => {
      transitionTo(STATES.EXPLAIN);
    }, 3800);
  }
});

/* ---------- ESC KEY ALWAYS RETURNS TO IDLE ---------- */

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    renderState(STATES.IDLE);
    clearTension();
  }
});
