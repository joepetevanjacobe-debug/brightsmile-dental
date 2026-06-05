import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { AdminLayout } from '../../components/layout/AdminSidebar'
import { SkeletonTable } from '../../components/ui/SkeletonLoader'
import { adminApi } from '../../api/endpoints'

const CATEGORIES = ['COSMETIC', 'RESTORATIVE', 'PREVENTIVE', 'ORTHODONTIC', 'PEDIATRIC', 'GENERAL']

const EMPTY = { name: '', description: '', category: 'GENERAL', durationMin: 30, price: 0, icon: '', visible: true, sortOrder: 0 }

export default function Services() {
  const qc = useQueryClient()
  const [modal, setModal] = useState<{ open: boolean; editing: any | null }>({ open: false, editing: null })
  const [form, setForm]   = useState<any>(EMPTY)
  const upd = (k: string, v: unknown) => setForm((f: any) => ({ ...f, [k]: v }))

  const { data, isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: () => adminApi.services.list().then(r => r.data),
  })

  const saveMutation = useMutation({
    mutationFn: () => modal.editing ? adminApi.services.update(modal.editing.id, form) : adminApi.services.create(form),
    onSuccess: () => { toast.success('Service saved'); qc.invalidateQueries({ queryKey: ['admin-services'] }); setModal({ open: false, editing: null }) },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.services.delete(id),
    onSuccess: () => { toast.success('Service deleted'); qc.invalidateQueries({ queryKey: ['admin-services'] }) },
  })

  const openAdd = () => { setForm(EMPTY); setModal({ open: true, editing: null }) }
  const openEdit = (s: any) => { setForm({ ...s }); setModal({ open: true, editing: s }) }

  const services: any[] = data ?? []

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-gray-900">Services</h1>
          <button onClick={openAdd} className="btn-primary text-sm py-2">
            <Plus size={16} /> Add Service
          </button>
        </div>

        {isLoading ? <SkeletonTable rows={6} /> : (
          <div className="bg-white rounded-card shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Service', 'Category', 'Duration', 'Price', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {services.map((s: any) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{s.category}</td>
                      <td className="px-4 py-3 text-gray-600">{s.durationMin} min</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">₱{s.price}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${s.visible ? 'badge-confirmed' : 'badge-cancelled'}`}>
                          {s.visible ? 'Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button onClick={() => openEdit(s)} className="text-brand-600 hover:text-brand-800">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => saveMutation.mutate()} className="text-gray-400 hover:text-gray-700">
                            {s.visible ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          <button onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(s.id) }}
                                  className="text-red-400 hover:text-red-600">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-5">
              {modal.editing ? 'Edit Service' : 'Add Service'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input className="input-field" value={form.name} onChange={e => upd('name', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} className="input-field resize-none" value={form.description} onChange={e => upd('description', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="input-field" value={form.category} onChange={e => upd('category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                  <input type="number" className="input-field" value={form.durationMin} onChange={e => upd('durationMin', +e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₱)</label>
                <input type="number" step="0.01" className="input-field" value={form.price} onChange={e => upd('price', +e.target.value)} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.visible} onChange={e => upd('visible', e.target.checked)} className="w-4 h-4 accent-brand-600" />
                <span className="text-sm text-gray-700">Visible on public website</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal({ open: false, editing: null })} className="btn-outline flex-1 justify-center">Cancel</button>
              <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="btn-primary flex-1 justify-center">
                {saveMutation.isPending ? 'Saving…' : 'Save Service'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
