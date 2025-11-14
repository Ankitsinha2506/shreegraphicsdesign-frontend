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

  const floatingShapes = [
    { size: 100, x: '10%', y: '15%', delay: 0 },
    { size: 120, x: '85%', y: '20%', delay: 1 },
    { size: 70, x: '5%', y: '80%', delay: 2 },
    { size: 90, x: '90%', y: '70%', delay: 0.5 },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Floating red glows */}
      {floatingShapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-red-700/20 to-red-500/20 blur-3xl"
          style={{ width: shape.size, height: shape.size, left: shape.x, top: shape.y }}
          animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 4 + shape.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
        <motion.div
          className="max-w-md w-full space-y-8 bg-black/60 backdrop-blur-xl rounded-2xl p-8 border border-red-900/40 shadow-[0_0_25px_rgba(255,0,0,0.4)]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.div
              className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-to-r from-red-700 to-red-500 shadow-[0_0_15px_rgba(255,0,0,0.5)]"
              whileHover={{ scale: 1.05, rotate: -5 }}
            >
              <UserPlusIcon className="h-8 w-8 text-white" />
            </motion.div>
            <h2 className="mt-6 text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Join Shree Graphics
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-red-500 hover:text-red-400 font-medium">
                Sign in here
              </Link>
            </p>
          </motion.div>

          {/* Form */}
          <motion.form onSubmit={handleSubmit} className="space-y-5" variants={itemVariants}>
            {[
              { name: 'name', label: 'Full Name', icon: <UserIcon /> },
              { name: 'email', label: 'Email Address', icon: <EnvelopeIcon /> },
              { name: 'phone', label: 'Phone (Optional)', icon: <PhoneIcon /> },
            ].map((field) => (
              <motion.div key={field.name} whileHover={{ scale: 1.02 }}>
                <label className="block text-sm mb-2 text-gray-300">{field.label}</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">
                    {field.icon}
                  </span>
                  <input
                    name={field.name}
                    type={field.name === 'email' ? 'email' : 'text'}
                    value={formData[field.name]}
                    onChange={handleChange}
                    onFocus={() => setFocusedField(field.name)}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-10 pr-3 py-3 bg-black/80 text-gray-100 rounded-xl border ${
                      focusedField === field.name
                        ? 'border-red-500 ring-2 ring-red-500/30'
                        : 'border-gray-700 hover:border-red-400/50'
                    } focus:outline-none transition-all duration-200`}
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                  />
                </div>
                {errors[field.name] && (
                  <p className="mt-1 text-sm text-red-500">{errors[field.name]}</p>
                )}
              </motion.div>
            ))}

            {/* Password */}
            <motion.div whileHover={{ scale: 1.02 }}>
              <label className="block text-sm mb-2 text-gray-300">Password</label>
              <div className="relative">
                <LockClosedIcon
                  className={`absolute left-3 top-3 h-5 w-5 ${
                    focusedField === 'password' ? 'text-red-500' : 'text-gray-500'
                  }`}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full pl-10 pr-10 py-3 bg-black/80 text-gray-100 rounded-xl border ${
                    focusedField === 'password'
                      ? 'border-red-500 ring-2 ring-red-500/30'
                      : 'border-gray-700 hover:border-red-400/50'
                  } focus:outline-none transition-all duration-200`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-red-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </motion.div>

            {/* Confirm Password */}
            <motion.div whileHover={{ scale: 1.02 }}>
              <label className="block text-sm mb-2 text-gray-300">Confirm Password</label>
              <div className="relative">
                <LockClosedIcon
                  className={`absolute left-3 top-3 h-5 w-5 ${
                    focusedField === 'confirmPassword' ? 'text-red-500' : 'text-gray-500'
                  }`}
                />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full pl-10 pr-10 py-3 bg-black/80 text-gray-100 rounded-xl border ${
                    focusedField === 'confirmPassword'
                      ? 'border-red-500 ring-2 ring-red-500/30'
                      : 'border-gray-700 hover:border-red-400/50'
                  } focus:outline-none transition-all duration-200`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-red-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </motion.div>

            {/* Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-red-700 to-red-500 text-white font-semibold shadow-[0_0_15px_rgba(255,0,0,0.4)] hover:shadow-[0_0_20px_rgba(255,0,0,0.6)] transition-all"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </motion.button>
          </motion.form>

          {/* Footer */}
          <motion.div className="text-center mt-6 text-gray-400 text-sm" variants={itemVariants}>
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-red-400 hover:text-red-300">
              Terms
            </Link>{' '}
            &{' '}
            <Link to="/privacy" className="text-red-400 hover:text-red-300">
              Privacy Policy
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Register
