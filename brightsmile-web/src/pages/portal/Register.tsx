import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { authApi } from '../../api/endpoints'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const mutation = useMutation({
    mutationFn: () => authApi.register(form),
    onSuccess: () => {
      toast.success('Account created! Please check your email to verify.')
      navigate('/login')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error ?? 'Registration failed.')
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold font-display text-xl">C</div>
            <span className="font-display font-bold text-xl text-gray-900">Confi-dent <span className="text-brand-600">Dental</span></span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-1">Create Account</h1>
          <p className="text-gray-500 text-sm">Book appointments and manage your care online</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-8">
          <form onSubmit={e => { e.preventDefault(); mutation.mutate() }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input className="input-field" placeholder="Jane Smith" value={form.name} onChange={e => update('name', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" className="input-field" placeholder="jane@example.com" value={form.email} onChange={e => update('email', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input type="password" className="input-field" placeholder="Min. 8 characters" value={form.password} onChange={e => update('password', e.target.value)} required minLength={8} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" className="input-field" placeholder="(555) 123-4567" value={form.phone} onChange={e => update('phone', e.target.value)} />
            </div>
            <button type="submit" disabled={mutation.isPending} className="btn-primary w-full justify-center mt-2">
              {mutation.isPending ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
