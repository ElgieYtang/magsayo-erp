import { Fragment, useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import { PageHeader } from '@/components/layout/PageHeader'
import {
  MobileDetailField,
  MobileDetailShell,
  MobileStickyActions,
} from '@/components/layout/MobileDetailShell'
import { DeliveryReceiptScanPanel } from '@/components/transactions/DeliveryReceiptScanPanel'
import { TransactionLoadError } from '@/components/transactions/TransactionLoadError'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableLink,
  TableRow,
} from '@/components/ui/table'
import { useDemo } from '@/context/DemoContext'
import { useTransactions } from '@/context/TransactionContext'
import { fetchDeliveryReceipt } from '@/lib/transactionApi'
import { formatCurrency } from '@/lib/format'
import { getStatusDisplay } from '@/lib/status'
import {
  canCreateBillingFromDelivery,
  canMarkDeliveryDelivered,
  canMarkDeliveryDeliveredWithSerials,
  canMarkDeliveryOut,
  deliveryLineSerialProgress,
  deliverySerialsComplete,
  findBillingForDelivery,
} from '@/lib/transactionRules'

function normalizeDrRouteId(value) {
  return decodeURIComponent(String(value ?? '')).trim().toUpperCase()
}

function findDeliveryReceipt(rows, id) {
  const needle = normalizeDrRouteId(id)
  return rows.find(
    (row) =>
      normalizeDrRouteId(row.id) === needle ||
      String(row.dbId ?? '') === String(id ?? '').trim(),
  )
}

