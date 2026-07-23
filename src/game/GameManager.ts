import { EventBus } from '../core/EventBus';
import { GameEvent, GameStateType } from '../core/types';
import type { IGameState } from './states/IGameState';
import { ReadyState } from './states/ReadyState';
import { PlayingState } from './states/PlayingState';
import { GameOverState } from './states/GameOverState';
import { ScoreManager } from './ScoreManager';
import type { Engine } from '../engine/Engine';
import { LEVELS } from '../config/game.config';
import type { LevelConfig } from '../core/types';

export class GameManager {
  eventBus: EventBus;
  scoreManager: ScoreManager;
  levelConfig: LevelConfig;

  private states: Map<GameStateType, IGameState>;
  private currentState: IGameState;
  private currentStateType: GameStateType;

  constructor(bus: EventBus, engine: Engine) {
    this.eventBus = bus;
    this.scoreManager = new ScoreManager(bus, engine);
    this.levelConfig = LEVELS[0];
    this.currentStateType = GameStateType.READY;

    this.states = new Map<GameStateType, IGameState>();
    this.states.set(GameStateType.READY, new ReadyState());
    this.states.set(GameStateType.PLAYING, new PlayingState());
    this.states.set(GameStateType.GAME_OVER, new GameOverState());

    this.currentState = this.states.get(GameStateType.READY)!;

    // Listen for events
    this.eventBus.on(GameEvent.UI_START_CLICK, () => {
      if (this.currentStateType === GameStateType.READY) {
        this.changeState(GameStateType.PLAYING);
      }
    });

    this.eventBus.on(GameEvent.UI_RESTART, () => {
      this.changeState(GameStateType.READY);
    });
  }

  changeState(newState: GameStateType): void {
    this.currentState.exit(this);
    this.currentStateType = newState;
    this.currentState = this.states.get(newState)!;
    this.currentState.enter(this);
  }

  update(delta: number): void {
    this.currentState.update(this, delta);
  }

  getState(): GameStateType {
    return this.currentStateType;
  }
}
