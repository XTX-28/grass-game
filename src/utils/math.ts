import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

export function screenToWorld(
  clientX: number,
  clientY: number,
  camera: THREE.Camera,
  canvasWidth: number,
  canvasHeight: number
): { x: number; z: number } | null {
  const ndcX = (clientX / canvasWidth) * 2 - 1;
  const ndcY = -(clientY / canvasHeight) * 2 + 1;
  raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
  const target = new THREE.Vector3();
  const hit = raycaster.ray.intersectPlane(groundPlane, target);
  if (hit) {
    return { x: target.x, z: target.z };
  }
  return null;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}
