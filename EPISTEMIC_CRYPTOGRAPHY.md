# EPISTEMIC_CRYPTOGRAPHY.md
VECTAETOS — Epistemická Kryptografia  
Matematický kontrolný zoznam (pred implementáciou)

Status: PRE-FORMALIZATION  
Vrstva: Auditná / Epistemická  
Závislosť: Φ (pole)  
Nezávislosť: Simulation Vortex

---

## 0. ARCHITEKTONICKÉ PRAVIDLO

Epistemická Kryptografia:

- nesmie riadiť pole
- nesmie riadiť Vortex
- nesmie optimalizovať
- nesmie blokovať výstup
- nesmie vytvárať spätnú slučku

Je to auditná reflexná vrstva.

Formálne:

Vortex ⟂ EK  
Φ ⟂ EK  
EK = f(Projekcia)

---

# I. DEFINÍCIA PRIMITÍV

Musíme uzavrieť:

## 1️⃣ Definícia μᵢ (lokálna intenzita ťažiska Σᵢ)

Otázky:

- Je μᵢ odvodené z:
  - distribúcie trajektórií?
  - lokálneho napäťového gradientu?
  - integrálu deformácie?
- Je μᵢ skalár?
- Je μᵢ časovo vrstvené (LTL)?
- Je μᵢ normalizované?

Invariant:
μᵢ nesmie byť optimalizovateľné.

---

## 2️⃣ Definícia Aᵢⱼ (napäťová diferenciácia)

Základ:

Aᵢⱼ = |μᵢ − μⱼ|

Overiť:

- symetria (Aᵢⱼ = Aⱼᵢ)
- nehierarchickosť
- bez smerovej interpretácie
- bez normatívneho významu

Rozhodnúť:

- používame 28 párov (i < j)?
- budúca expanzia na 56 antisymetrických relácií?

---

## 3️⃣ Definícia A_topo

A_topo = priemerná diferenciácia naprieč všetkými pármi

Overiť:

- škálová invariancia
- nezávislosť od poradia Σ
- nemožnosť selektívnej manipulácie jedného páru

---

## 4️⃣ Definícia μ_total

μ_total = (1/8) Σ μᵢ

Overiť:

- reprezentuje distribúciu
- nereprezentuje koncentráciu
- neslúži ako skóre

---

## 5️⃣ Definícia h_topo

h_topo = μ_total / (μ_total + A_topo)

Overiť:

- 0 ≤ h_topo ≤ 1
- monotónnosť voči polarizácii
- nezávislosť od Vortexu
- nemožnosť optimalizácie bez zásahu do projekcie

---

# II. INVARIANTY

Musí platiť:

□ h_topo nie je vstupom do Vortexu  
□ h_topo nie je prahový blokátor  
□ h_topo nemá spätnú väzbu  
□ EK vrstva je pasívna  
□ zmena ES alebo CCS nemení projekciu  

---

# III. QE INTEGRÁCIA

Rozhodnúť:

- Ako sa QE prejaví v EK?
  - nulové μ_total?
  - rozpad konektivity?
  - osobitný stav mimo h_topo?

QE nesmie byť:

- chyba
- skóre
- optimalizačný signál

QE je ontologická hranica.

---

# IV. COHERENCE CHECKSUM (CCS)

Definovať presne:

struct_repr = ?

Obsahuje:

- N (trajektórie)
- D (dimenzie)
- QE stav
- h_topo
- časovú vrstvu?

Overiť:

□ hash reprezentuje štruktúru  
□ hash nie je bezpečnostný kľúč  
□ hash nie je autorita  

---

# V. EPISTEMIC SIGNATURE (ES)

Obsahuje:

- N
- D
- QE
- μ_total
- A_topo
- h_topo
- časová vrstva (LTL)

Overiť:

□ ES nemení výstup  
□ ES je čisto metadátová  
□ ES sa nedá použiť na optimalizáciu  

---

# VI. ODDELENIE OD VORTEXU

Formálne:

Vortex generuje trajektórie.

Epistemická Kryptografia:
- číta projekciu
- počíta štruktúru
- zapisuje audit

Nikdy:

- nezasahuje späť
- nemení parametre
- nemení dynamiku

---

# VII. TESTOVACIE SCENÁRE

Musíme matematicky preveriť:

1. Extrémna polarizácia (μ₁ >> ostatné)
2. Rovnomerná distribúcia
3. Náhodná fluktuácia
4. QE globálny stav
5. Manipulovaný výstup (bez QE)

---

# VIII. OTVORENÉ BODY

□ Presná definícia μᵢ  
□ Časová vrstvenosť (LTL integrácia)  
□ Rozšírenie na topologický rozpad komponentov  
□ Antisymetrické rozšírenie Aᵢⱼ  

---

# IX. STAV

Matematika Epistemickej Kryptografie je považovaná za uzavretú až po:

- formálnom dôkaze pasívnosti
- dôkaze neoptimalizovateľnosti
- overení topologickej invariancie
- potvrdení oddelenia od Vortexu

---

"Koherencia nie je cieľ.
Je to podmienka prežitia významu."
