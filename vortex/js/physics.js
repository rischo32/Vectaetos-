export class PhysicsManager {

  constructor(sceneManager) {
    this.sceneManager = sceneManager;
  }

  init() {
    // Zatiaľ bez externého engine
  }

  applyGateDamping(gatePoints) {

    if (!gatePoints) return;

    gatePoints.forEach(point => {

      point.position.x *= 0.98;
      point.position.y *= 0.98;
      point.position.z *= 0.98;
    });
  }

  update() {
    // Rezerva pre budúce rozšírenie
  }
}
