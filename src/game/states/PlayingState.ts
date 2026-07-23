import type { IGameState } from './IGameState';
import type { GameManager } from '../GameManager';
import { GameEvent, GameStateType } from '../../core/types';

export class PlayingState implements IGameState {
  private timeLeft: number = 0;

  enter(manager: GameManager): void {
    this.timeLeft = manager.levelConfig.duration;
    manager.eventBus.emit(GameEvent.GAME_START);
  }

  update(manager: GameManager, delta: number): void {
    this.timeLeft -= delta;

    manager.eventBus.emit(GameEvent.GAME_TICK, {
      timeLeft: Math.max(0, this.timeLeft),
      duration: manager.levelConfig.duration,
    });

    if (this.timeLeft <= 0) {
      manager.changeState(GameStateType.GAME_OVER);
    }
  }

  exit(_manager: GameManager): void {
    // Nothing to clean up
  }
}
