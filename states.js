/* =========================================
   VECTAETOS — UI State Machine Definition
   Canonical & Declarative Only
   ========================================= */

/*
  Available states:
  - IDLE     → init / neutral
  - INVITE   → orientation
  - INPUT    → epistemic gate (text entry)
  - GATE_1   → stabilization
  - MIRROR   → tension projection
  - EXPLAIN  → optional explanation
*/

export const STATES = Object.freeze({
  IDLE:    "IDLE",
  INVITE:  "INVITE",
  INPUT:   "INPUT",
  GATE_1:  "GATE_1",
  MIRROR:  "MIRROR",
  EXPLAIN: "EXPLAIN"
});

/*
  Allowed transitions between states.
  This topology defines what FOLLOWING state is permitted
  given the current state. There is NO logic about why;
  only a descriptive topology.
*/

export const TRANSITIONS = Object.freeze({

  [STATES.IDLE]: [
    STATES.INVITE
  ],

  [STATES.INVITE]: [
    STATES.INPUT
  ],

  [STATES.INPUT]: [
    STATES.GATE_1
  ],

  [STATES.GATE_1]: [
    STATES.MIRROR
  ],

  [STATES.MIRROR]: [
    STATES.EXPLAIN,
    STATES.IDLE
  ],

  [STATES.EXPLAIN]: [
    STATES.IDLE
  ]

});
