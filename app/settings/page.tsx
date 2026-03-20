'use client';
import { useSwarmStore } from '@/store/swarmStore';
import SwarmConfigRow from '@/components/SwarmConfigRow';

export default function SettingsPage() {
  const swarms = useSwarmStore((s) => s.swarms);

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Swarm Configuration</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage budgets, activation state, and kill switches per swarm.
        </p>
      </div>
      <div className="space-y-4 max-w-3xl">
        {swarms.map((swarm) => (
          <SwarmConfigRow key={swarm.id} swarm={swarm} />
        ))}
      </div>
    </div>
  );
}
