import { EventBus } from './EventBus.js';
import { Event } from './types.js';

export type AgentStatus = 'idle' | 'busy' | 'error';

export interface AgentInfo {
  id: string;
  name: string;
  capabilities: string[];
  status: AgentStatus;
}

export class AgentInterface {
  private eventBus: EventBus;
  private registry: Map<string, AgentInfo> = new Map();

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.setupListeners();
  }

  private setupListeners() {
    this.eventBus.subscribe('agent.register', (event: Event) => {
      const info = event.payload as AgentInfo;
      this.registry.set(info.id, info);
      console.log(`Agent [${info.name}] registered (id: ${info.id})`);
    });

    this.eventBus.subscribe('agent.status.update', (event: Event) => {
      const { id, status } = event.payload;
      const agent = this.registry.get(id);
      if (agent) {
        agent.status = status;
      }
    });
  }

  async register(info: AgentInfo) {
    await this.eventBus.emit('agent.register', info);
  }

  async reportStatus(id: string, status: AgentStatus) {
    await this.eventBus.emit('agent.status.update', { id, status });
  }

  getAgent(id: string) {
    return this.registry.get(id);
  }

  listAgents() {
    return Array.from(this.registry.values());
  }
}
