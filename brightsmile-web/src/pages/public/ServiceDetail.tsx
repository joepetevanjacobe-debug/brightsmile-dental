import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Wallet, ArrowLeft, CheckCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'
import { servicesApi } from '../../api/endpoints'

const procedureSteps: Record<string, string[]> = {
  default: [
    'Initial consultation and examination',
    'Digital X-rays and diagnostics if needed',
    'Treatment procedure with local anaesthesia where required',
    'Post-treatment review and care instructions',
  ],
}

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: service, isLoading, isError } = useQuery({
    queryKey: ['service', id],
    queryFn: () => servicesApi.getOne(Number(id)).then(r => r.data),
  })

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (isError || !service) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 mb-4">Service not found.</p>
        <button onClick={() => navigate('/services')} className="btn-primary">Back to Services</button>
      </div>
    </div>
  )

  const steps = procedureSteps[service.name] ?? procedureSteps.default

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <div className="bg-gradient-to-r from-brand-700 to-brand-600 py-16 px-4 text-white">
          <div className="max-w-4xl mx-auto">
            <Link to="/services" className="flex items-center gap-2 text-brand-100 hover:text-white text-sm mb-6">
              <ArrowLeft size={16} /> Back to Services
            </Link>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full mb-4 inline-block">
                {service.category}
              </span>
              <h1 className="font-display text-4xl font-bold mb-3">{service.name}</h1>
              <p className="text-brand-100 text-lg max-w-2xl">{service.description}</p>
              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-brand-200" />
                  {service.durationMin} minutes
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Wallet size={16} className="text-brand-200" />
                  From ₱{service.price}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">What to Expect</h2>
              <div className="space-y-4">
                {steps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </motion.div>
                ))}
              </div>

              <h2 className="font-display text-2xl font-bold text-gray-900 mt-12 mb-6">Benefits</h2>
              <ul className="space-y-3">
                {['Improved oral health and hygiene', 'Enhanced confidence and appearance', 'Long-lasting results with proper care', 'Performed by experienced specialists'].map(b => (
                  <li key={b} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle size={18} className="text-green-500 shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Book CTA */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-card-hover p-6 sticky top-24">
                <h3 className="font-display text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                  <span className="flex items-center gap-1"><Clock size={14} /> {service.durationMin} min</span>
                  <span className="flex items-center gap-1"><Wallet size={14} /> ₱{service.price}</span>
                </div>
                <Link to={`/book?serviceId=${service.id}`} className="btn-primary w-full justify-center">
                  Book This Service
                </Link>
                <p className="text-xs text-gray-400 text-center mt-3">No credit card required to book</p>
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    Questions? Call us at <a href="tel:+15551234567" className="text-brand-600 font-medium">(555) 123-4567</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
