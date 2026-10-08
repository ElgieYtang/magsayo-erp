import logo from '@/assets/logo.png'
import { TransactionBarcode } from '@/components/ui/transaction-barcode'
import { companyInfo } from '@/data/accomplishmentReports'
import type { Outslip, OutslipItem } from '@/data/erpTypes'

function formatLetterDate(value: string): string {
  if (!value) return ''
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ]
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

function splitCompanyName(name: string) {
  const space = name.trim().indexOf(' ')
  if (space === -1) return { lead: name, rest: '' }
  return { lead: name.slice(0, space), rest: name.slice(space + 1).trim() }
}

function itemLine(item: OutslipItem): string {
  const quantity = item.releasedQuantity > 0 ? item.releasedQuantity : item.poQuantity
  const unit = item.unit.trim()
  let description = item.description.trim()
  const brand = item.brand.trim()
  if (brand && !description.toLowerCase().includes(brand.toLowerCase())) {
    description = `${brand} ${description}`
  }
  return [quantity, unit, description].filter(Boolean).join(' ')
}

export function OutslipDocument({ outslip }: { outslip: Outslip }) {
  const { lead, rest } = splitCompanyName(companyInfo.name)
  const address = companyInfo.addressLines.filter(Boolean).join(', ')
  const items = outslip.items.filter(
    (item) => item.releasedQuantity > 0 || item.poQuantity > 0,
  )
  const signer = (outslip.preparedBy || outslip.approvedBy || outslip.releasedBy).trim()

  return (
    <div className="outslip-letter">
      <div className="outslip-letter-head">
        <img src={logo} alt={`${companyInfo.name} logo`} className="outslip-letter-logo" />
        <div className="outslip-letter-company">
          <div className="outslip-letter-company-name">
            <span className="outslip-letter-company-lead">{lead}</span>
            {rest ? <span className="outslip-letter-company-rest"> {rest}</span> : null}
          </div>
          <div className="outslip-letter-company-meta">
            {address}
            {address && companyInfo.phone ? '. ' : ''}
            {companyInfo.phone ? `Tel ${companyInfo.phone}.` : ''}
          </div>
        </div>
      </div>

      <div className="outslip-letter-date">{formatLetterDate(outslip.date)}</div>
      <div className="outslip-letter-date">{outslip.id}</div>
      <TransactionBarcode value={outslip.id} />

      <p className="outslip-letter-salutation">Sir/Madam:</p>

      <p className="outslip-letter-body">
        We would like to inform that we are going to receive/release items:
      </p>

      <ul className="outslip-letter-items">
        {items.length === 0 ? (
          <li>
            <span className="outslip-letter-check" aria-hidden="true" />
            <span>—</span>
          </li>
        ) : (
          items.map((item) => (
            <li key={item.id}>
              <span className="outslip-letter-check" aria-hidden="true" />
              <span>{itemLine(item)}</span>
            </li>
          ))
        )}
      </ul>

      <p className="outslip-letter-thanks">Thanks,</p>

      <div className="outslip-letter-signatory">
        <div className="outslip-letter-signatory-name">{signer ? signer.toUpperCase() : ''}</div>
      </div>
    </div>
  )
}
