const ones = [
  '',
  'ONE',
  'TWO',
  'THREE',
  'FOUR',
  'FIVE',
  'SIX',
  'SEVEN',
  'EIGHT',
  'NINE',
  'TEN',
  'ELEVEN',
  'TWELVE',
  'THIRTEEN',
  'FOURTEEN',
  'FIFTEEN',
  'SIXTEEN',
  'SEVENTEEN',
  'EIGHTEEN',
  'NINETEEN',
]

const tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY']

function chunkToWords(value) {
  const num = Number(value)
  if (!num) return ''

  const hundred = Math.floor(num / 100)
  const rest = num % 100
  const parts = []

  if (hundred) {
    parts.push(`${ones[hundred]} HUNDRED`)
  }

  if (rest) {
    if (rest < 20) {
      parts.push(ones[rest])
    } else {
      const ten = Math.floor(rest / 10)
      const one = rest % 10
      parts.push(one ? `${tens[ten]} ${ones[one]}` : tens[ten])
    }
  }

  return parts.join(' ')
}

function integerToWords(value) {
  const num = Math.floor(Number(value))
  if (!num) return 'ZERO'

  const millions = Math.floor(num / 1_000_000)
  const thousands = Math.floor((num % 1_000_000) / 1_000)
  const remainder = num % 1_000
  const leading = []

  if (millions) leading.push(`${chunkToWords(millions)} MILLION`)
  if (thousands) leading.push(`${chunkToWords(thousands)} THOUSAND`)

  if (leading.length && remainder) {
    return `${leading.join(' ')} AND ${chunkToWords(remainder)}`
  }

  if (leading.length) return leading.join(' ')
  return chunkToWords(remainder)
}

export function amountToPesoWords(amount) {
  const value = Number(amount)
  if (Number.isNaN(value)) return ''

  const whole = Math.floor(value)
  const cents = Math.round((value - whole) * 100)

  if (cents) {
    return `${integerToWords(whole)} PESOS AND ${integerToWords(cents)} CENTAVOS ONLY`
  }

  return `${integerToWords(whole)} PESOS ONLY`
}
