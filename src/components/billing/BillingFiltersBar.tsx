import { FormField, Input } from '@/components/ui/input'
import type { BillingFilterStatus, BillingFilters } from '@/data/billingTypes'
import { Search } from 'lucide-react'

interface BillingFiltersBarProps {
  filters: BillingFilters
  onChange: (filters: BillingFilters) => void
}

export function BillingFiltersBar({ filters, onChange }: BillingFiltersBarProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end">
      <div className="relative min-w-0 flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
          aria-hidden="true"
        />
        <Input
          aria-label="Search billings"
          placeholder="Search..."
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          className="pl-9"
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-[36rem]">
        <FormField label="Date From" labelClassName="text-xs font-normal text-text-secondary">
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(event) => onChange({ ...filters, dateFrom: event.target.value })}
          />
        </FormField>
        <FormField label="Date To" labelClassName="text-xs font-normal text-text-secondary">
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(event) => onChange({ ...filters, dateTo: event.target.value })}
          />
        </FormField>
        <FormField label="Status" labelClassName="text-xs font-normal text-text-secondary">
          <select
            value={filters.status}
            onChange={(event) =>
              onChange({
                ...filters,
                status: event.target.value as BillingFilterStatus,
              })
            }
            className="flex h-9 w-full rounded-md border border-border-input bg-surface px-3 py-1 text-sm text-text-primary focus-visible:border-maroon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon-light"
          >
            <option value="all">All Status</option>
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partially Paid</option>
            <option value="paid">Paid</option>
          </select>
        </FormField>
      </div>
    </div>
  )
}
