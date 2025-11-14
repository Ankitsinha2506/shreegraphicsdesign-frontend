import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState('')
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const result = await login(formData.email, formData.password)
    if (result.success) {
      const from = location.state?.from?.pathname
      if (result.user?.role === 'admin' || user?.role === 'admin') navigate('/admin', { replace: true })
      else navigate(from || '/', { replace: true })
    }
    setIsLoading(false)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const floatingShapes = [
    { size: 80, x: '10%', y: '25%', delay: 0 },
    { size: 120, x: '85%', y: '20%', delay: 1 },
    { size: 60, x: '20%', y: '80%', delay: 2 },
    { size: 100, x: '90%', y: '70%', delay: 0.5 },
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
          className="max-w-md w-full space-y-8 bg-black/60 backdrop-blur-xl rounded-2xl p-8 shadow-[0_0_20px_rgba(255,0,0,0.3)] border border-red-900/30"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.div
              className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-to-r from-red-700 to-red-500 shadow-[0_0_15px_rgba(255,0,0,0.4)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <UserIcon className="h-8 w-8 text-white" />
            </motion.div>
            <motion.h2
              className="mt-6 text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Welcome Back
            </motion.h2>
            <motion.p
              className="mt-2 text-sm text-gray-400"
              variants={itemVariants}
            >
              Don’t have an account?{' '}
              <Link to="/register" className="text-red-500 hover:text-red-400 font-medium">
                Sign up here
              </Link>
            </motion.p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
            variants={itemVariants}
          >
            <div className="space-y-4">
              {/* Email */}
              <motion.div whileHover={{ scale: 1.02 }}>
                <label className="block text-sm mb-2 text-gray-300">Email Address</label>
                <div className="relative">
                  <UserIcon
                    className={`absolute left-3 top-3.5 h-5 w-5 ${
                      focusedField === 'email' ? 'text-red-500' : 'text-gray-500'
                    }`}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    required
                    className={`w-full pl-10 pr-3 py-3 bg-black/80 text-gray-100 rounded-xl border ${
                      focusedField === 'email'
                        ? 'border-red-500 ring-2 ring-red-500/30'
                        : 'border-gray-700 hover:border-red-400/50'
                    } focus:outline-none transition-all duration-200`}
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div whileHover={{ scale: 1.02 }}>
                <label className="block text-sm mb-2 text-gray-300">Password</label>
                <div className="relative">
                  <LockClosedIcon
                    className={`absolute left-3 top-3.5 h-5 w-5 ${
                      focusedField === 'password' ? 'text-red-500' : 'text-gray-500'
                    }`}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    required
                    className={`w-full pl-10 pr-10 py-3 bg-black/80 text-gray-100 rounded-xl border ${
                      focusedField === 'password'
                        ? 'border-red-500 ring-2 ring-red-500/30'
                        : 'border-gray-700 hover:border-red-400/50'
                    } focus:outline-none transition-all duration-200`}
                  />
                  <motion.button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-red-500"
                    onClick={() => setShowPassword(!showPassword)}
                    whileHover={{ scale: 1.1 }}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-400">
                <input
                  type="checkbox"
                  className="rounded text-red-500 focus:ring-red-500 border-gray-600"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-red-400 hover:text-red-300 text-sm">
                Forgot password?
              </Link>
            </div>

            {/* Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-700 to-red-500 text-white font-semibold shadow-[0_0_15px_rgba(255,0,0,0.4)] hover:shadow-[0_0_20px_rgba(255,0,0,0.6)] transition-all"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
