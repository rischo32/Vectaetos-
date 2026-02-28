import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { EffectComposer } from 'https://unpkg.com/three@0.158.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.158.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.158.0/examples/jsm/postprocessing/UnrealBloomPass.js';

import { SceneManager } from './scene.js';
import { InputManager } from './input.js';

class VortexApp {

  constructor() {

    this.sceneManager = new SceneManager();
    this.inputManager = new InputManager(this.sceneManager);

    this.composer = null;

    this.init();
  }

  init() {

    this.sceneManager.init();
    this.inputManager.init();

    this.setupPostProcessing();
    this.setupResize();
    this.animate();
  }

  setupPostProcessing() {

    const { renderer, scene, camera } = this.sceneManager;

    this.composer = new EffectComposer(renderer);

    const renderPass = new RenderPass(scene, camera);
    this.composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.1,  // strength
      0.3,  // radius
      0.85  // threshold
    );

    this.composer.addPass(bloomPass);
  }

  animate() {

    requestAnimationFrame(() => this.animate());

    this.sceneManager.update();

    if (this.composer) {
      this.composer.render();
    }
  }

  setupResize() {

    window.addEventListener('resize', () => {

      this.sceneManager.onResize();

      if (this.composer) {
        this.composer.setSize(
          window.innerWidth,
          window.innerHeight
        );
      }
    });
  }
}

new VortexApp();
