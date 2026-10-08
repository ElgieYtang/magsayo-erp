import { GatePassPrint, mergeDocument } from '@/components/documents/GatePassPrint'
import { PrintActions } from '@/components/documents/DocumentLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FormField, Input } from '@/components/ui/input'
import { useTransactions } from '@/context/TransactionContext'
import { useSetupResource } from '@/hooks/useSetupResource'
import { canPrintGatePass } from '@/lib/gatePass'
import { getStatusDisplay } from '@/lib/status'
import { fetchGatePass, markGatePassExit, saveGatePass } from '@/lib/transactionApi'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export function GatePassPreviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { outslips, loading } = useTransactions()
  const { rows: companies } = useSetupResource('companies')

  const outslip = outslips.find((row) => row.id === id)
  const [document, setDocument] = useState(null)
  const [form, setForm] = useState({
    vehicleNo: '',
    driverName: '',
    plateNo: '',
    destination: '',
    remarks: '',
  })
  const [saving, setSaving] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (!outslip || !canPrintGatePass(outslip.status)) return

    fetchGatePass(outslip.id)
      .then((data) => {
        setDocument(data)
        setForm({
          vehicleNo: data.vehicleNo ?? '',
          driverName: data.driverName ?? '',
          plateNo: data.plateNo ?? '',
          destination: data.destination ?? '',
          remarks: data.remarks ?? '',
        })
      })
      .catch(() => setDocument(null))
  }, [outslip])

  const printDocument = useMemo(
    () => mergeDocument(document, form),
    [document, form],
  )

  const company = companies[0]
  const companyBlock = company
    ? {
        name: company.name,
        address: company.address,
        phone: `Tel: ${company.contactNo ?? ''}`,
        tin: `VAT REG. TIN.: ${company.tinNo ?? ''}`,
        signatoryName: printDocument?.preparedByName || 'LARKE G. GELBOLINGO',
        signatoryTitle: 'CEO/PRESIDENT',
      }
    : undefined

  if (loading && !outslip) {
    return <p className="document-preview-status">Loading…</p>
  }

  if (!outslip) {
    return <p className="document-preview-status">Outslip not found.</p>
  }

  if (!canPrintGatePass(outslip.status)) {
    return (
      <p className="document-preview-status">Gate pass is available after outslip approval.</p>
    )
  }

  const status = getStatusDisplay(printDocument?.outslipStatus ?? outslip.status)

  const handleSave = async () => {
    setSaving(true)
    try {
      const data = await saveGatePass(outslip.id, form)
      setDocument(data)
      setForm({
        vehicleNo: data.vehicleNo ?? '',
        driverName: data.driverName ?? '',
        plateNo: data.plateNo ?? '',
        destination: data.destination ?? '',
        remarks: data.remarks ?? '',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleExit = async () => {
    setExiting(true)
    try {
      await saveGatePass(outslip.id, form)
      const data = await markGatePassExit(outslip.id)
      setDocument(data)
    } finally {
      setExiting(false)
    }
  }

  return (
    <div className="quotation-print-page gate-pass-preview-page">
      <div className="gate-pass-preview-toolbar no-print">
        <div>
          <p className="gate-pass-preview-eyebrow">
            Outslip: {printDocument?.outslipNo ?? outslip.id}
          </p>
          <div className="gate-pass-preview-heading">
            <h1 className="gate-pass-preview-title">
              {printDocument?.gatePassNo ?? 'Gate Pass'} — {printDocument?.customerName ?? outslip.customerName}
            </h1>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        </div>
        <PrintActions onBack={() => navigate('/outslip')} />
      </div>

      <div className="gate-pass-preview-layout no-print">
        <aside className="gate-pass-preview-panel">
          <h2 className="gate-pass-preview-panel-title">Gate pass details</h2>
          <p className="gate-pass-preview-panel-hint">
            Fill in transport details before printing.
          </p>

          <div className="gate-pass-preview-readonly">
            <FormField label="Gate Pass No.">
              <Input readOnly value={printDocument?.gatePassNo ?? ''} />
            </FormField>
            <FormField label="Date">
              <Input readOnly value={printDocument?.displayDate ?? ''} />
            </FormField>
            <FormField label="Time Out">
              <Input readOnly value={printDocument?.displayTimeOut ?? ''} />
            </FormField>
            <FormField label="Outslip No.">
              <Input readOnly value={printDocument?.outslipNo ?? outslip.id} />
            </FormField>
            <FormField label="PO No.">
              <Input readOnly value={printDocument?.purchaseOrderNo ?? '—'} />
            </FormField>
          </div>

          <div className="gate-pass-preview-form">
            <FormField label="Destination">
              <Input
                value={form.destination}
                onChange={(event) => setForm({ ...form, destination: event.target.value })}
              />
            </FormField>
            <FormField label="Driver">
              <Input
                value={form.driverName}
                onChange={(event) => setForm({ ...form, driverName: event.target.value })}
              />
            </FormField>
            <FormField label="Plate No.">
              <Input
                value={form.plateNo}
                onChange={(event) => setForm({ ...form, plateNo: event.target.value })}
              />
            </FormField>
            <FormField label="Vehicle">
              <Input
                value={form.vehicleNo}
                onChange={(event) => setForm({ ...form, vehicleNo: event.target.value })}
              />
            </FormField>
            <FormField label="Remarks">
              <Input
                value={form.remarks}
                onChange={(event) => setForm({ ...form, remarks: event.target.value })}
              />
            </FormField>
          </div>

          <div className="gate-pass-preview-actions">
            <Button type="button" variant="secondary" disabled={saving} onClick={handleSave}>
              {saving ? 'Saving…' : 'Save details'}
            </Button>
            <Button type="button" onClick={() => window.print()}>
              Print Gate Pass
            </Button>
            {document?.status !== 'exited' ? (
              <Button type="button" disabled={exiting} onClick={handleExit}>
                {exiting ? 'Updating…' : 'Mark as exited'}
              </Button>
            ) : (
              <p className="gate-pass-preview-exited">Marked as exited</p>
            )}
          </div>
        </aside>

        <div className="gate-pass-preview-document">
          {printDocument ? (
            <GatePassPrint document={printDocument} company={companyBlock} />
          ) : (
            <p className="gate-pass-preview-panel-hint">Loading gate pass…</p>
          )}
        </div>
      </div>
    </div>
  )
}
