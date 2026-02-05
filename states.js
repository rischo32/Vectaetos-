/* =========================================
   VECTAETOS — UI State Topology
   File: states.js
   Status: Canonical (Declarative Only)

   This file defines:
   - allowed states
   - allowed transitions
   - no logic
   - no conditions
   - no timing
   ========================================= */

/*
  STATES OVERVIEW

  IDLE      — latent field, no projection
  INVITE    — orientation / invitation
  INPUT     — epistemic gate (text entry)
  GATE_1    — linear stabilization
  GATE_2    — parallel decomposition
  GATE_3    — depth / tension selection
  MIRROR    — tension projection
  SILENT    — valid non-output
  EXPLAIN   — optional epistemic description
*/

export const STATES = Object.freeze({
  IDLE:    "IDLE",
  INVITE:  "INVITE",
  INPUT:   "INPUT",
  GATE_1:  "GATE_1",
  GATE_2:  "GATE_2",
  GATE_3:  "GATE_3",
  MIRROR:  "MIRROR",
  SILENT:  "SILENT",
  EXPLAIN: "EXPLAIN"
});

/*
  TRANSITION TOPOLOGY

  This graph defines which state may follow another.
  It does NOT define:
  - when transitions happen
  - why they happen
  - whether they should happen

  It only defines:
  - whether a transition is ontologically allowed
*/

export const TRANSITIONS = Object.freeze({

  [STATES.IDLE]: [
    STATES.INVITE
  ],

  [STATES.INVITE]: [
    STATES.INPUT,
    STATES.IDLE
  ],

  [STATES.INPUT]: [
    STATES.GATE_1,
    STATES.IDLE
  ],

  [STATES.GATE_1]: [
    STATES.GATE_2
  ],

  [STATES.GATE_2]: [
    STATES.GATE_3
  ],

  [STATES.GATE_3]: [
    STATES.MIRROR,
    STATES.SILENT
  ],

  [STATES.MIRROR]: [
    STATES.EXPLAIN,
    STATES.IDLE
  ],

  [STATES.SILENT]: [
    STATES.IDLE
  ],

  [STATES.EXPLAIN]: [
    STATES.IDLE
  ]

});

/*
  TERMINAL STATES

  Terminal states automatically return to IDLE.
  This is descriptive, not prescriptive.
*/

export const TERMINAL_STATES = Object.freeze([
  STATES.MIRROR,
  STATES.SILENT,
  STATES.EXPLAIN
]);

/*
  INVARIANTS (DOCUMENTARY)

  - No state may transition directly to itself
  - No state bypasses the gate sequence
  - IDLE is the only stable attractor
  - Silence is a valid terminal projection
*/
