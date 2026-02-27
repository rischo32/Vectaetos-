import { computeSigma } from './sigma.js';

export class InputManager {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;

    this.textarea = document.getElementById("question");
    this.bufferFill = document.getElementById("bufferFill");

    this.maxChars = 100;
    this.intensity = 0;
  }

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

  handleInput() {
    const length = this.textarea.value.length;

    this.intensity = Math.min(1, length / this.maxChars);

    if (this.bufferFill) {
      this.bufferFill.style.width = `${this.intensity * 100}%`;
    }

    this.sceneManager.setIntensity(this.intensity);
  }

  handleSubmit() {
    const text = this.textarea.value.trim();
    if (!text.length) return;

    const { W, H, D } = computeSigma(text);

    this.sceneManager.startSplit(
      W,
      H,
      D,
      this.intensity
    );
  }
}
