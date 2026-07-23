import { EventBus } from '../core/EventBus';
import { GameEvent } from '../core/types';

export class AudioManager {
  private audioContext: AudioContext | null = null;

  constructor(bus: EventBus) {
    // Initialize audio context on first user interaction
    const initAudio = () => {
      if (!this.audioContext) {
        this.audioContext = new AudioContext();
      }
    };

    bus.on(GameEvent.UI_START_CLICK, initAudio);
    bus.on(GameEvent.INPUT_START, initAudio);

    // Play cut sound when grass is cut
    bus.on(GameEvent.GAME_CUT, () => {
      this.playCutSound();
    });
  }

  private playCutSound(): void {
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Create a short "swish" sound
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // White noise-like effect using high frequency
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(800, now);
    oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.1);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, now);

    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.1);
  }
}
