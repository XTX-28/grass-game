import type { IGameState } from './IGameState';
import type { GameManager } from '../GameManager';
import { GameEvent } from '../../core/types';

export class ReadyState implements IGameState {
  enter(manager: GameManager): void {
    manager.eventBus.emit(GameEvent.GAME_RESET);
  }

  update(_manager: GameManager, _delta: number): void {
    // Idle - waiting for start signal
  }

  exit(_manager: GameManager): void {
    // Nothing to clean up
  }
}
