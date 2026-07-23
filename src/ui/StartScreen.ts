import { EventBus } from '../core/EventBus';
import { GameEvent } from '../core/types';
import './styles/start.css';

export class StartScreen {
  private element: HTMLElement;

  constructor(bus: EventBus, container: HTMLElement) {
    this.element = document.createElement('div');
    this.element.className = 'start-screen';
    this.element.innerHTML = `
      <div class="start-title">割草大作战</div>
      <div class="start-subtitle">滑动屏幕，割尽所有草地</div>
      <button class="start-btn" id="start-btn">开始游戏</button>
      <div class="start-hint">在 60 秒内尽可能多地割草</div>
    `;
    container.appendChild(this.element);

    const btn = this.element.querySelector('#start-btn')!;
    btn.addEventListener('click', () => {
      bus.emit(GameEvent.UI_START_CLICK);
    });

    bus.on(GameEvent.GAME_START, () => {
      this.hide();
    });

    bus.on(GameEvent.GAME_RESET, () => {
      this.show();
    });
  }

  show(): void {
    this.element.classList.remove('hidden');
  }

  hide(): void {
    this.element.classList.add('hidden');
  }
}
