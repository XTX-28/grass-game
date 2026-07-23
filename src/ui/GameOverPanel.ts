import { EventBus } from '../core/EventBus';
import { GameEvent } from '../core/types';
import { getHighScore, setHighScore } from '../utils/storage';
import './styles/gameover.css';

export class GameOverPanel {
  private element: HTMLElement;
  private scoreEl: HTMLElement;
  private bestEl: HTMLElement;
  private btn: HTMLButtonElement;

  constructor(bus: EventBus, container: HTMLElement) {
    this.element = document.createElement('div');
    this.element.className = 'gameover-overlay hidden';
    this.element.innerHTML = `
      <div class="gameover-title">时间到!</div>
      <div class="gameover-score" id="go-score">0%</div>
      <div class="gameover-label">覆盖率</div>
      <div class="gameover-best" id="go-best"></div>
      <button class="gameover-btn" id="go-restart">再来一次</button>
    `;
    container.appendChild(this.element);

    this.scoreEl = this.element.querySelector('#go-score')!;
    this.bestEl = this.element.querySelector('#go-best')!;
    this.btn = this.element.querySelector('#go-restart')! as HTMLButtonElement;

    this.btn.addEventListener('click', () => {
      bus.emit(GameEvent.UI_RESTART);
    });

    bus.on(GameEvent.GAME_OVER, (data: { coverage: number }) => {
      this.show(data.coverage);
    });

    bus.on(GameEvent.GAME_RESET, () => {
      this.hide();
    });
  }

  show(coverage: number): void {
    this.scoreEl.textContent = `${coverage}%`;
    const best = getHighScore();
    if (coverage > best) {
      setHighScore(coverage);
      this.bestEl.textContent = '新纪录!';
    } else {
      this.bestEl.textContent = `最高纪录: ${best}%`;
    }
    this.element.classList.remove('hidden');
    this.element.classList.add('visible');
  }

  hide(): void {
    this.element.classList.remove('visible');
    this.element.classList.add('hidden');
  }
}
