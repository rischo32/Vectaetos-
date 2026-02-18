# ============================================================
# VECTAETOS :: Simulation Vortex Φ (v0.4 CANONICAL)
# ------------------------------------------------------------
# - 8 invariant singularities
# - antisymmetric relational tensions R_ij
# - local blind fluctuation
# - pairwise coupling
# - bounded via tanh (topological compression)
# - QE as graph fragmentation
# - no optimization
# - no objective
# - no feedback
# ============================================================

import random
import math
from typing import List, Tuple


# ------------------------------------------------------------
# CONFIG
# ------------------------------------------------------------

N = 8
INTERACTION_STRENGTH = 0.02
NOISE_LEVEL = 0.01
QE_THRESHOLD = 0.15


# ------------------------------------------------------------
# INITIAL RELATIONAL FIELD
# ------------------------------------------------------------

def generate_initial_relations(n: int = N) -> List[List[float]]:
    R = [[0.0 for _ in range(n)] for _ in range(n)]

    for i in range(n):
        for j in range(i + 1, n):
            val = random.uniform(-0.3, 0.3)
            R[i][j] = val
            R[j][i] = -val  # strict antisymmetry

    return R


# ------------------------------------------------------------
# SINGLE STEP UPDATE
# ------------------------------------------------------------

def pairwise_interaction(R: List[List[float]]) -> List[List[float]]:
    new_R = [row[:] for row in R]

    for i in range(N):
        for j in range(i + 1, N):

            tension = R[i][j]

            # Local blind fluctuation
            delta = random.uniform(-NOISE_LEVEL, NOISE_LEVEL)

            # Coupling via shared neighbors
            coupling = 0.0
            for k in range(N):
                if k != i and k != j:
                    coupling += (R[i][k] - R[j][k])

            coupling *= INTERACTION_STRENGTH

            updated = tension + delta + coupling

            # Topological compression (prevents divergence)
            bounded = math.tanh(updated)

            new_R[i][j] = bounded
            new_R[j][i] = -bounded  # preserve antisymmetry

    return new_R


# ------------------------------------------------------------
# QE DETECTOR (GRAPH FRAGMENTATION)
# ------------------------------------------------------------

def detect_qe(R: List[List[float]]) -> bool:

    visited = set()

    def dfs(node):
        for j in range(N):
            if abs(R[node][j]) > QE_THRESHOLD and j not in visited:
                visited.add(j)
                dfs(j)

    visited.add(0)
    dfs(0)

    return len(visited) < N


# ------------------------------------------------------------
# MAIN SIMULATION ENTRY
# ------------------------------------------------------------

def run_simulation(steps: int = 2000) -> Tuple[List[List[float]], bool]:

    R = generate_initial_relations()
    qe_state = False

    for _ in range(steps):
        R = pairwise_interaction(R)

        if detect_qe(R):
            qe_state = True
            break

    return R, qe_state


# ------------------------------------------------------------
# STANDALONE TEST
# ------------------------------------------------------------

if __name__ == "__main__":
    R_final, qe = run_simulation()
    print("QE state:", qe)
