import logo from '@/assets/logo.png'
import { RTS_LETTERHEAD } from '@/config/companyLetterhead'

const MIN_ITEM_ROWS = 8

function formatMoney(value) {
  return Number(value).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function buildLineItems(deliveryReceipt, outslip) {
  const sourceItems = deliveryReceipt.items ?? outslip?.items ?? []

  return sourceItems.map((item, index) => ({
    no: index + 1,
    description: item.productName ?? item.description ?? '',
    brandSerial:
      item.brandSerial ??
      item.serialNumbers?.join(', ') ??
      item.brand ??
      '',
    qty: item.quantity ?? 0,
    unit: item.unit ?? 'UNITS',
    unitPrice: item.unitPrice ?? 0,
    total: (item.quantity ?? 0) * (item.unitPrice ?? 0),
  }))
}

export function DeliveryReceiptPrint({
  deliveryReceipt,
  customer,
  outslip,
  company = RTS_LETTERHEAD,
}) {
  const items = buildLineItems(deliveryReceipt, outslip)
  const emptyRows = Math.max(0, MIN_ITEM_ROWS - items.length)
  const grandTotal =
    deliveryReceipt.total ?? items.reduce((sum, item) => sum + item.total, 0)

  const deliveredToLines = [
    customer?.name,
    customer?.address,
  ].filter(Boolean)

  const reference =
    deliveryReceipt.reference ??
    [
      deliveryReceipt.referenceOutslipId,
      outslip?.referencePoId,
    ]
      .filter(Boolean)
      .join(' / ')

  const deliveredByName =
    deliveryReceipt.deliveredByName ?? 'Larke Gelbolingo'
  const deliveredByTitle =
    deliveryReceipt.deliveredByTitle ?? 'Project Manager'

  return (
    <article className="quotation-print dr-print">
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

      <h1 className="quotation-print__title">DELIVERY RECEIPT</h1>

      <hr className="quotation-print__double-rule" />

      <section className="dr-print__meta">
        <div className="dr-print__delivered-to">
          <p className="dr-print__delivered-label">Delivered to:</p>
          {deliveredToLines.length > 0 ? (
            deliveredToLines.map((line) => (
              <p key={line} className="dr-print__delivered-line">
                {line}
              </p>
            ))
          ) : (
            <p className="dr-print__delivered-line">
              {deliveryReceipt.deliveryAddress || '\u00A0'}
            </p>
          )}
        </div>

        <div className="dr-print__doc-info">
          <div className="dr-print__doc-field">
            <span>Date:</span>
            <span className="dr-print__doc-value">{deliveryReceipt.date}</span>
          </div>
          <div className="dr-print__doc-field">
            <span>Delivery No.:</span>
            <span className="dr-print__doc-value">
              {deliveryReceipt.documentNo ?? deliveryReceipt.id}
            </span>
          </div>
        </div>
      </section>

      <div className="dr-print__reference">
        <span>Reference:</span>
        <span>{reference || '\u00A0'}</span>
      </div>

      <table className="dr-print__items">
        <thead>
          <tr>
            <th>NO</th>
            <th>ITEM DESCRIPTION</th>
            <th>BRAND/SERIAL NO.</th>
            <th>QTY.</th>
            <th>UNIT</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.no}>
              <td className="dr-print__cell-center">{item.no}</td>
              <td>{item.description}</td>
              <td className="dr-print__serial-cell">{item.brandSerial || '\u00A0'}</td>
              <td className="dr-print__cell-center">{item.qty}</td>
              <td className="dr-print__cell-center">{item.unit}</td>
              <td className="dr-print__cell-right">{formatMoney(item.unitPrice)}</td>
              <td className="dr-print__cell-right">{formatMoney(item.total)}</td>
            </tr>
          ))}
          {Array.from({ length: emptyRows }).map((_, index) => (
            <tr key={`empty-${index}`} className="dr-print__empty-row">
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          ))}
          <tr className="dr-print__nothing-follows">
            <td colSpan={7}>****NOTHING FOLLOWS****</td>
          </tr>
          <tr className="dr-print__total-row">
            <td colSpan={5} />
            <td className="dr-print__total-label">TOTAL AMOUNT</td>
            <td className="dr-print__total-value">{formatMoney(grandTotal)}</td>
          </tr>
        </tbody>
      </table>

      <p className="dr-print__acknowledgment">
        I/We acknowledged to have received in good order and condition the above
        merchandise(s) in accordance to the specifications stated subject to the
        terms and conditions.
      </p>

      <footer className="dr-print__footer">
        <div className="dr-print__footer-col">
          <p className="dr-print__footer-label">Delivered by:</p>
          <div className="quotation-print__signature-space" />
          <p className="dr-print__footer-name">{deliveredByName}</p>
          <p className="dr-print__footer-title">{deliveredByTitle}</p>
        </div>

        <div className="dr-print__footer-col">
          <p className="dr-print__footer-label">Received by:</p>
          <div className="quotation-print__signature-space" />
          <p className="dr-print__footer-hint">Signature Over Printed Name</p>
        </div>
      </footer>
    </article>
  )
}
