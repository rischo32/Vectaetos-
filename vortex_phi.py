#!/usr/bin/env python3
# VECTAETOS — Φ Simulation Vortex (5D)
# E, C, T, M, S
# Outputs field_state.json for web projection

import json
import random
import time

STATE_FILE = "field_state.json"
DT = 0.05

# Inicializácia stavu poľa
phi = {
    "E": 0.6,  # Energy
    "C": 0.7,  # Coherence
    "T": 0.2,  # Tension
    "M": 0.3,  # Memory
    "S": 0.1   # Entropy
}

def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))

def compute_rune(phi):
    if phi["C"] < 0.25:
        return "ᛁ"   # rozpad
    if phi["T"] > 0.7:
        return "ᚦ"   # tenzia
    if phi["C"] > 0.75:
        return "ᚱ"   # integrita
    if phi["S"] > 0.6:
        return "⊘"   # QE / apória
    return "ᚨ"       # otvorené pole

while True:
    # Dynamika poľa (jednoduchá, ale pravdivá)
    phi["T"] += random.uniform(-0.02, 0.02)
    phi["C"] += (0.01 - phi["T"] * 0.015)
    phi["S"] += abs(phi["T"]) * 0.01
    phi["M"] += 0.005 * (1 - phi["M"])

    # Clamp
    for k in phi:
        phi[k] = clamp(phi[k])

    rune = compute_rune(phi)

    out = {
        "phi": phi,
        "rune": rune,
        "timestamp": time.time()
    }

    with open(STATE_FILE, "w") as f:
        json.dump(out, f, indent=2)

    time.sleep(DT)
