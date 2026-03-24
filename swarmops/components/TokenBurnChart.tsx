'use client';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TokenDataPoint } from '@/types';

interface Props {
  data: TokenDataPoint[];
}

export default function TokenBurnChart({ data }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-elevated neon-border-violet rounded-2xl p-6 shadow-lg shadow-violet-500/10"
    >
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-sm font-semibold text-gray-300 mb-4 bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent"
      >
        Token Burn Rate (Last 24h)
      </motion.h3>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(167, 139, 250, 0.1)" />
            <XAxis
              dataKey="hour"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval={3}
            />
            <YAxis
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(167, 139, 250, 0.3)',
                borderRadius: 12,
                backdropFilter: 'blur(10px)',
              }}
              labelStyle={{ color: '#a78bfa' }}
              itemStyle={{ color: '#a78bfa' }}
              formatter={(v) => [`${Number(v).toLocaleString()} tokens`, 'Burn']}
            />
            <Line
              type="monotone"
              dataKey="tokens"
              stroke="#a78bfa"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, fill: '#a78bfa', filter: 'drop-shadow(0 0 8px rgba(167, 139, 250, 0.8))' }}
              filter="drop-shadow(0 0 10px rgba(167, 139, 250, 0.3))"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}
