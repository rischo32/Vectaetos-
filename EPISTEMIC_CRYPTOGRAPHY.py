#!/usr/bin/env python3
# ============================================================
# VECTAETOS :: EPISTEMIC CRYPTOGRAPHY LAYER (v0.1)
# ------------------------------------------------------------
# Passive structural audit layer.
#
# - Does NOT modify Φ
# - Does NOT modify Vortex
# - Does NOT block output
# - Does NOT optimize
# - Does NOT decide
#
# It only computes structural coherence signature.
# ============================================================

import hashlib
import time
from typing import List, Dict

# ============================================================
# CONFIGURATION
# ============================================================

DELTA = 0.3  # minimal humility threshold (signal only)

# ============================================================
# CORE MATHEMATICS
# ============================================================

def compute_mu_i(poles: List[Dict]) -> List[float]:
    """
    Local epistemic uncertainty μ_i
    μ_i = |T_i - mean(T_others)| + (1 - C_i)
    """
    mu_values = []
    tensions = [p["T"] for p in poles]

    for i, p in enumerate(poles):
        others = tensions[:i] + tensions[i+1:]
        mean_t = sum(others) / len(others)
        mu_i = abs(p["T"] - mean_t) + (1.0 - p["C"])
        mu_values.append(mu_i)

    return mu_values


def compute_authority_matrix(poles: List[Dict]) -> float:
    """
    Total authority A_tot over unordered 28 pairs.
    A_ij = max(0, T_i - T_j) * C_i
    Summed bidirectionally.
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
    """
    mu_values = compute_mu_i(poles)
    mu_tot = sum(mu_values)

    A_tot = compute_authority_matrix(poles)

    if (mu_tot + A_tot) == 0:
        h_topo = 0.0
    else:
        h_topo = mu_tot / (mu_tot + A_tot)

    return {
        "mu_local": mu_values,
        "mu_total": mu_tot,
        "authority_total": A_tot,
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

    trajectories = len(poles)
    dimensions = len(poles[0]) if poles else 0

    es = {
        "trajectories": trajectories,
        "dimensions": dimensions,
        "qe_state": qe_state,
        "mu_total": topo["mu_total"],
        "authority_total": topo["authority_total"],
        "h_topo": topo["h_topo"],
        "time_layer": int(time.time())
    }

    struct_repr = f"{trajectories}|{dimensions}|{qe_state}|{round(topo['h_topo'], 6)}"
    ccs = hashlib.sha256(struct_repr.encode()).hexdigest()

    h_flag = "VALID" if topo["h_topo"] >= DELTA else "INVALID"

    return {
        "epistemic_signature": es,
        "coherence_checksum": ccs,
        "h_flag": h_flag
    }

# ============================================================
# OPTIONAL CLI TEST
# ============================================================

if __name__ == "__main__":
    # Minimal synthetic test field
    import random

    test_poles = [
        {
            "E": random.uniform(0.4, 0.8),
            "C": random.uniform(0.4, 0.8),
            "T": random.uniform(0.1, 0.4),
            "M": 0.0,
            "S": random.uniform(0.05, 0.2)
        }
        for _ in range(8)
    ]

    result = epistemic_signature(test_poles, qe_state=False)

    print("Epistemic Signature:")
    print(result)
