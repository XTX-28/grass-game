type EventHandler = (...args: any[]) => void;

export class EventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map();

  on(event: string, handler: EventHandler): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  off(event: string, handler: EventHandler): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  emit(event: string, ...args: any[]): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(...args);
        } catch (e) {
          console.error(`EventBus error in handler for "${event}":`, e);
        }
      });
    }
  }

  once(event: string, handler: EventHandler): void {
    const wrapped = (...args: any[]) => {
      this.off(event, wrapped);
      handler(...args);
    };
    this.on(event, wrapped);
  }

  clear(): void {
    this.handlers.clear();
  }
}
