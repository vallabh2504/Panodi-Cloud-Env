'use client';
import { useState } from 'react';
import { Intervention } from '@/types';
import { useSwarmStore } from '@/store/swarmStore';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const RISK_STYLES: Record<Intervention['riskLevel'], string> = {
  low:    'text-blue-400  border-blue-800  bg-blue-900/10',
  medium: 'text-amber-400 border-amber-800 bg-amber-900/10',
  high:   'text-red-400   border-red-800   bg-red-900/10',
};

interface Props { intervention: Intervention; }

export default function InterventionCard({ intervention: iv }: Props) {
  const [guidance, setGuidance] = useState('');
  const approveIntervention = useSwarmStore((s) => s.approveIntervention);
  const rejectIntervention = useSwarmStore((s) => s.rejectIntervention);

  const elapsed = Math.floor((Date.now() - iv.timestamp) / 1000);
  const elapsedStr = elapsed < 60 ? `${elapsed}s ago` : `${Math.floor(elapsed / 60)}m ago`;

  return (
    <div className={`rounded-xl border p-5 space-y-4 ${RISK_STYLES[iv.riskLevel]}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertTriangle
              size={16}
              className={iv.riskLevel === 'high' ? 'text-red-400' : iv.riskLevel === 'medium' ? 'text-amber-400' : 'text-blue-400'}
            />
            <span className="font-semibold text-white text-sm">{iv.agentName}</span>
            <span className="text-xs text-gray-500">· {iv.swarmId}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${RISK_STYLES[iv.riskLevel]}`}>
              {iv.riskLevel.toUpperCase()} RISK
            </span>
          </div>
          <p className="text-xs text-gray-400">{iv.description}</p>
        </div>
        <span className="text-xs text-gray-600 shrink-0 tabular-nums">{elapsedStr}</span>
      </div>

      {/* Pending action */}
      <div className="bg-gray-950 border border-gray-800 rounded-lg p-3 font-mono text-xs text-green-400">
        <span className="text-gray-600 mr-2">$</span>
        {iv.pendingAction}
      </div>

      {/* Controls */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Optional: provide corrected guidance for the agent..."
          value={guidance}
          onChange={(e) => setGuidance(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none"
          aria-label={`Corrected guidance for ${iv.agentName}`}
        />
        <div className="flex gap-3">
          <button
            onClick={() => approveIntervention(iv.id, guidance)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-700 hover:bg-green-600 text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label={`Approve action for ${iv.agentName}`}
          >
            <CheckCircle size={15} /> Approve
          </button>
          <button
            onClick={() => rejectIntervention(iv.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-800 hover:bg-red-700 text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label={`Reject action for ${iv.agentName}`}
          >
            <XCircle size={15} /> Reject
          </button>
        </div>
      </div>
    </div>
  );
}
