import type { Metadata, Viewport } from 'next';
import './globals.css';
import AppShell from '@/components/AppShell';
import SimulatorProvider from '@/components/SimulatorProvider';

export const metadata: Metadata = {
  title: 'SwarmOps Dashboard',
  description: 'Real-time AI agent swarm monitoring and control',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#00ffcc',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className="bg-gray-900 text-gray-100 min-h-screen overflow-x-hidden">
        <SimulatorProvider />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
