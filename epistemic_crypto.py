# ============================================================
# VECTAETOS :: Epistemic Cryptography (v0.2)
# Audit Layer Only — No Feedback
# ============================================================

import math

def compute_mu(poles):
    """
    μᵢ(t) = |Tᵢ − mean(Tⱼ≠ᵢ)| + (1 − Cᵢ)
    """
    T_values = [p["T"] for p in poles]
    C_values = [p["C"] for p in poles]
    mu = []

    for i, p in enumerate(poles):
        others = T_values[:i] + T_values[i+1:]
        mean_others = sum(others) / len(others)
        mu_i = abs(p["T"] - mean_others) + (1 - p["C"])
        mu.append(max(0.0, mu_i))

    return mu


def compute_asymmetry(poles):
    """
    Aᵢⱼ(t) = |Tᵢ − Tⱼ| · ((Cᵢ + Cⱼ) / 2)
    """
    A_total = 0.0
    n = len(poles)

    for i in range(n):
        for j in range(i+1, n):
            Ti, Tj = poles[i]["T"], poles[j]["T"]
            Ci, Cj = poles[i]["C"], poles[j]["C"]
            Aij = abs(Ti - Tj) * ((Ci + Cj) / 2)
            A_total += max(0.0, Aij)

    return A_total


def compute_h(mu_total, A_total):
    denom = mu_total + A_total
    if denom == 0:
        return 1.0
    return mu_total / denom


def epistemic_signature(poles, qe_state):
    mu = compute_mu(poles)
    mu_total = sum(mu)
    A_total = compute_asymmetry(poles)
    h_topo = compute_h(mu_total, A_total)

    return {
        "mu_total": mu_total,
        "asymmetry_total": A_total,
        "h_topo": h_topo,
        "qe_state": qe_state
    }
