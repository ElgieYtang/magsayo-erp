import { DeliveryReceiptPrint } from '@/components/documents/DeliveryReceiptPrint'
import { PrintActions } from '@/components/documents/DocumentLayout'
import { useTransactions } from '@/context/TransactionContext'
import { useSetupResource } from '@/hooks/useSetupResource'
import { useNavigate, useParams } from 'react-router-dom'

export function DeliveryReceiptPreviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { deliveryReceipts, outslips, loading } = useTransactions()
  const { rows: customers } = useSetupResource('customers')
  const { rows: companies } = useSetupResource('companies')

  const deliveryReceipt = deliveryReceipts.find((dr) => dr.id === id)

  if (loading && !deliveryReceipt) {
    return <p className="text-text-secondary">Loading…</p>
  }

  if (!deliveryReceipt) {
    return <p className="text-text-secondary">Delivery receipt not found.</p>
  }

  const customer =
    customers.find((c) => String(c.id) === String(deliveryReceipt.customerId)) ?? {
      id: deliveryReceipt.customerId,
      name: deliveryReceipt.customerName,
      address: '',
    }
  const outslip = outslips.find(
    (o) =>
      o.id === deliveryReceipt.referenceOutslipId ||
      o.dbId === String(deliveryReceipt.referenceOutslipDbId),
  )
  const company = companies[0]

  return (
    <div className="quotation-print-page">
      <DeliveryReceiptPrint
        deliveryReceipt={{
          ...deliveryReceipt,
          items: deliveryReceipt.items ?? outslip?.items ?? [],
        }}
        customer={customer}
        outslip={outslip}
        company={
          company
            ? {
                name: company.name,
                address: company.address,
                phone: `Tel no: ${company.contactNo ?? ''}`,
                tin: `VAT REG. TIN.: ${company.tinNo ?? ''}`,
                signatoryName: 'LARKE G. GELBOLINGO',
                signatoryTitle: 'CEO/PRESIDENT',
              }
            : undefined
        }
      />
      <PrintActions onBack={() => navigate('/delivery-receipt')} />
    </div>
  )
}
