import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('diary_token')
    const username = localStorage.getItem('diary_username')
    if (token && username) {
      setUser({ token, username })
    }
    setLoading(false)
  }, [])

  function login(token, username) {
    localStorage.setItem('diary_token', token)
    localStorage.setItem('diary_username', username)
    setUser({ token, username })
  }

  function logout() {
    localStorage.removeItem('diary_token')
    localStorage.removeItem('diary_username')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
