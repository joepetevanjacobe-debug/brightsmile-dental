import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { Lock } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const { login } = useAuth()
  const navigate   = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin/dashboard')
    } catch {
      toast.error('Invalid admin credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">Admin Login</h1>
          <p className="text-gray-400 text-sm">Confi-dent Family Dental Care Staff Portal</p>
        </div>
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input type="email" className="w-full bg-gray-700 border border-gray-600 text-white rounded-button px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-600 placeholder-gray-500"
                     placeholder="admin@confidentdentalcare.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input type="password" className="w-full bg-gray-700 border border-gray-600 text-white rounded-button px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-600 placeholder-gray-500"
                     placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-xs text-gray-600 mt-6">
            <Link to="/login" className="text-gray-400 hover:text-white">Patient portal login →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
