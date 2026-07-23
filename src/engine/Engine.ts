import * as THREE from 'three';
import { GrassField } from './GrassField';
import { ParticleSystem } from './ParticleSystem';
import { TrailRenderer } from './TrailRenderer';
import { GAME_CONFIG } from '../config/game.config';

export class Engine {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private grassField: GrassField;
  private particles: ParticleSystem;
  private trail: TrailRenderer;
  private clock: THREE.Clock;
  private container: HTMLElement;
  private animationId: number | null = null;
  private onFrameCallbacks: ((delta: number) => void)[] = [];

  constructor(container: HTMLElement) {
    this.container = container;
    this.clock = new THREE.Clock();

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x2d5a27); // Dark green background
    container.appendChild(this.renderer.domElement);

    // Scene
    this.scene = new THREE.Scene();

    // Camera - orthographic top-down view
    const aspect = this.getAspect();
    const frustum = GAME_CONFIG.cameraFrustum;
    this.camera = new THREE.OrthographicCamera(
      -frustum * aspect / 2,
      frustum * aspect / 2,
      frustum / 2,
      -frustum / 2,
      0.1,
      100
    );
    this.camera.position.set(0, 20, 0);
    this.camera.lookAt(0, 0, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    this.scene.add(directionalLight);

    // Ground plane
    const groundGeo = new THREE.PlaneGeometry(
      GAME_CONFIG.fieldWidth + 2,
      GAME_CONFIG.fieldHeight + 2
    );
    const groundMat = new THREE.MeshBasicMaterial({ color: 0x3a7a34 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    this.scene.add(ground);

    // Grass field
    this.grassField = new GrassField(
      GAME_CONFIG.fieldWidth,
      GAME_CONFIG.fieldHeight,
      GAME_CONFIG.grassDensity
    );
    this.scene.add(this.grassField.getMesh());

    // Particles
    this.particles = new ParticleSystem();
    this.scene.add(this.particles.getMesh());

    // Trail
    this.trail = new TrailRenderer();
    this.scene.add(this.trail.getMesh());

    // Resize handler
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  private getAspect(): number {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    return width / height;
  }

  private handleResize = (): void => {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.renderer.setSize(width, height);

    const aspect = width / height;
    const frustum = GAME_CONFIG.cameraFrustum;
    this.camera.left = -frustum * aspect / 2;
    this.camera.right = frustum * aspect / 2;
    this.camera.top = frustum / 2;
    this.camera.bottom = -frustum / 2;
    this.camera.updateProjectionMatrix();
  };

  start(): void {
    this.clock.start();
    this.loop();
  }

  stop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private loop = (): void => {
    this.animationId = requestAnimationFrame(this.loop);
    const delta = Math.min(this.clock.getDelta(), 0.05); // Cap delta

    this.grassField.update(delta);
    this.particles.update(delta);
    this.trail.update(delta);

    for (const cb of this.onFrameCallbacks) {
      cb(delta);
    }

    this.renderer.render(this.scene, this.camera);
  };

  onFrame(callback: (delta: number) => void): void {
    this.onFrameCallbacks.push(callback);
  }

  getGrassField(): GrassField {
    return this.grassField;
  }

  getParticles(): ParticleSystem {
    return this.particles;
  }

  getTrail(): TrailRenderer {
    return this.trail;
  }

  getCamera(): THREE.Camera {
    return this.camera;
  }

  getCanvas(): HTMLCanvasElement {
    return this.renderer.domElement;
  }

  getContainerSize(): { width: number; height: number } {
    return {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    };
  }

  resetGrass(): void {
    this.grassField.reset();
  }

  dispose(): void {
    this.stop();
    window.removeEventListener('resize', this.handleResize);
    this.renderer.dispose();
    this.container.removeChild(this.renderer.domElement);
  }
}
