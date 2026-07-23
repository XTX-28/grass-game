import { EventBus } from '../core/EventBus';
import { GameEvent } from '../core/types';
import './styles/pause.css';

export class PauseButton {
  private button: HTMLButtonElement;
  private overlay: HTMLElement;

  constructor(bus: EventBus, container: HTMLElement) {
    // Pause button
    this.button = document.createElement('button');
    this.button.className = 'pause-btn hidden';
    this.button.textContent = '⏸';
    this.button.addEventListener('click', () => {
      bus.emit(GameEvent.UI_PAUSE_CLICK);
    });
    container.appendChild(this.button);

    // Pause overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'pause-overlay hidden';
    this.overlay.innerHTML = `
      <div class="pause-title">暂停</div>
      <button class="pause-resume-btn" id="pause-resume">继续游戏</button>
    `;
    container.appendChild(this.overlay);

    const resumeBtn = this.overlay.querySelector('#pause-resume')!;
    resumeBtn.addEventListener('click', () => {
      bus.emit(GameEvent.UI_PAUSE_CLICK);
    });

    bus.on(GameEvent.GAME_START, () => {
      this.button.classList.remove('hidden');
    });

    bus.on(GameEvent.GAME_RESET, () => {
      this.button.classList.add('hidden');
      this.overlay.classList.add('hidden');
    });

    bus.on(GameEvent.GAME_PAUSE, () => {
      this.overlay.classList.remove('hidden');
    });

    bus.on(GameEvent.GAME_RESUME, () => {
      this.overlay.classList.add('hidden');
    });

    // Listen for state changes via UI_PAUSE_CLICK
    bus.on(GameEvent.UI_PAUSE_CLICK, () => {
      this.overlay.classList.toggle('hidden');
    });
  }
}
