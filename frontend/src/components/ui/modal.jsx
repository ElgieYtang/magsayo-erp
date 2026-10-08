import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className={cn(
          'relative flex w-full max-h-[90vh] flex-col rounded-lg border border-border bg-surface shadow-xl',
          sizeClasses[size],
          className,
        )}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-text-secondary hover:bg-maroon-light hover:text-maroon"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">{children}</div>

        {footer ? (
          <div className="shrink-0 border-t border-border bg-surface px-6 py-4">{footer}</div>
        ) : null}
      </div>
    </div>
  )
}
