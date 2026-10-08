export function formatDisplayDate(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function addDaysDisplayDate(days, from = new Date()) {
  const next = new Date(from)
  next.setDate(next.getDate() + days)
  return formatDisplayDate(next)
}

export function getCustomerDetails(customer) {
  if (!customer) {
    return {
      name: '',
      address: '',
      contactPerson: '',
      phone: '',
      email: '',
      tinNo: '',
      terms: '',
    }
  }

  const terms = customer.terms
    ? customer.termsType
      ? `${customer.terms} ${customer.termsType}`
      : customer.terms
    : ''

  return {
    name: customer.name ?? '',
    address: customer.address ?? '',
    contactPerson: customer.contactPerson ?? '',
    phone: customer.phone ?? '',
    email: customer.email ?? '',
    tinNo: customer.tinNo ?? customer.tin ?? '',
    terms,
  }
}
