import type { SoaViewModel } from '@/lib/soa'
import {
  formatSoaDisplayDate,
  formatSoaMoney,
  formatSoaPeriod,
} from '@/lib/soa'

interface SoaLedgerProps {
  soa: SoaViewModel
}

export function SoaLedger({ soa }: SoaLedgerProps) {
  return (
    <>
      <div className="mb-4 rounded-lg border border-border bg-surface px-4 py-3 text-sm">
        <p className="text-text-secondary">
          Period: {formatSoaPeriod(soa.dateFrom, soa.dateTo)}
        </p>
        <p className="mt-1 font-semibold text-text-primary">{soa.customerName}</p>
      </div>

      <div className="mb-4 overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-table-header text-left text-xs uppercase tracking-wide text-text-secondary">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3 text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {soa.lines.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-text-secondary">
                  No transactions for this customer and period.
                </td>
              </tr>
            ) : (
              soa.lines.map((line) => (
                <tr key={line.id} className="border-t border-border">
                  <td className="px-4 py-3">{formatSoaDisplayDate(line.date)}</td>
                  <td className="px-4 py-3">{line.reference}</td>
                  <td className="px-4 py-3">{line.description}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatSoaMoney(line.balance)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-surface px-4 py-4">
          <p className="text-sm text-text-secondary">Total Charges</p>
          <p className="mt-1 text-2xl font-semibold text-text-primary">
            {formatSoaMoney(soa.totalCharges)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface px-4 py-4">
          <p className="text-sm text-text-secondary">Total Payments</p>
          <p className="mt-1 text-2xl font-semibold text-text-primary">
            {formatSoaMoney(soa.totalPayments)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface px-4 py-4">
          <p className="text-sm text-text-secondary">Outstanding Balance</p>
          <p className="mt-1 text-2xl font-semibold text-maroon">
            {formatSoaMoney(soa.outstandingBalance)}
          </p>
        </div>
      </div>
    </>
  )
}
