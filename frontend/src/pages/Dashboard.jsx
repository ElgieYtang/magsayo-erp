import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableLink,
  TableRow,
} from '@/components/ui/table'
import { useTransactions } from '@/context/TransactionContext'
import { formatCurrency } from '@/lib/format'
import { getStatusDisplay } from '@/lib/status'
import { AlertCircle, ClipboardList, FileText, ShoppingCart, Truck } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

export function DashboardPage() {
  const {
    quotations,
    purchaseOrders,
    receivings,
    deliveryReceipts,
    outslips,
    billingStatements,
    loading,
    error,
  } = useTransactions()
  const navigate = useNavigate()

  const pendingQuotations = quotations.filter((q) => q.status === 'pending').length
  const pendingReceiving = receivings.filter((r) => r.status !== 'completed').length
  const openPurchaseOrders = purchaseOrders.filter(
    (p) => p.status !== 'cancelled' && p.status !== 'fully_received',
  ).length
  const activeDeliveries = deliveryReceipts.filter(
    (d) => d.status === 'out_for_delivery' || d.status === 'active',
  ).length
  const pendingOutslips = outslips.filter(
    (o) => o.status === 'pending' || o.status === 'approved',
  ).length
  const unpaidBills = billingStatements.filter((b) => b.paymentStatus !== 'paid').length

  const stats = [
    {
      label: 'Pending Quotations',
      value: String(pendingQuotations),
      change: 'Needs attention',
      icon: FileText,
      path: '/quotations',
    },
    {
      label: 'Open Purchase Orders',
      value: String(openPurchaseOrders),
      change: 'Supplier POs',
      icon: ShoppingCart,
      path: '/purchase-order',
    },
    {
      label: 'Open Receiving',
      value: String(pendingReceiving),
      change: 'Stock in from suppliers',
      icon: ClipboardList,
      path: '/inventory/receiving',
    },
    {
      label: 'Active Deliveries',
      value: String(activeDeliveries),
      change: 'See delivery receipts',
      icon: Truck,
      path: '/delivery-receipt',
    },
  ]

  const recentRows = useMemo(() => {
    const rows = [
      ...quotations.slice(0, 5).map((q) => ({
        id: q.id,
        type: 'Quotation',
        party: q.customerName || '—',
        amount: formatCurrency(q.total ?? 0),
        status: q.status,
        path: `/quotations/${q.id}`,
        sort: q.date ?? '',
      })),
      ...purchaseOrders.slice(0, 5).map((p) => ({
        id: p.id,
        type: 'Purchase Order',
        party: p.supplierName || '—',
        amount: formatCurrency(p.total ?? 0),
        status: p.status,
        path: `/purchase-order/${p.id}`,
        sort: p.date ?? '',
      })),
      ...receivings.slice(0, 5).map((r) => ({
        id: r.id,
        type: 'Receiving',
        party: r.supplierName || '—',
        amount: '—',
        status: r.status,
        path: '/inventory/receiving',
        sort: r.date ?? '',
      })),
      ...deliveryReceipts.slice(0, 5).map((d) => ({
        id: d.id,
        type: 'Delivery Receipt',
        party: d.customerName || '—',
        amount: formatCurrency(d.total ?? 0),
        status: d.status,
        path: `/delivery-receipt/${d.id}/preview`,
        sort: d.date ?? '',
      })),
    ]

    return rows.sort((a, b) => String(b.sort).localeCompare(String(a.sort))).slice(0, 8)
  }, [quotations, purchaseOrders, receivings, deliveryReceipts])

  const needsAttention = [
    pendingQuotations > 0 ? `${pendingQuotations} quotation(s) pending approval` : null,
    pendingReceiving > 0 ? `${pendingReceiving} receiving record(s) still open` : null,
    pendingOutslips > 0 ? `${pendingOutslips} outslip(s) awaiting dispatch` : null,
    unpaidBills > 0 ? `${unpaidBills} billing statement(s) unpaid / partial` : null,
  ].filter(Boolean)

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of current transactions and workflow status."
      />

      {loading ? (
        <p className="mb-4 text-sm text-text-secondary">Loading dashboard…</p>
      ) : null}
      {error ? (
        <p className="mb-4 rounded-md border border-[#DC2626]/30 bg-[#FEE2E2] px-3 py-2 text-sm text-[#DC2626]">
          {error}
        </p>
      ) : null}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <button
            key={stat.label}
            type="button"
            onClick={() => navigate(stat.path)}
            className="text-left"
          >
            <Card className="h-full transition-colors hover:border-maroon/30">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-text-secondary">{stat.label}</p>
                    <p className="mt-2 text-3xl font-semibold text-text-primary">{stat.value}</p>
                    <p className="mt-1 text-xs text-text-secondary">{stat.change}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-maroon-light">
                    <stat.icon className="h-5 w-5 text-maroon" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-base font-semibold text-text-primary">Recent Transactions</h2>
          <Card>
            <CardContent className="overflow-x-auto pt-2">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Document No.</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Party</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRows.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={5} className="text-text-secondary">
                        No transactions yet. Start with a quotation.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentRows.map((tx) => {
                      const st = getStatusDisplay(tx.status)
                      return (
                        <TableRow key={`${tx.type}-${tx.id}`}>
                          <TableCell>
                            <TableLink onClick={() => navigate(tx.path)}>{tx.id}</TableLink>
                          </TableCell>
                          <TableCell>{tx.type}</TableCell>
                          <TableCell>{tx.party}</TableCell>
                          <TableCell>{tx.amount}</TableCell>
                          <TableCell>
                            <Badge variant={st.variant}>{st.label}</Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="mb-3 text-base font-semibold text-text-primary">Needs Attention</h2>
          <Card>
            <CardContent className="pt-4">
              {needsAttention.length === 0 ? (
                <p className="text-sm text-text-secondary">All caught up.</p>
              ) : (
                <ul className="space-y-3">
                  {needsAttention.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-text-primary">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-maroon" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
