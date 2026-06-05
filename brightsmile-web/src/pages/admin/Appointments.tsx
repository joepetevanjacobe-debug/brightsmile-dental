import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Download, CheckCircle, XCircle, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { AdminLayout } from '../../components/layout/AdminSidebar'
import { StatusBadge } from '../../components/ui/Badge'
import { SkeletonTable } from '../../components/ui/SkeletonLoader'
import { adminApi } from '../../api/endpoints'
import { format, parseISO } from 'date-fns'

const STATUSES = ['', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']

export default function Appointments() {
  const qc = useQueryClient()
  const [page, setPage]     = useState(0)
  const [status, setStatus] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-appointments', page, status],
    queryFn: () => adminApi.appointments.list({ page, size: 20, status: status || undefined }).then(r => r.data),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, s }: { id: number; s: string }) => adminApi.appointments.updateStatus(id, s),
    onSuccess: () => { toast.success('Status updated'); qc.invalidateQueries({ queryKey: ['admin-appointments'] }) },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.appointments.delete(id),
    onSuccess: () => { toast.success('Appointment deleted'); qc.invalidateQueries({ queryKey: ['admin-appointments'] }) },
  })

  const appointments: any[] = data?.content ?? []
  const totalPages: number = data?.totalPages ?? 1

  const exportCSV = () => {
    const rows = appointments.map((a: any) =>
      [a.id, a.patientName, a.patientAge ?? '', JSON.stringify(a.patientAddress ?? ''),
       a.serviceName, a.doctorName, a.startDatetime, a.status].join(',')
    )
    const csv = ['ID,Patient,Age,Address,Service,Doctor,DateTime,Status', ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'appointments.csv'; a.click()
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="font-display text-2xl font-bold text-gray-900">Appointments</h1>
          <button onClick={exportCSV} className="btn-outline text-sm py-2">
            <Download size={15} /> Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-card shadow-card p-4 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input-field pl-9 py-2 text-sm" placeholder="Search patients…" />
          </div>
          <select className="input-field py-2 text-sm w-auto"
                  value={status} onChange={e => { setStatus(e.target.value); setPage(0) }}>
            {STATUSES.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-card shadow-card overflow-hidden">
          {isLoading ? <SkeletonTable rows={8} /> : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['#', 'Patient', 'Age', 'Address', 'Service', 'Doctor', 'Date & Time', 'Status', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {appointments.map((a: any) => (
                      <tr key={a.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-400 text-xs">#{a.id}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{a.patientName}</td>
                        <td className="px-4 py-3 text-gray-600">{a.patientAge ?? '—'}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-48 truncate" title={a.patientAddress ?? ''}>{a.patientAddress ?? '—'}</td>
                        <td className="px-4 py-3 text-gray-600">{a.serviceName}</td>
                        <td className="px-4 py-3 text-gray-600">Dr. {a.doctorName}</td>
                        <td className="px-4 py-3 text-gray-600">{format(parseISO(a.startDatetime), 'MMM d, yyyy h:mm a')}</td>
                        <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {a.status === 'PENDING' && (
                              <button onClick={() => updateMutation.mutate({ id: a.id, s: 'CONFIRMED' })}
                                      className="text-green-600 hover:text-green-800" title="Confirm">
                                <CheckCircle size={16} />
                              </button>
                            )}
                            {(a.status === 'PENDING' || a.status === 'CONFIRMED') && (
                              <button onClick={() => updateMutation.mutate({ id: a.id, s: 'CANCELLED' })}
                                      className="text-red-500 hover:text-red-700" title="Cancel">
                                <XCircle size={16} />
                              </button>
                            )}
                            {a.status === 'CONFIRMED' && (
                              <button onClick={() => updateMutation.mutate({ id: a.id, s: 'COMPLETED' })}
                                      className="text-blue-500 hover:text-blue-700" title="Mark Complete">
                                <Eye size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">Page {page + 1} of {totalPages}</p>
                <div className="flex gap-2">
                  <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
                          className="px-3 py-1.5 text-xs border border-gray-300 rounded-button disabled:opacity-40 hover:bg-gray-50">
                    Previous
                  </button>
                  <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
                          className="px-3 py-1.5 text-xs border border-gray-300 rounded-button disabled:opacity-40 hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
