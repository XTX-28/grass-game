import { EventBus } from '../core/EventBus';
import { GameEvent } from '../core/types';
import './styles/combo.css';

export class ComboDisplay {
  private element: HTMLElement;
  private comboCount: HTMLElement;
  private multiplier: HTMLElement;
  private hideTimeout: number | null = null;

  constructor(bus: EventBus, container: HTMLElement) {
    this.element = document.createElement('div');
    this.element.className = 'combo-display hidden';
    this.element.innerHTML = `
      <div class="combo-count" id="combo-count">0</div>
      <div class="combo-label">COMBO</div>
      <div class="combo-multiplier" id="combo-multiplier">x1</div>
    `;
    container.appendChild(this.element);

    this.comboCount = this.element.querySelector('#combo-count')!;
    this.multiplier = this.element.querySelector('#combo-multiplier')!;

    bus.on(GameEvent.COMBO_UPDATE, (data: { combo: number; multiplier: number }) => {
      this.show(data.combo, data.multiplier);
    });

    bus.on(GameEvent.COMBO_RESET, () => {
      this.hide();
    });

    bus.on(GameEvent.GAME_RESET, () => {
      this.hide();
    });
  }

  show(combo: number, multiplier: number): void {
    this.comboCount.textContent = combo.toString();
    this.multiplier.textContent = `x${multiplier}`;
    this.element.classList.remove('hidden');
    this.element.classList.add('visible');

    // Add pulse animation
    this.element.classList.remove('pulse');
    void this.element.offsetWidth; // trigger reflow
    this.element.classList.add('pulse');

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }

  hide(): void {
    this.element.classList.remove('visible');
    this.element.classList.add('hidden');
  }
}