function DeliveryLineItemsTable({ items }) {
  if (!items.length) {
    return <p className="text-sm text-text-secondary">No line items on this delivery receipt.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Item</TableHead>
          <TableHead>Qty</TableHead>
          <TableHead>Serials</TableHead>
          <TableHead>Unit price</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => {
          const qty = Number(item.quantity ?? 0)
          const unitPrice = Number(item.unitPrice ?? 0)
          const amount = item.amount != null ? Number(item.amount) : qty * unitPrice
          const progress = deliveryLineSerialProgress(item)
          const serialLabel =
            progress.needed > 0 ? `${progress.captured}/${progress.needed}` : '—'
          return (
            <TableRow key={`${item.productId}-${item.productName}`}>
              <TableCell>{item.productName ?? '—'}</TableCell>
              <TableCell>{qty}</TableCell>
              <TableCell>{serialLabel}</TableCell>
              <TableCell>{formatCurrency(unitPrice)}</TableCell>
              <TableCell>{formatCurrency(amount)}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export function DeliveryReceiptDetailPage() {
  const { id } = useParams()
  const { showToast } = useDemo()
  const navigate = useNavigate()
  const {
    deliveryReceipts,
    billingStatements,
    outslips,
    loading,
    error,
    refreshAll,
    markDeliveryOutForDelivery,
    markDeliveryDelivered,
    createBillingFromDelivery,
  } = useTransactions()

  const [dr, setDr] = useState(null)
  const [detailLoading, setDetailLoading] = useState(true)
  const [detailError, setDetailError] = useState(null)
  const [busy, setBusy] = useState(false)
  const [outForDeliveryId, setOutForDeliveryId] = useState(null)
  const [deliverId, setDeliverId] = useState(null)
  const [billingId, setBillingId] = useState(null)

  useEffect(() => {
    let cancelled = false

    const cached = findDeliveryReceipt(deliveryReceipts, id)
    if (cached) {
      setDr(cached)
      setDetailError(null)
      setDetailLoading(false)
      return undefined
    }

    if (loading) {
      setDetailLoading(true)
      return undefined
    }

    setDetailLoading(true)
    setDr(null)
    setDetailError(null)

    fetchDeliveryReceipt(id)
      .then((row) => {
        if (!cancelled) {
          setDr(row)
          setDetailError(null)
        }
      })
      .catch((caught) => {
        if (!cancelled) {
          setDetailError(caught?.message ?? 'Delivery receipt not found.')
          setDr(null)
        }
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id, deliveryReceipts, loading])

  const items = useMemo(
    () => (dr?.items ?? []).map((item) => ({ ...item })),
    [dr],
  )

  const linkedOutslip = useMemo(() => {
    if (!dr) return null
    return outslips.find(
      (row) =>
        row.id === dr.referenceOutslipId ||
        row.dbId === String(dr.referenceOutslipDbId),
    )
  }, [dr, outslips])

  const linkedBilling = dr ? findBillingForDelivery(dr, billingStatements) : null
  const showOutForDelivery = dr ? canMarkDeliveryOut(dr) : false
  const showMarkDelivered = dr ? canMarkDeliveryDeliveredWithSerials(dr) : false
  const serialsPending = dr ? canMarkDeliveryDelivered(dr) && !deliverySerialsComplete(dr) : false
  const showCreateBilling = dr ? canCreateBillingFromDelivery(dr, billingStatements) : false
  const canScanSerials =
    dr?.status === 'active' || dr?.status === 'out_for_delivery'

  if (!loading && !detailLoading && !dr && detailError) {
    return (
      <div>
        <PageHeader
          title="Delivery Receipt"
          breadcrumbs={['Transaction', 'Delivery Receipt', id ?? '—']}
        />
        <TransactionLoadError message={detailError} onRetry={refreshAll} />
        <Button variant="secondary" onClick={() => navigate('/delivery-receipt')}>
          Back to list
        </Button>
      </div>
    )
  }

  if (!loading && !detailLoading && !dr && !detailError) {
    return <Navigate to="/delivery-receipt" replace />
  }

  if ((loading || detailLoading) && !dr) {
    return <p className="text-sm text-text-secondary">Loading delivery receipt…</p>
  }

  if (!dr) {
    return <p className="text-sm text-text-secondary">Loading delivery receipt…</p>
  }

  const st = getStatusDisplay(dr.status)

  const handleOutForDelivery = async () => {
    setBusy(true)
    try {
      await markDeliveryOutForDelivery(dr.id)
      showToast('success', 'Delivery marked as out for delivery.')
      setOutForDeliveryId(null)
    } catch (caught) {
      showToast('error', caught?.message ?? 'Could not update delivery.')
    } finally {
      setBusy(false)
    }
  }

  const handleDelivered = async () => {
    setBusy(true)
    try {
      await markDeliveryDelivered(dr.id)
      showToast('success', 'Delivery marked as completed.')
      setDeliverId(null)
    } catch (caught) {
      showToast('error', caught?.message ?? 'Could not mark delivered.')
    } finally {
      setBusy(false)
    }
  }

  const handleCreateBilling = async () => {
    setBusy(true)
    try {
      const bill = await createBillingFromDelivery(dr.id)
      showToast('success', `Billing ${bill?.id ?? ''} created.`)
      setBillingId(null)
      navigate('/billing')
    } catch (caught) {
      showToast('error', caught?.message ?? 'Could not create billing.')
    } finally {
      setBusy(false)
    }
  }

  const handleSerialsSaved = (updated) => {
    setDr(updated)
  }

  const actionButtons = (
    <>
      {serialsPending ? (
        <p className="w-full text-sm text-amber-800">
          Complete serial capture on all lines before delivery.
        </p>
      ) : null}
      {showOutForDelivery ? (
        <Button disabled={busy} onClick={() => setOutForDeliveryId(dr.id)}>
          Mark out for delivery
        </Button>
      ) : null}
      {showMarkDelivered ? (
        <Button disabled={busy} onClick={() => setDeliverId(dr.id)}>
          Mark delivered
        </Button>
      ) : null}
      {showCreateBilling ? (
        <Button disabled={busy} onClick={() => setBillingId(dr.id)}>
          Create billing
        </Button>
      ) : null}
      {linkedBilling ? (
        <Button variant="secondary" onClick={() => navigate('/billing')}>
          View billing {linkedBilling.id}
        </Button>
      ) : null}
      <Button variant="secondary" onClick={() => navigate(`/delivery-receipt/${dr.id}/preview`)}>
        Print
      </Button>
    </>
  )

  const metaBlock = (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge variant={st.variant}>{st.label}</Badge>
      </div>
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MobileDetailField label="Customer" value={dr.customerName || dr.customerId || '—'} />
        <MobileDetailField
          label="Reference outslip"
          value={
            dr.referenceOutslipId ? (
              linkedOutslip ? (
                <TableLink onClick={() => navigate(`/outslip/${linkedOutslip.id}`)}>
                  {dr.referenceOutslipId}
                </TableLink>
              ) : (
                dr.referenceOutslipId
              )
            ) : (
              '—'
            )
          }
        />
        <MobileDetailField label="Delivery date" value={dr.displayDate || dr.date || '—'} />
        <MobileDetailField label="Total" value={formatCurrency(dr.total ?? 0)} />
      </div>
      <h2 className="mb-3 text-sm font-semibold text-text-primary">Items</h2>
      <DeliveryLineItemsTable items={items} />
      {canScanSerials ? (
        <div className="mt-6">
          <DeliveryReceiptScanPanel
            deliveryId={dr.id}
            items={items}
            onSaved={handleSerialsSaved}
            disabled={busy}
          />
        </div>
      ) : null}
    </>
  )

  return (
    <Fragment>
      <div className="hidden md:block">
        <PageHeader
          title={dr.id}
          description="Review items, capture serials, then update delivery status."
          breadcrumbs={['Transaction', 'Delivery Receipt', dr.id]}
          action={
            <Button variant="secondary" onClick={() => navigate('/delivery-receipt')}>
              Back to list
            </Button>
          }
        />
        {error ? <TransactionLoadError message={error} onRetry={refreshAll} /> : null}
        <div className="rounded-xl border border-border bg-surface p-6">
          {metaBlock}
          <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-6">{actionButtons}</div>
        </div>
      </div>

      <MobileDetailShell
        title={dr.id}
        backTo="/delivery-receipt"
        actions={<MobileStickyActions>{actionButtons}</MobileStickyActions>}
      >
        {error ? <TransactionLoadError message={error} onRetry={refreshAll} /> : null}
        {metaBlock}
      </MobileDetailShell>

      <ConfirmDialog
        open={outForDeliveryId != null}
        onClose={() => setOutForDeliveryId(null)}
        title="Mark out for delivery?"
        message="This delivery will be marked as on the way to the customer."
        confirmLabel="Confirm"
        onConfirm={handleOutForDelivery}
      />

      <ConfirmDialog
        open={deliverId != null}
        onClose={() => setDeliverId(null)}
        title="Mark as delivered?"
        message="Confirm that all items were delivered to the customer."
        confirmLabel="Mark delivered"
        onConfirm={handleDelivered}
      />

      <ConfirmDialog
        open={billingId != null}
        onClose={() => setBillingId(null)}
        title="Create billing?"
        message={`Create a billing statement from ${dr.id}?`}
        confirmLabel="Create billing"
        onConfirm={handleCreateBilling}
      />
    </Fragment>
  )
}
