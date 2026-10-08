import { request } from '@/lib/api'

function fetchCustomerLedger({ customerId, from, to } = {}) {
  const params = new URLSearchParams()
  if (customerId) params.set('customerId', customerId)
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  const qs = params.toString()
  return request(`/reports/customer-ledger${qs ? `?${qs}` : ''}`).then((payload) => payload.data)
}

function fetchSoa({ customerId, from, to } = {}) {
  const params = new URLSearchParams()
  if (customerId) params.set('customerId', customerId)
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  const qs = params.toString()
  return request(`/reports/soa${qs ? `?${qs}` : ''}`).then((payload) => payload.data)
}

function fetchSupplierLedger({ supplierId, from, to } = {}) {
  const params = new URLSearchParams()
  if (supplierId) params.set('supplierId', supplierId)
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  const qs = params.toString()
  return request(`/reports/supplier-ledger${qs ? `?${qs}` : ''}`).then((payload) => payload.data)
}

function fetchInventoryReport({ branchId, q } = {}) {
  const params = new URLSearchParams()
  if (branchId) params.set('branchId', branchId)
  if (q) params.set('q', q)
  const qs = params.toString()
  return request(`/reports/inventory${qs ? `?${qs}` : ''}`).then((payload) => payload.data)
}

export {
  fetchCustomerLedger,
  fetchInventoryReport,
  fetchSoa,
  fetchSupplierLedger,
}
