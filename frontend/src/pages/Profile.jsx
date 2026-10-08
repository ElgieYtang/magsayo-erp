import { SettingsSection, SettingsToggleRow } from '@/components/settings/SettingsSection'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { useSetupResource } from '@/hooks/useSetupResource'
import { useUserSettings } from '@/hooks/useUserSettings'
import {
  currencyOptions,
  dateFormatOptions,
  labelForOption,
  languageOptions,
  timezoneOptions,
} from '@/lib/userSettings'
import { Bell, Globe, KeyRound, Mail, Settings, Shield, User } from 'lucide-react'
import { Link } from 'react-router-dom'

function ProfileField({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-page px-4 py-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-maroon-light text-maroon">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-text-primary">{value || '—'}</p>
      </div>
    </div>
  )
}

function roleLabel(user) {
  if (!user) return '—'
  if (user.role === 'admin' || String(user.type).toUpperCase() === 'ADMIN') {
    return 'Administrator'
  }
  return 'Staff'
}

const profileNotificationToggles = [
  {
    key: 'notify_in_app',
    title: 'In-app notifications',
    description: 'Show alerts in the header bell for items that need attention.',
  },
  {
    key: 'notify_quotations',
    title: 'Quotations',
    description: 'Pending quotations waiting for approval.',
  },
  {
    key: 'notify_deliveries',
    title: 'Deliveries',
    description: 'Delivery receipts still out for delivery.',
  },
  {
    key: 'notify_billing',
    title: 'Billing',
    description: 'Unpaid or partially paid billing statements.',
  },
]

export function ProfilePage() {
  const { user } = useAuth()
  const { rows: positions } = useSetupResource('positions')
  const { settings, updateSetting, saveSettings } = useUserSettings()

  const initial = user?.name?.charAt(0).toUpperCase() ?? user?.username?.charAt(0).toUpperCase() ?? 'A'
  const position = positions.find((row) => String(row.id) === String(user?.position_id))
  const isAdmin = user?.role === 'admin' || String(user?.type).toUpperCase() === 'ADMIN'

  async function handleToggle(key, value) {
    await saveSettings({ [key]: value })
  }

  return (
    <div>
      <PageHeader
        title="My Profile"
        description="Your account, preferences, and notification shortcuts."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_1fr]">
        <Card className="overflow-hidden">
          <CardContent className="flex flex-col items-center px-6 pb-6 pt-8 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-maroon text-3xl font-bold text-white shadow-md">
              {initial}
            </div>
            <h2 className="mt-4 text-xl font-semibold text-text-primary">
              {user?.name ?? 'User'}
            </h2>
            <p className="mt-1 text-sm text-text-secondary">@{user?.username ?? 'username'}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <Badge variant={isAdmin ? 'current' : 'default'}>{roleLabel(user)}</Badge>
              {position?.name ? <Badge variant="released">{position.name}</Badge> : null}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="grid grid-cols-1 gap-3 pt-6 sm:grid-cols-2">
              <ProfileField icon={User} label="Display name" value={user?.name} />
              <ProfileField icon={User} label="Username" value={user?.username} />
              <ProfileField icon={Mail} label="Email" value={user?.email} />
              <ProfileField icon={Shield} label="Access level" value={roleLabel(user)} />
              <ProfileField
                icon={User}
                label="Position"
                value={position?.name ?? 'Not assigned'}
              />
              <ProfileField icon={Shield} label="User ID" value={user?.id ? `USR-${user.id}` : '—'} />
            </CardContent>
          </Card>

          <SettingsSection icon={Globe} title="Regional & documents">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ProfileField
                icon={Globe}
                label="Timezone"
                value={labelForOption(timezoneOptions, settings.timezone)}
              />
              <ProfileField
                icon={Globe}
                label="Currency"
                value={labelForOption(currencyOptions, settings.currency)}
              />
              <ProfileField
                icon={Globe}
                label="Language"
                value={labelForOption(languageOptions, settings.language)}
              />
              <ProfileField
                icon={Settings}
                label="Date format"
                value={labelForOption(dateFormatOptions, settings.date_format)}
              />
            </div>
            <div className="mt-4">
              <Link to="/settings">
                <Button type="button" variant="secondary" size="sm">
                  Edit regional & document settings
                </Button>
              </Link>
            </div>
          </SettingsSection>

          <SettingsSection icon={Bell} title="Notifications">
            {profileNotificationToggles.map((item) => (
              <SettingsToggleRow
                key={item.key}
                title={item.title}
                description={item.description}
                checked={!!settings[item.key]}
                onChange={(value) => handleToggle(item.key, value)}
              />
            ))}
            <div className="pt-4">
              <Link to="/settings#notifications">
                <Button type="button" variant="ghost" size="sm" className="border border-border">
                  Manage all notification settings
                </Button>
              </Link>
            </div>
          </SettingsSection>

          <Card>
            <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row">
              <Link to="/settings" className="inline-flex">
                <Button type="button" variant="secondary" className="w-full sm:w-auto">
                  <Settings className="h-4 w-4" />
                  Open full settings
                </Button>
              </Link>
              <Link to="/settings#password" className="inline-flex">
                <Button type="button" variant="ghost" className="w-full border border-border sm:w-auto">
                  <KeyRound className="h-4 w-4" />
                  Change password
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
