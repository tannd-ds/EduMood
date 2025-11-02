import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('edumood_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error loading user:', error)
        localStorage.removeItem('edumood_user')
      }
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    const savedUsers = localStorage.getItem('edumood_users')
    if (!savedUsers) {
      throw new Error('Không tìm thấy tài khoản. Vui lòng đăng ký trước!')
    }

    const users = JSON.parse(savedUsers)
    const user = users.find(u => u.email === email)

    if (!user) {
      throw new Error('Email không tồn tại!')
    }

    if (user.password !== password) {
      throw new Error('Mật khẩu không đúng!')
    }

    // Login successful
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email
    }
    
    setUser(userData)
    localStorage.setItem('edumood_user', JSON.stringify(userData))
    return userData
  }

  const signup = (name, email, password) => {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Email không hợp lệ!')
    }

    // Validate password length
    if (password.length < 6) {
      throw new Error('Mật khẩu phải có ít nhất 6 ký tự!')
    }

    // Check if email already exists
    const savedUsers = localStorage.getItem('edumood_users')
    if (savedUsers) {
      const users = JSON.parse(savedUsers)
      if (users.find(u => u.email === email)) {
        throw new Error('Email đã được sử dụng!')
      }
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password
    }

    const users = savedUsers ? JSON.parse(savedUsers) : []
    users.push(newUser)
    localStorage.setItem('edumood_users', JSON.stringify(users))

    // Auto login after signup
    const userData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    }
    
    setUser(userData)
    localStorage.setItem('edumood_user', JSON.stringify(userData))
    return userData
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('edumood_user')
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

