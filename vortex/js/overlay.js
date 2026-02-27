export class OverlayManager {

  constructor() {
    this.container = document.getElementById("overlay");
  }

  show(data) {

    if (!this.container) return;

    const { W, H, D, EM, state } = data;

    const mirrorText = this.generateMirror(W, H, D, EM);

    this.container.innerHTML = `
      <div class="panel">
        <div class="tech">
          <div>W: ${W.toFixed(2)}</div>
          <div>H: ${H.toFixed(2)}</div>
          <div>D: ${D.toFixed(2)}</div>
          <div>EM: ${EM.toFixed(2)}</div>
          <div>STATE: ${state}</div>
        </div>
        <div class="mirror">
          ${mirrorText}
        </div>
      </div>
    `;

    this.container.style.opacity = 1;
  }

  generateMirror(W, H, D, EM) {

    if (EM > 0.7)
      return "Your question carries internal activation. You are not seeking data — you are seeking orientation.";

    if (EM > 0.4)
      return "The structure suggests tension. The answer may already exist inside the question.";

    return "The form is stable but shallow. Try increasing depth or intention.";
  }

  hide() {
    if (this.container)
      this.container.style.opacity = 0;
  }
}
