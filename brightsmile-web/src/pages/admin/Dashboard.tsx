import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar, Users, Wallet, TrendingDown, CalendarPlus, UserPlus, Clock, X } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import toast from 'react-hot-toast'
import { AdminLayout } from '../../components/layout/AdminSidebar'
import { StatsCard } from '../../components/ui/StatsCard'
import { SkeletonCard, SkeletonTable } from '../../components/ui/SkeletonLoader'
import { StatusBadge } from '../../components/ui/Badge'
import { adminApi, servicesApi, authApi } from '../../api/endpoints'
import { format, parseISO } from 'date-fns'

const PIE_COLORS = ['#1E6FBF', '#D4A943', '#10b981', '#f59e0b', '#6366f1', '#ec4899']

const EMPTY_APPT = { serviceId: '', doctorId: '', date: '', time: '', name: '', email: '', phone: '' }
const EMPTY_PATIENT = { name: '', email: '', password: '', phone: '' }

export default function Dashboard() {
  const qc = useQueryClient()
  const [apptModal, setApptModal] = useState(false)
  const [patientModal, setPatientModal] = useState(false)
  const [apptForm, setApptForm] = useState<any>(EMPTY_APPT)
  const [patientForm, setPatientForm] = useState<any>(EMPTY_PATIENT)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminApi.dashboard.stats().then(r => r.data),
    refetchInterval: 60_000,
  })

  const { data: apptData } = useQuery({
    queryKey: ['admin-appointments-today'],
    queryFn: () => adminApi.appointments.list({ page: 0, size: 8 }).then(r => r.data),
  })

  // Data for the Add Appointment modal
  const { data: servicesData } = useQuery({
    queryKey: ['services'],
    queryFn: () => servicesApi.list().then(r => r.data),
  })
  const { data: doctorsData } = useQuery({
    queryKey: ['admin-team'],
    queryFn: () => adminApi.team.list().then(r => r.data),
  })

  const services: any[] = servicesData ?? []
  const doctors: any[] = doctorsData ?? []

  const createAppt = useMutation({
    mutationFn: () => adminApi.appointments.create({
      serviceId: Number(apptForm.serviceId),
      doctorId: Number(apptForm.doctorId),
      startDatetime: `${apptForm.date}T${apptForm.time}`,
      guestName: apptForm.name,
      guestEmail: apptForm.email,
      guestPhone: apptForm.phone,
    }),
    onSuccess: () => {
      toast.success('Appointment added!')
      qc.invalidateQueries({ queryKey: ['admin-appointments-today'] })
      qc.invalidateQueries({ queryKey: ['admin-appointments'] })
      setApptModal(false); setApptForm(EMPTY_APPT)
    },
    onError: (e: any) => toast.error(e.response?.data?.error ?? 'Could not add appointment'),
  })

  const createPatient = useMutation({
    mutationFn: () => authApi.register({
      name: patientForm.name,
      email: patientForm.email,
      password: patientForm.password,
      // backend requires 7-15 digits or no phone at all; strip spaces, omit if empty
      phone: patientForm.phone.replace(/[^0-9+]/g, '') || undefined,
    }),
    onSuccess: () => {
      toast.success('Patient added!')
      qc.invalidateQueries({ queryKey: ['admin-patients'] })
      setPatientModal(false); setPatientForm(EMPTY_PATIENT)
    },
    onError: (e: any) => toast.error(e.response?.data?.error ?? 'Could not add patient'),
  })

  const stats = data
  const recentAppts: any[] = apptData?.content ?? []

  const apptValid = apptForm.serviceId && apptForm.doctorId && apptForm.date && apptForm.time && apptForm.name && apptForm.email
  const patientValid = patientForm.name && patientForm.email && patientForm.password.length >= 8

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-0.5">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setApptModal(true)} className="btn-outline text-sm py-2 px-4">
              <CalendarPlus size={15} /> Add Appointment
            </button>
            <button onClick={() => setPatientModal(true)} className="btn-primary text-sm py-2 px-4">
              <UserPlus size={15} /> Add Patient
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Today's Appointments" value={stats?.todayAppointments ?? 0} icon={Calendar} color="brand" delay={0} />
            <StatsCard title="New Patients (Month)" value={stats?.newPatientsThisMonth ?? 0} icon={Users} color="green" delay={0.1} />
            <StatsCard title="Revenue (Month)" value={`₱${Number(stats?.totalRevenueThisMonth ?? 0).toLocaleString()}`} icon={Wallet} color="gold" delay={0.2} />
            <StatsCard title="Cancellation Rate" value={`${stats?.cancellationRate ?? 0}%`} icon={TrendingDown} color="red" delay={0.3} />
          </div>
        )}

        {/* Charts row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Line chart */}
          <div className="lg:col-span-2 bg-white rounded-card shadow-card p-6">
            <h2 className="font-semibold text-gray-900 mb-5">Appointments — Last 30 Days</h2>
            {isLoading ? (
              <div className="skeleton h-48 rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={stats?.appointmentsLast30Days ?? []}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={d => d.slice(5)} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip labelFormatter={l => `Date: ${l}`} />
                  <Line type="monotone" dataKey="count" stroke="#1E6FBF" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Donut chart */}
          <div className="bg-white rounded-card shadow-card p-6">
            <h2 className="font-semibold text-gray-900 mb-5">By Service</h2>
            {isLoading ? (
              <div className="skeleton h-48 rounded-full w-48 mx-auto" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={stats?.serviceBreakdown ?? []} dataKey="count" nameKey="serviceName" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                    {(stats?.serviceBreakdown ?? []).map((_: any, i: number) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Upcoming appointments table */}
        <div className="bg-white rounded-card shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Upcoming Appointments</h2>
            <a href="/admin/appointments" className="text-sm text-brand-600 hover:underline">View all →</a>
          </div>
          {isLoading ? (
            <SkeletonTable rows={5} />
          ) : recentAppts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Clock size={32} className="mx-auto mb-2 text-gray-300" />
              No appointments today.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Patient', 'Service', 'Doctor', 'Date & Time', 'Status'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentAppts.map((a: any) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-gray-900">{a.patientName}</td>
                      <td className="px-5 py-3.5 text-gray-600">{a.serviceName}</td>
                      <td className="px-5 py-3.5 text-gray-600">Dr. {a.doctorName}</td>
                      <td className="px-5 py-3.5 text-gray-600">{format(parseISO(a.startDatetime), 'MMM d, h:mm a')}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Add Appointment Modal ── */}
      {apptModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 my-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold text-gray-900">Add Appointment</h2>
              <button onClick={() => setApptModal(false)} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service *</label>
                <select className="input-field" value={apptForm.serviceId} onChange={e => setApptForm({ ...apptForm, serviceId: e.target.value })}>
                  <option value="">Select a service…</option>
                  {services.map((s: any) => <option key={s.id} value={s.id}>{s.name} — ₱{s.price}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor *</label>
                <select className="input-field" value={apptForm.doctorId} onChange={e => setApptForm({ ...apptForm, doctorId: e.target.value })}>
                  <option value="">Select a doctor…</option>
                  {doctors.map((d: any) => <option key={d.id} value={d.id}>Dr. {d.user?.name} {d.specialty ? `(${d.specialty})` : ''}</option>)}
                </select>
                {doctors.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">No doctors yet — add one under Team first.</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input type="date" className="input-field" min={format(new Date(), 'yyyy-MM-dd')}
                         value={apptForm.date} onChange={e => setApptForm({ ...apptForm, date: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                  <input type="time" className="input-field"
                         value={apptForm.time} onChange={e => setApptForm({ ...apptForm, time: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
                <input className="input-field" placeholder="Juan Dela Cruz"
                       value={apptForm.name} onChange={e => setApptForm({ ...apptForm, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" className="input-field" placeholder="patient@email.com"
                         value={apptForm.email} onChange={e => setApptForm({ ...apptForm, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" className="input-field" placeholder="09171234567"
                         value={apptForm.phone} onChange={e => setApptForm({ ...apptForm, phone: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setApptModal(false)} className="btn-outline flex-1 justify-center">Cancel</button>
              <button onClick={() => createAppt.mutate()} disabled={!apptValid || createAppt.isPending}
                      className="btn-primary flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed">
                {createAppt.isPending ? 'Adding…' : 'Add Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Patient Modal ── */}
      {patientModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 my-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold text-gray-900">Add Patient</h2>
              <button onClick={() => setPatientModal(false)} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input className="input-field" placeholder="Juan Dela Cruz"
                       value={patientForm.name} onChange={e => setPatientForm({ ...patientForm, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" className="input-field" placeholder="patient@email.com"
                       value={patientForm.email} onChange={e => setPatientForm({ ...patientForm, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password * <span className="text-gray-400 font-normal">(min 8 chars)</span></label>
                <input type="text" className="input-field" placeholder="temporary password"
                       value={patientForm.password} onChange={e => setPatientForm({ ...patientForm, password: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" className="input-field" placeholder="09171234567"
                       value={patientForm.phone} onChange={e => setPatientForm({ ...patientForm, phone: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setPatientModal(false)} className="btn-outline flex-1 justify-center">Cancel</button>
              <button onClick={() => createPatient.mutate()} disabled={!patientValid || createPatient.isPending}
                      className="btn-primary flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed">
                {createPatient.isPending ? 'Adding…' : 'Add Patient'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
