import { AddQuotationModal } from '@/components/quotations/AddQuotationModal'
import { StatusTabs } from '@/components/layout/Breadcrumbs'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { FormField, Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { TABLE_ACTIONS_CELL_CLASS, TABLE_ACTIONS_HEAD_CLASS, TableActions } from '@/components/ui/action-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableLink,
  TableRow,
} from '@/components/ui/table'
import { EmptyState, TableFilters } from '@/components/ui/table-filters'
import { ResponsiveTable } from '@/components/ui/responsive-table'
import { QuotationWorkflow } from '@/components/workflow/quotationWorkflow'
import { useDemo } from '@/context/DemoContext'
import { useTransactions } from '@/context/TransactionContext'
import { useSetupResource } from '@/hooks/useSetupResource'
import { formatCurrency } from '@/lib/format'
import { filterByDateRange } from '@/lib/dateFilter'
import { getStatusDisplay } from '@/lib/status'
import { Plus } from 'lucide-react'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function QuotationsPage() {
  const { showToast } = useDemo()
  const {
    quotations,
    loading,
    updateQuotation,
    cancelQuotation,
    convertQuotationToPO,
  } = useTransactions()
  const suppliers = useSetupResource('suppliers')
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewId, setViewId] = useState(null)
  const [editId, setEditId] = useState(null)
  const [cancelId, setCancelId] = useState(null)
  const [addOpen, setAddOpen] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [convertId, setConvertId] = useState(null)
  const [supplierId, setSupplierId] = useState('')
  const [busy, setBusy] = useState(false)

  const filtered = useMemo(() => {
    let list = quotations
    const q = search.toLowerCase()
    if (q) {
      list = list.filter(
        (qt) =>
          qt.id.toLowerCase().includes(q) ||
          (qt.customerName ?? '').toLowerCase().includes(q),
      )
    }
    if (statusFilter !== 'all') {
      list = list.filter((qt) => qt.status === statusFilter)
    }
    list = filterByDateRange(list, dateFrom, dateTo, 'date')
    const order = ['pending', 'approved', 'rejected', 'draft', 'cancelled']
    return [...list].sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status))
  }, [quotations, search, statusFilter, dateFrom, dateTo])

  const viewQtn = viewId ? quotations.find((q) => q.id === viewId) : null
  const editQtn = editId ? quotations.find((q) => q.id === editId) : null

  const openDetail = (id) => {
    if (isMobile) navigate(`/quotations/${id}`)
    else setViewId(id)
  }

  const openEdit = (q) => {
    setEditId(q.id)
    setEditForm({
      date: q.date,
      status: q.status,
    })
  }

  const saveEdit = async () => {
    if (!editId) return
    setBusy(true)
    try {
      await updateQuotation(editId, {
        date: editForm.date,
        status: editForm.status,
      })
      showToast('success', 'Quotation updated successfully.')
      setEditId(null)
    } catch (caught) {
      showToast('error', caught?.message ?? 'Could not update quotation.')
    } finally {
      setBusy(false)
    }
  }

  const openConvert = (qtnId) => {
    setConvertId(qtnId)
    setSupplierId(suppliers.rows.find((row) => row.status !== 'Inactive')?.id ?? '')
  }

  const handleConvertPO = async () => {
    if (!convertId) return
    if (!supplierId) {
      showToast('error', 'Please select a supplier.')
      return
    }

    setBusy(true)
    try {
      const poId = await convertQuotationToPO(convertId, supplierId)
      setConvertId(null)
      setViewId(null)
      showToast('success', `Purchase Order ${poId} created.`)
      navigate('/purchase-order')
    } catch (caught) {
      showToast('error', caught?.message ?? 'Could not convert quotation.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Quotations"
        description="Manage and track customer quotations."
        breadcrumbs={['Transaction', 'Quotations']}
        action={
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" />
            New Quotation
          </Button>
        }
      />

      {loading ? (
        <p className="mb-4 text-sm text-text-secondary">Loading quotations…</p>
      ) : null}

      <StatusTabs
        active={statusFilter}
        onChange={setStatusFilter}
        tabs={[
          { key: 'all', label: 'All', count: quotations.length },
          {
            key: 'pending',
            label: 'Pending',
            count: quotations.filter((q) => q.status === 'pending').length,
          },
          {
            key: 'approved',
            label: 'Approved',
            count: quotations.filter((q) => q.status === 'approved').length,
          },
          {
            key: 'rejected',
            label: 'Rejected',
            count: quotations.filter((q) => q.status === 'rejected').length,
          },
        ]}
      />

      <TableFilters
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search quotations..."
        showDateRange
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
      />

      <ResponsiveTable
        emptyMessage="No quotations found."
        mobileItems={filtered.map((q) => {
          const st = getStatusDisplay(q.status)
          return {
            id: q.id,
            title: q.id,
            subtitle: q.customerName,
            badge: { label: st.label, variant: st.variant },
            fields: [
              { label: 'Date', value: q.displayDate ?? q.date },
              { label: 'Amount', value: formatCurrency(q.total) },
            ],
            onClick: () => openDetail(q.id),
          }
        })}
        desktop={
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Quotation No.</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className={TABLE_ACTIONS_HEAD_CLASS}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6}>
                    <EmptyState />
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((q) => {
                  const st = getStatusDisplay(q.status)
                  return (
                    <TableRow key={q.id}>
                      <TableCell>
                        <TableLink onClick={() => openDetail(q.id)}>{q.id}</TableLink>
                      </TableCell>
                      <TableCell>{q.customerName}</TableCell>
                      <TableCell>{q.displayDate ?? q.date}</TableCell>
                      <TableCell>{formatCurrency(q.total)}</TableCell>
                      <TableCell>
                        <Badge variant={st.variant}>{st.label}</Badge>
                      </TableCell>
                      <TableCell className={TABLE_ACTIONS_CELL_CLASS}>
                        <TableActions
                          onEdit={() => openEdit(q)}
                          onDelete={
                            q.status !== 'cancelled' ? () => setCancelId(q.id) : undefined
                          }
                          onPrint={() => {
                            navigate(`/quotations/${q.id}/preview`)
                            setTimeout(() => window.print(), 300)
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        }
      />

      <Modal open={!!viewQtn} onClose={() => setViewId(null)} title="Quotation Details" size="lg">
        {viewQtn ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-secondary">Quotation No:</span>{' '}
                <strong>{viewQtn.id}</strong>
              </div>
              <div>
                <span className="text-text-secondary">Date:</span> {viewQtn.displayDate ?? viewQtn.date}
              </div>
              <div>
                <span className="text-text-secondary">Customer:</span> {viewQtn.customerName}
              </div>
              <div>
                <span className="text-text-secondary">Status:</span>{' '}
                {getStatusDisplay(viewQtn.status).label}
              </div>
              <div>
                <span className="text-text-secondary">Total:</span>{' '}
                <strong>{formatCurrency(viewQtn.total)}</strong>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Item</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {viewQtn.items.map((item) => (
                  <TableRow key={`${item.productId}-${item.productName}`}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell>{formatCurrency(item.quantity * item.unitPrice)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <h3 className="font-semibold">Workflow Progress</h3>
            <QuotationWorkflow quotation={viewQtn} />

            <div className="flex gap-2 pt-2">
              {viewQtn.status === 'approved' ? (
                <Button onClick={() => openConvert(viewQtn.id)}>Convert to PO</Button>
              ) : null}
              {viewQtn.status === 'pending' ? (
                <Button
                  onClick={async () => {
                    try {
                      await updateQuotation(viewQtn.id, { status: 'approved' })
                      showToast('success', 'Quotation approved.')
                    } catch (caught) {
                      showToast('error', caught?.message ?? 'Could not approve quotation.')
                    }
                  }}
                >
                  Approve
                </Button>
              ) : null}
              <Button
                variant="secondary"
                onClick={() => navigate(`/quotations/${viewQtn.id}/preview`)}
              >
                Preview
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal open={!!editQtn} onClose={() => setEditId(null)} title="Edit Quotation" size="lg">
        {editQtn ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Quotation No.">
                <Input value={editQtn.id} readOnly />
              </FormField>
              <FormField label="Date">
                <Input
                  type="date"
                  value={editForm.date ?? editQtn.date}
                  onChange={(event) => setEditForm({ ...editForm, date: event.target.value })}
                />
              </FormField>
              <FormField label="Status" className="col-span-2">
                <select
                  value={editForm.status ?? editQtn.status}
                  onChange={(event) => setEditForm({ ...editForm, status: event.target.value })}
                  className="h-9 w-full rounded-md border border-border-input bg-surface px-3 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </FormField>
            </div>
            <div className="flex gap-3">
              <Button onClick={saveEdit} disabled={busy}>
                {busy ? 'Saving…' : 'Save'}
              </Button>
              <Button variant="secondary" onClick={() => setEditId(null)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={!!convertId}
        onClose={() => setConvertId(null)}
        title="Convert to Purchase Order"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Select the supplier for the purchase order created from {convertId}.
          </p>
          <FormField label="Supplier" required>
            <select
              value={supplierId}
              onChange={(event) => setSupplierId(event.target.value)}
              className="h-9 w-full rounded-md border border-border-input bg-surface px-3 text-sm"
            >
              <option value="">Select supplier...</option>
              {suppliers.rows
                .filter((row) => row.status !== 'Inactive')
                .map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.name}
                  </option>
                ))}
            </select>
          </FormField>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setConvertId(null)}>
              Cancel
            </Button>
            <Button onClick={handleConvertPO} disabled={busy}>
              {busy ? 'Creating…' : 'Create PO'}
            </Button>
          </div>
        </div>
      </Modal>

      <AddQuotationModal open={addOpen} onClose={() => setAddOpen(false)} />

      <ConfirmDialog
        open={!!cancelId}
        onClose={() => setCancelId(null)}
        title="Cancel Quotation"
        message={`Are you sure you want to cancel ${cancelId}?`}
        confirmLabel="Confirm"
        onConfirm={async () => {
          if (!cancelId) return
          try {
            await cancelQuotation(cancelId)
            showToast('success', 'Quotation cancelled.')
            setCancelId(null)
          } catch (caught) {
            showToast('error', caught?.message ?? 'Could not cancel quotation.')
          }
        }}
      />
    </div>
  )
}
