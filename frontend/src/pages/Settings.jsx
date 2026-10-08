import { SettingsSection, SettingsSelect, SettingsToggleRow } from '@/components/settings/SettingsSection'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { FormField, Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'
import { useUserSettings } from '@/hooks/useUserSettings'
import { savePassword } from '@/lib/api'
import {
  currencyOptions,
  dateFormatOptions,
  languageOptions,
  timezoneOptions,
} from '@/lib/userSettings'
import { Bell, Building2, FileText, Globe, KeyRound } from 'lucide-react'
import { useState } from 'react'

export function SettingsPage() {
  const { user } = useAuth()
  const { settings, updateSetting, saveSettings } = useUserSettings()
  const [password, setPassword] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  })
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const isAdmin = user?.role === 'admin' || String(user?.type).toUpperCase() === 'ADMIN'

  async function handleSaveSettings(event) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setStatus(null)
    try {
      await saveSettings()
      setStatus('Settings saved.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not save settings.')
    } finally {
      setSaving(false)
    }
  }

  async function handleSavePassword(event) {
    event.preventDefault()
    setError(null)
    setStatus(null)
    if (password.password !== password.password_confirmation) {
      setError('New password and confirmation do not match.')
      return
    }
    try {
      await savePassword(password)
      setPassword({ current_password: '', password: '', password_confirmation: '' })
      setStatus('Password updated.')
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Password can only be changed when the Laravel API is running.',
      )
    }
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Company defaults, documents, regional options, and notification preferences."
      />

      {status ? <p className="mb-4 text-sm text-success-text">{status}</p> : null}
      {error ? <p className="mb-4 text-sm text-error-text">{error}</p> : null}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {isAdmin ? (
          <SettingsSection icon={Building2} title="Company">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Company name" className="sm:col-span-2">
                <Input
                  value={settings.company_name}
                  onChange={(event) => updateSetting('company_name', event.target.value)}
                  required
                />
              </FormField>
              <FormField label="Address" className="sm:col-span-2">
                <Input
                  value={settings.company_address}
                  onChange={(event) => updateSetting('company_address', event.target.value)}
                />
              </FormField>
              <FormField label="Phone">
                <Input
                  value={settings.company_phone}
                  onChange={(event) => updateSetting('company_phone', event.target.value)}
                />
              </FormField>
              <FormField label="Email">
                <Input
                  type="email"
                  value={settings.company_email}
                  onChange={(event) => updateSetting('company_email', event.target.value)}
                />
              </FormField>
            </div>
          </SettingsSection>
        ) : null}

        <SettingsSection icon={FileText} title="Documents">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Date format">
              <SettingsSelect
                value={settings.date_format}
                onChange={(value) => updateSetting('date_format', value)}
                options={dateFormatOptions}
              />
            </FormField>
            <FormField label="Paper size">
              <SettingsSelect
                value={settings.paper_size}
                onChange={(value) => updateSetting('paper_size', value)}
                options={[
                  { value: 'A4', label: 'A4' },
                  { value: 'Letter', label: 'Letter' },
                ]}
              />
            </FormField>
          </div>
          <div className="mt-2 border-t border-border">
            <SettingsToggleRow
              title="Open document preview automatically"
              description="Jump to print preview after creating quotations, POs, and receipts."
              checked={!!settings.auto_open_preview}
              onChange={(value) => updateSetting('auto_open_preview', value)}
            />
          </div>
        </SettingsSection>

        <SettingsSection icon={Globe} title="Regional">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField label="Timezone">
              <SettingsSelect
                value={settings.timezone}
                onChange={(value) => updateSetting('timezone', value)}
                options={timezoneOptions}
              />
            </FormField>
            <FormField label="Currency">
              <SettingsSelect
                value={settings.currency}
                onChange={(value) => updateSetting('currency', value)}
                options={currencyOptions}
              />
            </FormField>
            <FormField label="Language">
              <SettingsSelect
                value={settings.language}
                onChange={(value) => updateSetting('language', value)}
                options={languageOptions}
              />
            </FormField>
          </div>
        </SettingsSection>

        <SettingsSection id="notifications" icon={Bell} title="Notifications">
          <SettingsToggleRow
            title="In-app notifications"
            description="Show alerts in the header bell for items that need attention."
            checked={!!settings.notify_in_app}
            onChange={(value) => updateSetting('notify_in_app', value)}
          />
          <SettingsToggleRow
            title="Email notifications"
            description="Keep a record of this preference for when email delivery is enabled."
            checked={!!settings.notify_email}
            onChange={(value) => updateSetting('notify_email', value)}
          />
          <SettingsToggleRow
            title="Quotations"
            description="Pending quotations waiting for approval."
            checked={!!settings.notify_quotations}
            onChange={(value) => updateSetting('notify_quotations', value)}
          />
          <SettingsToggleRow
            title="Purchase orders"
            description="Open purchase orders that still need receiving."
            checked={!!settings.notify_purchase_orders}
            onChange={(value) => updateSetting('notify_purchase_orders', value)}
          />
          <SettingsToggleRow
            title="Receiving"
            description="Stock-in records that are not yet completed."
            checked={!!settings.notify_receiving}
            onChange={(value) => updateSetting('notify_receiving', value)}
          />
          <SettingsToggleRow
            title="Deliveries"
            description="Delivery receipts still out for delivery."
            checked={!!settings.notify_deliveries}
            onChange={(value) => updateSetting('notify_deliveries', value)}
          />
          <SettingsToggleRow
            title="Billing"
            description="Unpaid or partially paid billing statements."
            checked={!!settings.notify_billing}
            onChange={(value) => updateSetting('notify_billing', value)}
          />
        </SettingsSection>

        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save settings'}
        </Button>
      </form>

      <form id="password" onSubmit={handleSavePassword} className="mt-6 scroll-mt-24">
        <SettingsSection icon={KeyRound} title="Change password">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField label="Current password">
              <Input
                type="password"
                value={password.current_password}
                onChange={(event) =>
                  setPassword((current) => ({
                    ...current,
                    current_password: event.target.value,
                  }))
                }
                autoComplete="current-password"
              />
            </FormField>
            <FormField label="New password">
              <Input
                type="password"
                value={password.password}
                onChange={(event) =>
                  setPassword((current) => ({ ...current, password: event.target.value }))
                }
                autoComplete="new-password"
              />
            </FormField>
            <FormField label="Confirm password">
              <Input
                type="password"
                value={password.password_confirmation}
                onChange={(event) =>
                  setPassword((current) => ({
                    ...current,
                    password_confirmation: event.target.value,
                  }))
                }
                autoComplete="new-password"
              />
            </FormField>
            <div className="sm:col-span-3">
              <Button type="submit" variant="secondary">
                Update password
              </Button>
            </div>
          </div>
        </SettingsSection>
      </form>
    </div>
  )
}
