import pkg from 'eventemitter2';
const { EventEmitter2 } = pkg;
import fs from 'fs/promises';
export class EventBus {
    emitter;
    eventLogPath;
    constructor(eventLogPath = 'events.jsonl') {
        this.emitter = new EventEmitter2({
            wildcard: true,
            delimiter: '.',
            maxListeners: 20,
        });
        this.eventLogPath = eventLogPath;
    }
    async emit(name, payload) {
        const event = {
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
    subscribe(pattern, handler) {
        this.emitter.on(pattern, handler);
    }
}
