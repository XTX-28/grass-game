import * as THREE from 'three';

export interface IGrassField {
  getMesh(): THREE.Object3D;
  cutAt(x: number, z: number, radius: number): number;
  update(delta: number): void;
  reset(): void;
  getCutCount(): number;
  getTotalCount(): number;
}

export interface IParticleSystem {
  getMesh(): THREE.Object3D;
  emit(x: number, y: number, z: number, count: number): void;
  update(delta: number): void;
}

export interface ITrailRenderer {
  getMesh(): THREE.Object3D;
  addPoint(x: number, y: number, z: number): void;
  update(delta: number): void;
  clear(): void;
}
