import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Award, Cpu, Heart, DollarSign, ChevronDown, ChevronUp, Star, ArrowRight
} from 'lucide-react'
import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'
import { useQuery } from '@tanstack/react-query'
import { servicesApi } from '../../api/endpoints'

/* ── Why Choose Us ── */
const features = [
  { icon: Award,      title: 'Expert Team',      desc: '20+ years of combined dental excellence with board-certified specialists.' },
  { icon: Cpu,        title: 'Modern Technology', desc: 'Digital X-rays, 3D imaging, and laser dentistry for precise, comfortable care.' },
  { icon: Heart,      title: 'Patient Comfort',   desc: 'Relaxing environment, gentle techniques, and sedation options available.' },
  { icon: DollarSign, title: 'Transparent Pricing', desc: 'Clear, upfront costs. We work with most major insurance plans.' },
]

/* ── Testimonials ── */
const testimonials = [
  { name: 'Sarah M.',   rating: 5, text: 'Absolutely the best dental experience I\'ve ever had. The team made me feel so comfortable and the results are amazing!', initials: 'SM' },
  { name: 'James R.',   rating: 5, text: 'Finally a dentist that explains everything clearly. My invisalign treatment was seamless. Highly recommend!', initials: 'JR' },
  { name: 'Linda K.',   rating: 5, text: 'My kids actually look forward to going to the dentist now. The pediatric team here is wonderful.', initials: 'LK' },
  { name: 'David P.',   rating: 5, text: 'Had a root canal and honestly it was painless. The technology here is incredible.', initials: 'DP' },
]

/* ── FAQ ── */
const faqs = [
  { q: 'How often should I visit the dentist?', a: 'We recommend visiting every 6 months for a routine check-up and cleaning. However, some patients may need more frequent visits depending on their oral health.' },
  { q: 'Do you accept dental insurance?', a: 'Yes! We accept most major dental insurance plans. Our team will work with your insurance provider to maximize your benefits.' },
  { q: 'How can I book an appointment?', a: 'You can book online 24/7 using our appointment booking system, or message us on Facebook during office hours.' },
  { q: 'What should I do in a dental emergency?', a: 'Message us immediately on our Facebook page. We reserve time slots for dental emergencies and aim to see emergency patients the same day.' },
  { q: 'Is teeth whitening safe?', a: 'Absolutely. Our professional whitening treatments are safe and effective. We use the latest techniques to minimize sensitivity.' },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        className="w-full flex items-center justify-between py-4 text-left"
        onClick={() => setOpen(o => !o)}
      >
        <span className="font-medium text-gray-900 pr-4">{q}</span>
        {open ? <ChevronUp size={18} className="text-brand-600 shrink-0" />
               : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="pb-4 text-gray-600 text-sm leading-relaxed"
        >
          {a}
        </motion.div>
      )}
    </div>
  )
}

export default function Home() {
  const [testimonialIdx, setTestimonialIdx] = useState(0)
  const { data: servicesData } = useQuery({
    queryKey: ['services'],
    queryFn: () => servicesApi.list().then(r => r.data),
  })
  const services: any[] = servicesData ?? []

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-brand-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 pt-16">
        {/* Background circles */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-brand-100 rounded-full opacity-30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gold-100 rounded-full opacity-20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
              ✨ Daet's Most Trusted Dental Clinic
            </span>
            <p className="font-display text-3xl sm:text-4xl font-bold text-brand-600 mb-5">
              Confi-dent Family Dental Care
            </p>
            <h1 className="font-display text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Your Perfect Smile<br />
              <span className="text-brand-600">Starts Here</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Experience premium, compassionate dental care with cutting-edge technology in a relaxing environment. Book your appointment today.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/book" className="btn-primary text-base px-8 py-4">
                Book Appointment <ArrowRight size={18} />
              </Link>
              <Link to="/services" className="btn-outline text-base px-8 py-4">
                Our Services
              </Link>
            </div>
            {/* Social proof */}
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-gray-200">
              {[['500+', 'Happy Patients'], ['15+', 'Years Experience'], ['98%', 'Satisfaction Rate']].map(([n, l]) => (
                <div key={l}>
                  <div className="text-2xl font-bold text-brand-600 font-display">{n}</div>
                  <div className="text-xs text-gray-500">{l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hero illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative">
              <div className="w-80 h-80 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full opacity-10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 bg-white dark:bg-slate-800 rounded-2xl shadow-card-hover flex items-center justify-center p-5">
                  <img
                    src="/tooth-mascot.png"
                    alt="Confi-dent Family Dental Care mascot"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title mb-4">Why Choose Confi-dent?</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              We combine clinical excellence with genuine warmth to deliver dental care you'll actually look forward to.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card text-center"
              >
                <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={26} className="text-brand-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Comprehensive dental care for every stage of life, delivered with precision and compassion.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((s: any, i: number) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link to={`/services/${s.id}`} className="card flex flex-col h-full group">
                  <div className="w-12 h-12 bg-brand-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand-100 transition-colors">
                    <span className="text-2xl">🦷</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{s.name}</h3>
                  <p className="text-sm text-gray-600 flex-1 line-clamp-2">{s.description}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500">{s.durationMin} min</span>
                    <span className="text-sm font-semibold text-brand-600">From ₱{s.price}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/services" className="btn-outline">View All Services <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-brand-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">What Our Patients Say</h2>
          <p className="text-brand-100 mb-12">Real reviews from real patients who trust us with their smiles.</p>
          <div className="relative">
            <motion.div
              key={testimonialIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-xl"
            >
              <div className="flex justify-center mb-4">
                {Array.from({ length: testimonials[testimonialIdx].rating }).map((_, i) => (
                  <Star key={i} size={20} className="text-gold-500 fill-gold-500" />
                ))}
              </div>
              <p className="text-gray-700 text-lg italic mb-6">"{testimonials[testimonialIdx].text}"</p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {testimonials[testimonialIdx].initials}
                </div>
                <span className="font-semibold text-gray-900">{testimonials[testimonialIdx].name}</span>
              </div>
            </motion.div>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIdx(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === testimonialIdx ? 'bg-white w-6' : 'bg-brand-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Everything you need to know about your dental care.</p>
          </div>
          <div className="divide-y divide-gray-200 bg-white rounded-2xl shadow-card p-6">
            {faqs.map(faq => <FAQItem key={faq.q} {...faq} />)}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 bg-gradient-to-r from-brand-700 to-brand-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-3">Ready for Your Best Smile?</h2>
          <p className="text-brand-100 mb-8">Book your appointment today — it takes less than 2 minutes.</p>
          <Link to="/book" className="btn-gold text-base px-10 py-4">
            Book Appointment Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
