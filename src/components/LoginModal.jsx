import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

function LoginModal({ isOpen, onClose }) {
  const { login, signup } = useAuth()
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLoginMode) {
        await login(formData.email, formData.password)
      } else {
        await signup(formData.name, formData.email, formData.password)
      }
      onClose()
      setFormData({ name: '', email: '', password: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode)
    setError('')
    setFormData({ name: '', email: '', password: '' })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>

            {/* Content */}
            <div className="p-8">
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="inline-block mb-4"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl">
                    📚
                  </div>
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {isLoginMode ? 'Đăng nhập' : 'Đăng ký'}
                </h2>
                <p className="text-gray-600">
                  {isLoginMode
                    ? 'Chào mừng bạn trở lại!'
                    : 'Tham gia cùng chúng tôi ngay!'}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLoginMode && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required={!isLoginMode}
                      placeholder="Nhập họ và tên"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                    />
                  </motion.div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập email của bạn"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập mật khẩu"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang xử lý...' : isLoginMode ? 'Đăng nhập' : 'Đăng ký'}
                </motion.button>
              </form>

              {/* Toggle Mode */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  {isLoginMode ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                  >
                    {isLoginMode ? 'Đăng ký ngay' : 'Đăng nhập'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoginModal

