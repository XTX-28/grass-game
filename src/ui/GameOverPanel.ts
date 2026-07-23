import { EventBus } from '../core/EventBus';
import { GameEvent } from '../core/types';
import { getHighScore, setHighScore } from '../utils/storage';
import { GAME_CONFIG } from '../config/game.config';
import './styles/gameover.css';

export class GameOverPanel {
  private element: HTMLElement;
  private scoreEl: HTMLElement;
  private bestEl: HTMLElement;
  private starsEl: HTMLElement;
  private comboEl: HTMLElement;
  private btn: HTMLButtonElement;

  constructor(bus: EventBus, container: HTMLElement) {
    this.element = document.createElement('div');
    this.element.className = 'gameover-overlay hidden';
    this.element.innerHTML = `
      <div class="gameover-title">时间到!</div>
      <div class="gameover-stars" id="go-stars"></div>
      <div class="gameover-score" id="go-score">0%</div>
      <div class="gameover-label">覆盖率</div>
      <div class="gameover-combo" id="go-combo"></div>
      <div class="gameover-best" id="go-best"></div>
      <button class="gameover-btn" id="go-restart">再来一次</button>
    `;
    container.appendChild(this.element);

    this.scoreEl = this.element.querySelector('#go-score')!;
    this.bestEl = this.element.querySelector('#go-best')!;
    this.starsEl = this.element.querySelector('#go-stars')!;
    this.comboEl = this.element.querySelector('#go-combo')!;
    this.btn = this.element.querySelector('#go-restart')! as HTMLButtonElement;

    this.btn.addEventListener('click', () => {
      bus.emit(GameEvent.UI_RESTART);
    });

    bus.on(GameEvent.GAME_OVER, (data: { coverage: number; maxCombo: number }) => {
      this.show(data.coverage, data.maxCombo);
    });

    bus.on(GameEvent.GAME_RESET, () => {
      this.hide();
    });
  }

  private getStars(coverage: number): string {
    const t = GAME_CONFIG.starThresholds;
    if (coverage >= t.threeStar) return '⭐⭐⭐';
    if (coverage >= t.twoStar) return '⭐⭐';
    if (coverage >= t.oneStar) return '⭐';
    return '';
  }

  show(coverage: number, maxCombo: number): void {
    this.scoreEl.textContent = `${coverage}%`;
    this.starsEl.textContent = this.getStars(coverage);

    if (maxCombo > 0) {
      this.comboEl.textContent = `最高连击: ${maxCombo}`;
    } else {
      this.comboEl.textContent = '';
    }

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
