import { fetchSettings, saveSettings } from '@/lib/api'

export const SETTINGS_STORAGE_KEY = 'erp-settings'

export const defaultUserSettings = {
  company_name: 'RESPONSIVCODE TECHNOLOGY SOLUTIONS',
  company_address: 'Room 301E-3, Medalle Building, Fuente Osmeña, Cebu City 6000',
  company_phone: '(032) 345-2283 / +63 917 573 4911',
  company_email: 'lark.gel@gmail.com',
  date_format: 'F j, Y',
  paper_size: 'A4',
  auto_open_preview: true,
  timezone: 'Asia/Manila',
  currency: 'PHP',
  language: 'en',
  notify_in_app: true,
  notify_email: false,
  notify_quotations: true,
  notify_purchase_orders: true,
  notify_receiving: true,
  notify_deliveries: true,
  notify_billing: true,
}

export const dateFormatOptions = [
  { value: 'F j, Y', label: 'August 25, 2026' },
  { value: 'Y-m-d', label: '2026-08-25' },
  { value: 'm/d/Y', label: '08/25/2026' },
]

export const timezoneOptions = [
  { value: 'Asia/Manila', label: 'Asia/Manila (GMT+8)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (GMT+8)' },
  { value: 'UTC', label: 'UTC' },
]

export const currencyOptions = [
  { value: 'PHP', label: 'Philippine peso (₱)' },
  { value: 'USD', label: 'US dollar ($)' },
]

export const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'fil', label: 'Filipino' },
]

export function loadUserSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!raw) return { ...defaultUserSettings }
    return { ...defaultUserSettings, ...JSON.parse(raw) }
  } catch {
    return { ...defaultUserSettings }
  }
}

export function storeUserSettingsLocally(settings) {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
}

export async function loadUserSettingsFromApi() {
  try {
    const data = await fetchSettings()
    const merged = { ...defaultUserSettings, ...data }
    storeUserSettingsLocally(merged)
    return merged
  } catch {
    return loadUserSettings()
  }
}

export async function persistUserSettings(settings) {
  storeUserSettingsLocally(settings)
  try {
    await saveSettings(settings)
  } catch {
    // Local fallback when API is offline.
  }
  return settings
}

export function labelForOption(options, value) {
  return options.find((option) => option.value === value)?.label ?? value
}
