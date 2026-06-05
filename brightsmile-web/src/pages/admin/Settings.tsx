import { useState } from 'react'
import toast from 'react-hot-toast'
import { Save, Bell, Mail, Clock } from 'lucide-react'
import { AdminLayout } from '../../components/layout/AdminSidebar'

export default function Settings() {
  const [clinic, setClinic] = useState({
    name: 'Confi-dent Family Dental Care',
    phone: '',
    email: 'hello@confidentdentalcare.com',
    address: 'Daet, Camarines Norte, Philippines',
  })

  const [notifications, setNotifications] = useState({
    emailOnBooking: true,
    reminder24h: true,
    reminder2h: true,
    smsEnabled: false,
  })

  const save = () => toast.success('Settings saved!')

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <h1 className="font-display text-2xl font-bold text-gray-900">Settings</h1>

        {/* Clinic info */}
        <div className="bg-white rounded-card shadow-card p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock size={18} className="text-brand-600" /> Clinic Information
          </h2>
          <div className="space-y-4">
            {[
              ['name',    'Clinic Name',    'text',  clinic.name],
              ['phone',   'Phone Number',   'tel',   clinic.phone],
              ['email',   'Contact Email',  'email', clinic.email],
              ['address', 'Address',        'text',  clinic.address],
            ].map(([key, label, type, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input type={type} className="input-field" value={value}
                       onChange={e => setClinic(c => ({ ...c, [key]: e.target.value }))} />
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-card shadow-card p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Bell size={18} className="text-brand-600" /> Notifications
          </h2>
          <div className="space-y-4">
            {[
              ['emailOnBooking', 'Email confirmation on booking'],
              ['reminder24h',    '24-hour appointment reminder'],
              ['reminder2h',     '2-hour appointment reminder'],
              ['smsEnabled',     'SMS reminders (requires Twilio config)'],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[key as keyof typeof notifications]}
                  onChange={e => setNotifications(n => ({ ...n, [key]: e.target.checked }))}
                  className="w-4 h-4 accent-brand-600"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Email templates note */}
        <div className="bg-white rounded-card shadow-card p-6">
          <h2 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Mail size={18} className="text-brand-600" /> Email Templates
          </h2>
          <p className="text-sm text-gray-600">
            Email templates are managed as Thymeleaf HTML files in the backend at
            <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded ml-1">src/main/resources/templates/email/</code>.
          </p>
          <ul className="mt-3 space-y-1 text-sm text-gray-500">
            <li>• <code className="text-xs bg-gray-100 px-1">booking-confirmation.html</code> — sent on booking</li>
            <li>• <code className="text-xs bg-gray-100 px-1">reminder.html</code> — sent 24h and 2h before</li>
            <li>• <code className="text-xs bg-gray-100 px-1">cancellation.html</code> — sent on cancellation</li>
            <li>• <code className="text-xs bg-gray-100 px-1">verify.html</code> — email verification</li>
          </ul>
        </div>

        <button onClick={save} className="btn-primary">
          <Save size={16} /> Save Settings
        </button>
      </div>
    </AdminLayout>
  )
}
