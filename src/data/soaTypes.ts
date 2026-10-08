export type SoaStatus = 'open' | 'partial' | 'settled'

export interface SoaLine {
  id: string
  date: string
  reference: string
  description: string
  debit: number
  credit: number
  balance: number
}

export interface StatementOfAccount {
  id: string
  soaNo: string
  customerId: string
  customerName: string
  dateFrom: string
  dateTo: string
  status: SoaStatus
  lines: SoaLine[]
  totalDebit: number
  totalCredit: number
  endingBalance: number
}

export type SoaFilterStatus = SoaStatus | 'all'

export interface SoaFilters {
  status: SoaFilterStatus
  search: string
  dateFrom: string
  dateTo: string
}
