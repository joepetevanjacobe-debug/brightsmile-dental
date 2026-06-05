import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, ArrowRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'
import { SkeletonCard } from '../../components/ui/SkeletonLoader'
import { servicesApi } from '../../api/endpoints'

const CATEGORIES = ['ALL', 'COSMETIC', 'RESTORATIVE', 'PREVENTIVE', 'ORTHODONTIC', 'PEDIATRIC', 'GENERAL']

export default function Services() {
  const [cat, setCat] = useState('ALL')

  const { data, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => servicesApi.list().then(r => r.data),
  })

  const services: any[] = data ?? []
  const filtered = cat === 'ALL' ? services : services.filter(s => s.category === cat)

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        {/* Page hero */}
        <div className="bg-gradient-to-r from-brand-700 to-brand-600 py-16 px-4 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl font-bold mb-3">Our Dental Services</h1>
            <p className="text-brand-100 max-w-lg mx-auto">
              From routine cleanings to advanced cosmetic procedures — we have everything you need for a healthy, beautiful smile.
            </p>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  cat === c
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c === 'ALL' ? 'All Services' : c.charAt(0) + c.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <motion.div
              layout
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((s: any, i: number) => (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link to={`/services/${s.id}`} className="card flex flex-col h-full group">
                    <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-100 transition-colors text-2xl">
                      🦷
                    </div>
                    <span className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-2">
                      {s.category}
                    </span>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{s.name}</h3>
                    <p className="text-sm text-gray-600 flex-1 line-clamp-3">{s.description}</p>
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                      <span className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Clock size={14} /> {s.durationMin} min
                      </span>
                      <span className="flex items-center gap-1 text-sm font-semibold text-brand-600 group-hover:gap-2 transition-all">
                        Learn More <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {!isLoading && filtered.length === 0 && (
            <p className="text-center text-gray-500 py-16">No services in this category.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
