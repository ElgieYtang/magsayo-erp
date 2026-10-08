import logo from '@/assets/logo.png'
import { RTS_LETTERHEAD } from '@/config/companyLetterhead'

const MIN_ITEM_ROWS = 10

function formatMoney(value) {
  return Number(value).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function itemNumber(index) {
  return `${index + 1}.0`
}

function FieldLine({ label, value, className = '' }) {
  return (
    <div className={`quotation-print__field ${className}`}>
      <span className="quotation-print__field-label">{label}</span>
      <span className="quotation-print__field-value">{value || '\u00A0'}</span>
    </div>
  )
}

export function QuotationPrint({
  quotation,
  customer,
  company = RTS_LETTERHEAD,
}) {
  const items = quotation.items.map((item, index) => ({
    number: itemNumber(index),
    description: item.productName,
    qty: item.quantity,
    unit: item.unit ?? 'PC/S',
    unitCost: item.unitPrice,
    amount: item.quantity * item.unitPrice,
  }))

  const emptyRows = Math.max(0, MIN_ITEM_ROWS - items.length)
  const grandTotal = quotation.total ?? items.reduce((sum, item) => sum + item.amount, 0)

  return (
    <article className="quotation-print">
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

      <h1 className="quotation-print__title">QUOTATION</h1>

      <hr className="quotation-print__double-rule" />

      <section className="quotation-print__meta">
        <div className="quotation-print__meta-left">
          <FieldLine label="To:" value={customer?.name} />
          <FieldLine label="Address:" value={customer?.address} />
          <FieldLine label="Telephone No.:" value={customer?.phone} />
          <FieldLine label="TIN No.:" value={customer?.tinNo} />
        </div>
        <div className="quotation-print__meta-right">
          <FieldLine label="No.:" value={quotation.documentNo ?? quotation.id} />
          <FieldLine label="Date:" value={quotation.date} />
        </div>
      </section>

      <div className="quotation-print__subject">
        <span className="quotation-print__field-label">Subject :</span>
        <span className="quotation-print__subject-line">{quotation.subject ?? ''}</span>
      </div>

      <hr className="quotation-print__single-rule" />

      <table className="quotation-print__items">
        <thead>
          <tr>
            <th>Item Number</th>
            <th>Item Description</th>
            <th>QTY.</th>
            <th>Unit</th>
            <th>Unit Cost</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.number}>
              <td className="quotation-print__cell-center">{item.number}</td>
              <td>{item.description}</td>
              <td className="quotation-print__cell-center">{item.qty}</td>
              <td className="quotation-print__cell-center">{item.unit}</td>
              <td className="quotation-print__cell-right">{formatMoney(item.unitCost)}</td>
              <td className="quotation-print__cell-right">{formatMoney(item.amount)}</td>
            </tr>
          ))}
          {Array.from({ length: emptyRows }).map((_, index) => (
            <tr key={`empty-${index}`} className="quotation-print__empty-row">
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          ))}
          <tr className="quotation-print__nothing-follows">
            <td colSpan={6}>****NOTHING FOLLOWS****</td>
          </tr>
        </tbody>
      </table>

      <div className="quotation-print__grand-total">
        <span className="quotation-print__grand-total-label">GRAND TOTAL</span>
        <span className="quotation-print__grand-total-value">{formatMoney(grandTotal)}</span>
      </div>

      <footer className="quotation-print__footer">
        <div className="quotation-print__footer-col">
          <p className="quotation-print__footer-opening">Very truly yours,</p>
          <div className="quotation-print__signature-space" />
          <p className="quotation-print__signatory-name">{company.signatoryName}</p>
          <p className="quotation-print__signatory-title">{company.signatoryTitle}</p>
          <div className="quotation-print__date-line">
            <span>Date:</span>
            <span className="quotation-print__date-rule" />
          </div>
        </div>

        <div className="quotation-print__footer-col">
          <p className="quotation-print__footer-label">CONFORME:</p>
          <div className="quotation-print__signature-space" />
          <p className="quotation-print__conforme-name">{customer?.name ?? ''}</p>
          <p className="quotation-print__conforme-hint">Signature Over Printed Name of Customer</p>
          <div className="quotation-print__date-line">
            <span>Date:</span>
            <span className="quotation-print__date-rule" />
          </div>
        </div>
      </footer>
    </article>
  )
}
