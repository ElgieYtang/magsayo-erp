import { useToast } from '@/context/ToastContext'
import { cn } from '@/lib/utils'
import { CheckCircle, Info, X, XCircle } from 'lucide-react'

export function ToastContainer() {
  const { toasts, removeToast } = useToast()
  if (toasts.length === 0) return null

  return (
    <div className="fixed right-4 top-4 z-[100] flex flex-col gap-2 no-print">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex min-w-[280px] max-w-sm items-center gap-3 rounded-lg border px-4 py-3 shadow-lg animate-in fade-in slide-in-from-top-2',
            toast.type === 'success' && 'border-[#15803D]/30 bg-[#DCFCE7] text-[#15803D]',
            toast.type === 'error' && 'border-[#DC2626]/30 bg-[#FEE2E2] text-[#DC2626]',
            toast.type === 'info' && 'border-maroon/30 bg-maroon-light text-maroon',
          )}
        >
          {toast.type === 'success' ? <CheckCircle className="h-5 w-5 shrink-0" /> : null}
          {toast.type === 'error' ? <XCircle className="h-5 w-5 shrink-0" /> : null}
          {toast.type === 'info' ? <Info className="h-5 w-5 shrink-0" /> : null}
          <span className="flex-1 text-sm font-medium">{toast.message}</span>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="shrink-0 opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
