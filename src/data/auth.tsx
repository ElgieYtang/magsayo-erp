import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const AUTH_KEY = 'erp-auth-session'

export interface AuthUser {
  name: string
  email: string
}

interface AuthContextValue {
  user: AuthUser | null
  login: (input: { email: string; password: string; remember: boolean }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const DEMO = {
  email: 'admin@responsivcode.com',
  password: 'admin123',
  name: 'Admin',
}

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY) ?? sessionStorage.getItem(AUTH_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthUser
    if (!parsed?.email) return null
    return parsed
  } catch {
    return null
  }
}

function persistUser(user: AuthUser, remember: boolean) {
  const payload = JSON.stringify(user)
  localStorage.removeItem(AUTH_KEY)
  sessionStorage.removeItem(AUTH_KEY)
  if (remember) localStorage.setItem(AUTH_KEY, payload)
  else sessionStorage.setItem(AUTH_KEY, payload)
}

function clearUser() {
  localStorage.removeItem(AUTH_KEY)
  sessionStorage.removeItem(AUTH_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadUser)

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      async login({ email, password, remember }) {
        const mail = email.trim().toLowerCase()

        if (mail === DEMO.email && password === DEMO.password) {
          const next: AuthUser = {
            name: DEMO.name,
            email: DEMO.email,
          }
          persistUser(next, remember)
          setUser(next)
          return
        }

        throw new Error('Invalid email or password.')
      },
      logout() {
        clearUser()
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.')
  }
  return context
}
