import { useAuth } from '@/data/auth'
import { Bell, LogOut, Settings } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const initial = (user?.name ?? 'A').trim().charAt(0).toUpperCase() || 'A'

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-surface px-4 sm:px-6">
      <div />
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          className="rounded-md p-2 text-text-secondary transition-colors hover:bg-maroon-light hover:text-maroon"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-text-primary">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-maroon text-xs font-semibold text-white">
            {initial}
          </div>
          <span>{user?.name ?? 'Admin'}</span>
        </div>
        <Link
          to="/settings"
          className="rounded-md p-2 text-text-secondary transition-colors hover:bg-maroon-light hover:text-maroon"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-md p-2 text-text-secondary transition-colors hover:bg-maroon-light hover:text-maroon"
          aria-label="Log out"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
