import { AgentLog } from '@/types';

const SEVERITY_STYLES: Record<AgentLog['severity'], string> = {
  info:    'text-blue-400   bg-blue-900/20   border-blue-800/40',
  action:  'text-green-400  bg-green-900/20  border-green-800/40',
  thought: 'text-violet-400 bg-violet-900/20 border-violet-800/40',
  error:   'text-red-400    bg-red-900/20    border-red-800/40',
};

const SEVERITY_LABELS: Record<AgentLog['severity'], string> = {
  info: 'INFO', action: 'ACT', thought: 'THT', error: 'ERR',
};

interface Props { log: AgentLog; }

export default function LogEntry({ log }: Props) {
  const styles = SEVERITY_STYLES[log.severity];
  const time = new Date(log.timestamp).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div
      className={`flex items-start gap-3 px-3 py-2 rounded-lg border ${styles} font-mono text-xs`}
      role="listitem"
    >
      <span className="shrink-0 opacity-60 tabular-nums">{time}</span>
      <span className="shrink-0 font-bold w-8">{SEVERITY_LABELS[log.severity]}</span>
      <span className="shrink-0 text-gray-500 max-w-[100px] truncate">[{log.agentId}]</span>
      <span className="flex-1 break-all">{log.message}</span>
    </div>
  );
}
