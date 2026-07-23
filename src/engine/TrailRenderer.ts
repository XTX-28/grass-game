import * as THREE from 'three';
import type { ITrailRenderer } from './interfaces';
import { GAME_CONFIG } from '../config/game.config';

interface TrailPoint {
  position: THREE.Vector3;
  age: number;
}

const MAX_TRAIL_POINTS = 50;

export class TrailRenderer implements ITrailRenderer {
  private mesh: THREE.Line;
  private points: TrailPoint[] = [];
  private geometry: THREE.BufferGeometry;
  private positions: Float32Array;

  constructor() {
    this.positions = new Float32Array(MAX_TRAIL_POINTS * 3);

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));

    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
      linewidth: 2,
    });

    this.mesh = new THREE.Line(this.geometry, material);
    this.mesh.frustumCulled = false;
  }

  addPoint(x: number, y: number, z: number): void {
    this.points.push({
      position: new THREE.Vector3(x, y + 0.05, z),
      age: 0,
    });

    if (this.points.length > MAX_TRAIL_POINTS) {
      this.points.shift();
    }

    this.updateBuffers();
  }

  update(delta: number): void {
    let hasChanges = false;
    for (let i = this.points.length - 1; i >= 0; i--) {
      this.points[i].age += delta;
      if (this.points[i].age > 1.0 / GAME_CONFIG.trailFadeSpeed) {
        this.points.splice(i, 1);
        hasChanges = true;
      }
    }

    if (hasChanges || this.points.length > 0) {
      this.updateBuffers();
    }
  }

  private updateBuffers(): void {
    for (let i = 0; i < MAX_TRAIL_POINTS; i++) {
      const idx = i * 3;
      if (i < this.points.length) {
        this.positions[idx] = this.points[i].position.x;
        this.positions[idx + 1] = this.points[i].position.y;
        this.positions[idx + 2] = this.points[i].position.z;
      } else {
        this.positions[idx] = 0;
        this.positions[idx + 1] = 0;
        this.positions[idx + 2] = 0;
      }
    }

    this.geometry.setDrawRange(0, this.points.length);
    (this.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
  }

  clear(): void {
    this.points.length = 0;
    this.geometry.setDrawRange(0, 0);
  }

  getMesh(): THREE.Object3D {
    return this.mesh;
  }
}
