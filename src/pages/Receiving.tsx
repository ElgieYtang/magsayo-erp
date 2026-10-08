import { CreateReceivingFromPoDialog } from '@/components/receiving/CreateReceivingFromPoDialog'
import { ReceivingDetailModal } from '@/components/receiving/ReceivingDetailModal'
import { ReceivingDocument } from '@/components/receiving/ReceivingDocument'
import { ReceivingFiltersBar } from '@/components/receiving/ReceivingFiltersBar'
import { ReceivingTable } from '@/components/receiving/ReceivingTable'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import { Toast } from '@/components/ui/toast'
import { useErp } from '@/data/erpStore'
import type { Receiving } from '@/data/erpTypes'
import type { PurchaseOrder } from '@/data/purchaseOrderTypes'
import {
  clearReceivingFlash,
  filterReceivings,
  handleReceivingPrint,
  paginateItems,
  readReceivingFlash,
  receivingCreatedToast,
  sortReceivingsByDateDesc,
  type ReceivingFilters,
} from '@/lib/receivings'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const PAGE_SIZE = 10

const defaultFilters: ReceivingFilters = {
  status: 'all',
  search: '',
  dateFrom: '',
  dateTo: '',
}

export function ReceivingPage() {
  const {
    receivings,
    purchaseOrders,
    confirmReceiving,
    createReceivingFromPO,
  } = useErp()
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const poQuery = params.get('po')
  const idQuery = params.get('id')
  const initialFlash = readReceivingFlash()
  const initialReceivingId = idQuery ?? initialFlash?.highlightId ?? null

  const [detailId, setDetailId] = useState<string | null>(initialReceivingId)
  const [highlightedId, setHighlightedId] = useState<string | null>(
    () => initialReceivingId,
  )
  const [toast, setToast] = useState<string | null>(() => initialFlash?.toast ?? null)
  const [detailMessage, setDetailMessage] = useState<string | null>(null)
  const [filters, setFilters] = useState<ReceivingFilters>(() =>
    initialFlash?.highlightId ? { ...defaultFilters, status: 'pending' } : defaultFilters,
  )
  const [page, setPage] = useState(1)
  const [printReceiving, setPrintReceiving] = useState<Receiving | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [createPoId, setCreatePoId] = useState('')
  const [createMessage, setCreateMessage] = useState<string | null>(null)

  const selectedPo = useMemo(() => {
    if (!poQuery) return null
    return (
      purchaseOrders.find((row) => row.poNo === poQuery) ??
      purchaseOrders.find((row) => row.id === poQuery) ??
      null
    )
  }, [poQuery, purchaseOrders])

  const eligiblePurchaseOrders = useMemo(
    () =>
      purchaseOrders.filter(
        (row) =>
          (row.status === 'approved' || row.status === 'completed') && !row.receivingId,
      ),
    [purchaseOrders],
  )

  const filteredReceivings = useMemo(
    () => sortReceivingsByDateDesc(filterReceivings(receivings, filters)),
    [receivings, filters],
  )

  const pagination = useMemo(
    () => paginateItems(filteredReceivings, page, PAGE_SIZE),
    [filteredReceivings, page],
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
    clearReceivingFlash()
  }, [])

  useEffect(() => {
    if (!idQuery) return
    setDetailId(idQuery)
    setHighlightedId(idQuery)
  }, [idQuery])

  const selected = receivings.find((row) => row.id === detailId) ?? null

  function openReceiving(receiving: Receiving) {
    setDetailId(receiving.id)
    setDetailMessage(null)
    setHighlightedId(receiving.id)
  }

  function closeDetail() {
    setDetailId(null)
    setDetailMessage(null)
    if (idQuery) {
      navigate('/inventory/receiving', { replace: true })
    }
  }

  function handleConfirm() {
    if (!selected) return
    const result = confirmReceiving(selected.id)
    if (result.error) {
      setDetailMessage(result.error)
      return
    }
    setDetailMessage(null)
  }

  function openCreateOutslip() {
    if (!selected) return
    navigate(`/outslips?receiving=${encodeURIComponent(selected.id)}`)
  }

  function showPendingReceiving(receiving: Receiving, alreadyHad: boolean) {
    setCreateOpen(false)
    setCreateMessage(null)
    setDetailId(null)
    setDetailMessage(null)
    setHighlightedId(receiving.id)
    setFilters((current) => ({ ...current, status: 'pending' }))
    if (!alreadyHad) {
      setToast(receivingCreatedToast(receiving.id))
    }
  }

  function createPendingFromPo(po: PurchaseOrder) {
    const alreadyHad =
      Boolean(po.receivingId) ||
      receivings.some((row) => row.poRecordId === po.id || row.poId === po.poNo)

    const existing =
      (po.receivingId ? receivings.find((row) => row.id === po.receivingId) : undefined) ??
      receivings.find((row) => row.poRecordId === po.id || row.poId === po.poNo)

    if (existing?.status === 'pending') {
      setDetailId(existing.id)
      setDetailMessage(null)
      setHighlightedId(existing.id)
      setFilters((current) => ({ ...current, status: 'pending' }))
      return
    }

    const result = createReceivingFromPO(po.id)
    if (result.error || !result.receiving) {
      setCreateMessage(result.error ?? 'Could not create receiving.')
      setCreateOpen(true)
      return
    }

    showPendingReceiving(result.receiving, alreadyHad)
  }

  function openCreate() {
    if (selectedPo) {
      createPendingFromPo(selectedPo)
      return
    }
    setCreatePoId('')
    setCreateMessage(null)
    setCreateOpen(true)
  }

  function closeCreate() {
    setCreateOpen(false)
    setCreateMessage(null)
  }

  function handleCreateFromPo() {
    if (!createPoId) {
      setCreateMessage('Select an approved PO first.')
      return
    }
    const po = purchaseOrders.find((row) => row.id === createPoId)
    if (!po) {
      setCreateMessage('Selected Purchase Order is not available.')
      return
    }
    createPendingFromPo(po)
  }

  function handlePrint(receiving: Receiving) {
    setPrintReceiving(receiving)
    requestAnimationFrame(() => handleReceivingPrint())
  }

  return (
    <div>
      <div className="no-print">
        {toast ? <Toast message={toast} onClose={() => setToast(null)} /> : null}

        <PageHeader
          breadcrumb="Transaction / Receiving"
          title="Receiving"
          description="Incoming goods from supplier POs. Posts to inventory (in)."
          action={
            <Button type="button" onClick={openCreate}>
              New Receiving
            </Button>
          }
        />

        <ReceivingFiltersBar filters={filters} onChange={setFilters} />

        <ReceivingTable
          receivings={pagination.items}
          highlightedId={highlightedId}
          onSelect={openReceiving}
          onPrint={handlePrint}
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

        <CreateReceivingFromPoDialog
          open={createOpen}
          purchaseOrders={eligiblePurchaseOrders}
          selectedPoId={createPoId}
          message={createMessage}
          onSelectedPoIdChange={setCreatePoId}
          onConfirm={handleCreateFromPo}
          onClose={closeCreate}
        />

        {selected ? (
          <ReceivingDetailModal
            receiving={selected}
            message={detailMessage}
            onClose={closeDetail}
            onConfirm={handleConfirm}
            onCreateOutslip={openCreateOutslip}
          />
        ) : null}
      </div>

      <div className="receiving-print-root">
        {printReceiving ? <ReceivingDocument receiving={printReceiving} /> : null}
      </div>
    </div>
  )
}
