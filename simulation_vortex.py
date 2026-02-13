# =========================================
# VECTAETOS :: SIMULATION VORTEX Φ (5D)
# Version: v0.2
# Status: Canonical Technical Projection
#
# Changes from v0.1:
# - Removed global means export
# - Introduced QE topological break (non-threshold)
# - Added dual-run wrapper
# - Replaced mean coupling with local pairwise coupling
# - Introduced curvature term
# - Reserved torsion slot (non-activated)
#
# This file is a projection.
# Ontology is defined in FORMAL_SIMULATION_VORTEX.md
# =========================================
#!/usr/bin/env python3
# =========================================
# VECTAETOS :: SIMULATION VORTEX Φ (5D) v0.4
# Curvature + Future-Compatible Torsion
#
# - No optimization
# - No ranking
# - No thresholds
# - QE = structural degeneration
# - Curvature = metric deformation
# - Torsion = antisymmetric relational twist
# =========================================

import random
import json
import time
import copy
import math

# -----------------------------
# CONFIGURATION
# -----------------------------
POLES = 8
STEPS = 2000
DT = 0.05
EXPORT_EVERY = 10
OUT_FILE = "vortex_state.json"

ALPHA_E = 0.02
ALPHA_T = 0.03
ALPHA_C = 0.04
ALPHA_M = 0.01
ALPHA_S = 0.015
ALPHA_CURV = 0.02
ALPHA_TORSION = 0.02

NOISE = 0.01


# -----------------------------
# INITIALIZATION
# -----------------------------
def init_pole():
    return {
        "E": random.uniform(0.4, 0.8),
        "C": random.uniform(0.4, 0.8),
        "T": random.uniform(0.1, 0.4),
        "M": 0.0,
        "S": random.uniform(0.05, 0.2)
    }


def clamp(x, lo=0.0, hi=1.0):
    return max(lo, min(hi, x))


# -----------------------------
# METRIC DISTANCE
# -----------------------------
def metric_distance(p_i, p_j):
    """
    Euclidean metric in 5D state space.
    """
    return math.sqrt(
        (p_i["E"] - p_j["E"])**2 +
        (p_i["C"] - p_j["C"])**2 +
        (p_i["T"] - p_j["T"])**2 +
        (p_i["M"] - p_j["M"])**2 +
        (p_i["S"] - p_j["S"])**2
    )


# -----------------------------
# CURVATURE (RICCI-LIKE LOCAL)
# -----------------------------
def curvature(poles, i):
    """
    Curvature is deviation of local neighborhood
    from metric average — no optimization intent.
    """
    p = poles[i]
    distances = []

    for j in range(len(poles)):
        if j != i:
            distances.append(metric_distance(p, poles[j]))

    if not distances:
        return 0

    mean_d = sum(distances) / len(distances)
    local_variation = sum((d - mean_d)**2 for d in distances)

    return ALPHA_CURV * local_variation


# -----------------------------
# TORSION (antisymmetric)
# -----------------------------
def torsion(p_i, p_j):
    """
    Antisymmetric twist term.
    τ(i,j) = -τ(j,i)
    """
    return ALPHA_TORSION * (p_i["E"] * p_j["T"] - p_j["E"] * p_i["T"])


# -----------------------------
# PAIRWISE LOCAL DYNAMICS
# -----------------------------
def pairwise_interaction(poles, i):
    p = poles[i]
    neighbors = [poles[j] for j in range(len(poles)) if j != i]

    dE = dT = dC = dM = dS = 0

    for n in neighbors:
        dE += ALPHA_E * (n["T"] - p["T"])
        dT += ALPHA_T * (1.0 - p["C"]) - 0.5 * p["S"]
        dC += ALPHA_C * (p["E"] - abs(p["T"] - n["T"]))

        anomaly = abs(p["T"] - n["T"])
        dM += ALPHA_M * anomaly - 0.1 * p["M"]
        dS += ALPHA_S * (abs(dE) + abs(dT))

        # torsion
        tau = torsion(p, n)
        dT += tau
        dC -= tau * 0.5

    # curvature influence (metric deformation)
    kappa_local = curvature(poles, i)
    dT += kappa_local
    dC -= 0.5 * kappa_local

    L = len(neighbors)

    return dE/L, dT/L, dC/L, dM/L, dS/L


# -----------------------------
# TOPOLOGICAL QE DETECTOR
# -----------------------------
def detect_qe(poles):
    """
    QE = structural degeneration:
    - no metric diversity
    - no torsional activity
    """

    distances = []
    torsion_sum = 0

    for i in range(len(poles)):
        for j in range(i+1, len(poles)):
            distances.append(metric_distance(poles[i], poles[j]))
            torsion_sum += abs(torsion(poles[i], poles[j]))

    if not distances:
        return False

    diversity = max(distances) - min(distances)

    if diversity == 0 and torsion_sum == 0:
        return True

    return False


# -----------------------------
# VORTEX STEP
# -----------------------------
def vortex_step(poles):
    updated = []

    for i in range(len(poles)):
        p = copy.deepcopy(poles[i])
        dE, dT, dC, dM, dS = pairwise_interaction(poles, i)

        p["E"] = clamp(p["E"] + dE * DT + random.uniform(-NOISE, NOISE))
        p["T"] = clamp(p["T"] + dT * DT + random.uniform(-NOISE, NOISE))
        p["C"] = clamp(p["C"] + dC * DT + random.uniform(-NOISE, NOISE))
        p["M"] = clamp(p["M"] + dM * DT)
        p["S"] = clamp(p["S"] + dS * DT)

        updated.append(p)

    return updated


# -----------------------------
# EXPORT
# -----------------------------
def export_state(step, poles, run_id, status="RUNNING"):
    snapshot = {
        "run": run_id,
        "step": step,
        "time": time.time(),
        "status": status,
        "poles": poles
    }
    with open(OUT_FILE, "w") as f:
        json.dump(snapshot, f, indent=2)


# -----------------------------
# RUN
# -----------------------------
def run_vortex(run_id):
    poles = [init_pole() for _ in range(POLES)]

    for step in range(STEPS):
        poles = vortex_step(poles)

        if detect_qe(poles):
            export_state(step, poles, run_id, status="QE")
            return

        if step % EXPORT_EVERY == 0:
            export_state(step, poles, run_id)

    export_state(STEPS, poles, run_id, status="COMPLETED")


# -----------------------------
# DUAL RUN WRAPPER
# -----------------------------
if __name__ == "__main__":
    print("Starting VECTAETOS Simulation Vortex Φ (5D) v0.4")
    run_vortex("A")
    run_vortex("B")
    print("Execution finished.")
