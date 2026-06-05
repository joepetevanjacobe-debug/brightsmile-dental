import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { ThemeToggle } from '../ui/ThemeToggle'

const navLinks = [
  { label: 'Services', to: '/services' },
  { label: 'About',    to: '/about' },
  { label: 'Contact',  to: '/contact' },
]

export function Navbar() {
  const [isOpen,    setIsOpen]    = useState(false)
  const [scrolled,  setScrolled]  = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setIsOpen(false) }, [location.pathname])

  return (
    <>
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center text-white font-display font-bold text-lg">C</div>
            <span className="font-display font-bold text-xl text-gray-900 hidden sm:block">
              Confi-dent <span className="text-brand-600">Dental</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm font-medium transition-colors duration-150 ${
                  location.pathname.startsWith(l.to)
                    ? 'text-brand-600'
                    : 'text-gray-600 hover:text-brand-600'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA cluster */}
          <div className="hidden md:flex items-center gap-3">
            <a href="https://www.facebook.com/confidentfamilydentalcare" target="_blank" rel="noreferrer"
               className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-brand-600 transition-colors">
              <Phone size={15} />
              Contact Us
            </a>
            {user ? (
              <div className="flex items-center gap-3">
                <Link to={user.role === 'PATIENT' ? '/portal' : '/admin/dashboard'}
                      className="text-sm font-medium text-gray-700 hover:text-brand-600">
                  {user.name}
                </Link>
                <button onClick={logout} className="text-sm text-gray-500 hover:text-red-500">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-brand-600">Login</Link>
            )}
            <ThemeToggle />
            <Link to="/book" className="btn-primary text-sm px-5 py-2.5">Book Appointment</Link>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-200"
                    onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>
    </header>

      {/* Mobile drawer — sibling of header (not a child), so it is positioned
          against the viewport. Inside the backdrop-blur header it would be clipped
          to the 64px bar and let page content bleed through. */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 top-16 bg-white z-40 flex flex-col p-6 gap-6 overflow-y-auto md:hidden"
          >
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to}
                    className="text-lg font-medium text-gray-800 border-b border-gray-100 pb-4">
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to={user.role === 'PATIENT' ? '/portal' : '/admin/dashboard'}
                      className="text-lg font-medium text-brand-600">My Account</Link>
                <button onClick={logout} className="text-left text-lg text-red-500">Logout</button>
              </>
            ) : (
              <Link to="/login" className="text-lg font-medium text-gray-800 border-b border-gray-100 pb-4">Login</Link>
            )}
            <Link to="/book" className="btn-primary justify-center mt-2">Book Appointment</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
