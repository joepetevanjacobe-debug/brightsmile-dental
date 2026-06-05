import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Calendar, Clock, LogOut, CalendarPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { portalApi } from '../../api/endpoints'
import { StatusBadge } from '../../components/ui/Badge'
import { SkeletonTable } from '../../components/ui/SkeletonLoader'
import { ThemeToggle } from '../../components/ui/ThemeToggle'
import { format, parseISO } from 'date-fns'

export default function Portal() {
  const { user, logout } = useAuth()
  const qc = useQueryClient()
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')

  const { data, isLoading } = useQuery({
    queryKey: ['portal-appointments'],
    queryFn: () => portalApi.myAppointments().then(r => r.data),
  })

  const cancelMutation = useMutation({
    mutationFn: (id: number) => portalApi.cancel(id),
    onSuccess: () => {
      toast.success('Appointment cancelled.')
      qc.invalidateQueries({ queryKey: ['portal-appointments'] })
    },
  })

  const appointments: any[] = data ?? []
  const now = new Date()
  const upcoming = appointments.filter(a => new Date(a.startDatetime) >= now && a.status !== 'CANCELLED')
  const past     = appointments.filter(a => new Date(a.startDatetime) < now || a.status === 'CANCELLED')
  const shown    = activeTab === 'upcoming' ? upcoming : past

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
            <span className="font-display font-bold text-gray-900 hidden sm:block">Confi-dent Family Dental Care</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">{user?.name}</span>
            <ThemeToggle />
            <button onClick={logout} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500">
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-1">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-500 mb-8">Manage your dental appointments below.</p>
        </motion.div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link to="/book" className="bg-brand-600 text-white rounded-xl p-5 flex items-center gap-4 hover:bg-brand-700 transition-colors">
            <CalendarPlus size={24} />
            <div>
              <div className="font-semibold">Book New Appointment</div>
              <div className="text-brand-200 text-sm">Choose a service and time</div>
            </div>
          </Link>
          <div className="bg-white rounded-xl shadow-card p-5 flex items-center gap-4">
            <Calendar size={24} className="text-gold-500" />
            <div>
              <div className="font-semibold text-gray-900">{upcoming.length} Upcoming</div>
              <div className="text-gray-500 text-sm">{past.length} past appointments</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
          {(['upcoming', 'past'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'upcoming' ? `Upcoming (${upcoming.length})` : `History (${past.length})`}
            </button>
          ))}
        </div>

        {/* Appointment list */}
        {isLoading ? (
          <SkeletonTable rows={3} />
        ) : shown.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Calendar size={40} className="mx-auto mb-3 text-gray-300" />
            <p>{activeTab === 'upcoming' ? 'No upcoming appointments.' : 'No past appointments.'}</p>
            {activeTab === 'upcoming' && (
              <Link to="/book" className="btn-primary mt-4 inline-flex">Book Appointment</Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {shown.map((a: any) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-card p-5 flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
                    <Clock size={20} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{a.serviceName}</p>
                    <p className="text-sm text-gray-600">Dr. {a.doctorName}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {format(parseISO(a.startDatetime), 'EEEE, MMMM d yyyy')} at {format(parseISO(a.startDatetime), 'h:mm a')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={a.status} />
                  {a.status === 'CONFIRMED' || a.status === 'PENDING' ? (
                    <button
                      onClick={() => cancelMutation.mutate(a.id)}
                      disabled={cancelMutation.isPending}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
