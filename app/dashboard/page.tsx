'use client';
import { useSwarmStore } from '@/store/swarmStore';
import StatsCard from '@/components/StatsCard';
import TokenBurnChart from '@/components/TokenBurnChart';
import { Bot, DollarSign, Zap, Layers } from 'lucide-react';

export default function DashboardPage() {
  const metrics = useSwarmStore((s) => s.metrics);
  const interventions = useSwarmStore((s) => s.interventions);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Control Plane</h1>
        <p className="text-gray-400 text-sm mt-1">Real-time overview of all active swarms and agents.</p>
      </div>

      {interventions.length > 0 && (
        <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-4 flex items-center gap-3">
          <span className="text-amber-400 font-semibold text-sm">
            ⚠ {interventions.length} intervention{interventions.length > 1 ? 's' : ''} require your attention.
          </span>
          <a href="/interventions" className="text-amber-300 underline text-sm hover:text-amber-200">
            Review now →
          </a>
        </div>
      )}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Active Agents"
          value={metrics.activeAgents}
          subtitle={`Across ${metrics.activeSwarms} swarms`}
          icon={Bot}
          iconColor="text-green-400"
        />
        <StatsCard
          title="Tokens Today"
          value={metrics.totalTokensToday.toLocaleString()}
          subtitle="Cumulative token usage"
          icon={Zap}
          iconColor="text-violet-400"
        />
        <StatsCard
          title="Monthly Tokens"
          value={`${(metrics.totalTokensMonth / 1_000_000).toFixed(2)}M`}
          subtitle="Rolling 30-day total"
          icon={Layers}
          iconColor="text-blue-400"
        />
        <StatsCard
          title="Cost Today"
          value={`$${metrics.totalCostToday.toFixed(2)}`}
          subtitle="Estimated API cost"
          icon={DollarSign}
          iconColor="text-emerald-400"
        />
      </div>

      <TokenBurnChart data={metrics.tokenBurnHistory} />
    </div>
  );
}
