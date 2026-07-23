import { EventBus } from '../core/EventBus';
import { GameEvent } from '../core/types';
import { screenToWorld } from '../utils/math';
import type { Engine } from '../engine/Engine';

export class InputHandler {
  private bus: EventBus;
  private engine: Engine;
  private isDown = false;
  private boundOnPointerDown: (e: PointerEvent) => void;
  private boundOnPointerMove: (e: PointerEvent) => void;
  private boundOnPointerUp: (e: PointerEvent) => void;

  constructor(bus: EventBus, engine: Engine) {
    this.bus = bus;
    this.engine = engine;

    this.boundOnPointerDown = this.onPointerDown.bind(this);
    this.boundOnPointerMove = this.onPointerMove.bind(this);
    this.boundOnPointerUp = this.onPointerUp.bind(this);

    const canvas = engine.getCanvas();
    canvas.addEventListener('pointerdown', this.boundOnPointerDown);
    canvas.addEventListener('pointermove', this.boundOnPointerMove);
    canvas.addEventListener('pointerup', this.boundOnPointerUp);
    canvas.addEventListener('pointerleave', this.boundOnPointerUp);
  }

  private getWorldCoord(e: PointerEvent): { x: number; z: number } | null {
    const canvas = this.engine.getCanvas();
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const { width, height } = this.engine.getContainerSize();
    return screenToWorld(clientX, clientY, this.engine.getCamera(), width, height);
  }

  private onPointerDown(e: PointerEvent): void {
    this.isDown = true;
    const coord = this.getWorldCoord(e);
    if (coord) {
      this.bus.emit(GameEvent.INPUT_START, coord);
      this.bus.emit(GameEvent.INPUT_MOVE, coord);
    }
  }

  private onPointerMove(e: PointerEvent): void {
    if (!this.isDown) return;
    const coord = this.getWorldCoord(e);
    if (coord) {
      this.bus.emit(GameEvent.INPUT_MOVE, coord);
    }
  }

  private onPointerUp(_e: PointerEvent): void {
    this.isDown = false;
    this.bus.emit(GameEvent.INPUT_END);
  }

  dispose(): void {
    const canvas = this.engine.getCanvas();
    canvas.removeEventListener('pointerdown', this.boundOnPointerDown);
    canvas.removeEventListener('pointermove', this.boundOnPointerMove);
    canvas.removeEventListener('pointerup', this.boundOnPointerUp);
    canvas.removeEventListener('pointerleave', this.boundOnPointerUp);
  }
}
