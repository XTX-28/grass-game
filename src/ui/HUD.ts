import { EventBus } from '../core/EventBus';
import { GameEvent } from '../core/types';
import './styles/hud.css';

export class HUD {
  private element: HTMLElement;
  private timeValue: HTMLElement;
  private coverageValue: HTMLElement;
  private progressBar: HTMLElement;

  constructor(bus: EventBus, container: HTMLElement) {
    this.element = document.createElement('div');
    this.element.className = 'hud';
    this.element.innerHTML = `
      <div class="hud-item">
        <span class="hud-label">时间</span>
        <span class="hud-value" id="hud-time">60</span>
      </div>
      <div class="hud-item">
        <span class="hud-label">覆盖率</span>
        <span class="hud-value" id="hud-coverage">0%</span>
        <div class="hud-progress">
          <div class="hud-progress-bar" id="hud-progress"></div>
        </div>
      </div>
    `;
    container.appendChild(this.element);

    this.timeValue = this.element.querySelector('#hud-time')!;
    this.coverageValue = this.element.querySelector('#hud-coverage')!;
    this.progressBar = this.element.querySelector('#hud-progress')!;

    bus.on(GameEvent.GAME_TICK, (data: { timeLeft: number }) => {
      this.timeValue.textContent = Math.ceil(data.timeLeft).toString();
    });

    bus.on(GameEvent.SCORE_UPDATE, (data: { coverage: number }) => {
      this.coverageValue.textContent = `${data.coverage}%`;
      this.progressBar.style.width = `${data.coverage}%`;
    });

    bus.on(GameEvent.GAME_START, () => {
      this.element.classList.remove('hidden');
    });

    bus.on(GameEvent.GAME_RESET, () => {
      this.timeValue.textContent = '60';
      this.coverageValue.textContent = '0%';
      this.progressBar.style.width = '0%';
    });
  }

  show(): void {
    this.element.classList.remove('hidden');
  }

  hide(): void {
    this.element.classList.add('hidden');
  }
}
