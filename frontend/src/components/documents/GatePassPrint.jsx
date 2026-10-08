import logo from '@/assets/logo.png'
import { RTS_LETTERHEAD } from '@/config/companyLetterhead'

const MIN_ITEM_ROWS = 6

function dash(value) {
  const text = value?.toString().trim()
  return text ? text : '—'
}

function buildItems(document) {
  return (document?.items ?? []).map((item, index) => ({
    no: index + 1,
    name: item.productName ?? item.description ?? '',
    code: item.productCode ?? item.productId ?? '',
    brand: dash(item.brand),
    model: dash(item.model),
    qty: item.quantity ?? 0,
    unit: item.unit ?? 'UNIT',
  }))
}

function mergeDocument(document, overrides = {}) {
  if (!document) return null
  return { ...document, ...overrides }
}

export function GatePassPrint({
  document: documentProp,
  outslip,
  customer,
  gatePass,
  company = RTS_LETTERHEAD,
}) {
  const document =
    documentProp ??
    mergeDocument(
      gatePass
        ? {
            gatePassNo: gatePass.gatePassNo,
            displayDate: outslip?.displayDate ?? outslip?.date,
            displayTimeOut: gatePass.displayTimeOut,
            outslipNo: outslip?.id,
            purchaseOrderNo: outslip?.purchaseOrderId,
            customerName: customer?.name ?? outslip?.customerName,
            destination: gatePass.destination || customer?.address,
            purpose: 'Delivery of items per Outslip',
            vehicleNo: gatePass.vehicleNo,
            plateNo: gatePass.plateNo,
            driverName: gatePass.driverName,
            remarks: gatePass.remarks,
            preparedByName: company.signatoryName,
            authorizedByName: 'Admin',
            items: buildLineItemsLegacy(outslip),
          }
        : null,
      gatePass,
    )

  const items = buildItems(document)
  const emptyRows = Math.max(0, MIN_ITEM_ROWS - items.length)

  return (
    <article className="quotation-print gate-pass-print">
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

      <h1 className="quotation-print__title">GATE PASS</h1>

      <hr className="quotation-print__double-rule" />

      <section className="gate-pass-print__meta">
        <div className="gate-pass-print__meta-left">
          <div className="gate-pass-print__field">
            <span>Released to:</span>
            <span>{dash(document?.customerName)}</span>
          </div>
          <div className="gate-pass-print__field">
            <span>Destination:</span>
            <span>{dash(document?.destination)}</span>
          </div>
        </div>

        <div className="gate-pass-print__meta-right">
          <div className="gate-pass-print__field">
            <span>Date:</span>
            <span>{dash(document?.displayDate ?? document?.date)}</span>
          </div>
          <div className="gate-pass-print__field">
            <span>Time Out:</span>
            <span>{dash(document?.displayTimeOut)}</span>
          </div>
          <div className="gate-pass-print__field">
            <span>Gate Pass No.:</span>
            <span>{dash(document?.gatePassNo)}</span>
          </div>
          <div className="gate-pass-print__field">
            <span>Outslip No.:</span>
            <span>{dash(document?.outslipNo)}</span>
          </div>
          <div className="gate-pass-print__field">
            <span>PO No.:</span>
            <span>{dash(document?.purchaseOrderNo)}</span>
          </div>
        </div>
      </section>

      <p className="gate-pass-print__purpose">
        <strong>Purpose:</strong> {document?.purpose || 'Delivery of items per Outslip'}
      </p>

      <div className="gate-pass-print__transport">
        <div className="gate-pass-print__field">
          <span>Vehicle:</span>
          <span>{dash(document?.vehicleNo)}</span>
        </div>
        <div className="gate-pass-print__field">
          <span>Plate No.:</span>
          <span>{dash(document?.plateNo)}</span>
        </div>
        <div className="gate-pass-print__field gate-pass-print__field--wide">
          <span>Driver:</span>
          <span>{dash(document?.driverName)}</span>
        </div>
      </div>

      <p className="gate-pass-print__table-title">Items to Leave Premises</p>

      <table className="gate-pass-print__items">
        <thead>
          <tr>
            <th>No.</th>
            <th>Item Description</th>
            <th>Brand</th>
            <th>Model / Serial No.</th>
            <th>Qty</th>
            <th>Unit</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.no}>
              <td className="gate-pass-print__cell-center">{item.no}</td>
              <td>
                <span className="gate-pass-print__item-name">{item.name}</span>
                {item.code ? (
                  <span className="gate-pass-print__item-code">{item.code}</span>
                ) : null}
              </td>
              <td className="gate-pass-print__cell-center">{item.brand}</td>
              <td className="gate-pass-print__cell-center">{item.model}</td>
              <td className="gate-pass-print__cell-center">{item.qty}</td>
              <td className="gate-pass-print__cell-center">{item.unit}</td>
            </tr>
          ))}
          {Array.from({ length: emptyRows }).map((_, index) => (
            <tr key={`empty-${index}`} className="gate-pass-print__empty-row">
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          ))}
          <tr className="gate-pass-print__nothing-follows">
            <td colSpan={6}>****NOTHING FOLLOWS****</td>
          </tr>
        </tbody>
      </table>

      <div className="gate-pass-print__remarks-box">
        <p className="gate-pass-print__remarks-label">Remarks</p>
        <p>{dash(document?.remarks)}</p>
      </div>

      <footer className="gate-pass-print__footer gate-pass-print__footer--quad">
        <div className="gate-pass-print__footer-col">
          <p className="gate-pass-print__footer-label">Prepared By:</p>
          <div className="quotation-print__signature-space" />
          <p className="gate-pass-print__footer-name">
            {document?.preparedByName || company.signatoryName}
          </p>
        </div>
        <div className="gate-pass-print__footer-col">
          <p className="gate-pass-print__footer-label">Authorized By:</p>
          <div className="quotation-print__signature-space" />
          <p className="gate-pass-print__footer-name">{document?.authorizedByName || 'Admin'}</p>
        </div>
        <div className="gate-pass-print__footer-col">
          <p className="gate-pass-print__footer-label">Guard on Duty:</p>
          <div className="quotation-print__signature-space" />
          <p className="gate-pass-print__footer-hint">Name / Position</p>
        </div>
        <div className="gate-pass-print__footer-col">
          <p className="gate-pass-print__footer-label">Driver:</p>
          <div className="quotation-print__signature-space" />
          <p className="gate-pass-print__footer-hint">Signature Over Printed Name</p>
        </div>
      </footer>
    </article>
  )
}

function buildLineItemsLegacy(outslip) {
  return (outslip?.items ?? []).map((item) => ({
    productName: item.productName ?? item.description ?? '',
    productCode: item.productId ? `ITM-${String(item.productId).padStart(4, '0')}` : '',
    brand: '',
    model: '',
    quantity: item.quantity ?? 0,
    unit: item.unit ?? 'PC/S',
  }))
}

export { mergeDocument }
