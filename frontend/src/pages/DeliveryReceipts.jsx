import { StatusTabs } from '@/components/layout/Breadcrumbs'
import { PageHeader } from '@/components/layout/PageHeader'
import { TransactionLoadError } from '@/components/transactions/TransactionLoadError'
import { TABLE_ACTIONS_CELL_CLASS, TABLE_ACTIONS_HEAD_CLASS, TableActions } from '@/components/ui/action-menu'
import { Badge } from '@/components/ui/badge'
import { ResponsiveTable } from '@/components/ui/responsive-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableLink,
  TableRow,
} from '@/components/ui/table'
import { EmptyState, TableFilters } from '@/components/ui/table-filters'
import { useTransactions } from '@/context/TransactionContext'
import { filterByDateRange } from '@/lib/dateFilter'
import { formatCurrency } from '@/lib/format'
import { getStatusDisplay } from '@/lib/status'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function DeliveryReceiptsPage() {
  const { deliveryReceipts, loading, error, refreshAll } = useTransactions()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [statusTab, setStatusTab] = useState('all')

  const counts = useMemo(
    () => ({
      active: deliveryReceipts.filter((d) => d.status === 'active').length,
      out_for_delivery: deliveryReceipts.filter((d) => d.status === 'out_for_delivery').length,
      delivered: deliveryReceipts.filter((d) => d.status === 'delivered').length,
      all: deliveryReceipts.length,
    }),
    [deliveryReceipts],
  )

  const filtered = useMemo(() => {
    let list = [...deliveryReceipts]
    const q = search.toLowerCase()
    if (q) {
      list = list.filter(
        (d) =>
          d.id.toLowerCase().includes(q) ||
          (d.customerName ?? '').toLowerCase().includes(q) ||
          (d.referenceOutslipId ?? '').toLowerCase().includes(q),
      )
    }
    if (statusTab !== 'all') {
      list = list.filter((d) => d.status === statusTab)
    }
    list = filterByDateRange(list, dateFrom, dateTo, 'date')
    const order = ['active', 'out_for_delivery', 'delivered']
    list.sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status))
    return list
  }, [deliveryReceipts, search, statusTab, dateFrom, dateTo])

  const openDetail = (deliveryId) => {
    navigate(`/delivery-receipt/${encodeURIComponent(deliveryId)}`)
  }

  return (
    <div>
      <PageHeader
        title="Delivery Receipt"
        description="Track and confirm customer deliveries."
        breadcrumbs={['Transaction', 'Delivery Receipt']}
      />

      {loading ? (
        <p className="mb-4 text-sm text-text-secondary">Loading delivery receipts…</p>
      ) : null}

      {error ? <TransactionLoadError message={error} onRetry={refreshAll} /> : null}

      <StatusTabs
        active={statusTab}
        onChange={setStatusTab}
        tabs={[
          { key: 'all', label: 'All', count: counts.all },
          { key: 'active', label: 'Active', count: counts.active },
          { key: 'out_for_delivery', label: 'Out for Delivery', count: counts.out_for_delivery },
          { key: 'delivered', label: 'Delivered', count: counts.delivered },
        ]}
      />

      <TableFilters
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search delivery receipts..."
        showDateRange
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
      />

      <ResponsiveTable
        emptyMessage="No delivery receipts found."
        mobileItems={filtered.map((d) => {
          const st = getStatusDisplay(d.status)
          const itemCount = (d.items ?? []).length
          return {
            id: d.id,
            title: d.id,
            subtitle: d.customerName || d.customerId,
            badge: { label: st.label, variant: st.variant },
            fields: [
              { label: 'Date', value: d.displayDate || d.date },
              { label: 'Total', value: formatCurrency(d.total ?? 0) },
              { label: 'Items', value: `${itemCount} line(s)` },
            ],
            onClick: () => openDetail(d.id),
          }
        })}
        desktop={
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>DR No.</TableHead>
                <TableHead>Reference Outslip</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className={TABLE_ACTIONS_HEAD_CLASS}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={7}>
                    <EmptyState />
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((d) => {
                  const st = getStatusDisplay(d.status)
                  return (
                    <TableRow
                      key={d.id}
                      className="cursor-pointer"
                      onClick={() => openDetail(d.id)}
                    >
                      <TableCell>
                        <TableLink
                          onClick={(event) => {
                            event.stopPropagation()
                            openDetail(d.id)
                          }}
                        >
                          {d.id}
                        </TableLink>
                      </TableCell>
                      <TableCell>{d.referenceOutslipId ?? '—'}</TableCell>
                      <TableCell>{d.customerName || d.customerId}</TableCell>
                      <TableCell>{d.displayDate || d.date}</TableCell>
                      <TableCell>{formatCurrency(d.total ?? 0)}</TableCell>
                      <TableCell>
                        <Badge variant={st.variant}>{st.label}</Badge>
                      </TableCell>
                      <TableCell className={TABLE_ACTIONS_CELL_CLASS} onClick={(event) => event.stopPropagation()}>
                        <TableActions
                          onPrint={() => navigate(`/delivery-receipt/${encodeURIComponent(d.id)}/preview`)}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        }
      />
    </div>
  )
}
