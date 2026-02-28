import { EventBus } from './EventBus.js';
const bus = new EventBus('events.jsonl');
async function main() {
    // Test Zero Loop
    console.log('--- Starting Test Zero Loop ---');
    bus.subscribe('system.*', async (event) => {
        console.log(`[Subscriber] Caught event: ${event.name} with ID: ${event.id}`);
        if (event.name === 'system.ping') {
            console.log('[Subscriber] Received system.ping. Sending system.pong...');
            await bus.emit('system.pong', { response: 'pong' });
        }
        else if (event.name === 'system.pong') {
            console.log('[Subscriber] Received system.pong. Test Zero Loop completed successfully.');
            process.exit(0);
        }
    });
    console.log('[Emitter] Sending system.ping...');
    await bus.emit('system.ping', { message: 'ping' });
    // Timeout after 5 seconds
    setTimeout(() => {
        console.error('[Error] Test Zero Loop timed out.');
        process.exit(1);
    }, 5000);
}
main().catch(err => {
    console.error('[Error] Main loop failed:', err);
    process.exit(1);
});
