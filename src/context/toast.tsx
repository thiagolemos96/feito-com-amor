import { createContext, useCallback, useContext, useState } from 'react'
import { ToastContainer, type ToastItem } from '../components/ui'

export type ToastType = 'success' | 'error'

interface ToastContextValue {
  toast: (message: string, type: ToastType, subtitle?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t))
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300)
  }, [])

  const toast = useCallback((message: string, type: ToastType, subtitle?: string) => {
    const id = crypto.randomUUID()
    setToasts(prev => [{ id, message, type, subtitle }, ...prev].slice(0, 3))
    setTimeout(() => dismiss(id), 3200)
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
