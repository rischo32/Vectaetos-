#!/usr/bin/env python3
# ============================================================
# VECTAETOS :: EPISTEMIC CRYPTOGRAPHY LAYER (v0.2)
# Passive structural audit layer.
#
# - Does NOT modify Φ
# - Does NOT modify Vortex
# - Does NOT block output
# - Does NOT decide
# - Does NOT interpret
#
# Only computes structural coherence signature.
# ============================================================

import hashlib
import time
from typing import List, Dict

# ============================================================
# CONFIGURATION
# ============================================================

DELTA = 0.3  # minimal humility threshold

# ============================================================
# CORE MATHEMATICS
# ============================================================

def compute_mu_i(poles: List[Dict]) -> List[float]:
    """
    Local epistemic uncertainty μ_i for each pole.
    Assumes C_i ∈ [0,1].
    """
    mu_values = []
    tensions = [p["T"] for p in poles]

    if not tensions:
        return []

    for i, p in enumerate(poles):
        others = tensions[:i] + tensions[i+1:]
        mean_t = sum(others) / len(others) if others else tensions[i]
        mu_i = abs(p["T"] - mean_t) + (1.0 - p["C"])
        mu_values.append(mu_i)

    return mu_values


def compute_asymmetry_matrix(poles: List[Dict]) -> float:
    """
    Asymmetry total (formerly authority) — structural imbalance metric.
    Does NOT imply prescriptive authority.
    """
    A_tot = 0.0
    n = len(poles)

    for i in range(n):
        for j in range(i + 1, n):
            Ti, Ci = poles[i]["T"], poles[i]["C"]
            Tj, Cj = poles[j]["T"], poles[j]["C"]

            A_ij = max(0.0, Ti - Tj) * Ci
            A_ji = max(0.0, Tj - Ti) * Cj

            A_tot += A_ij + A_ji

    return A_tot


def compute_h_topo(poles: List[Dict]) -> Dict:
    """
    h_topo = μ_tot / (μ_tot + A_tot)
    If both are zero, h_topo = 1.0 (neutral coherence).
    """
    mu_values = compute_mu_i(poles)
    mu_tot = sum(mu_values)

    A_tot = compute_asymmetry_matrix(poles)

    if (mu_tot + A_tot) == 0:
        h_topo = 1.0
    else:
        h_topo = mu_tot / (mu_tot + A_tot)

    return {
        "mu_local": mu_values,
        "mu_total": mu_tot,
        "asymmetry_total": A_tot,
        "h_topo": h_topo
    }

# ============================================================
# EPISTEMIC SIGNATURE
# ============================================================

def epistemic_signature(poles: List[Dict], qe_state: bool) -> Dict:
    """
    Generates passive structural signature.
    """

    topo = compute_h_topo(poles)

    es = {
        "trajectories": len(poles),
        "dimensions": len(poles[0]) if poles else 0,
        "qe_state": qe_state,
        "mu_total": topo["mu_total"],
        "asymmetry_total": topo["asymmetry_total"],
        "h_topo": topo["h_topo"],
        "time_layer": int(time.time())
    }

    # Include ALL structural components in string for checksum
    struct_repr = (
        f"{es['trajectories']}|{es['dimensions']}|"
        f"{es['qe_state']}|"
        f"{round(es['mu_total'], 6)}|"
        f"{round(es['asymmetry_total'], 6)}|"
        f"{round(es['h_topo'], 6)}"
    )

    coherence_checksum = hashlib.sha256(struct_repr.encode()).hexdigest()

    # Descriptive / non-normative flag
    h_flag = (
        "ABOVE_DELTA" if topo["h_topo"] >= DELTA else "BELOW_DELTA"
    )

    return {
        "epistemic_signature": es,
        "coherence_checksum": coherence_checksum,
        "h_flag": h_flag
    }

# ============================================================
# OPTIONAL CLI TEST
# ============================================================

if __name__ == "__main__":
    import random

    test_poles = [
        {
            "E": random.uniform(0.4, 0.8),
            "C": random.uniform(0.0, 1.0),
            "T": random.uniform(0.1, 0.4),
            "M": 0.0,
            "S": random.uniform(0.05, 0.2)
        }
        for _ in range(8)
    ]

    result = epistemic_signature(test_poles, qe_state=False)
    print("Epistemic Signature:")
    print(result)