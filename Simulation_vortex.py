#!/usr/bin/env python3
# =========================================
# VECTAETOS – PHI MULTIPOLAR VORTEX (BASIC)
# Termux compatible
# =========================================

import random
import math

# -------------------------------
# KONFIGURÁCIA
# -------------------------------
STEPS = 10000
POLES = 4          # multipole (P0..Pn)
AXIOMS = 8
PRINT_EVERY = 500

# anti-atraktor
STAGNATION_WINDOW = 120
MAINTENANCE_GAIN = 0.00015

# perturbácie
PERTURB_THRESHOLD = 1e-4
PERTURB_STRENGTH = 0.02

# hysterezia
MEMORY_DECAY = 0.999
MEMORY_GAIN = 0.015

# -------------------------------
# INICIALIZÁCIA POĽA
# -------------------------------
poles = []
for i in range(POLES):
    poles.append({
        "E": random.uniform(0.1, 1.0),   # energia
        "C": random.uniform(0.1, 1.0),   # koherencia
        "T": random.uniform(0.05, 0.4),  # napätie
        "M": 1.0,                        # pamäť
        "history": 0.0                   # hysterezia
    })

axioms = [round(random.uniform(0.05, 0.1), 3) for _ in range(AXIOMS)]

last_state = None
stagnation_counter = 0
collapses = 0

# -------------------------------
# POMOCNÉ FUNKCIE
# -------------------------------
def distance(a, b):
    return abs(a["E"] - b["E"]) + abs(a["C"] - b["C"]) + abs(a["T"] - b["T"])

def redistribute_energy():
    for i in range(POLES):
        for j in range(i + 1, POLES):
            pi = poles[i]
            pj = poles[j]

            grad_T = pj["T"] - pi["T"]
            grad_C = pj["C"] - pi["C"]

            flow = 0.01 * grad_T * grad_C
            flow *= (1 + pi["history"])

            pi["E"] += flow
            pj["E"] -= flow

            pi["history"] += abs(flow) * MEMORY_GAIN
            pj["history"] += abs(flow) * MEMORY_GAIN

def apply_hysteresis():
    for p in poles:
        p["history"] *= MEMORY_DECAY
        p["M"] = max(0.1, p["M"] * (1 - p["history"] * 0.001))

def maintenance_cost():
    global stagnation_counter
    if stagnation_counter > STAGNATION_WINDOW:
        for p in poles:
            p["E"] -= MAINTENANCE_GAIN * stagnation_counter
            p["C"] -= MAINTENANCE_GAIN * 0.5

def latent_perturbation():
    for p in poles:
        p["T"] += random.uniform(-PERTURB_STRENGTH, PERTURB_STRENGTH)
        p["C"] += random.uniform(-PERTURB_STRENGTH * 0.5, PERTURB_STRENGTH * 0.5)

def clamp():
    for p in poles:
        p["E"] = max(0.0, min(1.5, p["E"]))
        p["C"] = max(0.0, min(1.0, p["C"]))
        p["T"] = max(0.0, min(1.0, p["T"]))

# -------------------------------
# HLAVNÁ SMYČKA
# -------------------------------
for step in range(1, STEPS + 1):
    redistribute_energy()
    apply_hysteresis()
    maintenance_cost()

    # kontrola stagnácie
    snapshot = tuple(round(p["E"], 4) for p in poles)
    if snapshot == last_state:
        stagnation_counter += 1
    else:
        stagnation_counter = 0

    if stagnation_counter > STAGNATION_WINDOW and random.random() < 0.1:
        latent_perturbation()

    last_state = snapshot
    clamp()

    # kolaps (nie trest – fyzikálny limit)
    for p in poles:
        if p["C"] < 0.02 or p["E"] < 0.02:
            collapses += 1
            p["E"] = random.uniform(0.2, 0.6)
            p["C"] = random.uniform(0.3, 0.7)
            p["T"] = random.uniform(0.1, 0.4)

    if step % PRINT_EVERY == 0:
        avgE = sum(p["E"] for p in poles) / POLES
        avgC = sum(p["C"] for p in poles) / POLES
        avgT = sum(p["T"] for p in poles) / POLES
        print(
            f"step={step:5d} | "
            f"E={avgE:.3f} C={avgC:.3f} T={avgT:.3f} "
            f"collapses={collapses}"
        )

# -------------------------------
# VÝSTUP
# -------------------------------
print("\n--- HOTOVO ---")
print("Kolapsy celkom:", collapses)
print("Axiomy:", axioms)
print("Konečné póly:")
for i, p in enumerate(poles):
    print(f"P{i}: E={p['E']:.3f}, C={p['C']:.3f}, T={p['T']:.3f}, M={p['M']:.3f}")
