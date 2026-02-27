import { SceneManager } from './scene.js';
import { InputManager } from './input.js';

class VortexApp {
  constructor() {
    this.sceneManager = new SceneManager();
    this.inputManager = new InputManager(this.sceneManager);
  }

  init() {
    this.sceneManager.init();
    this.inputManager.init();
    this.animate();
    this.setupResize();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.sceneManager.update();
    this.sceneManager.render();
  }

  setupResize() {
    window.addEventListener('resize', () => {
      this.sceneManager.onResize();
    });
  }
}

const app = new VortexApp();
app.init();
