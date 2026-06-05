import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { CheckCircle } from 'lucide-react'
import { StepIndicator } from './StepIndicator'
import { servicesApi, slotsApi, appointmentsApi } from '../../api/endpoints'
import { format } from 'date-fns'

const STEPS = ['Service', 'Date & Time', 'Your Info', 'Confirm']

interface FormData {
  serviceId: number | null
  doctorId: number | null
  date: string
  slot: string
  name: string
  email: string
  phone: string
  age: string
  address: string
  notes: string
}

const initial: FormData = {
  serviceId: null, doctorId: null,
  date: '', slot: '',
  name: '', email: '', phone: '', age: '', address: '', notes: '',
}

export function BookingForm() {
  const [step, setStep]   = useState(0)
  const [form, setForm]   = useState<FormData>(initial)
  const [done, setDone]   = useState(false)

  const { data: servicesData } = useQuery({
    queryKey: ['services'],
    queryFn: () => servicesApi.list().then(r => r.data),
  })

  const { data: slotsData, isLoading: slotsLoading } = useQuery({
    queryKey: ['slots', form.date, form.doctorId],
    queryFn: () => slotsApi.get(form.date, form.doctorId!).then(r => r.data),
    enabled: !!form.date && !!form.doctorId,
  })

  const bookMutation = useMutation({
    mutationFn: () => appointmentsApi.book({
      serviceId: form.serviceId!,
      doctorId: form.doctorId!,
      startDatetime: `${form.date}T${form.slot}`,
      guestName: form.name,
      guestEmail: form.email,
      guestPhone: form.phone,
      guestAge: form.age ? Number(form.age) : null,
      guestAddress: form.address,
      notes: form.notes,
    }),
    onSuccess: () => {
      setDone(true)
      toast.success('Appointment booked successfully!')
    },
  })

  const services: any[] = servicesData ?? []
  const slots: any[] = slotsData ?? []
  const selectedService = services.find(s => s.id === form.serviceId)

  // Hard-code first doctor for demo; in production fetch from API
  const DEMO_DOCTOR_ID = 1

  const update = (key: keyof FormData, val: unknown) =>
    setForm(f => ({ ...f, [key]: val }))

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 px-4"
      >
        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          A confirmation email has been sent to <strong>{form.email}</strong>.
        </p>
        <button onClick={() => { setDone(false); setForm(initial); setStep(0) }}
                className="btn-primary">
          Book Another
        </button>
      </motion.div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <StepIndicator steps={STEPS} current={step} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          {/* Step 0: Service */}
          {step === 0 && (
            <div>
              <h3 className="font-display text-xl font-bold text-gray-900 mb-5">Select a Service</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((s: any) => (
                  <button
                    key={s.id}
                    onClick={() => { update('serviceId', s.id); update('doctorId', DEMO_DOCTOR_ID) }}
                    className={`text-left p-4 rounded-card border-2 transition-all ${
                      form.serviceId === s.id
                        ? 'border-brand-600 bg-brand-50'
                        : 'border-gray-200 hover:border-brand-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{s.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{s.durationMin} min · ₱{s.price}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Date + Time */}
          {step === 1 && (
            <div>
              <h3 className="font-display text-xl font-bold text-gray-900 mb-5">Choose Date & Time</h3>
              <input
                type="date"
                className="input-field mb-6"
                min={format(new Date(), 'yyyy-MM-dd')}
                value={form.date}
                onChange={e => { update('date', e.target.value); update('slot', '') }}
              />
              {form.date && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Available Slots</p>
                  {slotsLoading ? (
                    <div className="grid grid-cols-3 gap-2">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="skeleton h-10 rounded-button" />
                      ))}
                    </div>
                  ) : slots.filter(s => s.available).length === 0 ? (
                    <p className="text-gray-500 text-sm">No slots available on this date. Please pick another day.</p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {slots.filter(s => s.available).map((slot: any) => {
                        const time = slot.datetime.slice(11, 16)
                        return (
                          <button
                            key={slot.datetime}
                            onClick={() => update('slot', time)}
                            className={`py-2 px-3 text-sm rounded-button border-2 transition-all ${
                              form.slot === time
                                ? 'border-brand-600 bg-brand-600 text-white'
                                : 'border-gray-200 hover:border-brand-400'
                            }`}
                          >
                            {time}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Patient info */}
          {step === 2 && (
            <div>
              <h3 className="font-display text-xl font-bold text-gray-900 mb-5">Your Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input className="input-field" placeholder="Jane Smith"
                         value={form.name} onChange={e => update('name', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input type="email" className="input-field" placeholder="jane@example.com"
                         value={form.email} onChange={e => update('email', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input type="tel" className="input-field" placeholder="(555) 123-4567"
                         value={form.phone} onChange={e => update('phone', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                  <input type="number" min={0} max={120} className="input-field" placeholder="35"
                         value={form.age} onChange={e => update('age', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <input className="input-field" placeholder="123 Main St, City"
                         value={form.address} onChange={e => update('address', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                  <textarea rows={3} className="input-field resize-none" placeholder="Any concerns or special requests..."
                            value={form.notes} onChange={e => update('notes', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div>
              <h3 className="font-display text-xl font-bold text-gray-900 mb-5">Confirm Appointment</h3>
              <div className="bg-brand-50 border border-brand-200 rounded-card p-6 space-y-3 text-sm">
                <Row label="Service"  value={selectedService?.name ?? ''} />
                <Row label="Date"     value={form.date} />
                <Row label="Time"     value={form.slot} />
                <Row label="Patient"  value={form.name} />
                <Row label="Email"    value={form.email} />
                <Row label="Phone"    value={form.phone} />
                <Row label="Age"      value={form.age} />
                <Row label="Address"  value={form.address} />
                {form.notes && <Row label="Notes" value={form.notes} />}
              </div>
              <p className="text-xs text-gray-500 mt-4">
                By booking, you agree to our cancellation policy. A confirmation email will be sent to {form.email}.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={() => setStep(s => s - 1)}
          disabled={step === 0}
          className="btn-outline disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Back
        </button>
        {step < 3 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={
              (step === 0 && !form.serviceId) ||
              (step === 1 && (!form.date || !form.slot)) ||
              (step === 2 && (!form.name || !form.email || !form.phone || !form.age || !form.address))
            }
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={() => bookMutation.mutate()}
            disabled={bookMutation.isPending}
            className="btn-gold"
          >
            {bookMutation.isPending ? 'Booking…' : 'Confirm Booking'}
          </button>
        )}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  )
}
