import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from 'lucide-react'

const hours = [
  { day: 'Monday – Friday', time: '8:00 AM – 6:00 PM' },
  { day: 'Saturday',        time: '9:00 AM – 4:00 PM' },
  { day: 'Sunday',          time: 'Closed' },
]

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold font-display text-lg">C</div>
              <span className="font-display font-bold text-xl text-white">Confi-dent Family Dental Care</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-5">
              Premium, compassionate dental care for the whole family. Your perfect smile starts here.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-brand-600 hover:text-white transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                ['Services', '/services'],
                ['About Us', '/about'],
                ['Our Team', '/about#team'],
                ['Contact', '/contact'],
                ['Book Appointment', '/book'],
                ['Patient Portal', '/portal'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-gray-400 hover:text-brand-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <MapPin size={16} className="text-brand-400 shrink-0 mt-0.5" />
                <span className="text-gray-400">Daet, Camarines Norte<br />Philippines</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-brand-400 shrink-0" />
                <a href="tel:+15551234567" className="text-gray-400 hover:text-white">(555) 123-4567</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-brand-400 shrink-0" />
                <a href="mailto:hello@confidentdentalcare.com" className="text-gray-400 hover:text-white">hello@confidentdentalcare.com</a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-white font-semibold mb-4">Opening Hours</h3>
            <ul className="space-y-2 text-sm">
              {hours.map((h) => (
                <li key={h.day} className="flex items-start gap-2">
                  <Clock size={14} className="text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-gray-300 font-medium">{h.day}</div>
                    <div className="text-gray-500">{h.time}</div>
                  </div>
                </li>
              ))}
            </ul>
            {/* Map embed placeholder */}
            <div className="mt-5 rounded-lg overflow-hidden h-28 bg-gray-800 flex items-center justify-center text-gray-600 text-xs">
              <MapPin size={20} className="mr-1.5" /> Map — Daet, Camarines Norte
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} Confi-dent Family Dental Care. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-400">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
