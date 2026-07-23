import type { IGameState } from './IGameState';
import type { GameManager } from '../GameManager';

export class PausedState implements IGameState {
  enter(_manager: GameManager): void {
    // Nothing special
  }

  update(_manager: GameManager, _delta: number): void {
    // Do nothing while paused
  }

  exit(_manager: GameManager): void {
    // Nothing to clean up
  }
}
