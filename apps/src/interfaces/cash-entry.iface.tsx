import { Moment } from "moment"

export interface IDataCash {
  id?: string,
  status: boolean,
  memo: string,
  createdat: Moment | number | string,
  updatedat: Moment | number | string
}

export interface IDataCashDetail {
  id?: string,
  refid?: string | null,
  value: number,
  transdate: Moment | number | string,
  type: 'IN' | 'OUT'
  desc: string,
  createdat: Moment | number | string,
  updatedat: Moment | number | string
}

export interface IDataCashMerge {
  header: Partial<IDataCash>,
  details: Array<IDataCashDetail>
}


export interface IStateCashEntry {
  inputType: 'add' | 'edit',
  currentId: string | null,
  currentTab: string,
  dataForms: IDataCashMerge,
  listCashEntry: Array<IDataCash>,
  listCashEntryDetail: Array<IDataCashDetail>,
  pagination: { page: number, pageSize: number, total: number },
  filters: { q: string, qType: string },
  loadingState: boolean
}