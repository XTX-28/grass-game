import * as THREE from 'three';
import type { IGrassField } from './interfaces';
import { createGrassMaterial } from './GrassShader';
import { SpatialGrid } from '../core/SpatialGrid';
import { GAME_CONFIG } from '../config/game.config';
import { randomRange } from '../utils/math';

export class GrassField implements IGrassField {
  private mesh: THREE.InstancedMesh;
  private material: THREE.ShaderMaterial;
  private count: number;
  private cutProgressArray: Float32Array;
  private randomArray: Float32Array;
  private positionsX: Float32Array;
  private positionsZ: Float32Array;
  private isCut: Uint8Array;
  private spatialGrid: SpatialGrid;
  private fieldWidth: number;
  private fieldHeight: number;
  private cutCount = 0;
  private dummy = new THREE.Object3D();

  constructor(fieldWidth: number, fieldHeight: number, density: number) {
    this.fieldWidth = fieldWidth;
    this.fieldHeight = fieldHeight;
    this.count = Math.floor(fieldWidth * fieldHeight * density);

    // Allocate data arrays
    this.cutProgressArray = new Float32Array(this.count);
    this.randomArray = new Float32Array(this.count);
    this.positionsX = new Float32Array(this.count);
    this.positionsZ = new Float32Array(this.count);
    this.isCut = new Uint8Array(this.count);

    // Create spatial grid
    this.spatialGrid = new SpatialGrid(fieldWidth, fieldHeight, 1.0, this.count);

    // Create geometry - simple blade shape (two triangles)
    const bladeHeight = GAME_CONFIG.bladeHeight;
    const bladeWidth = GAME_CONFIG.bladeWidth;

    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      -bladeWidth / 2, 0, 0,
      bladeWidth / 2, 0, 0,
      -bladeWidth / 4, bladeHeight * 0.5, 0,
      bladeWidth / 4, bladeHeight * 0.5, 0,
      0, bladeHeight, 0,
    ]);
    const indices = [0, 1, 2, 1, 3, 2, 2, 3, 4];
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    // Create material
    this.material = createGrassMaterial();

    // Create InstancedMesh
    this.mesh = new THREE.InstancedMesh(geometry, this.material, this.count);
    this.mesh.frustumCulled = false;

    // Initialize instances
    this.initializeGrass();
  }

  private initializeGrass(): void {
    const halfW = this.fieldWidth / 2;
    const halfH = this.fieldHeight / 2;

    this.spatialGrid.clear();
    this.cutCount = 0;

    for (let i = 0; i < this.count; i++) {
      const x = randomRange(-halfW, halfW);
      const z = randomRange(-halfH, halfH);
      const rot = randomRange(0, Math.PI * 2);
      const heightScale = randomRange(0.7, 1.3);

      this.positionsX[i] = x;
      this.positionsZ[i] = z;
      this.randomArray[i] = Math.random();
      this.cutProgressArray[i] = 0;
      this.isCut[i] = 0;

      this.dummy.position.set(x, 0, z);
      this.dummy.rotation.set(0, rot, 0);
      this.dummy.scale.set(1, heightScale, 1);
      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(i, this.dummy.matrix);

      // Insert into spatial grid (use positive coordinates)
      this.spatialGrid.insert(i, x + halfW, z + halfH);
    }

    // Set custom attributes
    this.mesh.geometry.setAttribute(
      'aCutProgress',
      new THREE.InstancedBufferAttribute(this.cutProgressArray, 1)
    );
    this.mesh.geometry.setAttribute(
      'aRandom',
      new THREE.InstancedBufferAttribute(this.randomArray, 1)
    );

    this.mesh.instanceMatrix.needsUpdate = true;
  }

  cutAt(x: number, z: number, radius: number): number {
    const halfW = this.fieldWidth / 2;
    const halfH = this.fieldHeight / 2;
    const candidates: number[] = [];
    const radiusSq = radius * radius;

    this.spatialGrid.query(x + halfW, z + halfH, radius, candidates);

    let newCuts = 0;
    for (const idx of candidates) {
      if (this.isCut[idx]) continue;

      const dx = this.positionsX[idx] - x;
      const dz = this.positionsZ[idx] - z;
      const distSq = dx * dx + dz * dz;

      if (distSq <= radiusSq) {
        this.isCut[idx] = 1;
        this.cutProgressArray[idx] = 1.0;
        this.cutCount++;
        newCuts++;
      }
    }

    if (newCuts > 0) {
      const attr = this.mesh.geometry.getAttribute('aCutProgress') as THREE.InstancedBufferAttribute;
      attr.needsUpdate = true;
    }

    return newCuts;
  }

  update(delta: number): void {
    this.material.uniforms.uTime.value += delta;
  }

  reset(): void {
    this.initializeGrass();
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  getMesh(): THREE.Object3D {
    return this.mesh;
  }

  getCutCount(): number {
    return this.cutCount;
  }

  getTotalCount(): number {
    return this.count;
  }
}
