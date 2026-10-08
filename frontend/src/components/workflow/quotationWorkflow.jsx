import { WorkflowTracker } from '@/components/workflow/WorkflowTracker'
import { useTransactions } from '@/context/TransactionContext'

function getQuotationWorkflow(quotationId, transactions) {
  const po = transactions.purchaseOrders.find(
    (p) =>
      p.referenceQuotationNo === quotationId ||
      p.referenceQuotationId === quotationId ||
      String(p.referenceQuotationId) === String(quotationId),
  )
  const hasPO = !!po
  const hasReceiving = po
    ? transactions.receivings.some(
        (r) => r.purchaseOrderId === po.id || r.purchaseOrderDbId === po.dbId,
      )
    : false
  const qtn = transactions.quotations.find((q) => q.id === quotationId)
  const outslip = qtn
    ? transactions.outslips.find((o) => String(o.customerId) === String(qtn.customerId))
    : undefined
  const hasOutslip = !!outslip
  const dr = outslip
    ? transactions.deliveryReceipts.find(
        (d) =>
          d.referenceOutslipId === outslip.id ||
          d.referenceOutslipDbId === outslip.dbId,
      )
    : qtn
      ? transactions.deliveryReceipts.find((d) => String(d.customerId) === String(qtn.customerId))
      : undefined
  const hasDR = !!dr
  const hasBilling = dr
    ? transactions.billingStatements.some((b) => b.referenceDrId === dr.id)
    : false

  return [
    { label: 'Quotation', status: 'completed' },
    { label: 'Purchase Order', status: hasPO ? 'completed' : 'current' },
    {
      label: 'Receiving',
      status: hasReceiving ? 'completed' : hasPO ? 'current' : 'future',
    },
    {
      label: 'Outslip',
      status: hasOutslip
        ? outslip?.status === 'for_dispatch'
          ? 'completed'
          : 'current'
        : hasReceiving
          ? 'current'
          : 'future',
    },
    {
      label: 'Delivery Receipt',
      status: hasDR
        ? dr?.status === 'delivered'
          ? 'completed'
          : 'current'
        : hasOutslip
          ? 'current'
          : 'future',
    },
    {
      label: 'Billing',
      status: hasBilling ? 'completed' : hasDR && dr?.status === 'delivered' ? 'current' : 'future',
    },
  ]
}

export function QuotationWorkflow({ quotation }) {
  const transactions = useTransactions()

  return (
    <WorkflowTracker stages={getQuotationWorkflow(quotation.id, transactions)} />
  )
}

export { getQuotationWorkflow }
