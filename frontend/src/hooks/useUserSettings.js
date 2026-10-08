import {
  defaultUserSettings,
  loadUserSettings,
  loadUserSettingsFromApi,
  persistUserSettings,
} from '@/lib/userSettings'
import { useCallback, useEffect, useState } from 'react'

export function useUserSettings() {
  const [settings, setSettings] = useState(loadUserSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    loadUserSettingsFromApi().then((data) => {
      if (!cancelled) {
        setSettings(data)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const updateSetting = useCallback((key, value) => {
    setSettings((current) => ({ ...current, [key]: value }))
  }, [])

  const saveSettings = useCallback(async (partial = {}) => {
    let next = null
    setSettings((current) => {
      next = { ...current, ...partial }
      return next
    })
    await persistUserSettings(next ?? { ...defaultUserSettings, ...partial })
    return next
  }, [])

  const resetSettings = useCallback(() => {
    setSettings({ ...defaultUserSettings })
  }, [])

  return {
    settings,
    loading,
    updateSetting,
    saveSettings,
    resetSettings,
  }
}
