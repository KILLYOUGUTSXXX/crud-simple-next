import { IDataCash, IDataCashMerge } from "@afx/interfaces/cash-entry.iface"
import request from "@afx/utils/request.util"
import rest from "@afx/utils/config.rest"
import { IQueryRequestParams } from "@afx/interfaces/global.iface"


export function getSomeCashEntries (params: IQueryRequestParams) {
  return request<IDataCash[]>({
    url: rest.cashEntry.main,
    method: 'GET',
    data: params
  })
}

export function getOneCashEntry (ids: string) {
  return request<IDataCash>({
    url: rest.cashEntry.params.replace(':ids', ids),
    method: 'GET'
  })
}

export function bulkCreateCashEntries (data: IDataCashMerge) {
  return request<any>({
    url: rest.cashEntry.bulk,
    method: 'POST',
    data
  })
}

export function bulkUpdateCashEntries (ids: string, data: IDataCashMerge) {
  return request<any>({
    url: rest.cashEntry.bulkParams.replace(':ids', ids),
    method: 'PUT',
    data
  })
}

export function voidTransaction (ids: string) {
  return request<any, Partial<IDataCash>>({
    url: rest.cashEntry.params.replace(':ids', ids),
    method: 'PATCH',
    data: {
      status: false
    }
  })
}