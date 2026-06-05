import { motion } from 'framer-motion'
import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'
import { BookingForm } from '../../components/booking/BookingForm'

export default function Book() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <div className="bg-gradient-to-r from-brand-700 to-brand-600 py-14 px-4 text-white text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl font-bold mb-2">Book an Appointment</h1>
            <p className="text-brand-100">Choose your service, pick a time, and we'll handle the rest.</p>
          </motion.div>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <BookingForm />
        </div>
      </div>
      <Footer />
    </div>
  )
}
