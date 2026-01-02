#!/usr/bin/env python3
# PHI VECTAETOS — MULTIPOLE / CONFIGURABLE / CSV LOG & PLOTS
# Build: v2.0-enhanced

import random
import math
import csv
import time
from collections import deque
from itertools import combinations
import matplotlib.pyplot as plt  # For visualization

# =========================
# KONFIGURÁCIA
# =========================
CONFIG = {
    "SEED": 42,
    "STEPS": 10000,
    "POLES": 4,
    "AXIOMS": 8,
    "LOG_EVERY": 500,
    "WINDOW": 50,
    "ENERGY_DECAY": 0.002,
    "COUPLING": 0.05,
    "PERTURB_SIZE": 0.35,
    "PERTURB_PROB": 0.04,
    "PERSIST_STD": 0.012,
    "PERSIST_COST": 0.003,
    "TAU_MIN": 0.05,
    "TAU_MAX": 0.45,
    "COLLAPSE_E": 0.18,
}

random.seed(CONFIG["SEED"])

# =========================
# FUNKCIE PÓLU A POMOCNÉ FUNKCIE
# =========================
def clamp(value, lower=0, upper=1):
    """Obmedzí hodnotu na požadovaný rozsah."""
    return max(lower, min(upper, value))

def generate_topology(n_poles, topology="random"):
    """
    Vytvára topológiu systému.
    Typy: 
    - "random" - náhodná asymetrická sieť.
    - "ring" - kruhová sieť, kde každý pól má spojenia len medzi dvoma polami.
    - "fully_connected" - každý pól je pripojený ku všetkým ostatným.
    """
    if topology == "fully_connected":
        return [[1 if i != j else 0 for j in range(n_poles)] for i in range(n_poles)]
    elif topology == "ring":
        topo = [[0] * n_poles for _ in range(n_poles)]
        for i in range(n_poles):
            topo[i][(i+1) % n_poles] = 1
            topo[(i+1) % n_poles][i] = 1
        return topo
    else:  # Random topology
        topo = [[random.choice([0, 1]) for _ in range(n_poles)] for _ in range(n_poles)]
        for i in range(n_poles):
            topo[i][i] = 0  # Žiadny pól nie je pripojený sám na seba
        return topo

class Pole:
    """Jednotka simulácie (pól)."""
    def __init__(self):
        self.E = random.uniform(0.6, 0.9)  # Energia
        self.C = random.uniform(0.4, 0.8)  # Koherencia
        self.T = random.uniform(0.05, 0.2)  # Napätie
        self.M = 0.0  # Pamäť
        self.U = 0.0  # Neznáme vplyvy
        self.tau = random.uniform(CONFIG["TAU_MIN"] + 0.07, CONFIG["TAU_MAX"] - 0.07)
        self.cost = 0.0  # Náklady na údržbu
        self.collapse = False
        self.collapses = 0  # Počet kolapsov
        self.hist = deque(maxlen=CONFIG["WINDOW"])  # História (okno s poslednými hodnotami)

    def update(self, global_perturb, dominant, axiom_effect, inconsistency):
        """Aktualizuje vlastnosti pólu."""
        global PERSIST_COST, PERSIST_STD, CLAMP_E

        # História / meranie stability
        self.hist.append((self.E, self.C, self.T))
        if len(self.hist) == CONFIG["WINDOW"]:
            flattened = [x for h in self.hist for x in h]
            mean = sum(flattened) / len(flattened)
            std = math.sqrt(sum((x - mean) ** 2 for x in flattened) / len(flattened))
            if std < CONFIG["PERSIST_STD"]:
                self.cost += CONFIG["PERSIST_COST"] * clamp(std)
