# ============================================================
# VECTAETOS :: CANONICAL PIPELINE v0.2
# ------------------------------------------------------------
# Φ → Vortex → QE detection
# → Relational Projection
# → Epistemic Cryptography (audit only)
# → Hash-chained logging
# ------------------------------------------------------------
# No feedback loops.
# No optimization.
# No intervention.
# ============================================================

from simulation_vortex import run_simulation
from relational_projection import relations_to_poles
from epistemic_cryptography import epistemic_signature
from phi_logger import log_event


STEPS = 2000


def main():

    # --------------------------------------------------------
    # 1. Simulation start
    # --------------------------------------------------------
    log_event("simulation_start", {"steps": STEPS})

    # --------------------------------------------------------
    # 2. Run Vortex
    # Returns:
    #   R  -> antisymmetric relational matrix
    #   qe -> QE state (True / False)
    # --------------------------------------------------------
    R, qe_state = run_simulation(steps=STEPS)

    log_event("simulation_end", {"qe_state": qe_state})

    # --------------------------------------------------------
    # 3. Relational projection (R → poles)
    # --------------------------------------------------------
    poles = relations_to_poles(R)

    log_event("relational_projection_complete", {
        "poles_count": len(poles)
    })

    # --------------------------------------------------------
    # 4. Epistemic Cryptography (audit layer only)
    # --------------------------------------------------------
    audit = epistemic_signature(poles, qe_state=qe_state)

    log_event("epistemic_audit", audit)

    # --------------------------------------------------------
    # 5. Output (descriptive only)
    # --------------------------------------------------------
    print("\n--- VECTAETOS :: Epistemic Signature ---\n")
    print(audit)


# ------------------------------------------------------------
# ENTRY POINT
# ------------------------------------------------------------
if __name__ == "__main__":
    main()
