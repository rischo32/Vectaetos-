/* =========================================
   VECTAETOS — Main UI Orchestrator
   File: main.js
   Role: State coordination only

   - no epistemic logic
   - no interpretation
   - no decision making
   ========================================= */

import { STATES, TRANSITIONS, TERMINAL_STATES } from "./states.js";

/* ---------- DOM REFERENCES ---------- */

const projectionStates = document.querySelectorAll(".projection-state");
const inputLayer = document.getElementById("input-layer");
const inputField = document.getElementById("epistemic-input");

/* ---------- STATE ---------- */

let currentState = STATES.IDLE;

/* ---------- CORE FUNCTIONS ---------- */

/**
 * Activate a visual state.
 * This function does not care WHY the state changes.
 */
function renderState(state) {
  projectionStates.forEach(el => {
    el.classList.toggle(
      "active",
      el.dataset.state === state
    );
  });

  // Input layer visibility
  if (state === STATES.INPUT) {
    inputLayer.hidden = false;
    inputField.focus();
  } else {
    inputLayer.hidden = true;
    inputField.value = "";
  }

  currentState = state;
}

/**
 * Check whether a transition is allowed.
 * Purely topological.
 */
function canTransition(toState) {
  return TRANSITIONS[currentState]?.includes(toState);
}

/**
 * Transition handler.
 * No side effects beyond rendering.
 */
function transitionTo(nextState) {
  if (!canTransition(nextState)) return;
  renderState(nextState);

  // Terminal states auto-return to IDLE
  if (TERMINAL_STATES.includes(nextState)) {
    setTimeout(() => {
      renderState(STATES.IDLE);
    }, 5000);
  }
}

/* ---------- EVENT BINDINGS ---------- */

/* Initial orientation */
window.addEventListener("load", () => {
  renderState(STATES.INVITE);
});

/* Click anywhere to move from INVITE → INPUT */
document.addEventListener("click", () => {
  if (currentState === STATES.INVITE) {
    transitionTo(STATES.INPUT);
  }
});

/* Input submission:
   - ENTER submits
   - content is discarded
*/
inputField.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    transitionTo(STATES.GATE_1);

    // Gate sequence timing (purely temporal, not logical)
    setTimeout(() => transitionTo(STATES.GATE_2), 800);
    setTimeout(() => transitionTo(STATES.GATE_3), 2000);

    // Projection outcome:
    // NOTE: no decision logic here
    setTimeout(() => {
      transitionTo(STATES.MIRROR);
    }, 3000);
  }
});

/* Escape always returns to IDLE */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    renderState(STATES.IDLE);
  }
});