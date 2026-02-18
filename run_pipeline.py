# -------------------------------------------------
# FULL PIPELINE
# Φ → Vortex → EK → Log
# -------------------------------------------------

from simulation_vortex import run_simulation
from epistemic_cryptography import epistemic_signature
from phi_logger import log_event


if __name__ == "__main__":

    log_event("simulation_start", {"steps": 2000})

    R, qe = run_simulation(steps=2000)

    log_event("simulation_end", {"qe_state": qe})

    # Transform relations into pole-style summary for EK
    poles = []
    for i in range(len(R)):
        avg_tension = sum(abs(R[i][j]) for j in range(len(R)) if j != i) / (len(R) - 1)
        poles.append({
            "E": 0.5,
            "C": max(0.0, 1.0 - avg_tension),
            "T": avg_tension,
            "M": 0.0,
            "S": 0.0
        })

    audit = epistemic_signature(poles, qe_state=qe)

    log_event("epistemic_audit", audit)

    print("\n--- Epistemic Signature ---")
    print(audit)
