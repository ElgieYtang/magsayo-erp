import logo from '@/assets/logo.png'
import { RTS_LETTERHEAD } from '@/config/companyLetterhead'
import { companyInfo } from '@/data/accomplishmentReports'
import { groupImagesIntoPages, padImageSlots } from '@/lib/reportPages'
import { X } from 'lucide-react'

const DEFAULT_COMPANY = {
  name: companyInfo.name,
  address: 'RM301E-3 MEDALLE BLDG. FUENTE OSMEÑA CAPITOL SITE CEBU CITY',
  phone: '345-2283/09175734911',
}

export function AccomplishmentReport({
  report,
  company = DEFAULT_COMPANY,
  signatoryName = RTS_LETTERHEAD.signatoryName,
  previewPage,
  onRemoveImage,
}) {
  const pages = groupImagesIntoPages(report.images)
  const totalPages = pages.length
  const isPaginatedPreview = previewPage != null

  return (
    <div className={isPaginatedPreview ? 'ar-print ar-print--paginated' : 'ar-print'}>
      {pages.map((pageImages, pageIndex) => {
        const pageNumber = pageIndex + 1
        const isFirstPage = pageIndex === 0
        const isLastPage = pageNumber === totalPages
        const slots = padImageSlots(pageImages, 4)
        const isHiddenInPreview = isPaginatedPreview && pageNumber !== previewPage

        return (
          <section
            key={`${report.id}-page-${pageNumber}`}
            className={
              isHiddenInPreview
                ? 'ar-print__page ar-print__page--hidden-preview'
                : 'ar-print__page'
            }
            aria-label={`Accomplishment Report page ${pageNumber} of ${totalPages}`}
            aria-hidden={isHiddenInPreview}
          >
            {isFirstPage ? (
              <ReportLetterhead company={company} />
            ) : (
              <div className="ar-print__continued">
                <h1 className="ar-print__title">ACCOMPLISHMENT REPORT</h1>
                <p className="ar-print__page-no">
                  Page {pageNumber} of {totalPages}
                </p>
              </div>
            )}

            {isFirstPage ? <ReportInfoTable report={report} /> : null}

            <PicturesSection
              images={slots}
              attached={isFirstPage}
              onRemoveImage={onRemoveImage}
            />

            {isLastPage ? (
              <SignatureSection
                preparedBy={report.preparedBy}
                preparedByPosition={report.preparedByPosition ?? 'PERSONNEL'}
                signatoryName={signatoryName}
                confirmedByLabel={
                  report.confirmedByLabel ?? 'SIGNATURE OF PRINTED NAME/POSITION'
                }
              />
            ) : null}
          </section>
        )
      })}
    </div>
  )
}

function ReportLetterhead({ company }) {
  return (
    <header className="ar-print__letterhead">
      <div className="ar-print__letterhead-row">
        <img
          src={logo}
          alt={`${company.name} logo`}
          className="ar-print__logo"
          width={72}
          height={72}
        />
        <div className="ar-print__company">
          <p className="ar-print__company-name">{company.name}</p>
          <p className="ar-print__company-line">{company.address}</p>
          <p className="ar-print__company-line">{company.phone}</p>
        </div>
      </div>
      <h1 className="ar-print__title">ACCOMPLISHMENT REPORT</h1>
    </header>
  )
}

function ReportInfoTable({ report }) {
  return (
    <table className="ar-print__info-table">
      <tbody>
        <tr>
          <th>Project Name:</th>
          <td colSpan={3}>{report.projectName}</td>
        </tr>
        <tr>
          <th>Location</th>
          <td>{report.location}</td>
          <th>Remarks</th>
          <td>{report.remarks}</td>
        </tr>
        <tr>
          <th>Installation Report No:</th>
          <td>{report.installationReportNo}</td>
          <th>Date:</th>
          <td>{report.date}</td>
        </tr>
      </tbody>
    </table>
  )
}

function PicturesSection({ images, attached, onRemoveImage }) {
  return (
    <div
      className={
        attached ? 'ar-print__pictures' : 'ar-print__pictures ar-print__pictures--standalone'
      }
    >
      <div className="ar-print__pictures-label">Pictures</div>
      <div className="ar-print__image-grid">
        {images.map((image, index) => (
          <div key={image?.id ?? `empty-${index}`} className="ar-print__image-cell">
            {image ? (
              <>
                <img src={image.src} alt={image.alt} draggable={false} />
                {onRemoveImage ? (
                  <button
                    type="button"
                    className="ar-print__image-remove no-print"
                    onClick={() => onRemoveImage(image.id)}
                    aria-label={`Remove ${image.alt}`}
                    title="Remove photo"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : null}
              </>
            ) : (
              <span className="ar-print__image-empty" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function SignatureSection({
  preparedBy,
  preparedByPosition,
  signatoryName,
  confirmedByLabel,
}) {
  return (
    <table className="ar-print__signatures">
      <tbody>
        <tr>
          <th>Prepared By:</th>
          <th>Confirmed By:</th>
        </tr>
        <tr>
          <td>
            <div className="ar-print__signature-space" />
            <p className="ar-print__signature-name">{signatoryName || preparedBy}</p>
            <p className="ar-print__signature-role">{preparedByPosition}</p>
          </td>
          <td>
            <div className="ar-print__signature-space" />
            <p className="ar-print__signature-role ar-print__signature-role--center">
              {confirmedByLabel}
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  )
}
