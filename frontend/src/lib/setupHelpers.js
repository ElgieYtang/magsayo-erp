export function nextSequentialCode(prefix, items, field = 'code') {
  const numbers = items.map((item) => {
    const value = String(item[field] ?? '')
    const match = value.match(/(\d+)(?!.*\d)/)
    return match ? Number.parseInt(match[1], 10) : 0
  })
  const next = (numbers.length ? Math.max(...numbers) : 0) + 1
  return `${prefix}-${String(next).padStart(3, '0')}`
}

export function nextUserId(users) {
  const numbers = users.map((user) => {
    const match = String(user.id ?? '').match(/USR-(\d+)/)
    return match ? Number.parseInt(match[1], 10) : 0
  })
  const next = (numbers.length ? Math.max(...numbers) : 0) + 1
  return `USR-${String(next).padStart(3, '0')}`
}

export function slugId(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
