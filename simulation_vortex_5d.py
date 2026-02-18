# ============================================================
# VECTAETOS :: Simulation Vortex Φ (v0.3)
# ------------------------------------------------------------
# - Pairwise relational field
# - No optimization
# - No objective
# - No agent
# - Topological QE detection
# - Bounded dynamics via tanh
# ============================================================

import random
import math

# ------------------------------------------------------------
# CONFIG
# ------------------------------------------------------------

POLES = 8
STEPS = 200
INTERACTION_SCALE = 0.05


# ------------------------------------------------------------
# INITIAL FIELD
# ------------------------------------------------------------

def initialize_relations():
    relations = {}
    for i in range(POLES):
        for j in range(i + 1, POLES):
            relations[(i, j)] = random.uniform(-0.2, 0.2)
    return relations


# ------------------------------------------------------------
# PAIRWISE INTERACTION
# ------------------------------------------------------------

def compute_pairwise_interaction(i, j, relations):
    total = 0.0

    for k in range(POLES):
        if k != i and k != j:
            a = relations.get(tuple(sorted((i, k))), 0.0)
            b = relations.get(tuple(sorted((j, k))), 0.0)
            total += (a - b)

    return INTERACTION_SCALE * total


# ------------------------------------------------------------
# BOUNDED UPDATE (tanh compression)
# ------------------------------------------------------------

def bounded_update(value):
    return math.tanh(value)


# ------------------------------------------------------------
# GRAPH CONNECTIVITY CHECK (QE detector)
# ------------------------------------------------------------

def is_connected(relations):
    adjacency = {i: set() for i in range(POLES)}

    for (i, j), value in relations.items():
        if abs(value) > 0.05:
            adjacency[i].add(j)
            adjacency[j].add(i)

    visited = set()

    def dfs(node):
        if node in visited:
            return
        visited.add(node)
        for neighbor in adjacency[node]:
            dfs(neighbor)

    dfs(0)

    return len(visited) == POLES


# ------------------------------------------------------------
# MAIN VORTEX STEP
# ------------------------------------------------------------

def run_vortex():
    relations = initialize_relations()
    qe_state = False

    for step in range(STEPS):

        new_relations = {}

        for (i, j), value in relations.items():
            interaction = compute_pairwise_interaction(i, j, relations)
            updated = value + interaction
            new_relations[(i, j)] = bounded_update(updated)

        relations = new_relations

        if not is_connected(relations):
            qe_state = True
            break

    return relations, qe_state
