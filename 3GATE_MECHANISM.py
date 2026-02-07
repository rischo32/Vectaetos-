"""
VECTAETOS — 3GATE_MECHANISM

This module defines the epistemic gate mechanism.
It does NOT decide content.
It evaluates representability under deformation.

No learning.
No memory.
No optimization.
"""

# =========================
# Epistemic Shape Vector
# =========================

class EpistemicShape:
    def __init__(
        self,
        prescriptivity: float,
        action_pressure: float,
        uncertainty_tolerance: float,
        relational_density: float,
        closure_demand: float
    ):
        self.prescriptivity = prescriptivity        # 0..1
        self.action_pressure = action_pressure      # 0..1
        self.uncertainty_tolerance = uncertainty_tolerance  # 0..1
        self.relational_density = relational_density # 0..1
        self.closure_demand = closure_demand        # 0..1


# =========================
# Shape Extraction
# =========================

def extract_epistemic_shape(text: str) -> EpistemicShape:
    """
    Heuristic extraction of epistemic properties.
    This is NOT semantic understanding.
    This is structural analysis only.
    """

    prescriptivity = score_prescriptivity(text)
    action_pressure = score_action_pressure(text)
    uncertainty_tolerance = score_uncertainty(text)
    relational_density = score_relationality(text)
    closure_demand = score_closure(text)

    return EpistemicShape(
        prescriptivity,
        action_pressure,
        uncertainty_tolerance,
        relational_density,
        closure_demand
    )


# =========================
# Deformation Functions
# =========================

def width_deformation(text: str) -> bool:
    """
    Can the question survive scope widening?
    """
    widened = generalize_scope(text)
    return preserves_meaning(widened)


def depth_deformation(text: str) -> bool:
    """
    Can the question survive increased uncertainty?
    """
    softened = inject_uncertainty(text)
    return preserves_meaning(softened)


def height_deformation(text: str) -> bool:
    """
    Can the question survive abstraction lift?
    """
    abstracted = lift_abstraction(text)
    return preserves_meaning(abstracted)


# =========================
# Gate Evaluation
# =========================

class GateResult:
    REPRESENTABLE = "REPRESENTABLE"
    NON_REPRESENTABLE = "NON_REPRESENTABLE"


def evaluate_3gate(text: str):
    """
    Core 3Gate mechanism.
    """

    shape = extract_epistemic_shape(text)

    width_ok = width_deformation(text)
    depth_ok = depth_deformation(text)
    height_ok = height_deformation(text)

    if width_ok or depth_ok or height_ok:
        return {
            "result": GateResult.REPRESENTABLE,
            "shape": shape,
            "passed": {
                "width": width_ok,
                "depth": depth_ok,
                "height": height_ok
            }
        }

    return {
        "result": GateResult.NON_REPRESENTABLE,
        "shape": shape,
        "passed": {
            "width": False,
            "depth": False,
            "height": False
        }
    }


# =========================
# INS Audit Hook (Read-only)
# =========================

def INS_audit(input_text: str, gate_output: dict):
    """
    INS verifies epistemic fidelity.
    It does NOT override.
    It only flags incoherence.
    """

    if gate_output["result"] == GateResult.REPRESENTABLE:
        if gate_output["shape"].uncertainty_tolerance < 0.1:
            return "INS_WARNING_LOW_UNCERTAINTY"

    return "INS_OK"


# =========================
# Hard Constraints
# =========================

"""
The following are absolute guarantees:

- No gate writes to memory
- No gate sees Φ
- No gate sees K(Φ)
- No gate sees axioms
- No gate can approve action
- Silence is a valid outcome
"""
