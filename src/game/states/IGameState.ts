import type { GameManager } from '../GameManager';

export interface IGameState {
  enter(manager: GameManager): void;
  update(manager: GameManager, delta: number): void;
  exit(manager: GameManager): void;
}
