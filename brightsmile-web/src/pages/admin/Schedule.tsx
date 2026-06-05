import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Clock, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { AdminLayout } from '../../components/layout/AdminSidebar'
import { adminApi } from '../../api/endpoints'

const DAYS = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY']
const DAY_LABELS: Record<string, string> = {
  MONDAY: 'Mon', TUESDAY: 'Tue', WEDNESDAY: 'Wed', THURSDAY: 'Thu',
  FRIDAY: 'Fri', SATURDAY: 'Sat', SUNDAY: 'Sun',
}

export default function Schedule() {
  const qc = useQueryClient()
  const [doctorId, setDoctorId] = useState(1) // in production select from team list
  const [blockModal, setBlockModal] = useState(false)
  const [block, setBlock] = useState({ startDatetime: '', endDatetime: '', reason: '' })

  const { data: scheduleData } = useQuery({
    queryKey: ['admin-schedule', doctorId],
    queryFn: () => adminApi.schedule.get(doctorId).then(r => r.data),
  })

  const { data: teamData } = useQuery({
    queryKey: ['admin-team'],
    queryFn: () => adminApi.team.list().then(r => r.data),
  })

  const scheduleMutation = useMutation({
    mutationFn: (entries: unknown) => adminApi.schedule.set(doctorId, entries),
    onSuccess: () => { toast.success('Schedule saved'); qc.invalidateQueries({ queryKey: ['admin-schedule'] }) },
  })

  const blockMutation = useMutation({
    mutationFn: () => adminApi.schedule.block({ doctorId, ...block }),
    onSuccess: () => { toast.success('Time blocked'); setBlockModal(false) },
  })

  const team: any[] = teamData ?? []
  const schedule: any[] = scheduleData ?? []

  const getEntry = (day: string) => schedule.find(s => s.dayOfWeek === day)
  const toggleDay = (day: string) => {
    const existing = getEntry(day)
    const updated = existing
      ? schedule.filter(s => s.dayOfWeek !== day)
      : [...schedule, { dayOfWeek: day, startTime: '09:00', endTime: '17:00', slotDurationMin: 30 }]
    scheduleMutation.mutate(updated)
  }

  const updateTime = (day: string, field: string, val: string) => {
    const updated = schedule.map(s => s.dayOfWeek === day ? { ...s, [field]: val } : s)
    scheduleMutation.mutate(updated)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="font-display text-2xl font-bold text-gray-900">Schedule Management</h1>
          <button onClick={() => setBlockModal(true)} className="btn-outline text-sm py-2">
            <Clock size={15} /> Block Time Slot
          </button>
        </div>

        {/* Doctor selector */}
        <div className="bg-white rounded-card shadow-card p-4 flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Doctor:</label>
          <select className="input-field py-2 text-sm w-auto"
                  value={doctorId} onChange={e => setDoctorId(+e.target.value)}>
            {team.map((d: any) => (
              <option key={d.id} value={d.id}>Dr. {d.user?.name} — {d.specialty}</option>
            ))}
          </select>
        </div>

        {/* Weekly schedule grid */}
        <div className="bg-white rounded-card shadow-card p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Working Hours</h2>
          <div className="space-y-3">
            {DAYS.map(day => {
              const entry = getEntry(day)
              const active = !!entry
              return (
                <div key={day} className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-colors ${active ? 'border-brand-200 bg-brand-50' : 'border-gray-100 bg-gray-50'}`}>
                  <label className="flex items-center gap-2 w-24 cursor-pointer">
                    <input type="checkbox" checked={active} onChange={() => toggleDay(day)} className="w-4 h-4 accent-brand-600" />
                    <span className={`font-medium text-sm ${active ? 'text-brand-700' : 'text-gray-400'}`}>{DAY_LABELS[day]}</span>
                  </label>
                  {active ? (
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Start</span>
                        <input type="time" className="border border-gray-300 rounded-button px-3 py-1.5 text-sm"
                               value={entry.startTime} onChange={e => updateTime(day, 'startTime', e.target.value)} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">End</span>
                        <input type="time" className="border border-gray-300 rounded-button px-3 py-1.5 text-sm"
                               value={entry.endTime} onChange={e => updateTime(day, 'endTime', e.target.value)} />
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">Not working</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Block time modal */}
      {blockModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-5">Block Time Slot</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
                <input type="datetime-local" className="input-field" value={block.startDatetime}
                       onChange={e => setBlock(b => ({ ...b, startDatetime: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End</label>
                <input type="datetime-local" className="input-field" value={block.endDatetime}
                       onChange={e => setBlock(b => ({ ...b, endDatetime: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <input className="input-field" placeholder="Lunch break, holiday…"
                       value={block.reason} onChange={e => setBlock(b => ({ ...b, reason: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setBlockModal(false)} className="btn-outline flex-1 justify-center">Cancel</button>
              <button onClick={() => blockMutation.mutate()} disabled={blockMutation.isPending} className="btn-primary flex-1 justify-center">
                {blockMutation.isPending ? 'Blocking…' : 'Block Slot'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
