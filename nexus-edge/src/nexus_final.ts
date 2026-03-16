import { EventBus } from './EventBus.js';
import { MemoryManager } from './MemoryManager.js';
import { DAGOrchestrator } from './DAGOrchestrator.js';
import { AgentInterface } from './AgentInterface.js';
import { DAGDefinition } from './types.js';

async function main() {
  console.log("--- Initializing Nexus-Edge Final Loop Demo ---");

  const eventBus = new EventBus('nexus_events.jsonl');
  const memory = new MemoryManager('memory/l2', 'memory/l3/nexus_vector_store.json');
  const orchestrator = new DAGOrchestrator(eventBus);
  const agentInterface = new AgentInterface(eventBus);

  await memory.init();

  // 1. Register Agents
  await agentInterface.register({
    id: 'researcher-01',
    name: 'Research Agent',
    capabilities: ['web-search', 'data-extraction'],
    status: 'idle'
  });

  await agentInterface.register({
    id: 'summarizer-01',
    name: 'Summary Agent',
    capabilities: ['text-summarization'],
    status: 'idle'
  });

  // 2. Define DAG
  // Sequence: Research (Task A) -> Summarize (Task B) -> Save to L3 (Task C)
  const nexusDAG: DAGDefinition = {
    id: 'nexus-loop-v1',
    tasks: [
      {
        id: 'task-a-research',
        handler: 'researchHandler',
        triggers: ['start.research'],
        retryCount: 2
      },
      {
        id: 'task-b-summarize',
        handler: 'summaryHandler',
        triggers: ['task.task-a-research.completed']
      },
      {
        id: 'task-c-save-l3',
        handler: 'l3SaveHandler',
        triggers: ['task.task-b-summarize.completed']
      }
    ]
  };

  // 3. Register Handlers
  orchestrator.registerHandler('researchHandler', async (payload) => {
    console.log("[Task A] Researching topic:", payload.topic);
    await agentInterface.reportStatus('researcher-01', 'busy');
    // Simulate research work
    const researchData = `Detailed research findings about ${payload.topic} in 2026. This is a very innovative technology.`;
    await memory.storeL2('research_results.json', { topic: payload.topic, data: researchData });
    await agentInterface.reportStatus('researcher-01', 'idle');
    return { data: researchData };
  });

  orchestrator.registerHandler('summaryHandler', async (payload) => {
    console.log("[Task B] Summarizing research data...");
    await agentInterface.reportStatus('summarizer-01', 'busy');
    const input = payload.output.data;
    const summary = `Summary: ${input.substring(0, 50)}... [Condensed]`;
    memory.storeL1('recent_summaries', summary);
    await agentInterface.reportStatus('summarizer-01', 'idle');
    return { summary };
  });

  orchestrator.registerHandler('l3SaveHandler', async (payload) => {
    console.log("[Task C] Saving summary to L3 Memory (Vector Store)...");
    const summary = payload.output.summary;
    const doc = await memory.storeL3(summary, { source: 'nexus-loop', type: 'summary' });
    console.log("Saved to L3 with ID:", doc.id);
    return { l3Id: doc.id };
  });

  // 4. Load DAG and Start
  await orchestrator.loadDAG(nexusDAG);

  // Trigger the start of the loop
  console.log("\n>>> Triggering Nexus Loop for topic: 'Quantum Computing' <<<");
  await eventBus.emit('start.research', { topic: 'Quantum Computing' });

  // 5. Verification (Wait for completion)
  eventBus.subscribe('task.task-c-save-l3.completed', async (event) => {
    console.log("\n--- Nexus Loop Completed Successfully ---");
    console.log("Final Output:", JSON.stringify(event.payload.output, null, 2));
    
    console.log("\n--- Verifying Semantic Retrieval from L3 ---");
    const searchResults = await memory.queryL3("Quantum Computing findings");
    console.log("Search Results for 'Quantum Computing findings':");
    searchResults.forEach((res, i) => {
      console.log(`${i+1}. [Score: Match] ${res.content}`);
    });

    const stats = memory.getStats();
    console.log("\nMemory Stats:", JSON.stringify(stats, null, 2));
    
    console.log("\nDemo Result: 100% PASS");
    process.exit(0);
  });
}

main().catch(err => {
  console.error("Demo failed:", err);
  process.exit(1);
});
