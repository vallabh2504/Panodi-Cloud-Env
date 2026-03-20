'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Bot, ShieldAlert, Settings, Zap, X } from 'lucide-react';
import { useSwarmStore } from '@/store/swarmStore';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/agents', label: 'Agents', icon: Bot },
  { href: '/interventions', label: 'Interventions', icon: ShieldAlert },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const interventions = useSwarmStore((s) => s.interventions);

  return (
    <aside
      className={[
        'flex flex-col w-64 h-screen bg-gray-950 border-r border-gray-800 shrink-0',
        // Mobile: fixed drawer sliding from left
        'fixed inset-y-0 left-0 z-30 transition-transform duration-200 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none',
        // Desktop: static in flow, always visible, always interactive
        'lg:static lg:translate-x-0 lg:z-auto lg:transition-none lg:pointer-events-auto',
      ].join(' ')}
    >
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-800">
        <Zap className="text-violet-400" size={22} />
        <span className="text-white font-bold text-lg tracking-tight flex-1">SwarmOps</span>
        <button
          onClick={onClose}
          aria-label="Close navigation menu"
          className="lg:hidden text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          const badge = href === '/interventions' && interventions.length > 0 ? interventions.length : null;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-violet-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              aria-label={label}
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              {badge !== null && (
                <span className="bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-4 border-t border-gray-800">
        <p className="text-xs text-gray-600">SwarmOps v0.1.0</p>
        <p className="text-xs text-gray-700">fine-clownfish-749</p>
      </div>
    </aside>
  );
}
