'use client';
import { useSwarmSimulator } from '@/lib/simulator';

export default function SimulatorProvider() {
  useSwarmSimulator();
  return null;
}
