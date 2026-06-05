import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { AdminLayout } from '../../components/layout/AdminSidebar'
import { SkeletonCard } from '../../components/ui/SkeletonLoader'
import { adminApi } from '../../api/endpoints'

const EMPTY = { name: '', email: '', password: '', phone: '', specialty: '', bio: '', credentials: '', visible: true }

export default function Team() {
  const qc = useQueryClient()
  const [modal, setModal] = useState<{ open: boolean; editing: any | null }>({ open: false, editing: null })
  const [form, setForm]   = useState<any>(EMPTY)
  const upd = (k: string, v: unknown) => setForm((f: any) => ({ ...f, [k]: v }))

  const { data, isLoading } = useQuery({
    queryKey: ['admin-team'],
    queryFn: () => adminApi.team.list().then(r => r.data),
  })

  const saveMutation = useMutation({
    mutationFn: () => modal.editing ? adminApi.team.update(modal.editing.id, form) : adminApi.team.create(form),
    onSuccess: () => { toast.success('Team member saved'); qc.invalidateQueries({ queryKey: ['admin-team'] }); setModal({ open: false, editing: null }) },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.team.delete(id),
    onSuccess: () => { toast.success('Team member removed'); qc.invalidateQueries({ queryKey: ['admin-team'] }) },
  })

  const team: any[] = data ?? []

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-gray-900">Team</h1>
          <button onClick={() => { setForm(EMPTY); setModal({ open: true, editing: null }) }} className="btn-primary text-sm py-2">
            <Plus size={16} /> Add Member
          </button>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.map((d: any) => (
              <div key={d.id} className="bg-white rounded-card shadow-card p-5 relative">
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => { setForm({ name: d.user?.name, email: d.user?.email, phone: d.user?.phone, specialty: d.specialty, bio: d.bio, credentials: d.credentials, visible: d.visible }); setModal({ open: true, editing: d }) }}
                          className="text-gray-400 hover:text-brand-600"><Pencil size={14} /></button>
                  <button onClick={() => { if (confirm('Remove?')) deleteMutation.mutate(d.id) }}
                          className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
                <div className="w-14 h-14 bg-brand-600 rounded-full flex items-center justify-center text-white font-bold text-xl font-display mb-3">
                  {d.user?.name?.[0] ?? 'D'}
                </div>
                <h3 className="font-semibold text-gray-900">Dr. {d.user?.name}</h3>
                <p className="text-sm text-brand-600 font-medium">{d.specialty}</p>
                <p className="text-xs text-gray-500 mt-0.5">{d.credentials}</p>
                <p className="text-sm text-gray-600 mt-3 line-clamp-2">{d.bio}</p>
                <span className={`badge mt-3 ${d.visible ? 'badge-confirmed' : 'badge-cancelled'}`}>
                  {d.visible ? 'Public' : 'Hidden'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal.open && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 my-8">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-5">
              {modal.editing ? 'Edit Team Member' : 'Add Team Member'}
            </h2>
            <div className="space-y-3">
              {[['name','Full Name *','text'], ['email','Email *','email'], ['password', modal.editing ? 'Password (leave blank to keep)' : 'Password *', 'password'], ['phone','Phone','tel'], ['specialty','Specialty','text'], ['credentials','Credentials','text']].map(([k, label, type]) => (
                <div key={k}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type} className="input-field" value={form[k] ?? ''} onChange={e => upd(k, e.target.value)} />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea rows={3} className="input-field resize-none" value={form.bio ?? ''} onChange={e => upd('bio', e.target.value)} />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.visible} onChange={e => upd('visible', e.target.checked)} className="w-4 h-4 accent-brand-600" />
                <span className="text-sm text-gray-700">Show on public website</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal({ open: false, editing: null })} className="btn-outline flex-1 justify-center">Cancel</button>
              <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="btn-primary flex-1 justify-center">
                {saveMutation.isPending ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
