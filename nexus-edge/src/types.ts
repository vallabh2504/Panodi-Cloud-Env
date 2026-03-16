export interface Event {
  id: string;
  name: string;
  payload: any;
  timestamp: string;
}

export type TaskHandler = (payload: any) => Promise<any> | any;

export interface DAGTask {
  id: string;
  handler: string; // Name of the handler function or script reference
  triggers: string[]; // Event patterns that trigger this task
  retryCount?: number; // Max retries for this task
}

export interface DAGDefinition {
  id: string;
  tasks: DAGTask[];
}

export interface TaskResult {
  taskId: string;
  status: 'success' | 'failure';
  output?: any;
  error?: string;
  triggerEventId: string;
}
