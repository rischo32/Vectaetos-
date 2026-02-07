# ============================================================
# LLM_ADAPTER.py
# VECTAETOS — Language Model Adapter (Technical Projection)
# ============================================================
#
# Status: Canonical technical projection
# Role: Language translation ONLY
#
# Absolute constraints:
# - No access to Φ
# - No access to K(Φ) or κ
# - No memory
# - No learning
# - No decision-making
# - No prescriptive output
#
# This module renders language.
# Meaning is already fixed elsewhere.
# ============================================================


from enum import Enum
from typing import Optional, Dict, Any


# =========================
# Output Modes
# =========================

class OutputMode(Enum):
    DESCRIPTIVE = "DESCRIPTIVE"
    METAPHORICAL = "METAPHORICAL"
    QUESTION = "QUESTION"
    SILENCE = "SILENCE"
    QE = "QE"  # Qualitative Epistemic Aporia


# =========================
# Projection Envelope
# =========================

class ProjectionEnvelope:
    """
    Read-only container for already-safe projections.
    """

    def __init__(
        self,
        content: Optional[Any],
        mode: OutputMode,
        attenuation_level: float = 0.0
    ):
        self.content = content
        self.mode = mode
        self.attenuation_level = attenuation_level

    def is_empty(self) -> bool:
        return self.content is None


# =========================
# INS Audit Interface
# =========================

class INSAuditResult(Enum):
    OK = "OK"
    WARNING = "WARNING"
    VIOLATION = "VIOLATION"


def INS_audit_language(text: str, mode: OutputMode) -> INSAuditResult:
    """
    INS audits the linguistic surface only.
    It never blocks directly.
    """

    # Absolute red flags (examples, non-exhaustive)
    forbidden_patterns = [
        "you should",
        "do this",
        "recommended action",
        "the correct answer is",
        "you must",
        "step-by-step",
    ]

    for pattern in forbidden_patterns:
        if pattern in text.lower():
            return INSAuditResult.VIOLATION

    # QE and SILENCE are always safe
    if mode in (OutputMode.QE, OutputMode.SILENCE):
        return INSAuditResult.OK

    # Weak signals (soft authority, closure pressure)
    if text.strip().endswith(".") and mode == OutputMode.DESCRIPTIVE:
        return INSAuditResult.WARNING

    return INSAuditResult.OK


# =========================
# Core Adapter
# =========================

class LLMAdapter:
    """
    The LLM Adapter renders language from projections.
    It does not interpret.
    It does not decide.
    """

    def __init__(self, llm_backend):
        """
        llm_backend is an external language model interface.
        This adapter assumes zero trust.
        """
        self.llm = llm_backend

    def render(self, envelope: ProjectionEnvelope) -> Optional[str]:
        """
        Render a linguistic surface from a projection envelope.
        """

        # -------- Silence handling --------
        if envelope.mode == OutputMode.SILENCE:
            return None

        # -------- QE handling --------
        if envelope.mode == OutputMode.QE:
            text = self._render_qe()
            return self._INS_guard(text, envelope.mode)

        # -------- Empty content --------
        if envelope.is_empty():
            return None

        # -------- Render modes --------
        if envelope.mode == OutputMode.DESCRIPTIVE:
            text = self._render_descriptive(envelope)
        elif envelope.mode == OutputMode.METAPHORICAL:
            text = self._render_metaphorical(envelope)
        elif envelope.mode == OutputMode.QUESTION:
            text = self._render_question(envelope)
        else:
            return None

        return self._INS_guard(text, envelope.mode)

    # =========================
    # Rendering Methods
    # =========================

    def _render_descriptive(self, envelope: ProjectionEnvelope) -> str:
        prompt = (
            "Describe the following projection without conclusions, "
            "instructions, or authority. Preserve ambiguity.\n\n"
            f"{envelope.content}"
        )
        return self.llm.generate(prompt)

    def _render_metaphorical(self, envelope: ProjectionEnvelope) -> str:
        prompt = (
            "Express the following projection as a metaphor. "
            "Avoid advice, solutions, or closure.\n\n"
            f"{envelope.content}"
        )
        return self.llm.generate(prompt)

    def _render_question(self, envelope: ProjectionEnvelope) -> str:
        prompt = (
            "Transform the following projection into an open-ended question "
            "that does not imply an answer.\n\n"
            f"{envelope.content}"
        )
        return self.llm.generate(prompt)

    def _render_qe(self) -> str:
        return (
            "The field does not collapse into an answer here. "
            "What remains is the tension itself."
        )

    # =========================
    # INS Guard
    # =========================

    def _INS_guard(self, text: str, mode: OutputMode) -> Optional[str]:
        """
        INS audit is applied after generation.
        INS never corrects.
        It may only attenuate or silence.
        """

        audit = INS_audit_language(text, mode)

        if audit == INSAuditResult.OK:
            return text

        if audit == INSAuditResult.WARNING:
            # Attenuation by weakening closure
            return self._attenuate(text)

        if audit == INSAuditResult.VIOLATION:
            # Silence is the only valid response
            return None

        return None

    def _attenuate(self, text: str) -> str:
        """
        Softens certainty without adding meaning.
        """
        return text.rstrip(".") + "…"


# =========================
# Hard Guarantees
# =========================

"""
This module guarantees:

- No epistemic state is created here
- No meaning is introduced
- No authority emerges
- No memory is written
- No feedback loop exists
- Silence is always valid

If this module is misused,
the failure manifests only as silence.
"""
