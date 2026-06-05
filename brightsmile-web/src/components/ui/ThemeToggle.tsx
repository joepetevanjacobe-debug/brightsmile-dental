import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

interface Props {
  /** Use on dark backgrounds (e.g. admin sidebar) for correct contrast. */
  onDark?: boolean
  className?: string
}

export function ThemeToggle({ onDark = false, className = '' }: Props) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  const base = onDark
    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
    : 'text-gray-600 hover:text-brand-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${base} ${className}`}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
