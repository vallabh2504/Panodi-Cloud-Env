export interface Event {
    id: string;
    name: string;
    payload: any;
    timestamp: string;
}
export declare class EventBus {
    private emitter;
    private eventLogPath;
    constructor(eventLogPath?: string);
    emit(name: string, payload: any): Promise<void>;
    subscribe(pattern: string, handler: (event: Event) => void): void;
}
//# sourceMappingURL=EventBus.d.ts.map