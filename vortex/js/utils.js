import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

/* Clamp */

export function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

/* Map range */

export function mapRange(value, inMin, inMax, outMin, outMax) {
  return (
    ((value - inMin) * (outMax - outMin)) /
      (inMax - inMin) +
    outMin
  );
}

/* Random between */

export function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

/* Smoothstep */

export function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/* Distance to center */

export function distanceToCenter(vector) {
  return vector.length();
}

/* Create axis helper line */

export function createAxisLine(start, end, color = 0x333333) {
  const material = new THREE.LineBasicMaterial({ color });
  const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
  return new THREE.Line(geometry, material);
}

/* Create glow material */

export function createGlowMaterial(colorHex, intensity = 0.8) {
  const color = new THREE.Color(colorHex);
  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: intensity
  });
}
