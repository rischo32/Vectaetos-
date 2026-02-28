import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.158.0/examples/jsm/controls/OrbitControls.js';

export class SceneManager {

  constructor() {

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;

    this.time = 0;

    this.emPoint = null;
    this.gatePoints = [];

    this.splitting = false;
    this.splitProgress = 0;

    this.targetPositions = [];

    this.intensity = 0;
  }

  /* =========================
     INIT
  ========================= */

  init() {

    this.setupScene();
    this.setupCamera();
    this.setupRenderer();
    this.setupControls();
    this.setupLights();
    this.setupGrid();
    this.setupAxes();
    this.setupEMPoint();
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0C0D10);
  }

  setupCamera() {

    this.camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    this.camera.position.set(0, 1.5, 3);
  }

  setupRenderer() {

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    document.body.appendChild(this.renderer.domElement);
  }

  setupControls() {

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    this.controls.enablePan = false;

    this.controls.minDistance = 2;
    this.controls.maxDistance = 6;

    this.controls.minPolarAngle = 0.6;
    this.controls.maxPolarAngle = 2.2;
  }

  setupLights() {

    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    this.scene.add(ambient);

    const directional = new THREE.DirectionalLight(0xffffff, 0.6);
    directional.position.set(2, 3, 2);
    this.scene.add(directional);
  }

  setupGrid() {

    const grid = new THREE.GridHelper(4, 40, 0x222222, 0x222222);
    grid.material.opacity = 0.08;
    grid.material.transparent = true;

    this.scene.add(grid);
  }

  setupAxes() {

    const axisLength = 1.5;
    const axisMaterial = new THREE.LineBasicMaterial({ color: 0x333333 });

    const makeAxis = (start, end) => {
      const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
      return new THREE.Line(geometry, axisMaterial);
    };

    this.scene.add(makeAxis(
      new THREE.Vector3(-axisLength, 0, 0),
      new THREE.Vector3(axisLength, 0, 0)
    ));

    this.scene.add(makeAxis(
      new THREE.Vector3(0, -axisLength, 0),
      new THREE.Vector3(0, axisLength, 0)
    ));

    this.scene.add(makeAxis(
      new THREE.Vector3(0, 0, -axisLength),
      new THREE.Vector3(0, 0, axisLength)
    ));
  }

  setupEMPoint() {

    const geometry = new THREE.SphereGeometry(0.06, 32, 32);

    const material = new THREE.MeshStandardMaterial({
      color: 0x5DA9FF,
      emissive: 0x5DA9FF,
      emissiveIntensity: 0.9
    });

    this.emPoint = new THREE.Mesh(geometry, material);

    this.scene.add(this.emPoint);
  }

  /* =========================
     INTENSITY
  ========================= */

  setIntensity(value) {
    this.intensity = value;
  }

  /* =========================
     SPLIT
  ========================= */

  startSplit(W, H, D) {

    if (this.splitting) return;

    this.splitting = true;
    this.splitProgress = 0;

    // Hybrid režim → zamkni kameru počas splitu
    this.controls.enableRotate = false;

    const scale = 2.4;

    this.targetPositions = [
      new THREE.Vector3(Math.pow(W, 0.6) * scale, 0, 0),
      new THREE.Vector3(0, Math.pow(H, 0.6) * scale, 0),
      new THREE.Vector3(0, 0, Math.pow(D, 0.6) * scale)
    ];

    const colors = [
      new THREE.Color(0x4FC3F7),
      new THREE.Color(0x81C784),
      new THREE.Color(0xBA68C8)
    ];

    this.gatePoints = [];

    for (let i = 0; i < 3; i++) {

      const geometry = new THREE.SphereGeometry(0.05, 24, 24);

      const material = new THREE.MeshStandardMaterial({
        color: colors[i],
        emissive: colors[i],
        emissiveIntensity: 0.7
      });

      const mesh = new THREE.Mesh(geometry, material);

      this.scene.add(mesh);
      this.gatePoints.push(mesh);
    }

    if (this.emPoint) {
      this.scene.remove(this.emPoint);
      this.emPoint = null;
    }
  }

  /* =========================
     UPDATE
  ========================= */

  update() {

    this.time += 0.01;
    this.controls.update();

    // Idle pulz
    if (!this.splitting && this.emPoint) {

      const pulse = 1 + Math.sin(this.time * 5) * 0.06;

      this.emPoint.scale.set(pulse, pulse, pulse);

      this.emPoint.position.x =
        Math.sin(this.time * 1.5) * 0.12 * this.intensity;

      this.emPoint.position.y =
        Math.cos(this.time * 1.2) * 0.12 * this.intensity;

      this.emPoint.position.z =
        Math.sin(this.time * 1.8) * 0.12 * this.intensity;
    }

    // Split animácia
    if (this.splitting && this.splitProgress < 1) {

      this.splitProgress += 0.02;

      const eased =
        this.splitProgress < 0.5
          ? 2 * this.splitProgress * this.splitProgress
          : 1 - Math.pow(-2 * this.splitProgress + 2, 2) / 2;

      for (let i = 0; i < this.gatePoints.length; i++) {

        this.gatePoints[i].position.lerpVectors(
          new THREE.Vector3(0, 0, 0),
          this.targetPositions[i],
          eased
        );
      }

      if (this.splitProgress >= 1) {

        // Po splite → mierne povolíme rotáciu
        this.controls.enableRotate = true;
        this.splitting = false;
      }
    }
  }

  /* =========================
     RESIZE
  ========================= */

  onResize() {

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );
  }
}
