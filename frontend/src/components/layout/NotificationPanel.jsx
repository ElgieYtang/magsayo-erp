import { useNotifications } from '@/hooks/useNotifications'
import { cn } from '@/lib/utils'
import { Bell } from 'lucide-react'
import { Link } from 'react-router-dom'

function NotificationDot({ active, unread, status }) {
  if (!active) return null

  return (
    <span
      className={cn(
        'mt-2 h-2.5 w-2.5 shrink-0 rounded-full',
        unread ? 'bg-maroon ring-4 ring-maroon/15' : 'bg-border',
        status === 'out_for_delivery' && unread && 'bg-amber-500 ring-amber-500/20',
        status === 'active' && unread && 'animate-pulse',
      )}
      aria-hidden
      title={unread ? 'Unread alert' : 'Seen alert'}
    />
  )
}

export function NotificationPanel({ open, onClose }) {
  const { notifications, count, totalCount, enabled, loading, markAsRead } = useNotifications()

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-label="Notifications"
      className="absolute right-0 z-50 mt-2 w-[min(100vw-2rem,380px)] overflow-hidden rounded-lg border border-border bg-surface shadow-xl"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-maroon" />
          <p className="text-sm font-semibold text-text-primary">Notifications</p>
          {count > 0 ? (
            <span className="rounded-full bg-maroon px-2 py-0.5 text-[11px] font-semibold text-white">
              {count}
            </span>
          ) : totalCount > 0 ? (
            <span className="rounded-full bg-border px-2 py-0.5 text-[11px] font-semibold text-text-secondary">
              {totalCount}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-medium text-text-secondary hover:text-maroon"
        >
          Close
        </button>
      </div>

      {!enabled ? (
        <div className="px-4 py-6 text-center text-sm text-text-secondary">
          <p>In-app notifications are turned off.</p>
          <Link
            to="/settings#notifications"
            onClick={onClose}
            className="mt-2 inline-block font-medium text-maroon hover:underline"
          >
            Enable in settings
          </Link>
        </div>
      ) : loading && totalCount === 0 ? (
        <p className="px-4 py-6 text-sm text-text-secondary">Loading alerts…</p>
      ) : totalCount === 0 ? (
        <p className="px-4 py-6 text-sm text-text-secondary">
          You&apos;re all caught up. No items need attention right now.
        </p>
      ) : (
        <ul className="max-h-80 overflow-y-auto">
          {notifications.map((item) => (
            <li key={item.id} className="border-b border-border last:border-b-0">
              <Link
                to={item.path}
                onClick={() => {
                  markAsRead(item.id)
                  onClose()
                }}
                className={cn(
                  'flex gap-3 px-4 py-3 transition-colors hover:bg-maroon-light',
                  item.unread && 'bg-maroon-light/40',
                )}
              >
                <NotificationDot active={item.active} unread={item.unread} status={item.status} />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-maroon">
                    {item.categoryLabel}
                  </p>
                  <p
                    className={cn(
                      'mt-0.5 text-sm text-text-primary',
                      item.unread ? 'font-semibold' : 'font-medium',
                    )}
                  >
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-sm text-text-secondary">{item.message}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="border-t border-border bg-page px-4 py-3">
        <Link
          to="/settings#notifications"
          onClick={onClose}
          className="flex h-8 w-full items-center justify-center rounded-md border border-border text-sm font-medium text-text-primary transition-colors hover:bg-maroon-light"
        >
          Notification preferences
        </Link>
      </div>
    </div>
  )
}

export function NotificationBellButton({ open, count, enabled, onClick, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative rounded-md p-2 text-text-secondary transition-colors hover:bg-maroon-light hover:text-maroon',
        open && 'bg-maroon-light text-maroon',
        className,
      )}
      aria-label={count > 0 ? `${count} notifications` : 'Notifications'}
      aria-expanded={open}
    >
      <Bell className="h-5 w-5" />
      {enabled && count > 0 ? (
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-maroon px-1 text-[10px] font-bold leading-none text-white">
          {count > 9 ? '9+' : count}
        </span>
      ) : null}
    </button>
  )
}
