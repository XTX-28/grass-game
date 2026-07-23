import { EventBus } from './core/EventBus';
import { GameEvent, GameStateType } from './core/types';
import { Engine } from './engine/Engine';
import { GameManager } from './game/GameManager';
import { InputHandler } from './game/InputHandler';
import { HUD } from './ui/HUD';
import { GameOverPanel } from './ui/GameOverPanel';
import { StartScreen } from './ui/StartScreen';
import { GAME_CONFIG } from './config/game.config';

// Global styles
import './index.css';

class App {
  private bus: EventBus;
  private engine: Engine;
  private gameManager: GameManager;

  constructor() {
    const container = document.getElementById('app')!;

    // Create EventBus
    this.bus = new EventBus();

    // Create Engine
    this.engine = new Engine(container);

    // Create GameManager
    this.gameManager = new GameManager(this.bus, this.engine);

    // Create InputHandler
    new InputHandler(this.bus, this.engine);

    // Create UI
    new HUD(this.bus, container);
    new GameOverPanel(this.bus, container);
    new StartScreen(this.bus, container);

    // Wire up game logic
    this.setupGameLogic();

    // Start render loop
    this.engine.start();
  }

  private setupGameLogic(): void {
    const grassField = this.engine.getGrassField();
    const particles = this.engine.getParticles();
    const trail = this.engine.getTrail();

    // Handle input movement - cut grass
    this.bus.on(GameEvent.INPUT_MOVE, (coord: { x: number; z: number }) => {
      if (this.gameManager.getState() !== GameStateType.PLAYING) return;

      const cutRadius = this.gameManager.levelConfig.cutRadius;
      const newCuts = grassField.cutAt(coord.x, coord.z, cutRadius);

      if (newCuts > 0) {
        particles.emit(coord.x, 0, coord.z, Math.min(newCuts, GAME_CONFIG.particleCount));
      }

      trail.addPoint(coord.x, 0, coord.z);
    });

    // Update game manager each frame
    this.engine.onFrame((delta: number) => {
      this.gameManager.update(delta);

      // Update score during play
      if (this.gameManager.getState() === GameStateType.PLAYING) {
        this.gameManager.scoreManager.emitScoreUpdate(0);
      }
    });

    // Reset grass on game reset
    this.bus.on(GameEvent.GAME_RESET, () => {
      grassField.reset();
      trail.clear();
    });
  }
}

// Start the app
new App();
