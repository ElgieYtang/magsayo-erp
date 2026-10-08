import type { Receiving, ReceivingItem, ReceivingStatus } from '@/data/erpTypes'
import type { PurchaseOrder } from '@/data/purchaseOrderTypes'
import { formatDisplayDate, paginateItems, todayIsoDate } from '@/lib/purchaseOrders'

export type ReceivingListFilterStatus = 'all' | 'pending' | 'completed'

export interface ReceivingFilters {
  status: ReceivingListFilterStatus
  search: string
  dateFrom: string
  dateTo: string
}

export const receivingListStatusLabel: Record<ReceivingStatus, string> = {
  pending: 'Pending',
  completed: 'Completed',
}

export { formatDisplayDate, paginateItems }

const STORAGE_KEY = 'erp-receivings'

function parseNumberFromId(id: string): number {
  const numeric = Number(id.split('-').at(-1) ?? 0)
  return Number.isNaN(numeric) ? 0 : numeric
}

export function generateReceivingId(receivings: Receiving[], _dateIso?: string): string {
  const maxSeries = receivings.reduce((max, row) => {
    if (!/^(?:RCV|REC)(?:-\d{4})?-\d+$/.test(row.id)) return max
    return Math.max(max, parseNumberFromId(row.id))
  }, 0)
  return `RCV-${String(maxSeries + 1).padStart(5, '0')}`
}

export function buildReceivingItemsFromPo(po: PurchaseOrder): ReceivingItem[] {
  return po.items.map((item) => ({
    id: crypto.randomUUID(),
    itemCode: item.itemCode,
    description: item.itemName,
    orderedQuantity: item.quantity,
    receivedQuantity: 0,
    unit: item.unit,
    unitPrice: item.unitPrice,
  }))
}

export function buildReceivingFromPo(
  po: PurchaseOrder,
  receivings: Receiving[],
  preparedBy = 'WEB ADMINISTRATOR',
): Receiving {
  const date = todayIsoDate()
  return {
    id: generateReceivingId(receivings, date),
    date,
    poId: po.poNo,
    poRecordId: po.id,
    supplier: po.supplier,
    warehouse: 'Main Warehouse',
    items: buildReceivingItemsFromPo(po),
    remarks: po.remarks,
    status: 'pending',
    preparedBy,
    confirmedBy: '',
  }
}

export function loadReceivings(fallback: Receiving[] = []): Receiving[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as Receiving[]
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

export function saveReceivings(
  receivings: Receiving[],
  options: { emitEvent?: boolean } = {},
) {
  const serialized = JSON.stringify(receivings)
  if (localStorage.getItem(STORAGE_KEY) === serialized) return
  localStorage.setItem(STORAGE_KEY, serialized)
  if (options.emitEvent === false) return
  window.dispatchEvent(new Event('erp-receivings-updated'))
}

function matchesReceivingSearch(receiving: Receiving, search: string): boolean {
  const query = search.trim().toLowerCase()
  if (!query) return true
  const haystack = [
    receiving.id,
    receiving.poId,
    receiving.supplier,
    receiving.status,
    receivingListStatusLabel[receiving.status],
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(query)
}

function matchesReceivingDateRange(
  receiving: Receiving,
  dateFrom: string,
  dateTo: string,
): boolean {
  if (dateFrom && receiving.date < dateFrom) return false
  if (dateTo && receiving.date > dateTo) return false
  return true
}

export function filterReceivings(
  receivings: Receiving[],
  filters: ReceivingFilters,
): Receiving[] {
  return receivings.filter((receiving) => {
    if (filters.status !== 'all' && receiving.status !== filters.status) return false
    if (!matchesReceivingSearch(receiving, filters.search)) return false
    if (!matchesReceivingDateRange(receiving, filters.dateFrom, filters.dateTo)) {
      return false
    }
    return true
  })
}

export function sortReceivingsByDateDesc(receivings: Receiving[]): Receiving[] {
  return [...receivings].sort(
    (a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id),
  )
}

export function handleReceivingPrint() {
  window.print()
}

export const RECEIVING_COMPLETED_TOAST =
  'Receiving completed successfully. Inventory has been updated.'

export const RECEIVING_CREATED_TOAST = 'Receiving created.'

export function receivingCreatedToast(receivingId: string) {
  return `Receiving ${receivingId} created.`
}

export function formatReceivingReference(receivingId: string) {
  const match = receivingId.match(/(\d+)\s*$/)
  if (!match) return receivingId
  return `RCV #${Number(match[1])}`
}

const RECEIVING_FLASH_KEY = 'erp-receiving-flash'

export type ReceivingFlash = {
  toast?: string
  highlightId?: string
  selectedPoNo?: string
}

export function setReceivingFlash(flash: ReceivingFlash) {
  sessionStorage.setItem(RECEIVING_FLASH_KEY, JSON.stringify(flash))
}

export function readReceivingFlash(): ReceivingFlash | null {
  try {
    const raw = sessionStorage.getItem(RECEIVING_FLASH_KEY)
    if (!raw) return null
    return JSON.parse(raw) as ReceivingFlash
  } catch {
    return null
  }
}

export function clearReceivingFlash() {
  sessionStorage.removeItem(RECEIVING_FLASH_KEY)
}
