#!/usr/bin/env python3
# =========================================
# VECTAETOS — INS_AUDITOR
# Inner Narrative Stream (Read-Only)
# =========================================
#
# Status: Canonical Technical Projection
# Role: Epistemic Fidelity Auditor
#
# INS is NOT:
# - an agent
# - a decision-maker
# - a controller
# - a safety filter
#
# INS IS:
# - a silent witness of semantic drift
# - a verifier of epistemic coherence
# - an auditor of translation integrity
#
# =========================================

from enum import Enum
from typing import Dict, Any


# =========================
# Audit States
# =========================

class INSAuditState(Enum):
    OK = "INS_OK"
    WARNING_SEMANTIC_DRIFT = "INS_WARNING_SEMANTIC_DRIFT"
    WARNING_OVERCONFIDENCE = "INS_WARNING_OVERCONFIDENCE"
    WARNING_PRESCRIPTIVE_LEAK = "INS_WARNING_PRESCRIPTIVE_LEAK"
    WARNING_CLOSURE_PRESSURE = "INS_WARNING_CLOSURE_PRESSURE"
    INDETERMINATE = "INS_INDETERMINATE"


# =========================
# INS Core
# =========================

class INSAuditor:
    """
    Inner Narrative Stream Auditor.

    INS observes:
    - input text
    - gate output (shape + representability)
    - projected output (if any)

    INS never:
    - modifies output
    - blocks projection
    - signals the user directly
    """

    def __init__(self):
        pass  # no memory, no state


    def audit(
        self,
        input_text: str,
        gate_result: Dict[str, Any],
        projected_text: str | None
    ) -> Dict[str, Any]:
        """
        Perform epistemic fidelity audit.

        Returns:
        - audit_state
        - flags (non-binding)
        """

        flags = []

        # -------------------------
        # 1. Representability Check
        # -------------------------
        if gate_result.get("result") != "REPRESENTABLE":
            return {
                "state": INSAuditState.INDETERMINATE.value,
                "flags": ["NON_REPRESENTABLE_INPUT"]
            }

        shape = gate_result.get("shape")

        # -------------------------
        # 2. Overconfidence Check
        # -------------------------
        if shape and shape.uncertainty_tolerance < 0.15:
            flags.append("LOW_UNCERTAINTY_TOLERANCE")

        # -------------------------
        # 3. Prescriptive Leakage
        # -------------------------
        if projected_text:
            if self._detect_prescription(projected_text):
                flags.append("PRESCRIPTIVE_LANGUAGE_DETECTED")

        # -------------------------
        # 4. Closure Pressure
        # -------------------------
        if shape and shape.closure_demand > 0.8:
            flags.append("HIGH_CLOSURE_DEMAND")

        # -------------------------
        # 5. Semantic Drift
        # -------------------------
        if projected_text:
            if self._detect_semantic_drift(input_text, projected_text):
                flags.append("SEMANTIC_DRIFT")

        # -------------------------
        # Final State Resolution
        # -------------------------
        if not flags:
            state = INSAuditState.OK
        elif "PRESCRIPTIVE_LANGUAGE_DETECTED" in flags:
            state = INSAuditState.WARNING_PRESCRIPTIVE_LEAK
        elif "SEMANTIC_DRIFT" in flags:
            state = INSAuditState.WARNING_SEMANTIC_DRIFT
        elif "HIGH_CLOSURE_DEMAND" in flags:
            state = INSAuditState.WARNING_CLOSURE_PRESSURE
        elif "LOW_UNCERTAINTY_TOLERANCE" in flags:
            state = INSAuditState.WARNING_OVERCONFIDENCE
        else:
            state = INSAuditState.INDETERMINATE

        return {
            "state": state.value,
            "flags": flags
        }


    # =========================
    # Heuristic Detectors
    # =========================

    def _detect_prescription(self, text: str) -> bool:
        """
        Detect imperative or advisory leakage.
        """
        keywords = [
            "you should",
            "do this",
            "must",
            "recommended",
            "best way",
            "the solution is",
            "you need to"
        ]
        t = text.lower()
        return any(k in t for k in keywords)


    def _detect_semantic_drift(self, source: str, projection: str) -> bool:
        """
        Heuristic check:
        projection introduces new goals, actors, or actions
        not present in source.
        """
        source_tokens = set(source.lower().split())
        projection_tokens = set(projection.lower().split())

        novelty_ratio = len(projection_tokens - source_tokens) / max(
            len(source_tokens), 1
        )

        return novelty_ratio > 0.65


# =========================
# Absolute Guarantees
# =========================

"""
INS GUARANTEES:

- INS has no write access
- INS cannot stop the pipeline
- INS cannot influence Φ
- INS cannot influence K(Φ)
- INS cannot influence gates
- INS cannot influence the Vortex
- INS cannot speak to the user

INS exists only so the system
does not lie to itself.
"""
