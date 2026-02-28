import { EventBus } from './EventBus.js';
import { DAGDefinition, DAGTask, TaskHandler, Event } from './types.js';

export class DAGOrchestrator {
  private eventBus: EventBus;
  private definition: DAGDefinition | null = null;
  private handlers: Map<string, TaskHandler> = new Map();
  private executingTasks: Set<string> = new Set();
  private retryCounts: Map<string, number> = new Map();

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  /**
   * Register a task handler by name.
   */
  registerHandler(name: string, handler: TaskHandler) {
    this.handlers.set(name, handler);
  }

  /**
   * Load a DAG definition and subscribe to its triggers.
   */
  async loadDAG(definition: DAGDefinition) {
    this.definition = definition;
    
    // For each task in the DAG, subscribe to its triggers
    for (const task of definition.tasks) {
      for (const trigger of task.triggers) {
        this.eventBus.subscribe(trigger, (event: Event) => {
          this.handleTrigger(task, event);
        });
      }
    }
    
    console.log(`DAG [${definition.id}] loaded with ${definition.tasks.length} tasks.`);
  }

  /**
   * Internal trigger handler.
   */
  private async handleTrigger(task: DAGTask, event: Event) {
    const executionId = `${task.id}:${event.id}`;
    
    if (this.executingTasks.has(executionId)) {
      return;
    }
    
    console.log(`Trigger [${event.name}] matched for task [${task.id}]`);
    
    const handler = this.handlers.get(task.handler);
    if (!handler) {
      console.error(`No handler found for task [${task.id}] (handler name: ${task.handler})`);
      return;
    }

    try {
      this.executingTasks.add(executionId);
      
      // Execute the handler
      const result = await handler(event.payload);
      
      // On success, reset retry count
      this.retryCounts.delete(executionId);

      // Emit completion event
      await this.eventBus.emit(`task.${task.id}.completed`, {
        taskId: task.id,
        status: 'success',
        output: result,
        triggerEventId: event.id
      });

    } catch (error: any) {
      console.error(`Task [${task.id}] failed:`, error.message);
      
      const currentRetries = this.retryCounts.get(executionId) || 0;
      const maxRetries = task.retryCount || 0;

      if (currentRetries < maxRetries) {
        this.retryCounts.set(executionId, currentRetries + 1);
        const delay = Math.pow(2, currentRetries) * 1000;
        console.log(`Retrying task [${task.id}] in ${delay}ms... (Attempt ${currentRetries + 1}/${maxRetries})`);
        
        setTimeout(() => {
          this.executingTasks.delete(executionId);
          this.handleTrigger(task, event);
        }, delay);
        
      } else {
        // Emit failure event
        await this.eventBus.emit(`task.${task.id}.failed`, {
          taskId: task.id,
          status: 'failure',
          error: error.message,
          triggerEventId: event.id
        });
        this.retryCounts.delete(executionId);
      }
    } finally {
      if (!this.retryCounts.has(executionId)) {
        this.executingTasks.delete(executionId);
      }
    }
  }
}
