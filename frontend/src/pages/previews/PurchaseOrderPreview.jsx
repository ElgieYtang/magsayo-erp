import { PurchaseOrderPrint } from '@/components/documents/PurchaseOrderPrint'
import { PrintActions } from '@/components/documents/DocumentLayout'
import { useTransactions } from '@/context/TransactionContext'
import { useSetupResource } from '@/hooks/useSetupResource'
import { useNavigate, useParams } from 'react-router-dom'

export function PurchaseOrderPreviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { purchaseOrders, loading } = useTransactions()
  const companies = useSetupResource('companies')
  const purchaseOrder = purchaseOrders.find((po) => po.id === id)

  if (loading) {
    return <p className="text-text-secondary">Loading purchase order…</p>
  }

  if (!purchaseOrder) {
    return <p className="text-text-secondary">Purchase order not found.</p>
  }

  const supplier = {
    name: purchaseOrder.supplierName,
  }
  const company = companies.rows.find((row) => row.status !== 'Inactive') ?? companies.rows[0]

  return (
    <div className="quotation-print-page">
      <PurchaseOrderPrint
        purchaseOrder={{
          ...purchaseOrder,
          documentNo: purchaseOrder.id,
          date: purchaseOrder.displayDate ?? purchaseOrder.date,
        }}
        supplier={supplier}
        company={
          company
            ? {
                name: company.name,
                address: company.address,
                phone: `Tel no: ${company.contactNo}`,
                tin: `VAT REG. TIN.: ${company.tinNo}`,
                signatoryName: 'LARKE G. GELBOLINGO',
                signatoryTitle: 'CEO/PRESIDENT',
              }
            : undefined
        }
      />
      <PrintActions onBack={() => navigate('/purchase-order')} />
    </div>
  )
}
