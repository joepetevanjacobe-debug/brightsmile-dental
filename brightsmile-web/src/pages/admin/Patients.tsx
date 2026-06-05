import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Trash2, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { AdminLayout } from '../../components/layout/AdminSidebar'
import { SkeletonTable } from '../../components/ui/SkeletonLoader'
import { adminApi } from '../../api/endpoints'
import { format, parseISO } from 'date-fns'

export default function Patients() {
  const qc = useQueryClient()
  const [page, setPage] = useState(0)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-patients', page],
    queryFn: () => adminApi.patients.list({ page, size: 20 }).then(r => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.patients.delete(id),
    onSuccess: () => { toast.success('Patient removed'); qc.invalidateQueries({ queryKey: ['admin-patients'] }) },
  })

  const patients: any[] = data?.content ?? []
  const totalPages: number = data?.totalPages ?? 1

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Patients</h1>

        {/* Search bar */}
        <div className="bg-white rounded-card shadow-card p-4 flex gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input-field pl-9 py-2 text-sm" placeholder="Search by name, email, or phone…" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-card shadow-card overflow-hidden">
          {isLoading ? <SkeletonTable rows={8} /> : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['Patient', 'Email', 'Phone', 'Verified', 'Joined', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {patients.map((p: any) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-brand-50 rounded-full flex items-center justify-center">
                              <User size={14} className="text-brand-600" />
                            </div>
                            <span className="font-medium text-gray-900">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{p.email}</td>
                        <td className="px-4 py-3 text-gray-600">{p.phone ?? '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`badge ${p.verified ? 'badge-confirmed' : 'badge-pending'}`}>
                            {p.verified ? 'Verified' : 'Unverified'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {p.createdAt ? format(parseISO(p.createdAt), 'MMM d, yyyy') : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => { if (confirm('Delete this patient?')) deleteMutation.mutate(p.id) }}
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">Page {page + 1} of {totalPages}</p>
                <div className="flex gap-2">
                  <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
                          className="px-3 py-1.5 text-xs border border-gray-300 rounded-button disabled:opacity-40 hover:bg-gray-50">Previous</button>
                  <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
                          className="px-3 py-1.5 text-xs border border-gray-300 rounded-button disabled:opacity-40 hover:bg-gray-50">Next</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
