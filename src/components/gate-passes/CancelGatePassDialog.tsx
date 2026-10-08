import { Button } from '@/components/ui/button'
import type { GatePass } from '@/data/erpTypes'
import { X } from 'lucide-react'

interface CancelGatePassDialogProps {
  gatePass: GatePass | null
  onClose: () => void
  onConfirm: () => void
}

export function CancelGatePassDialog({
  gatePass,
  onClose,
  onConfirm,
}: CancelGatePassDialogProps) {
  if (!gatePass) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-transparent p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-gate-pass-title"
        className="w-full max-w-md rounded-xl border border-border bg-surface shadow-lg"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 id="cancel-gate-pass-title" className="text-lg font-semibold text-text-primary">
            Cancel Gate Pass
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cancel gate pass confirmation"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-text-secondary hover:bg-maroon-light hover:text-maroon"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="px-5 py-4 text-sm text-text-secondary">
          Cancel {gatePass.id}? It will no longer be valid. You can create a new Gate Pass from
          the same Outslip after this.
        </p>
        <div className="flex justify-end gap-3 border-t border-border px-5 py-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Keep Approved
          </Button>
          <Button type="button" onClick={onConfirm}>
            Cancel Gate Pass
          </Button>
        </div>
      </div>
    </div>
  )
}
