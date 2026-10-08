import { NotificationBellButton, NotificationPanel } from '@/components/layout/NotificationPanel'
import { useAuth } from '@/context/AuthContext'
import { useNotifications } from '@/hooks/useNotifications'
import { cn } from '@/lib/utils'
import { ChevronDown, LogOut, Menu, Settings, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export function Header({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const menuRef = useRef(null)
  const bellRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const { count, enabled } = useNotifications()

  const initial = user?.name?.charAt(0).toUpperCase() ?? 'A'

  useEffect(() => {
    if (!menuOpen && !notificationsOpen) return

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setNotificationsOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [menuOpen, notificationsOpen])

  useEffect(() => {
    setMenuOpen(false)
    setNotificationsOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    setMenuOpen(false)
    await logout()
    navigate('/login', { replace: true })
  }

  const handleViewProfile = () => {
    setMenuOpen(false)
    navigate('/profile')
  }

  return (
    <header className="app-shell-header sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-surface px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-maroon-light hover:text-maroon md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div ref={bellRef} className="relative">
          <NotificationBellButton
            open={notificationsOpen}
            count={count}
            enabled={enabled}
            onClick={() => {
              setNotificationsOpen((open) => !open)
              setMenuOpen(false)
            }}
          />
          <NotificationPanel
            open={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
          />
        </div>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setMenuOpen((open) => !open)
              setNotificationsOpen(false)
            }}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-text-primary transition-colors hover:bg-maroon-light',
              menuOpen && 'bg-maroon-light',
            )}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-maroon text-xs font-semibold text-white">
              {initial}
            </div>
            <span className="hidden sm:inline">{user?.name ?? 'Admin'}</span>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-text-secondary transition-transform',
                menuOpen && 'rotate-180',
              )}
            />
          </button>

          {menuOpen ? (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-48 overflow-hidden rounded-md border border-border bg-surface py-1 shadow-lg"
            >
              <button
                type="button"
                role="menuitem"
                onClick={handleViewProfile}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-text-primary transition-colors hover:bg-maroon-light"
              >
                <User className="h-4 w-4 text-text-secondary" />
                View Profile
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-text-primary transition-colors hover:bg-maroon-light"
              >
                <LogOut className="h-4 w-4 text-text-secondary" />
                Logout
              </button>
            </div>
          ) : null}
        </div>

        <Link
          to="/settings"
          className="rounded-md p-2 text-text-secondary transition-colors hover:bg-maroon-light hover:text-maroon"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </Link>
      </div>
    </header>
  )
}
