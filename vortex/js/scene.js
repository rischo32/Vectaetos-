import * as THREE from 'three';

export class SceneManager {
  constructor() {
    this.time = 0;
    this.radius = 2.2;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    this.emPoint = null;
    this.gatePoints = [];
    this.targetPositions = [];

    this.splitting = false;
    this.splitProgress = 0;

    this.intensity = 0;
    this.baseHue = 210 / 360;
  }

  /* =========================
     INIT
  ========================= */

  init() {
    this.setupScene();
    this.setupCamera();
    this.setupRenderer();
    this.setupLights();
    this.setupAxes();
    this.setupGrid();
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
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.body.appendChild(this.renderer.domElement);
  }

  setupLights() {
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const dir = new THREE.DirectionalLight(0xffffff, 0.3);
    dir.position.set(2, 3, 2);
    this.scene.add(dir);
  }

  setupAxes() {
    const axisLength = 1.5;
    const material = new THREE.LineBasicMaterial({ color: 0x333333 });

    const makeAxis = (start, end) => {
      const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
      return new THREE.Line(geometry, material);
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

  setupGrid() {
    const grid = new THREE.GridHelper(3, 30, 0x222222, 0x222222);
    grid.material.opacity = 0.08;
    grid.material.transparent = true;
    this.scene.add(grid);
  }

  setupEMPoint() {
    const geometry = new THREE.SphereGeometry(0.04, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x5DA9FF,
      emissive: 0x5DA9FF,
      emissiveIntensity: 0.7
    });

    this.emPoint = new THREE.Mesh(geometry, material);
    this.scene.add(this.emPoint);
  }

  /* =========================
     EXTERNAL UPDATE
  ========================= */

  setIntensity(value) {
    this.intensity = value;
  }

  /* =========================
     SPLIT
  ========================= */

  startSplit(W, H, D, intensity) {
    if (this.splitting) return;

    this.splitting = true;
    this.splitProgress = 0;

    const axisLength = 1.5;

    this.targetPositions = [
      new THREE.Vector3(W * intensity * axisLength, 0, 0),
      new THREE.Vector3(0, H * intensity * axisLength, 0),
      new THREE.Vector3(0, 0, D * intensity * axisLength)
    ];

    const colors = [
      new THREE.Color().setHSL(this.baseHue - 0.03, 0.8, 0.4 + W * 0.3),
      new THREE.Color().setHSL(this.baseHue + 0.05, 0.8, 0.4 + H * 0.3),
      new THREE.Color().setHSL(this.baseHue - 0.1, 0.8, 0.4 + D * 0.3)
    ];

    this.gatePoints = [];

    for (let i = 0; i < 3; i++) {
      const g = new THREE.SphereGeometry(0.035, 24, 24);
      const m = new THREE.MeshStandardMaterial({
        color: colors[i],
        emissive: colors[i],
        emissiveIntensity: 0.7
      });

      const mesh = new THREE.Mesh(g, m);
      this.scene.add(mesh);
      this.gatePoints.push(mesh);
    }

    if (this.emPoint) {
      this.scene.remove(this.emPoint);
      this.emPoint = null;
    }
  }

  /* =========================
     UPDATE LOOP
  ========================= */

  update() {
    this.time += 0.002;

    // Kamera mikro-orbit
    this.camera.position.set(
      Math.cos(this.time) * this.radius,
      1.2 + Math.sin(this.time * 0.5) * 0.1,
      Math.sin(this.time) * this.radius
    );
    this.camera.lookAt(0, 0, 0);

    // Draft EM pulz
    if (!this.splitting && this.emPoint) {
      const scale =
        1 +
        this.intensity * 0.8 +
        Math.sin(this.time * 10) * 0.05;

      this.emPoint.scale.set(scale, scale, scale);

      this.emPoint.position.x =
        Math.sin(this.time * 3) * this.intensity * 0.3;

      this.emPoint.position.y =
        Math.cos(this.time * 2) * this.intensity * 0.2;

      this.emPoint.position.z =
        Math.sin(this.time * 4) * this.intensity * 0.3;
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
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    this.camera.aspect =
      window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );
  }
}
