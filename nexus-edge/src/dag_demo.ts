import { EventBus } from './EventBus.js';
import { DAGOrchestrator } from './DAGOrchestrator.js';
import { DAGDefinition } from './types.js';

async function runDemo() {
  console.log('--- Starting Nexus-Edge DAG Demo ---');

  const bus = new EventBus('dag_events.jsonl');
  const orchestrator = new DAGOrchestrator(bus);

  // 1. Define task handlers
  orchestrator.registerHandler('taskA_handler', async (payload: any) => {
    console.log(`[Handler] Executing Task A with payload:`, payload);
    // Simulate some work
    await new Promise(resolve => setTimeout(resolve, 500));
    return { step: 'A', data: 'Processed by A' };
  });

  orchestrator.registerHandler('taskB_handler', async (payload: any) => {
    console.log(`[Handler] Executing Task B with payload (received from Task A):`, payload);
    // Simulate some work
    await new Promise(resolve => setTimeout(resolve, 500));
    return { step: 'B', data: 'Processed by B', final: true };
  });

  // 2. Define the DAG
  const myDAG: DAGDefinition = {
    id: 'demo_dag_01',
    tasks: [
      {
        id: 'task_a',
        handler: 'taskA_handler',
        triggers: ['system.start_dag']
      },
      {
        id: 'task_b',
        handler: 'taskB_handler',
        triggers: ['task.task_a.completed'] // Triggered when task_a completes
      }
    ]
  };

  // 3. Load the DAG
  await orchestrator.loadDAG(myDAG);

  // 4. Subscribe to the final result for confirmation
  bus.subscribe('task.task_b.completed', (event) => {
    console.log(`--- [DEMO SUCCESS] DAG Finished! ---`);
    console.log(`Final Event: ${event.name}`);
    console.log(`Final Payload:`, event.payload);
    process.exit(0);
  });

  // 5. Trigger the DAG
  console.log('[Emitter] Triggering DAG with system.start_dag...');
  await bus.emit('system.start_dag', { version: '1.0.0' });

  // Timeout safety
  setTimeout(() => {
    console.error('Demo timed out!');
    process.exit(1);
  }, 5000);
}

runDemo().catch(err => {
  console.error('[Error] Demo failed:', err);
  process.exit(1);
});
