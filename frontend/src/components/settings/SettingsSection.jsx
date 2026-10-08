import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

export function SettingsSection({ icon: Icon, title, children, className, id }) {
  return (
    <Card id={id} className={className}>
        <CardHeader className="flex flex-row items-center gap-2">
        {Icon ? <Icon className="h-5 w-5 text-maroon" /> : null}
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function SettingsToggleRow({ title, description, checked, onChange, disabled }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-4 last:border-b-0">
      <div className="min-w-0 pr-2">
        <p className="text-sm font-medium text-text-primary">{title}</p>
        {description ? (
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
        ) : null}
      </div>
      <Switch checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  )
}

export function SettingsSelect({ value, onChange, options, className }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={cn(
        'flex h-10 w-full rounded-md border border-border-input bg-surface px-3 text-sm text-text-primary',
        'focus-visible:border-maroon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon-light',
        className,
      )}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
