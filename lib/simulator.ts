'use client';
import { useEffect } from 'react';
import { useSwarmStore } from '@/store/swarmStore';
import { generateLog } from '@/lib/mockData';

export function useSwarmSimulator() {
  const pushLog = useSwarmStore((s) => s.pushLog);
  const updateMetric = useSwarmStore((s) => s.updateMetric);

  useEffect(() => {
    const interval = setInterval(() => {
      const log = generateLog();
      pushLog(log);
      const tokenDelta = Math.floor(50 + Math.random() * 300);
      updateMetric({ tokens: tokenDelta, cost: parseFloat((tokenDelta * 0.000003).toFixed(6)) });
    }, 1200);

    return () => clearInterval(interval);
  }, [pushLog, updateMetric]);
}
