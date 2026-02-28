# Nexus-Edge Project - Event-Driven Agentic Orchestrator

## Goal
Build a Node.js 22 + TypeScript (ESM) event-driven framework using `EventEmitter2` (wildcard support) and JSONL Event Sourcing.

## Implementation Details: 'Test Zero' Loop
1.  **Initialize EventBus:** Using `EventEmitter2`.
2.  **Event Sourcing:** Persistent storage of events in JSONL format.
3.  **Test Zero Loop:**
    -   Emitter sends a `system.ping` event.
    -   Subscriber listens to `system.*`.
    -   Subscriber receives `ping` and emits `system.pong`.
    -   All events are logged to a `.jsonl` file.

## Architecture
-   **Runtime:** Node.js 22
-   **Module System:** ESM
-   **Language:** TypeScript
-   **Event Library:** `eventemitter2`
-   **Storage:** File-based JSONL (Event Sourcing)
