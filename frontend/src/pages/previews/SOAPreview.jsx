import { SOAPrint } from '@/components/documents/SOAPrint'
import { PrintActions } from '@/components/documents/DocumentLayout'
import { useSetupResource } from '@/hooks/useSetupResource'
import { fetchSoa } from '@/lib/reportsApi'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export function SOAPreviewPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { rows: customers } = useSetupResource('customers')
  const customerId = searchParams.get('customerId') ?? customers[0]?.id ?? ''
  const dateFrom = searchParams.get('from') ?? ''
  const dateTo = searchParams.get('to') ?? ''
  const [account, setAccount] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!customerId) return
    let cancelled = false
    fetchSoa({
      customerId,
      from: dateFrom || undefined,
      to: dateTo || undefined,
    })
      .then((data) => {
        if (!cancelled) setAccount(data)
      })
      .catch((caught) => {
        if (!cancelled) setError(caught?.message ?? 'Could not load SOA.')
      })
    return () => {
      cancelled = true
    }
  }, [customerId, dateFrom, dateTo])

  const backPath = customerId
    ? `/soa?customerId=${encodeURIComponent(customerId)}`
    : '/soa'

  if (error) {
    return <p className="text-text-secondary">{error}</p>
  }

  if (!account) {
    return <p className="text-text-secondary">Loading SOA…</p>
  }

  const customer = customers.find((row) => String(row.id) === String(customerId))

  return (
    <div className="quotation-print-page">
      <SOAPrint
        account={account}
        attention={customer?.contactPerson || customer?.attention}
      />
      <PrintActions onBack={() => navigate(backPath)} />
    </div>
  )
}
