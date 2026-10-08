import { CreateGatePassFromOutslipDialog } from '@/components/gate-passes/CreateGatePassFromOutslipDialog'
import { CancelGatePassDialog } from '@/components/gate-passes/CancelGatePassDialog'
import { GatePassDetailModal } from '@/components/gate-passes/GatePassDetailModal'
import { GatePassDocument } from '@/components/gate-passes/GatePassDocument'
import { GatePassFiltersBar } from '@/components/gate-passes/GatePassFiltersBar'
import { GatePassTable } from '@/components/gate-passes/GatePassTable'
import { PageHeader } from '@/components/layout/PageHeader'
import { AddButton } from '@/components/ui/add-button'
import { Pagination } from '@/components/ui/pagination'
import { Toast } from '@/components/ui/toast'
import { useErp } from '@/data/erpStore'
import type { GatePass } from '@/data/erpTypes'
import {
  countGatePassStatuses,
  filterGatePasses,
  handleGatePassPrint,
  paginateItems,
  sortGatePassesByDateDesc,
  type GatePassFilters,
} from '@/lib/gatePasses'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

const PAGE_SIZE = 10

const defaultFilters: GatePassFilters = {
  status: 'all',
  search: '',
  dateFrom: '',
  dateTo: '',
}

export function GatePassesPage() {
  const { gatePasses, outslips, deliveryReceipts, createGatePassFromOutslip, updateGatePass, createDeliveryReceiptFromOutslip } = useErp()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const createdFrom = useRef<string | null>(null)

  const [filters, setFilters] = useState<GatePassFilters>(defaultFilters)
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState<string | null>(params.get('id'))
  const [toast, setToast] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [createOutslipId, setCreateOutslipId] = useState('')
  const [createMessage, setCreateMessage] = useState<string | null>(null)
  const [printTarget, setPrintTarget] = useState<GatePass | null>(null)
  const [cancelTarget, setCancelTarget] = useState<GatePass | null>(null)

  const statusCounts = useMemo(() => countGatePassStatuses(gatePasses), [gatePasses])

  const filteredGatePasses = useMemo(
    () => sortGatePassesByDateDesc(filterGatePasses(gatePasses, filters)),
    [gatePasses, filters],
  )

  const pagination = useMemo(
    () => paginateItems(filteredGatePasses, page, PAGE_SIZE),
    [filteredGatePasses, page],
  )

  useEffect(() => {
    setPage(1)
  }, [filters])

  useEffect(() => {
    if (page > pagination.totalPages) {
      setPage(pagination.totalPages)
    }
  }, [page, pagination.totalPages])

  useEffect(() => {
    const state = location.state as { toast?: string; highlightId?: string } | null
    if (!state?.toast && !state?.highlightId) return
    if (state.toast) setToast(state.toast)
    if (state.highlightId) setSelectedId(state.highlightId)
    navigate('.', { replace: true, state: null })
  }, [location.state, navigate])

  useEffect(() => {
    const fromOutslip = params.get('from')
    const byId = params.get('id')
    if (byId) {
      setSelectedId(byId)
      navigate('/gate-passes', { replace: true })
      return
    }
    if (!fromOutslip) return

    const existing = gatePasses.find(
      (row) => row.outslipId === fromOutslip && row.status === 'approved',
    )
    if (existing) {
      setSelectedId(existing.id)
      navigate('/gate-passes', { replace: true })
      return
    }
    if (createdFrom.current === fromOutslip) return
    createdFrom.current = fromOutslip

    const result = createGatePassFromOutslip(fromOutslip)
    if (result.error) {
      setMessage(result.error)
      createdFrom.current = null
      return
    }
    if (result.gatePass) {
      setSelectedId(result.gatePass.id)
      setToast(`Gate Pass ${result.gatePass.id} created.`)
      navigate('/gate-passes', { replace: true })
    }
  }, [params, gatePasses, createGatePassFromOutslip, navigate])

  const selected = gatePasses.find((row) => row.id === selectedId) ?? null

  function handlePrint(gatePass: GatePass) {
    setPrintTarget(gatePass)
    requestAnimationFrame(() => handleGatePassPrint())
  }

  function openCreate() {
    setCreateOutslipId('')
    setCreateMessage(null)
    setCreateOpen(true)
  }

  function handleCreateFromOutslip() {
    if (!createOutslipId) {
      setCreateMessage('Select a released Outslip first.')
      return
    }
    const result = createGatePassFromOutslip(createOutslipId)
    if (result.error || !result.gatePass) {
      setCreateMessage(result.error ?? 'Could not create gate pass.')
      return
    }
    setCreateOpen(false)
    setCreateMessage(null)
    setSelectedId(result.gatePass.id)
    setToast(`Gate Pass ${result.gatePass.id} created.`)
  }

  function updateSelectedField<K extends keyof GatePass>(key: K, value: GatePass[K]) {
    if (!selected) return
    if (selected.status === 'cancelled') return
    updateGatePass({ ...selected, [key]: value })
  }

  function handleCancelGatePass(gatePass: GatePass) {
    if (gatePass.status !== 'approved') return
    if (deliveryReceipts.some((row) => row.outslipId === gatePass.outslipId)) {
      setMessage('Cannot cancel a Gate Pass after a Delivery Receipt has been created.')
      return
    }
    setMessage(null)
    setCancelTarget(gatePass)
  }

  function confirmCancelGatePass() {
    if (!cancelTarget) return
    const current = gatePasses.find((row) => row.id === cancelTarget.id) ?? cancelTarget
    const result = updateGatePass({ ...current, status: 'cancelled' })
    if (result.error) {
      setMessage(result.error)
      setCancelTarget(null)
      return
    }
    setMessage(null)
    setToast(`Gate Pass ${current.id} cancelled.`)
    setCancelTarget(null)
  }

  const existingDeliveryReceiptId = selected
    ? (deliveryReceipts.find((row) => row.outslipId === selected.outslipId)?.id ?? null)
    : null

  const blockedOutslipIds = useMemo(
    () => new Set(deliveryReceipts.map((row) => row.outslipId)),
    [deliveryReceipts],
  )

  function handleCreateDeliveryReceipt() {
    if (!selected) return
    if (existingDeliveryReceiptId) {
      navigate(`/delivery-receipts?id=${existingDeliveryReceiptId}`)
      return
    }
    const result = createDeliveryReceiptFromOutslip(selected.outslipId)
    if (result.error) {
      setMessage(result.error)
      return
    }
    if (result.receipt) {
      navigate('/delivery-receipts', {
        state: {
          toast: 'Delivery Receipt created successfully.',
          highlightId: result.receipt.id,
        },
      })
    }
  }

  return (
    <div>
      <div className="no-print">
        {toast ? <Toast message={toast} onClose={() => setToast(null)} /> : null}

        <PageHeader
          breadcrumb="Transaction / Gate Pass"
          title="Gate Pass"
          description="Authorize items to leave the premises from a released Outslip, then create the Delivery Receipt."
          action={<AddButton label="New Gate Pass" onClick={openCreate} />}
        />

        <GatePassFiltersBar filters={filters} counts={statusCounts} onChange={setFilters} />

        <GatePassTable
          gatePasses={pagination.items}
          selectedId={selectedId}
          blockedOutslipIds={blockedOutslipIds}
          onSelect={(gatePass) => {
            setSelectedId(gatePass.id)
            setMessage(null)
          }}
          onPrint={handlePrint}
          onCancel={handleCancelGatePass}
        />

        {pagination.totalPages > 1 ? (
          <div className="mt-4">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        ) : null}

        {message ? <p className="mt-3 text-sm text-text-secondary">{message}</p> : null}

        <CreateGatePassFromOutslipDialog
          open={createOpen}
          outslips={outslips}
          usedOutslipIds={gatePasses
            .filter((row) => row.status === 'approved')
            .map((row) => row.outslipId)}
          selectedOutslipId={createOutslipId}
          message={createMessage}
          onSelectedOutslipIdChange={(outslipId) => {
            setCreateOutslipId(outslipId)
            setCreateMessage(null)
          }}
          onConfirm={handleCreateFromOutslip}
          onClose={() => {
            setCreateOpen(false)
            setCreateMessage(null)
          }}
        />

        {selected ? (
          <GatePassDetailModal
            gatePass={selected}
            message={message}
            existingDeliveryReceiptId={existingDeliveryReceiptId}
            onClose={() => setSelectedId(null)}
            onPrint={() => handlePrint(selected)}
            onCancel={() => handleCancelGatePass(selected)}
            onCreateDeliveryReceipt={handleCreateDeliveryReceipt}
            onViewDeliveryReceipt={(receiptId) => navigate(`/delivery-receipts?id=${receiptId}`)}
            onUpdateField={updateSelectedField}
          />
        ) : null}

        <CancelGatePassDialog
          gatePass={cancelTarget}
          onClose={() => setCancelTarget(null)}
          onConfirm={confirmCancelGatePass}
        />
      </div>

      <div className="gatepass-print-root">
        {printTarget ? <GatePassDocument gatePass={printTarget} /> : null}
      </div>
    </div>
  )
}
