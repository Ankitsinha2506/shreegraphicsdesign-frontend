import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import {
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [focusedField, setFocusedField] = useState('')

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Must be at least 6 characters'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, '')))
      newErrors.phone = 'Please enter a valid phone number'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    const { confirmPassword, ...data } = formData
    const result = await register(data)
    if (result.success) navigate('/')
    setIsLoading(false)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden text-gray-900"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.90)), url('https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-white/20 to-red-50/30"></div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-orange-400/10 to-red-500/10 blur-xl"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
        <motion.div
          className="max-w-2xl w-full space-y-8 bg-white/95 backdrop-blur-md rounded-2xl p-8 border border-orange-200 shadow-[0_0_50px_rgba(255,69,0,0.2)]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.div
              className="mx-auto h-20 w-20 flex items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 shadow-[0_0_20px_rgba(255,69,0,0.3)]"
              whileHover={{ scale: 1.05, rotate: -5 }}
            >
              <UserPlusIcon className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="mt-6 text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Join Shree Graphics Designs
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Create your account and start your creative journey
            </p>
          </motion.div>

          {/* Form */}
          <motion.form onSubmit={handleSubmit} className="space-y-6" variants={itemVariants}>
            {/* Name - Full Row */}
            <motion.div whileHover={{ scale: 1.01 }}>
              <label className="block text-sm font-medium mb-2 text-gray-700">Full Name *</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full pl-10 pr-3 py-3 bg-white text-gray-900 rounded-xl border ${
                    focusedField === 'name'
                      ? 'border-orange-500 ring-2 ring-orange-500/30'
                      : errors.name ? 'border-red-500' : 'border-gray-300 hover:border-orange-400'
                  } focus:outline-none transition-all duration-200`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </motion.div>

            {/* Email and Phone - One Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <motion.div whileHover={{ scale: 1.01 }}>
                <label className="block text-sm font-medium mb-2 text-gray-700">Email Address *</label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-10 pr-3 py-3 bg-white text-gray-900 rounded-xl border ${
                      focusedField === 'email'
                        ? 'border-orange-500 ring-2 ring-orange-500/30'
                        : errors.email ? 'border-red-500' : 'border-gray-300 hover:border-orange-400'
                    } focus:outline-none transition-all duration-200`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </motion.div>

              {/* Phone */}
              <motion.div whileHover={{ scale: 1.01 }}>
                <label className="block text-sm font-medium mb-2 text-gray-700">Phone Number</label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-10 pr-3 py-3 bg-white text-gray-900 rounded-xl border ${
                      focusedField === 'phone'
                        ? 'border-orange-500 ring-2 ring-orange-500/30'
                        : errors.phone ? 'border-red-500' : 'border-gray-300 hover:border-orange-400'
                    } focus:outline-none transition-all duration-200`}
                    placeholder="Enter your phone number"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </motion.div>
            </div>

            {/* Password and Confirm Password - One Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <motion.div whileHover={{ scale: 1.01 }}>
                <label className="block text-sm font-medium mb-2 text-gray-700">Password *</label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-10 pr-10 py-3 bg-white text-gray-900 rounded-xl border ${
                      focusedField === 'password'
                        ? 'border-orange-500 ring-2 ring-orange-500/30'
                        : errors.password ? 'border-red-500' : 'border-gray-300 hover:border-orange-400'
                    } focus:outline-none transition-all duration-200`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-orange-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </motion.div>

              {/* Confirm Password */}
              <motion.div whileHover={{ scale: 1.01 }}>
                <label className="block text-sm font-medium mb-2 text-gray-700">Confirm Password *</label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-10 pr-10 py-3 bg-white text-gray-900 rounded-xl border ${
                      focusedField === 'confirmPassword'
                        ? 'border-orange-500 ring-2 ring-orange-500/30'
                        : errors.confirmPassword ? 'border-red-500' : 'border-gray-300 hover:border-orange-400'
                    } focus:outline-none transition-all duration-200`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-orange-600 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </motion.div>
            </div>

            {/* Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 mt-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg shadow-[0_0_20px_rgba(255,69,0,0.3)] hover:shadow-[0_0_30px_rgba(255,69,0,0.5)] transition-all duration-300"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </motion.form>

          {/* Footer */}
          <motion.div className="text-center pt-6 border-t border-gray-200" variants={itemVariants}>
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-orange-600 hover:text-red-600 font-semibold transition-colors">
                Sign in here
              </Link>
            </p>
            <p className="text-xs text-gray-500 mt-3">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-orange-600 hover:text-red-600">
                Terms
              </Link>{' '}
              &{' '}
              <Link to="/privacy" className="text-orange-600 hover:text-red-600">
                Privacy Policy
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Register