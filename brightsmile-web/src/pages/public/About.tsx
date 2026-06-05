import { motion } from 'framer-motion'
import { Heart, Award, Users, Smile } from 'lucide-react'
import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'

const team = [
  { name: 'Dr. Sarah Johnson', specialty: 'General & Cosmetic Dentistry', credentials: 'DDS, NYU College of Dentistry', initials: 'SJ', bio: '15 years of experience transforming smiles with a gentle, patient-first approach.' },
  { name: 'Dr. Michael Chen',  specialty: 'Orthodontics',                credentials: 'DMD, MS Orthodontics, Columbia',  initials: 'MC', bio: 'Specializes in Invisalign and traditional braces for teens and adults.' },
  { name: 'Dr. Priya Patel',   specialty: 'Pediatric Dentistry',         credentials: 'DDS, MS Pediatrics, NYU',         initials: 'PP', bio: 'A child-friendly approach that makes dental visits fun and stress-free for kids.' },
  { name: 'Dr. James Rivera',  specialty: 'Oral Surgery & Implants',     credentials: 'DMD, Fellowship in Implantology',  initials: 'JR', bio: 'Expert in dental implants, extractions, and complex oral surgical procedures.' },
]

const values = [
  { icon: Heart,   title: 'Patient-First',   desc: 'Every decision we make puts your comfort and health first.' },
  { icon: Award,   title: 'Excellence',       desc: 'We hold ourselves to the highest clinical and service standards.' },
  { icon: Users,   title: 'Community',        desc: 'We\'re proud to serve our local community and give back whenever we can.' },
  { icon: Smile,   title: 'Integrity',        desc: 'Transparent, honest communication — always.' },
]

export default function About() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <div className="bg-gradient-to-r from-brand-700 to-brand-600 py-20 px-4 text-white text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-5xl font-bold mb-4">About Confi-dent Family Dental Care</h1>
            <p className="text-brand-100 max-w-2xl mx-auto text-lg">
              A team of passionate dental professionals dedicated to creating beautiful, healthy smiles since 2009.
            </p>
          </motion.div>
        </div>

        {/* Story */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="section-title mb-5">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Confi-dent Family Dental Care was founded with one simple goal: to create a dental practice where patients actually want to come back.
              </p>
              <p className="text-gray-600 mb-4">
                We started with a big vision right here in Daet, Camarines Norte. Today, our state-of-the-art clinic proudly serves hundreds of families in the community, with a team of specialists covering everything from pediatric care to complex oral surgery.
              </p>
              <p className="text-gray-600">
                What hasn't changed is our commitment to treating every patient like family — with warmth, respect, and the best dental care money can buy.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-brand-50 rounded-2xl p-10 grid grid-cols-2 gap-6"
            >
              {[['2009', 'Founded'], ['500+', 'Happy Patients'], ['8', 'Specialists'], ['15+', 'Years Experience']].map(([n, l]) => (
                <div key={l} className="text-center">
                  <div className="font-display text-4xl font-bold text-brand-600 mb-1">{n}</div>
                  <div className="text-sm text-gray-600">{l}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="bg-gray-50 py-20 px-4">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="section-title mb-4">Our Mission & Values</h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                We believe great dental care is about more than teeth — it's about the whole patient experience.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card text-center"
                >
                  <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon size={22} className="text-brand-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-600">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section id="team" className="py-20 px-4">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="section-title mb-4">Meet Our Team</h2>
              <p className="text-gray-600 max-w-xl mx-auto">Expert, caring professionals who are passionate about your smile.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((doc, i) => (
                <motion.div
                  key={doc.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card text-center hover:-translate-y-2"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-white font-bold text-2xl font-display mx-auto mb-4">
                    {doc.initials}
                  </div>
                  <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                  <p className="text-sm text-brand-600 font-medium mt-1">{doc.specialty}</p>
                  <p className="text-xs text-gray-500 mt-1 mb-3">{doc.credentials}</p>
                  <p className="text-sm text-gray-600">{doc.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
