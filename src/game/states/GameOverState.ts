import type { IGameState } from './IGameState';
import type { GameManager } from '../GameManager';
import { GameEvent } from '../../core/types';

export class GameOverState implements IGameState {
  enter(manager: GameManager): void {
    const coverage = manager.scoreManager.getCoverage();
    manager.eventBus.emit(GameEvent.GAME_OVER, { coverage });
  }

  update(_manager: GameManager, _delta: number): void {
    // Idle - waiting for restart
  }

  exit(_manager: GameManager): void {
    // Nothing to clean up
  }
}
