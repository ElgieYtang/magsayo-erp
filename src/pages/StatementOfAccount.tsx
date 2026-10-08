import { PageHeader } from '@/components/layout/PageHeader'
import { SoaDocument } from '@/components/soa/SoaDocument'
import { SoaLedger } from '@/components/soa/SoaLedger'
import { SoaPreviewModal } from '@/components/soa/SoaPreviewModal'
import { Button } from '@/components/ui/button'
import { FormField, Input } from '@/components/ui/input'
import type { Billing } from '@/data/billingTypes'
import { useSetupCustomers } from '@/hooks/useSetupCustomers'
import { initialBillings, loadBillings } from '@/lib/billings'
import { buildSoaFromBillings, buildSoaPrintDocument } from '@/lib/soa'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export function StatementOfAccountPage() {
  const customers = useSetupCustomers()
  const [searchParams, setSearchParams] = useSearchParams()
  const [billings, setBillings] = useState<Billing[]>(() => loadBillings(initialBillings))
  const [customerId, setCustomerId] = useState(searchParams.get('customerId') ?? '')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)

  useEffect(() => {
    function refresh() {
      setBillings(loadBillings(initialBillings))
    }
    window.addEventListener('erp-billings-updated', refresh)
    return () => window.removeEventListener('erp-billings-updated', refresh)
  }, [])

  const customerOptions = useMemo(() => {
    const options = new Map<string, { id: string; name: string }>()
    customers.forEach((customer) => {
      options.set(customer.id, { id: customer.id, name: customer.name })
    })
    billings.forEach((billing) => {
      if (billing.customerId && !options.has(billing.customerId)) {
        options.set(billing.customerId, {
          id: billing.customerId,
          name: billing.customerName,
        })
        return
      }
      if (
        !billing.customerId &&
        billing.customerName &&
        ![...options.values()].some((row) => row.name === billing.customerName)
      ) {
        options.set(`name:${billing.customerName}`, {
          id: `name:${billing.customerName}`,
          name: billing.customerName,
        })
      }
    })
    return [...options.values()]
  }, [customers, billings])

  useEffect(() => {
    if (customerId) return
    const fromUrl = searchParams.get('customerId')
    if (fromUrl && customerOptions.some((row) => row.id === fromUrl)) {
      setCustomerId(fromUrl)
      return
    }
    if (billings[0]?.customerId) {
      setCustomerId(billings[0].customerId)
      return
    }
    if (customerOptions.length > 0) {
      setCustomerId(customerOptions[0].id)
    }
  }, [customerId, customerOptions, billings, searchParams])

  useEffect(() => {
    const current = searchParams.get('customerId') ?? ''
    if (!customerId || customerId.startsWith('name:')) {
      if (!current) return
      setSearchParams({}, { replace: true })
      return
    }
    if (current === customerId) return
    setSearchParams({ customerId }, { replace: true })
  }, [customerId, searchParams, setSearchParams])

  const selectedCustomer = customers.find((row) => row.id === customerId)
  const selectedOption = customerOptions.find((row) => row.id === customerId)
  const customerName = selectedCustomer?.name || selectedOption?.name || ''

  const soa = useMemo(
    () =>
      buildSoaFromBillings(
        billings,
        customerId.startsWith('name:') ? '' : customerId,
        dateFrom,
        dateTo,
        customerName,
      ),
    [billings, customerId, dateFrom, dateTo, customerName],
  )

  const printDocument = useMemo(
    () =>
      buildSoaPrintDocument(
        billings,
        customerId.startsWith('name:') ? '' : customerId,
        dateFrom,
        dateTo,
        {
          name: customerName,
          address: selectedCustomer?.address,
          contactPerson: selectedCustomer?.contactPerson,
        },
      ),
    [
      billings,
      customerId,
      dateFrom,
      dateTo,
      customerName,
      selectedCustomer?.address,
      selectedCustomer?.contactPerson,
    ],
  )

  function handlePreview() {
    if (!customerId) {
      window.alert('Please select a customer.')
      return
    }
    setPreviewOpen(true)
  }

  function handlePrint() {
    if (!customerId) {
      window.alert('Please select a customer.')
      return
    }
    setPreviewOpen(false)
    requestAnimationFrame(() => window.print())
  }

  return (
    <div>
      <div className="no-print">
        <PageHeader
          title="Statement of Account"
          description="Generated from billing statements and payments."
          action={
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={handlePreview}>
                Preview
              </Button>
              <Button type="button" variant="secondary" onClick={handlePrint}>
                Print
              </Button>
            </div>
          }
        />

        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <FormField label="Customer" labelClassName="text-xs font-normal text-text-secondary">
            <select
              value={customerId}
              onChange={(event) => setCustomerId(event.target.value)}
              className="flex h-9 w-full rounded-md border border-border-input bg-surface px-3 py-1 text-sm text-text-primary focus-visible:border-maroon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon-light"
            >
              <option value="">Select customer...</option>
              {customerOptions.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Date From" labelClassName="text-xs font-normal text-text-secondary">
            <Input
              type="date"
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
            />
          </FormField>
          <FormField label="Date To" labelClassName="text-xs font-normal text-text-secondary">
            <Input
              type="date"
              value={dateTo}
              onChange={(event) => setDateTo(event.target.value)}
            />
          </FormField>
        </div>

        <SoaLedger soa={soa} />

        {previewOpen ? (
          <SoaPreviewModal
            printDocument={printDocument}
            onClose={() => setPreviewOpen(false)}
            onPrint={handlePrint}
          />
        ) : null}
      </div>

      <div className="soa-print-root">
        <SoaDocument document={printDocument} />
      </div>
    </div>
  )
}
