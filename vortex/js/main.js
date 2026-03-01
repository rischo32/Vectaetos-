/* =========================
   CDN IMPORTS (NO BUNDLER)
========================= */

import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.158.0/examples/jsm/controls/OrbitControls.js';

/* =========================
   INTERNAL MODULES
========================= */

import { SceneManager } from './scene.js';
import { InputManager } from './input.js';

/* =========================
   APP CORE
========================= */

class VortexApp {

  constructor() {

    console.log("VORTEX MAIN LOADED");

    this.sceneManager = new SceneManager();
    this.inputManager = new InputManager(this.sceneManager);

    this.init();
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
  }

  setupResize() {

    window.addEventListener('resize', () => {
      this.sceneManager.onResize();
    });
  }
}

/* =========================
   START
========================= */

new VortexApp();
