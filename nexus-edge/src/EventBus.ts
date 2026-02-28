import pkg from 'eventemitter2';
const { EventEmitter2 } = pkg;
type EventEmitter2Type = pkg.EventEmitter2;
import fs from 'fs/promises';
import path from 'path';

export interface Event {
  id: string;
  name: string;
  payload: any;
  timestamp: string;
}

export class EventBus {
  private emitter: EventEmitter2Type;
  private eventLogPath: string;

  constructor(eventLogPath: string = 'events.jsonl') {
    this.emitter = new EventEmitter2({
      wildcard: true,
      delimiter: '.',
      maxListeners: 20,
    }) as EventEmitter2Type;
    this.eventLogPath = eventLogPath;
  }

  async emit(name: string, payload: any) {
    const event: Event = {
      id: crypto.randomUUID(),
      name,
      payload,
      timestamp: new Date().toISOString(),
    };

    // Event Sourcing: Persist to JSONL
    await fs.appendFile(this.eventLogPath, JSON.stringify(event) + '\n');

    // Emit to listeners
    this.emitter.emit(name, event);
  }

  subscribe(pattern: string, handler: (event: Event) => void) {
    this.emitter.on(pattern, handler);
  }
}
