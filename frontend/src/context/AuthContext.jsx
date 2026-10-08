import {
  AUTH_UNAUTHORIZED_EVENT,
  fetchCurrentUser,
  loginRequest,
  logoutRequest,
  readStoredSession,
  writeStoredSession,
} from '@/lib/api'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredSession()?.user ?? null)
  const [isBootstrapping, setIsBootstrapping] = useState(() => !!readStoredSession()?.token)

  useEffect(() => {
    const session = readStoredSession()

    if (!session?.token) {
      setIsBootstrapping(false)
      return
    }

    let cancelled = false

    fetchCurrentUser()
      .then((payload) => {
        if (cancelled) return

        const nextUser = payload.user
        setUser(nextUser)
        writeStoredSession({ ...session, user: nextUser })
      })
      .catch(() => {
        if (cancelled) return

        writeStoredSession(null)
        setUser(null)
      })
      .finally(() => {
        if (!cancelled) {
          setIsBootstrapping(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null)
    }

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized)
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized)
  }, [])

  const login = useCallback(async (loginValue, password) => {
    const payload = await loginRequest(loginValue, password)

    writeStoredSession({
      token: payload.token,
      user: payload.user,
    })
    setUser(payload.user)

    return payload.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutRequest()
    } catch {
      // Clear local session even if the API is unreachable.
    }

    writeStoredSession(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isBootstrapping,
      login,
      logout,
    }),
    [user, isBootstrapping, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}

export { AuthProvider, useAuth }
