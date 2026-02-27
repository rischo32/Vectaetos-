import { computeSigma } from './sigma.js';
import { computeEM } from './em.js';
import { OverlayManager } from './overlay.js';

export class InputManager {

  constructor(sceneManager) {

    this.sceneManager = sceneManager;

    this.textarea = document.getElementById("question");
    this.bufferFill = document.getElementById("bufferFill");

    this.overlay = new OverlayManager();

    this.maxChars = 100;
    this.intensity = 0;
  }

  /* =========================
     INIT
  ========================= */

  init() {

    if (!this.textarea) return;

    this.textarea.addEventListener("input", () => {
      this.handleInput();
    });

    this.textarea.addEventListener("keydown", (e) => {

      if (e.key === "Enter") {
        e.preventDefault();
        this.handleSubmit();
      }
    });
  }

  /* =========================
     INPUT TRACKING
  ========================= */

  handleInput() {

    const length = this.textarea.value.length;

    this.intensity = Math.min(1, length / this.maxChars);

    if (this.bufferFill) {
      this.bufferFill.style.width =
        `${this.intensity * 100}%`;
    }

    this.sceneManager.setIntensity(this.intensity);
  }

  /* =========================
     SUBMIT
  ========================= */

  handleSubmit() {

    const text = this.textarea.value.trim();
    if (!text.length) return;

    // 1️⃣ Sigma
    const { W, H, D } = computeSigma(text);

    // 2️⃣ Epistemický Moment
    const { value, state } = computeEM(W, H, D);

    // 3️⃣ 3D split
    this.sceneManager.startSplit(
      W,
      H,
      D,
      this.intensity
    );

    // 4️⃣ Overlay zrkadlo
    this.overlay.show({
      W,
      H,
      D,
      EM: value,
      state
    });

    // 5️⃣ Reset buffer (nie text)
    this.intensity = 0;

    if (this.bufferFill) {
      this.bufferFill.style.width = "0%";
    }

    this.sceneManager.setIntensity(0);
  }
}
