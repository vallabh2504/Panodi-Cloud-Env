'use client';
import { useState } from 'react';
import { Swarm } from '@/types';
import { useSwarmStore } from '@/store/swarmStore';

interface Props { swarm: Swarm; }

export default function SwarmConfigRow({ swarm }: Props) {
  const setSwarmActive = useSwarmStore((s) => s.setSwarmActive);
  const setSwarmKillSwitch = useSwarmStore((s) => s.setSwarmKillSwitch);
  const setSwarmBudget = useSwarmStore((s) => s.setSwarmBudget);
  const [budget, setBudget] = useState(swarm.tokenBudget.toString());

  const budgetPct = Math.min(100, (swarm.tokensUsed / swarm.tokenBudget) * 100);
  const barColor = budgetPct > 90 ? 'bg-red-500' : budgetPct > 70 ? 'bg-amber-500' : 'bg-violet-500';

  const saveBudget = () => {
    const v = parseInt(budget, 10);
    if (!isNaN(v) && v > 0) setSwarmBudget(swarm.id, v);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-sm">{swarm.name}</h3>
          <p className="text-xs text-gray-500 font-mono">{swarm.id}</p>
        </div>
        <div className="flex items-center gap-5">
          {/* Active toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Active</span>
            <button
              role="switch"
              aria-checked={swarm.active}
              aria-label={`Toggle ${swarm.name} active`}
              onClick={() => setSwarmActive(swarm.id, !swarm.active)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 ${swarm.active ? 'bg-violet-600' : 'bg-gray-700'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${swarm.active ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          {/* Kill switch */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-400 font-medium">Kill Switch</span>
            <button
              role="switch"
              aria-checked={swarm.killSwitch}
              aria-label={`Kill switch for ${swarm.name}`}
              onClick={() => setSwarmKillSwitch(swarm.id, !swarm.killSwitch)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 ${swarm.killSwitch ? 'bg-red-600' : 'bg-gray-700'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${swarm.killSwitch ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Budget bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Token Budget Usage</span>
          <span className="tabular-nums">{swarm.tokensUsed.toLocaleString()} / {swarm.tokenBudget.toLocaleString()}</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.round(budgetPct)} aria-valuemin={0} aria-valuemax={100}>
          <div
            className={`h-full ${barColor} rounded-full transition-all duration-500`}
            style={{ width: `${budgetPct}%` }}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveBudget()}
            className="bg-gray-800 border border-gray-700 text-gray-200 text-xs rounded-lg px-3 py-1.5 w-40 focus:ring-1 focus:ring-violet-500 outline-none tabular-nums"
            aria-label={`Token budget for ${swarm.name}`}
            min={1}
          />
          <button
            onClick={saveBudget}
            className="text-xs px-3 py-1.5 bg-violet-700 hover:bg-violet-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            Save Budget
          </button>
          <span className="text-xs text-gray-600 ml-1">{budgetPct.toFixed(1)}% used</span>
        </div>
      </div>
    </div>
  );
}
