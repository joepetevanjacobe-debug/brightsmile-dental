import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'
import { contactApi } from '../../api/endpoints'

const schema = z.object({
  name:    z.string().min(2, 'Name required'),
  email:   z.string().email('Valid email required'),
  phone:   z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})
type FormData = z.infer<typeof schema>

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const mutation = useMutation({
    mutationFn: (data: FormData) => contactApi.submit(data),
    onSuccess: () => { toast.success('Message sent! We\'ll be in touch soon.'); reset() },
  })

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <div className="bg-gradient-to-r from-brand-700 to-brand-600 py-16 px-4 text-white text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl font-bold mb-3">Contact Us</h1>
            <p className="text-brand-100">We're here to help. Reach out anytime.</p>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Info sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {[
                { icon: MapPin, label: 'Address', lines: ['Daet, Camarines Norte', 'Philippines'] },
                { icon: Phone,  label: 'Phone',   lines: [''] },
                { icon: Mail,   label: 'Email',   lines: ['hello@confidentdentalcare.com'] },
              ].map(({ icon: Icon, label, lines }) => (
                <div key={label} className="flex gap-4 p-5 bg-white rounded-xl shadow-card">
                  <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
                    {lines.map(l => <p key={l} className="text-gray-900 font-medium text-sm">{l}</p>)}
                  </div>
                </div>
              ))}

              <div className="flex gap-4 p-5 bg-white rounded-xl shadow-card">
                <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center shrink-0">
                  <Clock size={20} className="text-brand-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">Hours</p>
                  {[['Mon–Fri', '8:00 AM – 6:00 PM'], ['Saturday', '9:00 AM – 4:00 PM'], ['Sunday', 'Closed']].map(([d, t]) => (
                    <div key={d} className="flex justify-between text-sm gap-6">
                      <span className="text-gray-600">{d}</span>
                      <span className="font-medium text-gray-900">{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="rounded-xl overflow-hidden shadow-card h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                <MapPin size={20} className="mr-2" /> 123 Smile Ave, NY
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-card p-8">
                <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input {...register('name')} className="input-field" placeholder="Jane Smith" />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input {...register('email')} type="email" className="input-field" placeholder="jane@example.com" />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                    <input {...register('phone')} type="tel" className="input-field" placeholder="(555) 123-4567" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <textarea {...register('message')} rows={5} className="input-field resize-none"
                              placeholder="How can we help you?" />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>
                  <button type="submit" disabled={mutation.isPending}
                          className="btn-primary w-full justify-center disabled:opacity-60">
                    {mutation.isPending
                      ? 'Sending…'
                      : mutation.isSuccess
                        ? <><CheckCircle size={16} /> Sent!</>
                        : <><Send size={16} /> Send Message</>
                    }
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
