# =========================================
# VECTAETOS — RUNIC PROJECTION (DESCRIPTIVE)
# =========================================

from enum import Enum
from dataclasses import dataclass
from typing import List


# -------------------------------
# ZÁKLADNÉ ENUMY
# -------------------------------

class RuneState(Enum):
    STABLE = "◯"
    TENSION = "△"
    TRANSITION = "◇"
    APORIA = "⊘"


class Axiom(Enum):
    INT = "ᚨ"   # Intention
    LEX = "ᛚ"   # Existence
    VER = "ᚱ"   # Truth
    LIB = "ᚦ"   # Freedom
    UNI = "ᛜ"   # Unity
    REL = "ᚷ"   # Relation
    WIS = "ᛟ"   # Wisdom
    CRE = "ᛞ"   # Creation


# -------------------------------
# DÁTOVÉ ŠTRUKTÚRY
# -------------------------------

@dataclass(frozen=True)
class SigmaState:
    E: float   # energia
    C: float   # koherencia
    T: float   # tenzia
    M: float   # pamäť
    S: float   # entropia


@dataclass(frozen=True)
class Rune:
    symbol: str
    axiom: Axiom
    state: RuneState
    dynamics: str   # "rising", "falling", "stable", "oscillating"


# -------------------------------
# PROJEKČNÁ FUNKCIA
# -------------------------------

def project_sigma_to_rune(
    sigma: SigmaState,
    axiom: Axiom,
    kappa: float
) -> Rune:
    """
    Čisto deskriptívna projekcia stavu Σ → Runa
    ŽIADNA preskripcia
    """

    # Aporia — nerealizovateľná projekcia
    if sigma.C < kappa or sigma.S > 0.9:
        return Rune(
            symbol="⊘",
            axiom=axiom,
            state=RuneState.APORIA,
            dynamics="undefined"
        )

    # Stavová heuristika (projekčná, nie rozhodovacia)
    if sigma.T < 0.2:
        state = RuneState.STABLE
    elif sigma.T < 0.5:
        state = RuneState.TENSION
    else:
        state = RuneState.TRANSITION

    # Dynamika (iba smerová stopa)
    if sigma.E > 0.6:
        dynamics = "rising"
    elif sigma.E < 0.3:
        dynamics = "falling"
    else:
        dynamics = "stable"

    return Rune(
        symbol=axiom.value,
        axiom=axiom,
        state=state,
        dynamics=dynamics
    )


# -------------------------------
# CELOKOVÁ PROJEKCIA POĽA
# -------------------------------

def project_field_to_runes(
    sigmas: List[SigmaState],
    kappa: float
) -> List[Rune]:
    """
    Φ → Runová konfigurácia
    Bez spätnej väzby, bez optimalizácie
    """
    runes = []

    for sigma, axiom in zip(sigmas, Axiom):
        runes.append(
            project_sigma_to_rune(sigma, axiom, kappa)
        )

    return runes


# -------------------------------
# PRÍKLAD (LEN NA TEST)
# -------------------------------

if __name__ == "__main__":
    sigmas = [
        SigmaState(0.7, 0.8, 0.1, 0.2, 0.1),
        SigmaState(0.4, 0.6, 0.3, 0.3, 0.2),
        SigmaState(0.2, 0.5, 0.6, 0.5, 0.3),
        SigmaState(0.9, 0.9, 0.2, 0.1, 0.1),
        SigmaState(0.5, 0.7, 0.4, 0.4, 0.2),
        SigmaState(0.6, 0.8, 0.2, 0.3, 0.1),
        SigmaState(0.3, 0.6, 0.5, 0.6, 0.4),
        SigmaState(0.8, 0.9, 0.15, 0.2, 0.1),
    ]

    runes = project_field_to_runes(sigmas, kappa=0.4)

    for r in runes:
        print(f"{r.symbol} {r.state.value} ({r.dynamics})")
