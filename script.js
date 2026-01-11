// --- KONFIGURÁCIA POĽA ---
const DELAY_MIN = 2000;   // ticho pred otázkou
const DELAY_MAX = 7000;
const TRUTH_CUT_CHANCE = 0.03; // ~3 % ostrý rez

// --- OTÁZKY (výber – doplň z tvojich 100 podľa chuti) ---
const streams = {
  aporia: [
    "Vieš prijať, že nevieš?",
    "Je nevedomosť chyba, alebo stav?",
    "Čo zostane, keď odpoveď nepríde?"
  ],
  truth: [
    "Je pravda udalosť, alebo vzťah?",
    "Môže byť pravda tichá?",
    "Čo ak pravda nevysvetľuje nič?"
  ],
  darkness: [
    "Je temnota neprítomnosť, alebo podmienka?",
    "Čo vidíš, keď sa nič neukazuje?",
    "Kedy sa ticho stáva aktívnym?"
  ],
  self: [
    "Kto sa práve pýta?",
    "Je táto otázka tvoja?",
    "Čo ak odpoveď zmení teba?"
  ]
};

// ostré, zriedkavé vety
const truthCuts = [
  "Istota je len únava otázky.",
  "Pravda nepotrebuje súhlas.",
  "To, čo hľadáš, nie je odpoveď."
];

// --- STAV RELÁCIE (bez ukladania) ---
let currentStream = Object.keys(streams)[Math.floor(Math.random() * 4)];
let index = Math.floor(Math.random() * streams[currentStream].length);

// --- LOGIKA ---
const qEl = document.getElementById("question");

function randomDelay() {
  return Math.random() * (DELAY_MAX - DELAY_MIN) + DELAY_MIN;
}

function nextQuestion() {
  qEl.classList.add("hidden");

  setTimeout(() => {
    // pravda-rez (vzácne)
    if (Math.random() < TRUTH_CUT_CHANCE) {
      qEl.textContent = truthCuts[Math.floor(Math.random() * truthCuts.length)];
    } else {
      qEl.textContent = streams[currentStream][index];
      index = (index + 1) % streams[currentStream].length;
    }
    qEl.classList.remove("hidden");
  }, randomDelay());
}

// štart: najprv ticho
setTimeout(nextQuestion, randomDelay());

// ENTER = pokračovanie v kontinuu
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") nextQuestion();
});
