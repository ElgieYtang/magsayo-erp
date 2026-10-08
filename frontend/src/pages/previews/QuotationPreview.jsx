import { QuotationPrint } from '@/components/documents/QuotationPrint'
import { PrintActions } from '@/components/documents/DocumentLayout'
import { useTransactions } from '@/context/TransactionContext'
import { useSetupResource } from '@/hooks/useSetupResource'
import { useNavigate, useParams } from 'react-router-dom'

export function QuotationPreviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { quotations, loading } = useTransactions()
  const companies = useSetupResource('companies')
  const customers = useSetupResource('customers')
  const quotation = quotations.find((q) => q.id === id)

  if (loading) {
    return <p className="text-text-secondary">Loading quotation…</p>
  }

  if (!quotation) {
    return <p className="text-text-secondary">Quotation not found.</p>
  }

  const customer = customers.rows.find((c) => c.id === quotation.customerId) ?? {
    name: quotation.customerName,
  }
  const company = companies.rows.find((row) => row.status !== 'Inactive') ?? companies.rows[0]

  return (
    <div className="quotation-print-page">
      <QuotationPrint
        quotation={{
          ...quotation,
          documentNo: quotation.id,
          date: quotation.displayDate ?? quotation.date,
        }}
        customer={customer}
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
      <PrintActions onBack={() => navigate('/quotations')} />
    </div>
  )
}
