#!/usr/bin/env python3
# =========================================
# VECTAETOS :: SIMULATION VORTEX Φ (5D)
# Canonical exploratory simulator
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
# - does NOT know κ
# - proposes trajectories only
# =========================================

import random
import math
import json
import time

# -----------------------------
# CONFIGURATION
# -----------------------------
POLES = 8              # Σ₁ … Σ₈
STEPS = 2000
DT = 0.05

EXPORT_EVERY = 10      # steps
OUT_FILE = "vortex_state.json"

# Dynamics coefficients (non-teleological)
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
# HELPER FUNCTIONS
# -----------------------------
def clamp(x, lo=0.0, hi=1.0):
    return max(lo, min(hi, x))

def field_means(poles):
    return {
        k: sum(p[k] for p in poles) / len(poles)
        for k in ["E", "C", "T", "M", "S"]
    }

# -----------------------------
# VORTEX STEP (proposal only)
# -----------------------------
def vortex_step(poles):
    means = field_means(poles)

    for p in poles:
        # Energy flows toward tension gradients
        dE = ALPHA_E * (means["T"] - p["T"])

        # Tension grows from incoherence, decays with entropy
        dT = ALPHA_T * (1.0 - p["C"]) - 0.5 * p["S"]

        # Coherence rises from balanced energy, falls from excess tension
        dC = ALPHA_C * (p["E"] - abs(p["T"] - means["T"]))

        # Memory resonates only when anomaly present
        anomaly = abs(p["T"] - means["T"])
        dM = ALPHA_M * anomaly - 0.1 * p["M"]

        # Entropy accumulates from over-activity
        dS = ALPHA_S * (abs(dE) + abs(dT))

        # Apply updates + noise
        p["E"] = clamp(p["E"] + dE * DT + random.uniform(-NOISE, NOISE))
        p["T"] = clamp(p["T"] + dT * DT + random.uniform(-NOISE, NOISE))
        p["C"] = clamp(p["C"] + dC * DT + random.uniform(-NOISE, NOISE))
        p["M"] = clamp(p["M"] + dM * DT)
        p["S"] = clamp(p["S"] + dS * DT)

# -----------------------------
# EXPORT FOR PROJECTION
# -----------------------------
def export_state(step, poles):
    snapshot = {
        "step": step,
        "time": time.time(),
        "poles": poles,
        "means": field_means(poles)
    }
    with open(OUT_FILE, "w") as f:
        json.dump(snapshot, f, indent=2)

# -----------------------------
# MAIN LOOP
# -----------------------------
if __name__ == "__main__":
    print("Starting VECTAETOS Simulation Vortex Φ (5D)")
    for step in range(STEPS):
        vortex_step(poles)

        if step % EXPORT_EVERY == 0:
            export_state(step, poles)
            print(f"[Φ] step {step} exported")

    print("Simulation finished.")
