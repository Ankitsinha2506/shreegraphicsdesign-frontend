import { useState } from 'react'
import toast from 'react-hot-toast'
import { API_URL } from '../config/api'
import { Phone, Mail, MapPin, Clock, MessageCircle, CheckCircle, Sparkles, Zap } from 'lucide-react'

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
        toast.success('Thank you! We\'ll get back to you within 24 hours!')
        setFormData({ name: '', email: '', phone: '', subject: '', message: '', projectType: '' })
      } else {
        toast.error(result.message || 'Failed to send message')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Phone,
      title: 'Call / WhatsApp',
      details: ['+91 88888 30696', '+91 87654 32109'],
      description: 'Instant response on WhatsApp'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['info@shreegraphics.com', 'support@shreegraphics.com'],
      description: 'We reply within 24 hours'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['Mountain View Society, Radhyeswari Nagari,', 'Bakori Road, Wagholi, Pune - 412207'],
      description: 'Mon–Sat: 10 AM – 6 PM'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Saturday: 10:00 AM - 4:00 PM'],
      description: 'Sunday Closed'
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
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-red-50">
        <img
          src="https://www.brother.in/-/media/ap2/india/products/sewingmachines/sewingmachines/singapore_sewing-banner-component.png"
          alt="Embroidery machine at Shree Graphics"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 px-6 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
            Let’s <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Connect</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10">
            Have a project in mind? We’re here to bring your branding & embroidery ideas to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="#contact-form"
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:shadow-orange-500/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              <MessageCircle className="h-6 w-6" />
              Start a Project
            </a>
            <a
              href="https://wa.me/8626035244"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-10 py-5 rounded-full font-bold text-lg shadow-2xl flex items-center gap-3 transform hover:scale-105 transition-all"
            >
              <MessageCircle className="h-6 w-6" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600">We’re just one message away!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => {
              const Icon = info.icon
              return (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-white to-orange-50/50 border border-orange-200 rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl hover:shadow-orange-200/50 transition-all duration-500 hover:-translate-y-3"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl group-hover:scale-110 transition-transform">
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{info.title}</h3>
                  <div className="space-y-2 mb-4">
                    {info.details.map((line, i) => (
                      <p key={i} className="text-gray-700 font-medium">{line}</p>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">{info.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Form + Sidebar */}
      <section id="contact-form" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Form */}
          <div className="bg-white rounded-3xl shadow-2xl border border-orange-100 p-10 lg:p-12">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-8">
              Send Us a <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Message</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Full Name *"
                  className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all text-gray-800 placeholder-gray-400"
                />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email *"
                  className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all text-gray-800 placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number *"
                  className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all text-gray-800 placeholder-gray-400"
                />
                <select
                  name="projectType"
                  required
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all text-gray-800"
                >
                  <option value="">Select Project Type *</option>
                  {services.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject *"
                className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all text-gray-800 placeholder-gray-400"
              />

              <textarea
                name="message"
                required
                rows={6}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your project... *"
                className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all text-gray-800 placeholder-gray-400 resize-none"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-5 rounded-2xl shadow-2xl hover:shadow-orange-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
              >
                {isSubmitting ? (
                  <>Sending...</>
                ) : (
                  <>
                    Send Message
                    <Sparkles className="h-6 w-6" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-10">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-10 shadow-xl border border-orange-200">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Why Work With Us?</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Lightning Fast Response</h4>
                    <p className="text-gray-600">Reply within 2–24 hours guaranteed</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Free Consultation</h4>
                    <p className="text-gray-600">No obligation. Just great advice</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Premium Quality</h4>
                    <p className="text-gray-600">Only the best materials & craftsmanship</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-10 text-white shadow-2xl">
              <h3 className="text-3xl font-bold mb-6">Chat on WhatsApp</h3>
              <p className="text-lg mb-8 text-orange-100">
                Get instant reply — just tap below!
              </p>
              <a
                href="https://wa.me/+918626035244?text=Hi!%20I%20found%20you%20on%20your%20website%20and%20would%20like%20to%20discuss%20a%20project!"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 bg-white text-orange-600 hover:bg-gray-100 px-8 py-5 rounded-full font-bold text-lg shadow-2xl transform hover:scale-105 transition-all"
              >
                <MessageCircle className="h-8 w-8" />
                Start WhatsApp Chat
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact