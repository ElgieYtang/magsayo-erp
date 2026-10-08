import { Input, Label } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'

export function TableFilters({
  search,
  onSearchChange,
  searchPlaceholder = 'Search...',
  statusFilter,
  onStatusChange,
  statusOptions,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  showDateRange = false,
  className,
}) {
  return (
    <div className={cn('mb-4 flex flex-wrap items-end gap-3 no-print', className)}>
      <div className="relative min-w-[200px] flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-9"
        />
      </div>

      {showDateRange && onDateFromChange && onDateToChange && (
        <>
          <div className="space-y-1.5">
            <Label className="text-xs text-text-secondary">Date From</Label>
            <Input
              type="date"
              value={dateFrom ?? ''}
              onChange={(e) => onDateFromChange(e.target.value)}
              className="w-[160px]"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-text-secondary">Date To</Label>
            <Input
              type="date"
              value={dateTo ?? ''}
              onChange={(e) => onDateToChange(e.target.value)}
              className="w-[160px]"
            />
          </div>
        </>
      )}

      {statusOptions && onStatusChange && (
        <div className="space-y-1.5">
          <Label className="text-xs text-text-secondary">Status</Label>
          <select
            value={statusFilter ?? 'all'}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-9 rounded-md border border-border-input bg-surface px-3 text-sm text-text-primary focus:border-maroon focus:outline-none focus:ring-2 focus:ring-maroon-light"
          >
            <option value="all">All Status</option>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}

export function DateRangeFilter({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  className,
}) {
  return (
    <div className={cn('flex flex-wrap items-end gap-3', className)}>
      <div className="space-y-1.5">
        <Label className="text-xs text-text-secondary">Date From</Label>
        <Input
          type="date"
          value={dateFrom ?? ''}
          onChange={(e) => onDateFromChange(e.target.value)}
          className="w-[160px]"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-text-secondary">Date To</Label>
        <Input
          type="date"
          value={dateTo ?? ''}
          onChange={(e) => onDateToChange(e.target.value)}
          className="w-[160px]"
        />
      </div>
    </div>
  )
}

export function EmptyState({ message }) {
  return (
    <div className="py-12 text-center">
      <p className="text-sm font-medium text-text-primary">
        {message ?? 'No transactions found.'}
      </p>
      <p className="mt-1 text-sm text-text-secondary">
        Try adjusting your search or filters.
      </p>
    </div>
  )
}
