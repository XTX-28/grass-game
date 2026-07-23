import { EventBus } from '../core/EventBus';
import { GameEvent } from '../core/types';

export class ComboManager {
  private bus: EventBus;
  private comboCount = 0;
  private comboTimer = 0;
  private comboTimeout = 1.5; // seconds before combo resets
  private maxCombo = 0;

  constructor(bus: EventBus) {
    this.bus = bus;

    this.bus.on(GameEvent.GAME_CUT, (data: { cutCount: number }) => {
      this.addCombo(data.cutCount);
    });

    this.bus.on(GameEvent.GAME_RESET, () => {
      this.reset();
    });
  }

  private addCombo(cuts: number): void {
    this.comboCount += cuts;
    this.comboTimer = this.comboTimeout;

    if (this.comboCount > this.maxCombo) {
      this.maxCombo = this.comboCount;
    }

    this.bus.emit(GameEvent.COMBO_UPDATE, {
      combo: this.comboCount,
      multiplier: this.getMultiplier(),
    });
  }

  update(delta: number): void {
    if (this.comboCount > 0) {
      this.comboTimer -= delta;
      if (this.comboTimer <= 0) {
        this.comboCount = 0;
        this.comboTimer = 0;
        this.bus.emit(GameEvent.COMBO_RESET);
      }
    }
  }

  getMultiplier(): number {
    if (this.comboCount >= 50) return 3;
    if (this.comboCount >= 20) return 2;
    if (this.comboCount >= 10) return 1.5;
    return 1;
  }

  getCombo(): number {
    return this.comboCount;
  }

  getMaxCombo(): number {
    return this.maxCombo;
  }

  reset(): void {
    this.comboCount = 0;
    this.comboTimer = 0;
    this.maxCombo = 0;
  }
}
