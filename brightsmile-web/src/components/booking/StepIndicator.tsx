import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface Props {
  steps: string[]
  current: number
}

export function StepIndicator({ steps, current }: Props) {
  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map((label, i) => {
        const done   = i < current
        const active = i === current
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  backgroundColor: done ? '#16a34a' : active ? '#1E6FBF' : '#e5e7eb',
                  scale: active ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
              >
                {done ? <Check size={16} /> : i + 1}
              </motion.div>
              <span className={`mt-1.5 text-xs font-medium hidden sm:block ${
                active ? 'text-brand-600' : done ? 'text-green-600' : 'text-gray-400'
              }`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="h-0.5 w-12 sm:w-20 mx-1 sm:mx-2 mt-0 sm:-mt-5 rounded-full overflow-hidden bg-gray-200">
                <motion.div
                  className="h-full bg-brand-600"
                  initial={{ width: '0%' }}
                  animate={{ width: done ? '100%' : '0%' }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
