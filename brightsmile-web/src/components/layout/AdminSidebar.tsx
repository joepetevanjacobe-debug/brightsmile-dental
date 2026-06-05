import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Calendar, Users, Stethoscope, UserCog,
  Clock, Settings, LogOut, Menu, X, ChevronRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { ThemeToggle } from '../ui/ThemeToggle'

const links = [
  { icon: LayoutDashboard, label: 'Dashboard',    to: '/admin/dashboard' },
  { icon: Calendar,        label: 'Appointments', to: '/admin/appointments' },
  { icon: Users,           label: 'Patients',     to: '/admin/patients' },
  { icon: Stethoscope,     label: 'Services',     to: '/admin/services' },
  { icon: UserCog,         label: 'Team',         to: '/admin/team' },
  { icon: Clock,           label: 'Schedule',     to: '/admin/schedule' },
  { icon: Settings,        label: 'Settings',     to: '/admin/settings' },
]

interface Props { children: React.ReactNode }

export function AdminLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center font-bold font-display">C</div>
          <div>
            <div className="font-display font-bold text-sm">Confi-dent</div>
            <div className="text-xs text-gray-400">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map(({ icon: Icon, label, to }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon size={18} />
              {label}
              {active && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-lg bg-gray-800">
          <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-sm font-bold">
            {user?.name[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{user?.name}</div>
            <div className="text-xs text-gray-400 truncate">{user?.role}</div>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-y-0 left-0 w-60 z-50 lg:hidden flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 h-14 flex items-center gap-4 sticky top-0 z-30">
          <button
            className="lg:hidden p-1.5 rounded-lg text-gray-700 hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <h1 className="text-base font-semibold text-gray-900">
            {links.find(l => location.pathname === l.to)?.label ?? 'Admin'}
          </h1>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
