import { EventBus } from '../core/EventBus';
import { GameEvent } from '../core/types';
import type { Engine } from '../engine/Engine';

export class ScoreManager {
  private bus: EventBus;
  private engine: Engine;

  constructor(bus: EventBus, engine: Engine) {
    this.bus = bus;
    this.engine = engine;
  }

  getCoverage(): number {
    const field = this.engine.getGrassField();
    const total = field.getTotalCount();
    const cut = field.getCutCount();
    return total > 0 ? Math.round((cut / total) * 100) : 0;
  }

  getCutCount(): number {
    return this.engine.getGrassField().getCutCount();
  }

  getTotalCount(): number {
    return this.engine.getGrassField().getTotalCount();
  }

  emitScoreUpdate(timeLeft: number): void {
    this.bus.emit(GameEvent.SCORE_UPDATE, {
      coverage: this.getCoverage(),
      cutCount: this.getCutCount(),
      totalCount: this.getTotalCount(),
      timeLeft,
    });
  }
}
