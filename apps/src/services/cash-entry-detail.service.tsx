import { IDataCashDetail } from "@afx/interfaces/cash-entry.iface"
import request from "@afx/utils/request.util"
import rest from "@afx/utils/config.rest"
import { IQueryRequestParams } from "@afx/interfaces/global.iface"


export function getAllCashEntryDetailsByRef (refid: string) {
  return request<IDataCashDetail[]>({
    url: rest.cashEntryDetail.all.replace(':refids', refid),
    method: 'GET'
  })
}
