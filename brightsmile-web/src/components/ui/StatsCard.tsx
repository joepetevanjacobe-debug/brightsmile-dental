import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface Props {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
  color?: string
  delay?: number
}

export function StatsCard({ title, value, icon: Icon, trend, trendUp, color = 'brand', delay = 0 }: Props) {
  const colorMap: Record<string, string> = {
    brand: 'bg-brand-50 text-brand-600',
    gold:  'bg-amber-50 text-amber-600',
    green: 'bg-green-50 text-green-600',
    red:   'bg-red-50 text-red-600',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white rounded-card shadow-card p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className={`text-xs mt-2 font-medium ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color] ?? colorMap.brand}`}>
          <Icon size={22} />
        </div>
      </div>
    </motion.div>
  )
}
