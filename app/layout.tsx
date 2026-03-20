import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import SimulatorProvider from '@/components/SimulatorProvider';

export const metadata: Metadata = {
  title: 'SwarmOps Dashboard',
  description: 'Real-time AI agent swarm monitoring and control',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-100 min-h-screen">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <SimulatorProvider />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
