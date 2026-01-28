#!/usr/bin/env python3
# =========================================
# VECTAETOS — Simulation Vortex Φ (5D)
# Descriptive, non-decisional, non-agent
# Termux compatible (pure Python)
# =========================================

import random
import math
import time

# -----------------------------------------
# CONFIGURATION
# -----------------------------------------
STEPS = 3000
POLES = 8              # Σ₁ … Σ₈
DT = 0.05

# Dynamics coefficients
ALPHA_E = 0.08         # energy flow
BETA_C  = 0.06         # coherence sensitivity
GAMMA_T = 0.04         # tension decay
LAMBDA_M = 0.98        # memory retention
DELTA_S = 0.03         # entropy growth

NOISE = 0.01           # stochastic background

PRINT_EVERY = 200

# -----------------------------------------
# STATE DEFINITION
# -----------------------------------------
class Sigma:
    def __init__(self):
        self.E = random.uniform(0.4, 0.8)   # Energy
        self.C = random.uniform(0.4, 0.9)   # Coherence
        self.T = random.uniform(0.05, 0.3)  # Tension
        self.M = random.uniform(0.0, 0.2)   # Memory
        self.S = random.uniform(0.0, 0.1)   # Entropy

    def vector(self):
        return (self.E, self.C, self.T, self.M, self.S)

# -----------------------------------------
# INITIAL FIELD Φ
# -----------------------------------------
sigmas = [Sigma() for _ in range(POLES)]

# Relation matrix R (0..1)
R = [[1.0 if i == j else random.uniform(0.2, 0.8)
      for j in range(POLES)] for i in range(POLES)]

# -----------------------------------------
# HELPERS
# -----------------------------------------
def clamp(x, lo, hi):
    return max(lo, min(hi, x))

def mean(values):
    return sum(values) / len(values)

def field_snapshot():
    return tuple(round(s.E + s.C + s.T + s.M - s.S, 4) for s in sigmas)

# -----------------------------------------
# VORTEX DYNAMICS (NO DECISIONS)
# -----------------------------------------
def step_vortex():
    global sigmas, R

    # Pairwise energy-tension exchange
    for i in range(POLES):
        for j in range(POLES):
            if i == j:
                continue

            si, sj = sigmas[i], sigmas[j]
            grad_T = sj.T - si.T
            flow = ALPHA_E * grad_T * R[i][j]

            si.E += flow * DT
            sj.E -= flow * DT

            si.M += abs(flow) * 0.01
            sj.M += abs(flow) * 0.01

    # Local evolution
    for s in sigmas:
        # Coherence reacts to tension and energy
        dC = BETA_C * (s.E - s.T) - DELTA_S * s.S
        # Tension relaxes but never vanishes
        dT = -GAMMA_T * s.T + NOISE * random.uniform(-1, 1)
        # Memory decays slowly
        dM = - (1 - LAMBDA_M) * s.M
        # Entropy accumulates
        dS = DELTA_S * abs(s.T) + NOISE * random.random()

        s.C += dC * DT
        s.T += dT * DT
        s.M += dM * DT
        s.S += dS * DT

        # Clamp physical ranges
        s.E = clamp(s.E, 0.0, 1.5)
        s.C = clamp(s.C, 0.0, 1.0)
        s.T = clamp(s.T, 0.0, 1.0)
        s.M = clamp(s.M, 0.0, 1.0)
        s.S = clamp(s.S, 0.0, 1.0)

    # Relations slowly decay (no attractors)
    for i in range(POLES):
        for j in range(POLES):
            if i != j:
                R[i][j] *= 0.999

# -----------------------------------------
# RUN SIMULATION
# -----------------------------------------
print("Starting VECTAETOS Simulation Vortex Φ (5D)")
print("POLES:", POLES, "STEPS:", STEPS)
print("-" * 50)

history = []
last = None
stagnation = 0

for step in range(1, STEPS + 1):
    step_vortex()
    snap = field_snapshot()

    if snap == last:
        stagnation += 1
    else:
        stagnation = 0

    last = snap
    history.append(snap)

    # Anti-stagnation micro-perturbation
    if stagnation > 80:
        k = random.randint(0, POLES - 1)
        sigmas[k].T += 0.1
        stagnation = 0

    if step % PRINT_EVERY == 0:
        avgE = mean([s.E for s in sigmas])
        avgC = mean([s.C for s in sigmas])
        avgT = mean([s.T for s in sigmas])
        avgS = mean([s.S for s in sigmas])

        print(
            f"step={step:4d} | "
            f"E={avgE:.3f} "
            f"C={avgC:.3f} "
            f"T={avgT:.3f} "
            f"S={avgS:.3f}"
        )

print("-" * 50)
print("Simulation finished.")
print("Final state:")
for i, s in enumerate(sigmas):
    print(
        f"Σ{i+1}: "
        f"E={s.E:.3f} "
        f"C={s.C:.3f} "
        f"T={s.T:.3f} "
        f"M={s.M:.3f} "
        f"S={s.S:.3f}"
    )
