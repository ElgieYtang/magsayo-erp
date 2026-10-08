export function buildCustomerLedgerRows(bills, payments, getCustomerName) {
  const rows = []
  let balance = 0

  const entries = [
    ...bills.map((bill) => ({
      date: bill.billingDate,
      ref: bill.id,
      description: bill.referenceDrId
        ? `Billing — ${bill.referenceDrId}`
        : `Billing — ${getCustomerName(bill.customerId)}`,
      debit: bill.amount,
      credit: 0,
      sortKey: bill.billingDate,
    })),
    ...payments.map((payment) => ({
      date: payment.date,
      ref: payment.reference,
      description: payment.description,
      debit: 0,
      credit: payment.amount,
      sortKey: payment.date,
    })),
  ].sort((a, b) => String(a.sortKey).localeCompare(String(b.sortKey)))

  for (const entry of entries) {
    balance += entry.debit - entry.credit
    rows.push({ ...entry, balance })
  }

  return rows
}

export function buildSupplierLedgerRows(purchaseOrders, payments) {
  const rows = []
  let balance = 0

  const entries = [
    ...purchaseOrders.map((po) => ({
      date: po.date,
      ref: po.id,
      description: po.referenceQuotationId
        ? `Purchase Order — ${po.referenceQuotationId}`
        : 'Purchase Order',
      debit: po.total,
      credit: 0,
      sortKey: po.date,
    })),
    ...payments.map((payment) => ({
      date: payment.date,
      ref: payment.reference,
      description: payment.description,
      debit: 0,
      credit: payment.amount,
      sortKey: payment.date,
    })),
  ].sort((a, b) => String(a.sortKey).localeCompare(String(b.sortKey)))

  for (const entry of entries) {
    balance += entry.debit - entry.credit
    rows.push({ ...entry, balance })
  }

  return rows
}

export function ledgerTotals(rows) {
  const totalDebit = rows.reduce((sum, row) => sum + row.debit, 0)
  const totalCredit = rows.reduce((sum, row) => sum + row.credit, 0)
  return {
    totalDebit,
    totalCredit,
    outstanding: totalDebit - totalCredit,
  }
}
