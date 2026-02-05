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

export const STATES = {
  IDLE: "IDLE",
  INVITE: "INVITE",
  INPUT: "INPUT",
  GATE_1: "GATE_1",
  MIRROR: "MIRROR",
  EXPLAIN: "EXPLAIN"
};

export const TRANSITIONS = {
  IDLE: ["INVITE"],
  INVITE: ["INPUT"],
  INPUT: ["GATE_1"],
  GATE_1: ["MIRROR"],
  MIRROR: ["EXPLAIN", "IDLE"],
  EXPLAIN: ["IDLE"]
};
