import { Button } from '@/components/ui/button'
import type { Outslip } from '@/data/erpTypes'
import { X } from 'lucide-react'
import { useEffect, useId, useMemo } from 'react'

interface CreateGatePassFromOutslipDialogProps {
  open: boolean
  outslips: Outslip[]
  usedOutslipIds: string[]
  selectedOutslipId: string
  message: string | null
  onSelectedOutslipIdChange: (outslipId: string) => void
  onConfirm: () => void
  onClose: () => void
}

export function CreateGatePassFromOutslipDialog({
  open,
  outslips,
  usedOutslipIds,
  selectedOutslipId,
  message,
  onSelectedOutslipIdChange,
  onConfirm,
  onClose,
}: CreateGatePassFromOutslipDialogProps) {
  const titleId = useId()
  const used = useMemo(() => new Set(usedOutslipIds), [usedOutslipIds])

  const eligibleOutslips = useMemo(
    () => outslips.filter((row) => row.status === 'released' && !used.has(row.id)),
    [outslips, used],
  )

  const selectedOutslip = useMemo(
    () => eligibleOutslips.find((row) => row.id === selectedOutslipId) ?? null,
    [eligibleOutslips, selectedOutslipId],
  )

  const itemsSummary = useMemo(() => {
    if (!selectedOutslip) return ''
    return selectedOutslip.items
      .filter((item) => item.releasedQuantity > 0)
      .map((item) => `${item.description} (${item.releasedQuantity})`)
      .join(', ')
  }, [selectedOutslip])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-transparent p-3 sm:p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-lg rounded-xl border border-border bg-surface shadow-lg"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 id={titleId} className="text-lg font-semibold text-text-primary">
            New Gate Pass
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close new gate pass"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-text-secondary hover:bg-maroon-light hover:text-maroon"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div>
            <label htmlFor="new-gate-pass-outslip" className="mb-1 block text-sm text-text-primary">
              From Outslip (for dispatch)
            </label>
            <select
              id="new-gate-pass-outslip"
              value={selectedOutslipId}
              onChange={(event) => onSelectedOutslipIdChange(event.target.value)}
              className="h-10 w-full rounded-md border border-border-input bg-surface px-3 text-sm"
            >
              <option value="">Select outslip...</option>
              {eligibleOutslips.map((outslip) => (
                <option key={outslip.id} value={outslip.id}>
                  {outslip.id} — {outslip.customer || '—'}
                </option>
              ))}
            </select>
          </div>

          {itemsSummary ? (
            <p className="text-sm text-text-secondary">Items: {itemsSummary}</p>
          ) : null}

          {eligibleOutslips.length === 0 ? (
            <p className="text-sm text-text-secondary">
              No released Outslip is available. Mark an Outslip for dispatch first.
            </p>
          ) : null}

          {message ? <p className="text-sm text-error-text">{message}</p> : null}
        </div>

        <div className="flex justify-start border-t border-border px-5 py-4">
          <Button type="button" onClick={onConfirm} disabled={!selectedOutslipId}>
            Create Gate Pass
          </Button>
        </div>
      </div>
    </div>
  )
}
