#!/usr/bin/env python3
# =========================================
# VECTAETOS :: SIMULATION VORTEX Φ (v0.2)
# Ontologically minimal, non-teleological
#
# Dimensions per pole:
# E – Energy
# C – Coherence
# T – Tension
# M – Memory (anomaly resonance)
# S – Entropy / saturation
#
# This vortex:
# - does NOT decide
# - does NOT optimize
# - does NOT compute global means
# - does NOT know κ
# - generates trajectories only
# - QE is topological disconnection
# =========================================

import random
import math
import json
import time

# -----------------------------
# CONFIGURATION
# -----------------------------
POLES = 8
STEPS = 2000
DT = 0.05

EXPORT_EVERY = 10
OUT_FILE = "vortex_state.json"

# Local interaction coefficients
ALPHA_E = 0.02
ALPHA_T = 0.03
ALPHA_C = 0.04
ALPHA_M = 0.01
ALPHA_S = 0.015

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

poles = [init_pole() for _ in range(POLES)]

# -----------------------------
# UTILS
# -----------------------------
def clamp(x, lo=0.0, hi=1.0):
    return max(lo, min(hi, x))

# -----------------------------
# LOCAL PAIR INTERACTION
# -----------------------------
def pairwise_interaction(poles):
    n = len(poles)
    delta = [{"dE":0,"dT":0,"dC":0,"dM":0,"dS":0} for _ in range(n)]

    for i in range(n):
        for j in range(i + 1, n):

            pi = poles[i]
            pj = poles[j]

            # Tension difference
            dTij = pj["T"] - pi["T"]

            # Energy flows along local gradient
            delta[i]["dE"] += ALPHA_E * dTij
            delta[j]["dE"] -= ALPHA_E * dTij

            # Tension reacts to incoherence locally
            delta[i]["dT"] += ALPHA_T * (1 - pi["C"]) - 0.5 * pi["S"]
            delta[j]["dT"] += ALPHA_T * (1 - pj["C"]) - 0.5 * pj["S"]

            # Coherence responds to local imbalance
            imbalance = abs(dTij)
            delta[i]["dC"] += ALPHA_C * (pi["E"] - imbalance)
            delta[j]["dC"] += ALPHA_C * (pj["E"] - imbalance)

            # Memory resonates on anomaly only
            anomaly = abs(dTij)
            delta[i]["dM"] += ALPHA_M * anomaly - 0.1 * pi["M"]
            delta[j]["dM"] += ALPHA_M * anomaly - 0.1 * pj["M"]

    return delta

# -----------------------------
# ENTROPIC EXPANSION (separate)
# -----------------------------
def entropic_expansion(poles):
    for p in poles:
        drift = random.uniform(-NOISE, NOISE)
        p["S"] = clamp(p["S"] + ALPHA_S * abs(drift) * DT)

# -----------------------------
# QE DETECTOR (topological)
# QE occurs if interaction graph disconnects
# -----------------------------
def detect_QE(poles):
    n = len(poles)

    # adjacency based on local tension proximity
    adjacency = [[] for _ in range(n)]

    for i in range(n):
        for j in range(n):
            if i != j:
                if abs(poles[i]["T"] - poles[j]["T"]) < 0.25:
                    adjacency[i].append(j)

    visited = set()
    stack = [0]

    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            stack.extend(adjacency[node])

    return len(visited) != n  # True => QE

# -----------------------------
# VORTEX STEP
# -----------------------------
def vortex_step(poles):

    deltas = pairwise_interaction(poles)

    for i, p in enumerate(poles):

        p["E"] = clamp(p["E"] + deltas[i]["dE"] * DT + random.uniform(-NOISE, NOISE))
        p["T"] = clamp(p["T"] + deltas[i]["dT"] * DT + random.uniform(-NOISE, NOISE))
        p["C"] = clamp(p["C"] + deltas[i]["dC"] * DT + random.uniform(-NOISE, NOISE))
        p["M"] = clamp(p["M"] + deltas[i]["dM"] * DT)
        p["S"] = clamp(p["S"])

    entropic_expansion(poles)

# -----------------------------
# EXPORT
# -----------------------------
def export_state(step, poles, qe_state):
    snapshot = {
        "step": step,
        "time": time.time(),
        "poles": poles,
        "QE": qe_state
    }
    with open(OUT_FILE, "w") as f:
        json.dump(snapshot, f, indent=2)

# -----------------------------
# DUAL RUN WRAPPER
# -----------------------------
def run_simulation():
    poles_local = [init_pole() for _ in range(POLES)]

    for step in range(STEPS):

        vortex_step(poles_local)

        qe = detect_QE(poles_local)

        if step % EXPORT_EVERY == 0:
            export_state(step, poles_local, qe)
            print(f"[Φ] step {step} exported | QE: {qe}")

        if qe:
            print("[Φ] QE detected — topological disconnection.")
            break

    return poles_local

# -----------------------------
# MAIN
# -----------------------------
if __name__ == "__main__":
    print("Starting VECTAETOS Simulation Vortex Φ (v0.2)")
    run_simulation()
    print("Simulation finished.")
