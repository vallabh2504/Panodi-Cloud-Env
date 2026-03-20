'use client';
import { useSwarmStore } from '@/store/swarmStore';
import InterventionCard from '@/components/InterventionCard';
import { ShieldCheck } from 'lucide-react';

export default function InterventionsPage() {
  const interventions = useSwarmStore((s) => s.interventions);

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Human-in-the-Loop</h1>
        <p className="text-gray-400 text-sm mt-1">
          Agents paused and awaiting your approval before executing risky actions.
        </p>
      </div>

      {interventions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-600">
          <ShieldCheck size={40} />
          <p className="text-sm">No pending interventions. All agents are running autonomously.</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {interventions.map((iv) => (
            <InterventionCard key={iv.id} intervention={iv} />
          ))}
        </div>
      )}
    </div>
  );
}
