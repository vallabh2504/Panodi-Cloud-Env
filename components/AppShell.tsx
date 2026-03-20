'use client';
import { useState } from 'react';
import { Menu, Zap } from 'lucide-react';
import Sidebar from './Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 bg-gray-950 border-b border-gray-800 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
            className="text-gray-300 hover:text-white"
          >
            <Menu size={22} />
          </button>
          <Zap className="text-violet-400" size={18} />
          <span className="text-white font-bold text-base tracking-tight">SwarmOps</span>
        </div>
        {children}
      </main>
    </div>
  );
}
