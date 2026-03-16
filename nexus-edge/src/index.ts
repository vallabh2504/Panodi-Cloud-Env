import { EventBus } from './EventBus.js';
import { MemoryManager } from './MemoryManager.js';

const bus = new EventBus('events.jsonl');
const memory = new MemoryManager();

async function main() {
  await memory.init();
  console.log('--- Starting Nexus-Edge with Memory Tiers ---');

  bus.subscribe('system.*', async (event) => {
    console.log(`[Subscriber] Caught event: ${event.name}`);
    
    // Store in L1 Memory
    memory.storeL1('system_events', event);

    if (event.name === 'system.ping') {
      console.log('[Subscriber] Received system.ping. Sending system.pong...');
      
      // Store intermediate state in L2
      await memory.storeL2('last_ping.json', { 
        ping_id: event.id, 
        received_at: new Date().toISOString() 
      });

      await bus.emit('system.pong', { response: 'pong' });
    } else if (event.name === 'system.pong') {
      console.log('[Subscriber] Received system.pong. Verifying Memory...');
      
      const l1 = memory.getL1('system_events');
      const l2 = await memory.readL2('last_ping.json');

      console.log(`[Memory] L1 Count: ${l1.length}`);
      console.log(`[Memory] L2 last_ping data:`, l2);

      console.log('Nexus-Edge 3-Tier Memory (L1/L2) Skeleton verified.');
      // Keep alive if DAG is running, or exit if just testing memory
      // process.exit(0);
    }
  });

  console.log('[Emitter] Sending system.ping...');
  await bus.emit('system.ping', { message: 'ping' });

  // Timeout after 10 seconds for this check
  setTimeout(() => {
    console.log('Main loop check finished.');
  }, 10000);
}

main().catch(err => {
  console.error('[Error] Main loop failed:', err);
  process.exit(1);
});

