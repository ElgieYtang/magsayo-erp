const STORAGE_KEY = 'rts_notification_read'

function readIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function getReadNotificationIds() {
  return new Set(readIds())
}

export function markNotificationRead(id) {
  const ids = getReadNotificationIds()
  if (ids.has(id)) return
  ids.add(id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
}

export function pruneReadNotificationIds(validIds) {
  const valid = new Set(validIds)
  const pruned = [...getReadNotificationIds()].filter((id) => valid.has(id))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned))
}
