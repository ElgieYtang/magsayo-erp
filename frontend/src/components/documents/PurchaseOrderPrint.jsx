import logo from '@/assets/logo.png'
import { RTS_LETTERHEAD } from '@/config/companyLetterhead'
import { amountToPesoWords } from '@/lib/numberToWords'

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

function FieldLine({ label, value, underlineValue = true }) {
  return (
    <div className="quotation-print__field">
      <span className="quotation-print__field-label">{label}</span>
      <span
        className={
          underlineValue
            ? 'quotation-print__field-value'
            : 'quotation-print__field-value quotation-print__field-value--plain'
        }
      >
        {value || '\u00A0'}
      </span>
    </div>
  )
}

function DeliveryField({ label, value }) {
  return (
    <div className="po-print__delivery-field">
      <span className="po-print__delivery-label">{label}</span>
      <span className="po-print__delivery-value">{value || '\u00A0'}</span>
    </div>
  )
}

export function PurchaseOrderPrint({
  purchaseOrder,
  supplier,
  company = RTS_LETTERHEAD,
}) {
  const items = purchaseOrder.items.map((item, index) => ({
    number: itemNumber(index),
    description: item.productName,
    qty: item.quantity,
    unit: item.unit ?? 'UNITS',
    unitCost: item.unitPrice,
    amount: item.quantity * item.unitPrice,
  }))

  const emptyRows = Math.max(0, MIN_ITEM_ROWS - items.length)
  const grandTotal =
    purchaseOrder.total ?? items.reduce((sum, item) => sum + item.amount, 0)

  const placeOfDelivery =
    purchaseOrder.placeOfDelivery ??
    'Rm 301-E3 Medalle Building, Fuente Osmena, Cebu City'

  const dateOfDelivery =
    purchaseOrder.dateOfDelivery ?? 'On or before ________, 2026'

  const warrantyPeriod =
    purchaseOrder.warrantyPeriod ?? 'One (1) Year Warranty from Date of Delivery'

  return (
    <article className="quotation-print po-print">
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

      <h1 className="quotation-print__title">PURCHASE ORDER</h1>

      <hr className="quotation-print__double-rule" />

      <section className="quotation-print__meta">
        <div className="quotation-print__meta-left">
          <FieldLine label="Supplier:" value={supplier?.name} />
          <FieldLine label="Address:" value={supplier?.address} />
          <FieldLine
            label="Telephone No.:"
            value={supplier?.phone ?? supplier?.contactPerson}
          />
          <FieldLine label="TIN No.:" value={supplier?.tinNo} />
        </div>
        <div className="quotation-print__meta-right">
          <FieldLine
            label="P.O. No.:"
            value={purchaseOrder.documentNo ?? purchaseOrder.id}
          />
          <FieldLine label="Date:" value={purchaseOrder.date} />
        </div>
      </section>

      <p className="po-print__intro">
        Gentlemen/Mesdames: Please deliver to this Office the following articles
        subject to the terms and conditions contained herein:
      </p>

      <section className="po-print__delivery-grid">
        <DeliveryField label="Place of Delivery:" value={placeOfDelivery} />
        <DeliveryField label="Date of Delivery:" value={dateOfDelivery} />
        <DeliveryField label="Warranty Period:" value={warrantyPeriod} />
        <DeliveryField label="Project:" value={purchaseOrder.project} />
        <DeliveryField label="Delivery Term:" value={purchaseOrder.deliveryTerm} />
        <DeliveryField label="Payment Term:" value={purchaseOrder.paymentTerm} />
      </section>

      <hr className="quotation-print__single-rule" />

      <table className="quotation-print__items po-print__items">
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

      <div className="po-print__amount-words">
        <span className="po-print__amount-words-label">TOTAL AMOUNT IN WORDS:</span>
        <span className="po-print__amount-words-value">{amountToPesoWords(grandTotal)}</span>
      </div>

      <p className="po-print__penalty">
        In case of failure to make full delivery within the time specified above, a
        penalty of one-tenth (1/10) of one percent for everyday of delay shall be
        imposed.
      </p>

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
          <p className="quotation-print__conforme-name">{supplier?.name ?? ''}</p>
          <p className="quotation-print__conforme-hint">
            Signature Over Printed Name of Supplier
          </p>
          <div className="quotation-print__date-line">
            <span>Date:</span>
            <span className="quotation-print__date-rule" />
          </div>
        </div>
      </footer>
    </article>
  )
}
