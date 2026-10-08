import logo from '@/assets/logo.png'
import { TransactionBarcode } from '@/components/ui/transaction-barcode'
import { companyInfo } from '@/data/accomplishmentReports'
import type { Receiving } from '@/data/erpTypes'
import { formatDisplayDate, receivingListStatusLabel } from '@/lib/receivings'

export function ReceivingDocument({ receiving }: { receiving: Receiving }) {
  return (
    <div className="outslip-document">
      <div className="outslip-head">
        <div className="outslip-company-wrap">
          <img src={logo} alt={`${companyInfo.name} logo`} className="outslip-logo" />
          <div>
            <div className="outslip-company-name">{companyInfo.name}</div>
            {companyInfo.addressLines.map((line) => (
              <div key={line} className="outslip-company-meta">
                {line}
              </div>
            ))}
            <div className="outslip-company-meta">Tel: {companyInfo.phone}</div>
            <div className="outslip-company-meta">Email: {companyInfo.email}</div>
          </div>
        </div>
      </div>

      <h1 className="outslip-title">RECEIVING</h1>

      <div className="outslip-reference-head">
        <div className="outslip-reference-left">
          <div className="outslip-reference-label">Supplier:</div>
          <div className="outslip-reference-value outslip-reference-value--strong">
            {receiving.supplier || '—'}
          </div>
          <div className="outslip-reference-value">Warehouse: {receiving.warehouse || '—'}</div>
        </div>
        <div className="outslip-reference-right">
          <div className="outslip-meta-row">
            <span>Date:</span>
            <span>{formatDisplayDate(receiving.date)}</span>
          </div>
          <div className="outslip-meta-row">
            <span>Receiving No.:</span>
            <span>{receiving.id}</span>
          </div>
          <div className="outslip-meta-row">
            <span>PO No.:</span>
            <span>{receiving.poId || '—'}</span>
          </div>
          <div className="outslip-meta-row">
            <span>Status:</span>
            <span>{receivingListStatusLabel[receiving.status]}</span>
          </div>
          <TransactionBarcode value={receiving.id} />
        </div>
      </div>

      <table className="outslip-items-table">
        <thead>
          <tr>
            <th>Item Code</th>
            <th>Description</th>
            <th>Ordered</th>
            <th>Received</th>
            <th>Unit</th>
          </tr>
        </thead>
        <tbody>
          {receiving.items.map((item) => (
            <tr key={item.id}>
              <td>{item.itemCode}</td>
              <td>{item.description}</td>
              <td>{item.orderedQuantity}</td>
              <td>{item.receivedQuantity}</td>
              <td>{item.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {receiving.remarks ? (
        <div className="outslip-reference-band">
          <span>Remarks:</span>
          <span>{receiving.remarks}</span>
        </div>
      ) : null}
    </div>
  )
}
