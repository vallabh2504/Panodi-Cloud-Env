import { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
}

export default function StatsCard({ title, value, subtitle, icon: Icon, iconColor = 'text-violet-400' }: Props) {
  return (
    <div className="glass-elevated neon-border-violet rounded-2xl p-6 flex flex-col gap-4 group hover:neon-glow-violet transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-300 font-semibold tracking-wide">{title}</span>
        <div className={`p-3 rounded-xl backdrop-blur-lg bg-gradient-to-br from-violet-500/20 to-violet-600/10 border border-violet-400/30 group-hover:border-violet-300/60 transition-all duration-300 ${iconColor}`}>
          <Icon size={18} className="group-hover:scale-110 transition-transform" />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-2">{subtitle}</p>}
      </div>
    </div>
  );
}
