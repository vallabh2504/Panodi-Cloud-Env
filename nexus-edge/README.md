# Nexus-Edge Orchestrator

An event-driven, DAG-based framework for orchestrating autonomous agents with multi-tier memory.

## Architecture

1.  **EventBus:** Wildcard-supported event emitter with JSONL persistence (Event Sourcing).
2.  **DAG Orchestrator:** Dynamic task execution based on event patterns, supporting retries and branching.
3.  **3-Tier Memory:**
    -   **L1 (In-Memory):** Ephemeral context cache.
    -   **L2 (Scratchpad):** Local file-based storage for task outputs.
    -   **L3 (Vector Store):** Semantic retrieval via a JSON-based vector store for long-term knowledge.
4.  **Agent Interface:** Standardized registry and status reporting for external agents.

## Getting Started

### Prerequisites

- Node.js 22+
- npm

### Installation

```bash
npm install
```

### Running the Demo

To run the complete Nexus Loop (Research -> Summarize -> Save to L3):

```bash
npm run nexus
```

## Usage

### Defining a DAG

```typescript
const myDAG = {
  id: 'my-workflow',
  tasks: [
    {
      id: 'task-1',
      handler: 'handlerName',
      triggers: ['event.pattern'],
      retryCount: 3
    },
    // ...
  ]
};
```

### Registering Handlers

```typescript
orchestrator.registerHandler('handlerName', async (payload) => {
  // Your logic here
  return { result: 'data' };
});
```

### Accessing Memory

```typescript
// L1
memory.storeL1('key', data);

// L2
await memory.storeL2('filename.json', data);

// L3
await memory.storeL3('content text', { metadata: 'info' });
const results = await memory.queryL3('query terms');
```

## License

ISC
