import logo from '@/assets/logo.png'
import { RTS_LETTERHEAD } from '@/config/companyLetterhead'

const MIN_ITEM_ROWS = 12

function formatMoney(value) {
  const amount = Number(value)
  const abs = Math.abs(amount).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return amount < 0 ? `(${abs})` : abs
}

function formatStatementDate(account) {
  const raw = account?.to || account?.generatedAt
  const date = raw ? new Date(raw) : new Date()
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function buildStatementNo(account) {
  const date = account?.to ? new Date(account.to) : new Date()
  const ymd = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('')
  const suffix = String(account?.customerId ?? '0').replace(/\D/g, '').padStart(3, '0').slice(-3)
  return `${ymd}${suffix}`
}

function buildReference(account) {
  if (account?.reference) return account.reference
  const refs = (account?.rows ?? [])
    .filter((row) => row.debit > 0)
    .map((row) => row.ref)
    .filter(Boolean)
    .slice(0, 3)
  if (refs.length) return refs.join(' / ')
  return account?.periodLabel ?? ''
}

/** Billings/charges only — matches official SOA line-item layout. */
function buildLineItems(rows) {
  return (rows ?? [])
    .filter((row) => row.debit > 0)
    .map((row, index) => ({
      no: index + 1,
      qty: 1,
      unit: 'LOT',
      description: row.description || row.ref,
      unitPrice: row.debit,
      total: row.debit,
    }))
}

export function SOAPrint({
  account,
  company = RTS_LETTERHEAD,
  attention,
  signatoryName = 'Larke Gelbolingo',
  signatoryTitle = 'Project Manager',
}) {
  const items = buildLineItems(account?.rows)
  const emptyRows = Math.max(0, MIN_ITEM_ROWS - items.length)
  const totals = account?.totals ?? {}
  const totalAmount =
    totals.totalDebit ??
    items.reduce((sum, item) => sum + item.total, 0)
  const paymentsApplied = totals.totalCredit ?? 0
  const balanceDue = totals.outstanding ?? totalAmount - paymentsApplied
  const statementDate = formatStatementDate(account)
  const statementNo = buildStatementNo(account)
  const reference = buildReference(account)

  return (
    <article className="quotation-print soa-print">
      <header className="quotation-print__header">
        <img src={logo} alt="ResponsivCode" className="quotation-print__logo" />
        <div className="quotation-print__company">
          <p className="quotation-print__company-name">{company.name}</p>
          <p>{company.address}</p>
          <p>{company.phone}</p>
          <p>{company.tin}</p>
        </div>
      </header>

      <hr className="quotation-print__double-rule" />

      <h1 className="quotation-print__title">STATEMENT OF ACCOUNT</h1>

      <hr className="quotation-print__double-rule" />

      <section className="soa-print__meta">
        <div className="soa-print__customer">
          <p className="soa-print__customer-name">{account?.customerName ?? ''}</p>
          {account?.customerAddress ? (
            <p className="soa-print__customer-address">{account.customerAddress}</p>
          ) : null}
          {attention ? <p className="soa-print__customer-thru">Thru: {attention}</p> : null}
        </div>

        <div className="soa-print__doc-info">
          <div className="soa-print__doc-field">
            <span>Statement date:</span>
            <span className="soa-print__doc-value">{statementDate}</span>
          </div>
          <div className="soa-print__doc-field">
            <span>Statement No.:</span>
            <span className="soa-print__doc-value">{statementNo}</span>
          </div>
        </div>
      </section>

      <div className="soa-print__reference">
        <span>Reference</span>
        <span>{reference || '\u00A0'}</span>
      </div>

      <p className="soa-print__section-label">Account Activity</p>

      <table className="soa-print__items">
        <thead>
          <tr>
            <th>ITEM</th>
            <th>QTY</th>
            <th>UNIT</th>
            <th>ITEM DESCRIPTION</th>
            <th>UNIT PRICE</th>
            <th>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={`${item.no}-${item.description}`}>
              <td className="soa-print__cell-center">{item.no}</td>
              <td className="soa-print__cell-center">{item.qty}</td>
              <td className="soa-print__cell-center">{item.unit}</td>
              <td>{item.description}</td>
              <td className="soa-print__cell-right">{formatMoney(item.unitPrice)}</td>
              <td className="soa-print__cell-right">{formatMoney(item.total)}</td>
            </tr>
          ))}
          {Array.from({ length: emptyRows }).map((_, index) => (
            <tr key={`empty-${index}`} className="soa-print__empty-row">
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          ))}
          <tr className="soa-print__nothing-follows">
            <td colSpan={6}>****NOTHING FOLLOWS****</td>
          </tr>
          <tr className="soa-print__total-row">
            <td colSpan={3} />
            <td className="soa-print__total-label">TOTAL AMOUNT</td>
            <td className="soa-print__total-currency">PHP</td>
            <td className="soa-print__total-value">{formatMoney(totalAmount)}</td>
          </tr>
          {paymentsApplied > 0 ? (
            <>
              <tr className="soa-print__summary-row">
                <td colSpan={3} />
                <td className="soa-print__summary-label">Less: Payments</td>
                <td className="soa-print__summary-currency">PHP</td>
                <td className="soa-print__summary-value">{formatMoney(paymentsApplied)}</td>
              </tr>
              <tr className="soa-print__summary-row">
                <td colSpan={3} />
                <td className="soa-print__summary-label">Balance Due</td>
                <td className="soa-print__summary-currency">PHP</td>
                <td className="soa-print__summary-value soa-print__total-value">
                  {formatMoney(balanceDue)}
                </td>
              </tr>
            </>
          ) : null}
        </tbody>
      </table>

      <footer className="soa-print__footer">
        <div className="soa-print__footer-col">
          <p className="soa-print__footer-label">Prepared by:</p>
          <div className="quotation-print__signature-space" />
          <p className="soa-print__footer-name">{signatoryName}</p>
          <p className="soa-print__footer-title">{signatoryTitle}</p>
        </div>

        <div className="soa-print__footer-col">
          <p className="soa-print__footer-label">Received by:</p>
          <div className="quotation-print__signature-space" />
          <p className="soa-print__footer-hint">Signature Over Printed Name</p>
        </div>
      </footer>

      <p className="soa-print__thanks">Thank You For Your Business!</p>
    </article>
  )
}
