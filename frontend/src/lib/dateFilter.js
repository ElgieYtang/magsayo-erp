export function parseDisplayDate(value) {
  if (!value) return null
  const parsed = Date.parse(String(value))
  if (Number.isNaN(parsed)) return null
  return new Date(parsed)
}

export function parseInputDate(value) {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

export function isWithinDateRange(recordDate, dateFrom, dateTo) {
  const date = parseDisplayDate(recordDate)
  if (!date) return true

  const from = parseInputDate(dateFrom)
  const to = parseInputDate(dateTo)

  if (from) {
    from.setHours(0, 0, 0, 0)
    if (date < from) return false
  }

  if (to) {
    const end = new Date(to)
    end.setHours(23, 59, 59, 999)
    if (date > end) return false
  }

  return true
}

export function filterByDateRange(list, dateFrom, dateTo, dateKey = 'date') {
  if (!dateFrom && !dateTo) return list
  return list.filter((item) => isWithinDateRange(item[dateKey], dateFrom, dateTo))
}
