import { BillingFiltersBar } from '@/components/billing/BillingFiltersBar'
import { BillingTable } from '@/components/billing/BillingTable'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { TransactionBarcode } from '@/components/ui/transaction-barcode'
import { FormField, Input } from '@/components/ui/input'
import { Toast } from '@/components/ui/toast'
import { useErp } from '@/data/erpStore'
import type { Billing, BillingFilters } from '@/data/billingTypes'
import {
  applyBillingPayment,
  billingStatusLabel,
  filterBillings,
  formatBillingDisplayDate,
  formatBillingMoney,
  initialBillings,
  loadBillings,
  saveBillings,
  syncBillingsWithDeliveryReceipts,
} from '@/lib/billings'
import { withOutslipAmounts } from '@/lib/deliveryReceipts'
import { useSetupItems } from '@/hooks/useSetupItems'
import { X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const defaultFilters: BillingFilters = {
  status: 'all',
  search: '',
  dateFrom: '',
  dateTo: '',
}

export function BillingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { deliveryReceipts, outslips, purchaseOrders } = useErp()
  const catalogItems = useSetupItems()
  const [billings, setBillings] = useState<Billing[]>(() => loadBillings(initialBillings))
  const [filters, setFilters] = useState<BillingFilters>(defaultFilters)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [payTarget, setPayTarget] = useState<Billing | null>(null)
  const [payAmount, setPayAmount] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    saveBillings(billings)
  }, [billings])

  useEffect(() => {
    function refreshBillings() {
      setBillings((current) => {
        const next = loadBillings(initialBillings)
        return JSON.stringify(current) === JSON.stringify(next) ? current : next
      })
    }
    window.addEventListener('erp-billings-updated', refreshBillings)
    return () => window.removeEventListener('erp-billings-updated', refreshBillings)
  }, [])

  useEffect(() => {
    const pricedReceipts = deliveryReceipts.map((receipt) => {
      const outslip = outslips.find((row) => row.id === receipt.outslipId)
      if (!outslip) return receipt
      const purchaseOrder = purchaseOrders.find(
        (row) => row.poNo === outslip.poId || row.id === outslip.poRecordId,
      )
      return withOutslipAmounts(receipt, outslip, purchaseOrder, catalogItems)
    })
    setBillings((current) => syncBillingsWithDeliveryReceipts(current, pricedReceipts))
  }, [catalogItems, deliveryReceipts, outslips, purchaseOrders])

  useEffect(() => {
    const state = location.state as { toast?: string; highlightId?: string } | null
    if (!state?.toast && !state?.highlightId) return
    if (state.toast) setToast(state.toast)
    if (state.highlightId) setSelectedId(state.highlightId)
    navigate('.', { replace: true, state: null })
  }, [location.state, navigate])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 4000)
    return () => window.clearTimeout(timer)
  }, [toast])

  const filtered = useMemo(() => filterBillings(billings, filters), [billings, filters])
  const selected = useMemo(
    () => billings.find((row) => row.id === selectedId) ?? null,
    [billings, selectedId],
  )

  function openPay(billing: Billing) {
    setPayTarget(billing)
    setPayAmount(String(billing.balance || ''))
  }

  function confirmPay() {
    if (!payTarget) return
    const amount = Number(payAmount)
    if (!Number.isFinite(amount) || amount <= 0) {
      window.alert('Enter a valid payment amount.')
      return
    }
    if (amount > payTarget.balance + 0.0001) {
      window.alert('Payment cannot exceed the remaining balance.')
      return
    }
    const next = applyBillingPayment(payTarget, amount)
    setBillings((current) => current.map((row) => (row.id === next.id ? next : row)))
    setToast(`Payment of ${formatBillingMoney(amount)} recorded for ${payTarget.billingNo}.`)
    setPayTarget(null)
    setPayAmount('')
  }

  return (
    <div>
      {toast ? <Toast message={toast} onClose={() => setToast(null)} /> : null}
      <PageHeader
        title="Billing"
        description="Generate and manage billing records."
      />

      <BillingFiltersBar filters={filters} onChange={setFilters} />

      <BillingTable
        billings={filtered}
        selectedId={selectedId}
        onSelect={(billing) => setSelectedId(billing.id)}
        onPay={openPay}
      />

      {selected ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-3 sm:p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedId(null)
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-lg rounded-xl border border-border bg-surface shadow-lg"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Billing Details</h2>
                <TransactionBarcode value={selected.billingNo} />
              </div>
              <button
                type="button"
                className="rounded-md p-1.5 text-text-secondary hover:bg-table-header"
                onClick={() => setSelectedId(null)}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 px-5 py-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <p>
                  <span className="text-text-secondary">BS No:</span>{' '}
                  <span className="font-semibold">{selected.billingNo}</span>
                </p>
                <p>
                  <span className="text-text-secondary">Billing Date:</span>{' '}
                  {formatBillingDisplayDate(selected.date)}
                </p>
                <p>
                  <span className="text-text-secondary">Customer:</span> {selected.customerName}
                </p>
                <p>
                  <span className="text-text-secondary">Payment Status:</span>{' '}
                  {billingStatusLabel[selected.status]}
                </p>
                <p>
                  <span className="text-text-secondary">Reference:</span>{' '}
                  {selected.deliveryReceiptNo || '—'}
                </p>
                <p>
                  <span className="text-text-secondary">Amount:</span>{' '}
                  <span className="font-semibold">{formatBillingMoney(selected.total)}</span>
                </p>
                <p className="sm:col-span-2">
                  <span className="text-text-secondary">Balance:</span>{' '}
                  <span className="font-semibold">{formatBillingMoney(selected.balance)}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-border px-5 py-4">
              {selected.balance > 0 ? (
                <Button type="button" onClick={() => openPay(selected)}>
                  Pay
                </Button>
              ) : null}
              <Button type="button" variant="secondary" onClick={() => setSelectedId(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {payTarget ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-3 sm:p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPayTarget(null)
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-xl border border-border bg-surface shadow-lg"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-lg font-semibold text-text-primary">
                Record Payment — {payTarget.billingNo}
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                Balance: {formatBillingMoney(payTarget.balance)}
              </p>
            </div>
            <div className="px-5 py-4">
              <FormField label="Payment Amount">
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={payAmount}
                  onChange={(event) => setPayAmount(event.target.value)}
                />
              </FormField>
            </div>
            <div className="flex justify-end gap-2 border-t border-border px-5 py-4">
              <Button type="button" variant="secondary" onClick={() => setPayTarget(null)}>
                Cancel
              </Button>
              <Button type="button" onClick={confirmPay}>
                Record Payment
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
