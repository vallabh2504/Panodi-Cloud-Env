import { motion } from 'framer-motion';
import { AgentLog } from '@/types';

const SEVERITY_STYLES: Record<AgentLog['severity'], string> = {
  info:    'border-blue-500/40 bg-blue-500/10 text-blue-300 shadow-lg shadow-blue-500/20',
  action:  'border-green-500/40 bg-green-500/10 text-green-300 shadow-lg shadow-green-500/20',
  thought: 'border-violet-500/40 bg-violet-500/10 text-violet-300 shadow-lg shadow-violet-500/20',
  error:   'border-red-500/40 bg-red-500/10 text-red-300 shadow-lg shadow-red-500/20',
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
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-start gap-3 px-4 py-2.5 rounded-lg border backdrop-blur-xl font-mono text-xs transition-all ${styles}`}
      role="listitem"
      whileHover={{ scale: 1.01, backdropFilter: 'blur(20px)' }}
    >
      <span className="shrink-0 opacity-70 tabular-nums text-gray-400">{time}</span>
      <span className="shrink-0 font-bold w-8 text-white">{SEVERITY_LABELS[log.severity]}</span>
      <span className="shrink-0 text-gray-500 max-w-[100px] truncate">[{log.agentId}]</span>
      <span className="flex-1 break-all">{log.message}</span>
    </motion.div>
  );
}
