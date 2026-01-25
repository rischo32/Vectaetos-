#!/usr/bin/env python3
# =========================================
# VECTAETOS – SIMULATION VORTEX Φ (5D)
# Canonical / Non-decisional / Termux-safe
# =========================================

import random
import math
import time

# -----------------------------------------
# CONFIG
# -----------------------------------------
STEPS = 12000
POLES = 8                 # Σ₁ … Σ₈
PRINT_EVERY = 600

# dynamics
DT = 0.05
ENERGY_FLOW = 0.08
TENSION_GAIN = 0.04
COHERENCE_DISSIPATION = 0.015

# memory & entropy
MEMORY_GAIN = 0.02
MEMORY_DECAY = 0.995
ENTROPY_GAIN = 0.01
ENTROPY_DECAY = 0.998

# stagnation detection
STAGNATION_WINDOW = 150
STAGNATION_THRESHOLD = 1e-4

# noise
NOISE_LEVEL = 0.01

random.seed(42)

# -----------------------------------------
# SIGMA STRUCTURE (5D)
# σ = (E, C, T, M, S)
# -----------------------------------------
def new_sigma():
    return {
        "E": random.uniform(0.4, 0.9),   # Energy
        "C": random.uniform(0.4, 0.9),   # Coherence
        "T": random.uniform(0.05, 0.4),  # Tension
        "M": 0.0,                        # Memory (anomaly resonance)
        "S": random.uniform(0.0, 0.1),   # Entropy / Strain
        "last": None                     # last snapshot (for stagnation)
    }

sigmas = [new_sigma() for _ in range(POLES)]

stagnation_counter = 0

# -----------------------------------------
# HELPERS
# -----------------------------------------
def clamp_sigma(s):
    s["E"] = max(0.0, min(1.5, s["E"]))
    s["C"] = max(0.0, min(1.0, s["C"]))
    s["T"] = max(0.0, min(1.0, s["T"]))
    s["M"] = max(0.0, s["M"])
    s["S"] = max(0.0, min(1.0, s["S"]))

def snapshot(s):
    return (
        round(s["E"], 4),
        round(s["C"], 4),
        round(s["T"], 4),
        round(s["M"], 4),
        round(s["S"], 4),
    )

# -----------------------------------------
# CORE DYNAMICS (VORTEX PROPOSAL)
# -----------------------------------------
def redistribute_energy():
    for i in range(POLES):
        for j in range(i + 1, POLES):
            si = sigmas[i]
            sj = sigmas[j]

            grad_T = sj["T"] - si["T"]
            grad_C = sj["C"] - si["C"]

            flow = ENERGY_FLOW * grad_T * grad_C
            flow *= (1.0 + si["M"])

            si["E"] += flow * DT
            sj["E"] -= flow * DT

            # memory reacts only to meaningful flow
            if abs(flow) > 0.001:
                si["M"] += MEMORY_GAIN * abs(flow)
                sj["M"] += MEMORY_GAIN * abs(flow)

def update_tension():
    for s in sigmas:
        s["T"] += TENSION_GAIN * (1.0 - s["C"]) * DT

def dissipate_coherence():
    for s in sigmas:
        s["C"] -= COHERENCE_DISSIPATION * s["T"] * DT

def apply_memory_entropy():
    for s in sigmas:
        s["M"] *= MEMORY_DECAY
        s["S"] += ENTROPY_GAIN * s["T"]
        s["S"] *= ENTROPY_DECAY

def inject_noise():
    for s in sigmas:
        s["E"] += random.uniform(-NOISE_LEVEL, NOISE_LEVEL)
        s["C"] += random.uniform(-NOISE_LEVEL, NOISE_LEVEL)
        s["T"] += random.uniform(-NOISE_LEVEL, NOISE_LEVEL)

# -----------------------------------------
# STAGNATION → ENTROPIC RESPONSE
# -----------------------------------------
def detect_stagnation():
    global stagnation_counter
    snaps = [snapshot(s) for s in sigmas]
    if all(s["last"] == snap for s, snap in zip(sigmas, snaps)):
        stagnation_counter += 1
    else:
        stagnation_counter = 0
    for s, snap in zip(sigmas, snaps):
        s["last"] = snap

def entropic_perturbation():
    for s in sigmas:
        s["T"] += random.uniform(0.0, 0.05)
        s["S"] += random.uniform(0.05, 0.1)

# -----------------------------------------
# MAIN LOOP
# -----------------------------------------
print("Starting VECTAETOS Simulation Vortex Φ (5D)...\n")

for step in range(1, STEPS + 1):
    redistribute_energy()
    update_tension()
    dissipate_coherence()
    apply_memory_entropy()
    inject_noise()

    detect_stagnation()
    if stagnation_counter > STAGNATION_WINDOW:
        entropic_perturbation()

    for s in sigmas:
        clamp_sigma(s)

    if step % PRINT_EVERY == 0:
        avgE = sum(s["E"] for s in sigmas) / POLES
        avgC = sum(s["C"] for s in sigmas) / POLES
        avgT = sum(s["T"] for s in sigmas) / POLES
        avgM = sum(s["M"] for s in sigmas) / POLES
        avgS = sum(s["S"] for s in sigmas) / POLES

        print(
            f"step={step:5d} | "
            f"E={avgE:.3f} C={avgC:.3f} "
            f"T={avgT:.3f} M={avgM:.3f} S={avgS:.3f} "
            f"stagnation={stagnation_counter}"
        )

print("\n--- SIMULATION COMPLETE ---")
print("Final poles:")
for i, s in enumerate(sigmas):
    print(
        f"Σ{i+1}: "
        f"E={s['E']:.3f}, C={s['C']:.3f}, "
        f"T={s['T']:.3f}, M={s['M']:.3f}, S={s['S']:.3f}"
    )
