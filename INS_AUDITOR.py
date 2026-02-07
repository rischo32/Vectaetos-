"""
VECTAETOS — INS_AUDITOR

Inner Narrative Stream (INS) — technical audit layer

INS is NOT:
- an agent
- a judge
- a controller
- a decision-maker

INS IS:
- a semantic consistency auditor
- a translation fidelity checker
- an epistemic sanity layer

INS never modifies output.
INS only annotates risk.
"""

# =========================
# Data Structures
# =========================

class INSReport:
    def __init__(
        self,
        status: str,
        warnings: list,
        confidence: float
    ):
        self.status = status              # OK | WARNING | CRITICAL
        self.warnings = warnings          # list of strings
        self.confidence = confidence      # 0.0 – 1.0


# =========================
# Core Audit Function
# =========================

def audit_translation(
    gate_shape,
    runic_projection,
    llm_output_text: str
) -> INSReport:
    """
    Compares epistemic shape with linguistic rendering.

    gate_shape:
        EpistemicShape from 3Gate

    runic_projection:
        symbolic / structural projection (no text authority)

    llm_output_text:
        natural language output (read-only)
    """

    warnings = []

    # --- Prescriptivity leak ---
    if detect_prescriptive_language(llm_output_text):
        if gate_shape.prescriptivity < 0.3:
            warnings.append(
                "Prescriptive language detected despite low prescriptivity shape"
            )

    # --- Closure hallucination ---
    if detect_false_closure(llm_output_text):
        if gate_shape.closure_demand < 0.4:
            warnings.append(
                "Artificial closure introduced by language"
            )

    # --- Uncertainty collapse ---
    if detect_certainty_bias(llm_output_text):
        if gate_shape.uncertainty_tolerance > 0.6:
            warnings.append(
                "Uncertainty collapsed in language rendering"
            )

    # --- Runic mismatch ---
    if not language_matches_runic_dynamics(llm_output_text, runic_projection):
        warnings.append(
            "Language diverges from runic dynamics"
        )

    # =========================
    # Final Status Resolution
    # =========================

    if len(warnings) == 0:
        return INSReport(
            status="OK",
            warnings=[],
            confidence=0.95
        )

    if len(warnings) <= 2:
        return INSReport(
            status="WARNING",
            warnings=warnings,
            confidence=0.65
        )

    return INSReport(
        status="CRITICAL",
        warnings=warnings,
        confidence=0.3
    )


# =========================
# Enforcement Rule
# =========================

"""
INS cannot:
- suppress output
- rewrite text
- modify projections
- influence Φ

INS may only:
- downgrade output visibility
- recommend silence
- annotate epistemic risk
"""
