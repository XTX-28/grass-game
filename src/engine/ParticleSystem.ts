import * as THREE from 'three';
import type { IParticleSystem } from './interfaces';
import { Pool } from '../core/Pool';

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  active: boolean;
}

const MAX_PARTICLES = 200;

export class ParticleSystem implements IParticleSystem {
  private mesh: THREE.Points;
  private positions: Float32Array;
  private colors: Float32Array;
  private sizes: Float32Array;
  private particles: Particle[];
  private pool: Pool<Particle>;

  constructor() {
    this.positions = new Float32Array(MAX_PARTICLES * 3);
    this.colors = new Float32Array(MAX_PARTICLES * 3);
    this.sizes = new Float32Array(MAX_PARTICLES);

    this.particles = [];
    this.pool = new Pool<Particle>(
      () => ({
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        life: 0,
        maxLife: 1,
        active: false,
      }),
      (p) => {
        p.active = false;
        p.life = 0;
      }
    );

    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = this.pool.acquire();
      this.particles.push(p);
      this.sizes[i] = 0;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    this.mesh = new THREE.Points(geometry, material);
    this.mesh.frustumCulled = false;
  }

  emit(x: number, y: number, z: number, count: number): void {
    for (let i = 0; i < count; i++) {
      // Find an inactive particle
      const p = this.particles.find((p) => !p.active);
      if (!p) break;

      p.active = true;
      p.life = 0;
      p.maxLife = 0.5 + Math.random() * 0.5;
      p.position.set(x, y + 0.1, z);
      p.velocity.set(
        (Math.random() - 0.5) * 2,
        Math.random() * 3 + 1,
        (Math.random() - 0.5) * 2
      );
    }
  }

  update(delta: number): void {
    let hasActive = false;
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = this.particles[i];
      if (!p.active) {
        this.sizes[i] = 0;
        continue;
      }

      hasActive = true;
      p.life += delta;
      if (p.life >= p.maxLife) {
        p.active = false;
        this.sizes[i] = 0;
        continue;
      }

      // Physics
      p.velocity.y -= 9.8 * delta;
      p.position.addScaledVector(p.velocity, delta);

      const t = p.life / p.maxLife;
      const idx = i * 3;
      this.positions[idx] = p.position.x;
      this.positions[idx + 1] = p.position.y;
      this.positions[idx + 2] = p.position.z;

      // Green to fade
      this.colors[idx] = 0.2 + t * 0.4;
      this.colors[idx + 1] = 0.7 - t * 0.5;
      this.colors[idx + 2] = 0.15;

      this.sizes[i] = 0.08 * (1 - t);
    }

    if (hasActive) {
      const geo = this.mesh.geometry;
      (geo.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
      (geo.getAttribute('color') as THREE.BufferAttribute).needsUpdate = true;
      (geo.getAttribute('size') as THREE.BufferAttribute).needsUpdate = true;
    }
  }

  getMesh(): THREE.Object3D {
    return this.mesh;
  }
}
