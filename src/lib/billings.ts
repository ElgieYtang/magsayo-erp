import type {
  Billing,
  BillingLineItem,
  BillingFilters,
  BillingStatus,
} from '@/data/billingTypes'
import type { DeliveryReceipt } from '@/data/erpTypes'
import { todayIsoDate } from '@/lib/quotations'

const STORAGE_KEY = 'erp-billings-v2'

export function formatBillingMoney(value: number): string {
  return `₱${value.toLocaleString('en-PH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`
}

export function formatBillingDisplayDate(isoDate: string): string {
  if (!isoDate) return '—'
  const date = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(date.getTime())) return isoDate
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function normalizeBilling(row: Billing): Billing {
  const amountPaid = Number(row.amountPaid) || 0
  const total = Number(row.total) || 0
  const balance = Math.max(0, total - amountPaid)
  let status: BillingStatus = row.status
  if (balance <= 0 && total > 0) status = 'paid'
  else if (amountPaid > 0 && balance > 0) status = 'partial'
  else if (amountPaid <= 0) status = 'unpaid'
  return { ...row, amountPaid, total, balance, status }
}

export function loadBillings(fallback: Billing[] = []): Billing[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback.map(normalizeBilling)
    const parsed = JSON.parse(raw) as Billing[]
    if (!Array.isArray(parsed)) return fallback.map(normalizeBilling)
    return parsed.map(normalizeBilling)
  } catch {
    return fallback.map(normalizeBilling)
  }
}

export function saveBillings(billings: Billing[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(billings.map(normalizeBilling)))
  window.dispatchEvent(new Event('erp-billings-updated'))
}

export function generateBillingNo(existing: Billing[]): string {
  const numbers = existing.map((row) => Number(row.billingNo.replace(/\D/g, '') || 0))
  const next = Math.max(0, ...numbers) + 1
  return `BS-${String(next).padStart(5, '0')}`
}

export function filterBillings(billings: Billing[], filters: BillingFilters): Billing[] {
  const search = filters.search.trim().toLowerCase()
  return billings.filter((row) => {
    if (filters.status !== 'all' && row.status !== filters.status) return false
    if (filters.dateFrom && row.date < filters.dateFrom) return false
    if (filters.dateTo && row.date > filters.dateTo) return false
    if (!search) return true
    return (
      row.billingNo.toLowerCase().includes(search) ||
      row.customerName.toLowerCase().includes(search) ||
      row.deliveryReceiptNo.toLowerCase().includes(search)
    )
  })
}

export const billingStatusLabel: Record<BillingStatus, string> = {
  unpaid: 'Unpaid',
  partial: 'Partially Paid',
  paid: 'Paid',
}

export function applyBillingPayment(billing: Billing, amount: number): Billing {
  const amountPaid = Math.min(billing.total, billing.amountPaid + amount)
  return normalizeBilling({ ...billing, amountPaid })
}

function addDaysIso(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(date.getTime())) return isoDate
  date.setDate(date.getDate() + days)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function findBillingForDeliveryReceipt(receiptId: string): Billing | undefined {
  return loadBillings([]).find(
    (row) => row.deliveryReceiptId === receiptId || row.deliveryReceiptNo === receiptId,
  )
}

function billedQuantity(item: DeliveryReceipt['items'][number]): number {
  if (item.quantity > 0) return item.quantity
  return item.allowedQuantity > 0 ? item.allowedQuantity : 0
}

function billedLineAmount(item: DeliveryReceipt['items'][number], quantity: number): number {
  const stored = Number(item.total) || 0
  if (stored > 0) return stored
  return quantity * (Number(item.unitPrice) || 0)
}

function billingItemsFromReceipt(receipt: DeliveryReceipt): BillingLineItem[] {
  const lines = receipt.items
    .map((item) => {
      const quantity = billedQuantity(item)
      const unitPrice = Number(item.unitPrice) || 0
      const amount = billedLineAmount(item, quantity)
      return {
        id: crypto.randomUUID(),
        description: item.description || item.itemCode,
        quantity,
        unit: item.unit,
        unitPrice,
        amount,
      }
    })
    .filter((line) => line.quantity > 0 || line.amount > 0)

  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0)
  if (subtotal > 0) return lines

  const fallbackAmount = Number(receipt.totalAmount) || 0
  if (fallbackAmount <= 0) return []

  return [
    {
      id: crypto.randomUUID(),
      description: `Delivery ${receipt.id}`,
      quantity: 1,
      unit: 'lot',
      unitPrice: fallbackAmount,
      amount: fallbackAmount,
    },
  ]
}

function applyReceiptAmounts(billing: Billing, receipt: DeliveryReceipt, customerId = ''): Billing {
  const items = billingItemsFromReceipt(receipt)
  const subtotal = items.reduce((sum, line) => sum + line.amount, 0)
  return normalizeBilling({
    ...billing,
    customerId: customerId || billing.customerId,
    customerName: receipt.customer || billing.customerName,
    deliveryReceiptId: receipt.id,
    deliveryReceiptNo: receipt.id,
    items: items.length > 0 ? items : billing.items,
    subtotal: subtotal > 0 ? subtotal : billing.subtotal,
    tax: billing.tax,
    total: subtotal > 0 ? subtotal : billing.total,
  })
}

function shouldRefreshBillingAmounts(billing: Billing, next: Billing): boolean {
  if (next.total <= 0) return false
  if (billing.total <= 0) return true
  return Math.abs(billing.total - next.total) > 0.0001 && billing.amountPaid <= 0
}

export function syncBillingsWithDeliveryReceipts(
  billings: Billing[],
  receipts: DeliveryReceipt[],
): Billing[] {
  let changed = false
  const next = billings.map((billing) => {
    const receipt = receipts.find(
      (row) => row.id === billing.deliveryReceiptId || row.id === billing.deliveryReceiptNo,
    )
    if (!receipt) return billing
    const refreshed = applyReceiptAmounts(billing, receipt)
    if (!shouldRefreshBillingAmounts(billing, refreshed)) return billing
    changed = true
    return refreshed
  })
  return changed ? next : billings
}

export function createBillingFromDeliveryReceipt(
  receipt: DeliveryReceipt,
  customerId = '',
): Billing {
  const billings = loadBillings([])
  const existing = billings.find(
    (row) => row.deliveryReceiptId === receipt.id || row.deliveryReceiptNo === receipt.id,
  )

  if (existing) {
    const refreshed = applyReceiptAmounts(existing, receipt, customerId)
    if (!shouldRefreshBillingAmounts(existing, refreshed)) return existing
    const next = billings.map((row) => (row.id === refreshed.id ? refreshed : row))
    saveBillings(next)
    return refreshed
  }

  const date = todayIsoDate()
  const billing = applyReceiptAmounts(
    {
      id: crypto.randomUUID(),
      billingNo: generateBillingNo(billings),
      customerId,
      customerName: receipt.customer,
      deliveryReceiptId: receipt.id,
      deliveryReceiptNo: receipt.id,
      date,
      dueDate: addDaysIso(date, 30),
      status: 'unpaid',
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      amountPaid: 0,
      balance: 0,
      remarks: '',
    },
    receipt,
    customerId,
  )

  saveBillings([...billings, billing])
  return billing
}

export const initialBillings: Billing[] = []
