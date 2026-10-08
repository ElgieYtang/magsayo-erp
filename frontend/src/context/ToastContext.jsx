import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((type, message) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 3500)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const value = useMemo(
    () => ({ toasts, showToast, removeToast }),
    [toasts, showToast, removeToast],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export { ToastProvider, useToast }
