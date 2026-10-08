import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Pencil, Printer, Trash2 } from 'lucide-react'

export const TABLE_ACTIONS_HEAD_CLASS = 'w-28 text-center'
export const TABLE_ACTIONS_CELL_CLASS = 'text-center'

const iconClass = 'block h-4 w-4 shrink-0'

function IconActionButton({ onClick, label, children, destructive = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'table-action-btn inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg p-0 leading-none transition-colors',
        destructive
          ? 'text-error-text hover:bg-error-bg'
          : 'text-text-secondary hover:bg-maroon-light hover:text-maroon',
      )}
    >
      {children}
    </button>
  )
}

export function TableActions({ onEdit, onDelete, onPrint, className }) {
  if (!onEdit && !onDelete && !onPrint) return null

  return (
    <div
      className={cn(
        'table-actions inline-flex items-center justify-center gap-1 no-print',
        className,
      )}
      role="group"
      aria-label="Row actions"
    >
      {onEdit && (
        <IconActionButton onClick={onEdit} label="Edit">
          <Pencil className={iconClass} strokeWidth={2} />
        </IconActionButton>
      )}
      {onDelete && (
        <IconActionButton onClick={onDelete} label="Delete" destructive>
          <Trash2 className={iconClass} strokeWidth={2} />
        </IconActionButton>
      )}
      {onPrint && (
        <IconActionButton onClick={onPrint} label="Print">
          <Printer className={iconClass} strokeWidth={2} />
        </IconActionButton>
      )}
    </div>
  )
}

export function LoadingButton({
  loading,
  children,
  onClick,
  variant = 'primary',
}) {
  return (
    <Button variant={variant} onClick={onClick} disabled={loading}>
      {loading ? 'Loading...' : children}
    </Button>
  )
}
