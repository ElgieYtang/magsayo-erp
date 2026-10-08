import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableLink } from '@/components/ui/table'
import type { Billing, BillingStatus } from '@/data/billingTypes'
import {
  billingStatusLabel,
  formatBillingDisplayDate,
  formatBillingMoney,
} from '@/lib/billings'
const statusVariant: Record<BillingStatus, 'pending' | 'current' | 'completed'> = {
  unpaid: 'pending',
  partial: 'pending',
  paid: 'completed',
}

interface BillingTableProps {
  billings: Billing[]
  selectedId: string | null
  onSelect: (billing: Billing) => void
  onPay: (billing: Billing) => void
}

export function BillingTable({
  billings,
  selectedId,
  onSelect,
  onPay,
}: BillingTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <table className="w-full text-sm">
        <thead className="bg-table-header text-left text-xs uppercase tracking-wide text-text-secondary">
          <tr>
            <th className="px-4 py-3">BS No.</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Reference</th>
            <th className="px-4 py-3">Billing Date</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Payment Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {billings.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-text-secondary">
                No billings found.
              </td>
            </tr>
          ) : (
            billings.map((billing) => (
              <tr
                key={billing.id}
                className={
                  selectedId === billing.id
                    ? 'border-t border-border bg-maroon-light/40'
                    : 'border-t border-border'
                }
              >
                <td className="px-4 py-3">
                  <TableLink onClick={() => onSelect(billing)}>{billing.billingNo}</TableLink>
                </td>
                <td className="px-4 py-3 text-text-primary">{billing.customerName}</td>
                <td className="px-4 py-3 text-text-primary">
                  {billing.deliveryReceiptNo || '—'}
                </td>
                <td className="px-4 py-3 text-text-primary">
                  {formatBillingDisplayDate(billing.date)}
                </td>
                <td className="px-4 py-3 text-text-primary">
                  <span className="font-medium">{formatBillingMoney(billing.total)}</span>
                  <span className="text-text-secondary">
                    {' '}
                    (Bal: {formatBillingMoney(billing.balance)})
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[billing.status]}>
                    {billingStatusLabel[billing.status]}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={billing.status === 'paid' || billing.balance <= 0}
                      onClick={() => onPay(billing)}
                    >
                      Pay
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
