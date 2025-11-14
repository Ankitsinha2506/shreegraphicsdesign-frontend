import { useState } from 'react'
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { API_URL } from '../config/api'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    projectType: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const result = await res.json()
      if (result.success) {
        toast.success('Message sent successfully!')
        setFormData({ name: '', email: '', phone: '', subject: '', message: '', projectType: '' })
      } else {
        toast.error(result.message || 'Failed to send message')
      }
    } catch {
      toast.error('Server error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'Phone',
      details: ['+91 88888 30696', '+91 87654 32109'],
      description: 'Call us for immediate assistance'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      details: ['info@shreegraphics.com', 'support@shreegraphics.com'],
      description: 'Send us an email anytime'
    },
    {
      icon: MapPinIcon,
      title: 'Address',
      details: ['Mountain View Society, Radhyeswari Nagari, Bakori road Wagholi, Pune. 412207'],
      description: 'Visit our design studio'
    },
    {
      icon: ClockIcon,
      title: 'Business Hours',
      details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat: 10:00 AM - 4:00 PM'],
      description: 'We’re here to help during these hours'
    }
  ]

  const services = [
    'Logo Design',
    'Brand Identity',
    'Embroidery',
    'Business Cards',
    'Brochures',
    'Web Design',
    'Print Design',
    'Other'
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 🧭 Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center text-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1581093804364-2f8dcead6c65?auto=format&fit=crop&w=2000&q=80"
          alt="Embroidery machine stitching design at Shree Graphics"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-red-950/80"></div>

        <div className="relative z-10 px-6 sm:px-8 md:px-12 max-w-4xl mx-auto text-white">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Let’s <span className="text-red-500 drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]">Connect</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
            Have a creative project in mind? We’d love to bring your embroidery, logo, or branding idea to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#form"
              className="bg-red-600 hover:bg-red-500 px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-[0_0_10px_rgba(255,0,0,0.5)]"
            >
              Send Message
            </a>
            <a
              href="/about"
              className="border-2 border-red-600 text-red-400 px-8 py-3 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-all duration-300"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* 📞 Contact Info Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-b from-zinc-900 to-black p-8 rounded-2xl shadow-[0_0_15px_rgba(255,0,0,0.2)] border border-red-900/40 text-center overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(255,0,0,0.5)]"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-red-500 to-red-800 blur-2xl transition-all"></div>
              <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <info.icon className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{info.title}</h3>
              <div className="space-y-1 mb-2">
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-300 font-medium">
                    {detail}
                  </p>
                ))}
              </div>
              <p className="text-gray-500 text-sm">{info.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 📨 Contact Form Section */}
      <section id="form" className="py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-black border border-red-900/30 rounded-2xl shadow-[0_0_20px_rgba(255,0,0,0.3)] p-10">
            <h2 className="text-3xl font-bold text-white mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Full Name *</label>
                  <input
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-zinc-900 text-gray-100 rounded-lg border border-gray-700 focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-zinc-900 text-gray-100 rounded-lg border border-gray-700 focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-zinc-900 text-gray-100 rounded-lg border border-gray-700 focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label htmlFor="projectType" className="block text-sm font-medium text-gray-400 mb-2">Project Type</label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-zinc-900 text-gray-100 rounded-lg border border-gray-700 focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  >
                    <option value="">Select a service</option>
                    {services.map((s, i) => (
                      <option key={i} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-2">Subject *</label>
                <input
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-900 text-gray-100 rounded-lg border border-gray-700 focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-900 text-gray-100 rounded-lg border border-gray-700 focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-red-700 to-red-500 text-white py-3 rounded-lg font-semibold shadow-[0_0_15px_rgba(255,0,0,0.5)] hover:shadow-[0_0_25px_rgba(255,0,0,0.7)] transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-zinc-900 border border-red-900/30 rounded-2xl p-8 shadow-[0_0_15px_rgba(255,0,0,0.3)]">
              <h3 className="text-2xl font-bold mb-4 text-white">Why Choose Us?</h3>
              <ul className="space-y-4 text-gray-400">
                <li>⚡ Quick Response within 24 hours</li>
                <li>💬 Free Consultation</li>
                <li>🎨 Custom Tailored Solutions</li>
                <li>❤️ 100% Satisfaction Guarantee</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-red-800 to-red-600 rounded-2xl p-8 text-white shadow-[0_0_20px_rgba(255,0,0,0.5)]">
              <h3 className="text-2xl font-bold mb-4">Let’s Talk</h3>
              <p className="mb-4 text-gray-100">
                Ready to get started? Reach us directly below.
              </p>
              <p className="flex items-center mb-2"><PhoneIcon className="h-5 w-5 mr-2 text-white" /> +91 88888 30696</p>
              <p className="flex items-center"><EnvelopeIcon className="h-5 w-5 mr-2 text-white" /> info@shreegraphics.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
