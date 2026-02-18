# -------------------------------------------------
# VECTAETOS :: Simulation Vortex Φ (Canonical Core)
# -------------------------------------------------
# - 8 invariant singularities
# - antisymmetric relational tensions R_ij
# - no optimization
# - no target
# - QE as topological fragmentation
# -------------------------------------------------

import random
from typing import List, Tuple


N = 8
INTERACTION_STRENGTH = 0.02
NOISE_LEVEL = 0.01
QE_THRESHOLD = 0.6  # fragmentation threshold


# -------------------------------
# RELATIONAL MATRIX
# -------------------------------

def generate_initial_relations(n: int = N) -> List[List[float]]:
    R = [[0.0 for _ in range(n)] for _ in range(n)]

    for i in range(n):
        for j in range(i + 1, n):
            val = random.uniform(-0.3, 0.3)
            R[i][j] = val
            R[j][i] = -val  # antisymmetry

    return R


# -------------------------------
# LOCAL PAIRWISE INTERACTION
# -------------------------------

def pairwise_interaction(R: List[List[float]]) -> List[List[float]]:
    new_R = [row[:] for row in R]

    for i in range(N):
        for j in range(i + 1, N):

            tension = R[i][j]

            # Local blind perturbation
            delta = random.uniform(-NOISE_LEVEL, NOISE_LEVEL)

            # Interaction coupling
            coupling = 0.0
            for k in range(N):
                if k != i and k != j:
                    coupling += (R[i][k] - R[j][k])

            coupling *= INTERACTION_STRENGTH

            updated = tension + delta + coupling

            new_R[i][j] = updated
            new_R[j][i] = -updated

    return new_R


# -------------------------------
# TOPOLOGICAL QE DETECTOR
# -------------------------------

def detect_qe(R: List[List[float]]) -> bool:
    """
    QE = relational graph fragmentation.
    If too many weak links, graph loses connectivity.
    """

    visited = set()

    def dfs(node):
        for j in range(N):
            if abs(R[node][j]) > QE_THRESHOLD and j not in visited:
                visited.add(j)
                dfs(j)

    visited.add(0)
    dfs(0)

    return len(visited) < N


# -------------------------------
# RUN SIMULATION
# -------------------------------

def run_simulation(steps: int = 2000) -> Tuple[List[List[float]], bool]:

    R = generate_initial_relations()
    qe_state = False

    for _ in range(steps):
        R = pairwise_interaction(R)

        if detect_qe(R):
            qe_state = True

    return R, qe_state


if __name__ == "__main__":
    R_final, qe = run_simulation()
    print("QE state:", qe)
