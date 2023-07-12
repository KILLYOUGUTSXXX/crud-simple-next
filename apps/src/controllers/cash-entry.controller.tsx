'use client'

import { IDataCash, IDataCashDetail, IDataCashMerge, IStateCashEntry } from "@afx/interfaces/cash-entry.iface"
import { IQueryRequestParams } from "@afx/interfaces/global.iface"
import { getAllCashEntryDetailsByRef } from "@afx/services/cash-entry-detail.service"
import { bulkCreateCashEntries, bulkUpdateCashEntries, getSomeCashEntries, voidTransaction } from "@afx/services/cash-entry.service"
import { Form, FormInstance, Modal, message, notification } from "antd"
import moment from "moment"
import { useState } from "react"


export interface ICashControllers {
  state: IStateCashEntry,
  Main: {
    onChangeTab: (key: string) => void
  },
  Form: {
    onSaveTransaction: (formH: FormInstance<IDataCash>) => void,
    onCancelTransaction: () => void,
    onResetForm: (formD: FormInstance<IDataCashDetail>) => void,
    onDeleteItem: (ids: string) => void,
    onEditItem: (formD: FormInstance<IDataCashDetail>, data: IDataCashDetail) => void,
    onSaveItem: (formD: FormInstance<IDataCashDetail>) => void
  },
  Browse: {
    onFetchDataCash: (props: IQueryRequestParams) => void
    onEditRecord: (record: IDataCash) => void,
    onVoidTransaction: (ids: string) => void
  }
}

const formatDateTime = (n: any) => moment(n).format('DD MMMM YYYY HH:mm:ss')
export default function ControllerCashEntry (): ICashControllers {
  const [state, sets] = useState<IStateCashEntry>({
    currentTab: 'form',
    currentId:  null,
    inputType: 'add',
    dataForms: { header: {}, details: [] },
    listCashEntry: [],
    listCashEntryDetail: [],
    pagination: { page: 1, pageSize: 10, total: 0 },
    filters: { q: '', qType: 'desc' },
    loadingState: false
  })
  const setState = (payloads: Partial<IStateCashEntry>) => sets(_state => ({  ..._state, ...payloads }))

  const findDataCash = async (_p: IQueryRequestParams = { _page: 1, _pageSize: 10, q: '' }) => {
    return await getSomeCashEntries(_p)
      .then(rs => setState({
        listCashEntry: rs.data.map(a => ({
          ...a,
          createdat: formatDateTime((a.createdat as number) * 1000),
          updatedat: a.updatedat ? formatDateTime((a.updatedat as number) * 1000) : '-'
        })),
        loadingState: false,
        dataForms: { header: {}, details: [] },
        pagination: { page: _p._page as number, pageSize: _p._pageSize as number, total: (rs.total as number) }
      }))
      .catch(er => {
        message.error(er.message)
        setState({ loadingState: false, dataForms: { header: {}, details: [] } })
      })
  }

  return  {
    state,
    Main: {
      onChangeTab: (key: string) => {
        setState({ currentTab: key, loadingState: true })
        if(key === 'browse') {
          setTimeout(() => {
            findDataCash()
          }, 500)
        } else {
          setState({ loadingState: false })
        }
      }
    },
    Form: {
      onSaveTransaction: (formsH: FormInstance<IDataCash>) => {
        Modal.confirm({
          title: 'Save Confirmation',
          content: 'Are you sure want to save this transaction ?',
          async onOk () {
            try {
              setState({ loadingState: true })
              let datas: IDataCashMerge

              try {
                const dataHeader: IDataCash = await formsH?.validateFields()
                const dataDetail: IDataCashDetail[] = state.dataForms.details

                datas = {
                  details: dataDetail.map(a => ({ ...a, transdate: moment(a.transdate).format('YYYY-MM-DD') })),
                  header: dataHeader
                }
              } catch (_er: any) {
                throw new Error(_er?.errorFields[0]?.errors[0])
              }

              let requestResult: any
              if(typeof state.dataForms.header.id === 'string') {
                requestResult = bulkUpdateCashEntries(state.dataForms.header.id, datas)
              } else {
                requestResult = bulkCreateCashEntries(datas)
              }

              await requestResult
              setState({ dataForms: { header: {}, details: [] }, loadingState: false })
              formsH.resetFields()
              Modal.success({
                title: 'Success',
                content: 'Transaction has been saved.',
                onOk () {
                  return null
                }
              })
            } catch (er: any) {
              setState({ loadingState: false })
              Modal.error({
                title: 'Failed to save transaction.',
                content: er.message
              })
            }
          }
        })
      },
      onCancelTransaction: () => {
        setState({
          dataForms: { header: {}, details: [] },
          currentTab: typeof state.dataForms.header.id === 'string' ? 'browse' : 'form'
        })
      },
      onResetForm: (formsD: FormInstance<IDataCashDetail>) => {
        if(state.inputType === 'edit') {
          setState({ inputType: 'add', currentId: null })
        }
        formsD?.resetFields()
      },
      onDeleteItem: (ids: string) => {
        Modal.confirm({
          title: 'Delete Confirmation',
          content: 'Are you sure want to delete this item ?',
          onOk () {
            setState({
              dataForms: {
                ...state.dataForms,
                details: state.dataForms.details.filter(a => a.id !== ids)
              }
            })
          }
        })
      },
      onEditItem: (formsD: FormInstance<IDataCashDetail>, data: IDataCashDetail) => {
        setState({ inputType: 'edit', currentId: data.id })
        formsD?.setFieldsValue({ ...data, transdate: moment(data.transdate) })
      },
      onSaveItem: (formsD: FormInstance<IDataCashDetail>) => {
        return formsD?.validateFields({ validateOnly: true }).then((data: IDataCashDetail) => {
          let newDataForms: IDataCashDetail[] = []
          if(state.inputType === 'add') {
            const newData: IDataCashDetail = {
              id: new Date().getTime().toString(),
              ...data
            }
            
            newDataForms = state.dataForms.details.concat(newData)
          } else {
            newDataForms = state.dataForms.details.map(a => a.id === state.currentId ? {...a, ...data} : a)
          }

          setState({
            dataForms: {
              ...state.dataForms,
              details: newDataForms
            },
            currentId: null,
            inputType: 'add'
          })
          formsD?.resetFields()
        }).catch(er => {
          notification.error({
            duration: 2,
            key: 'ERROR_FORM',
            message: er.errorFields[0]?.errors[0] || '-',
            description: 'Make sure all fields is filled correctly.'
          })
        })
      }
    },
    Browse: {
      onFetchDataCash: async (params: IQueryRequestParams) => {
        setState({ loadingState: true })
        setTimeout(() => {
          findDataCash(params)
        }, 500)
      },
      onEditRecord: (record: IDataCash) => {
        setState({ loadingState: true, currentTab: 'form' })

        setTimeout(() => {
          getAllCashEntryDetailsByRef((record.id as string))
          .then(rs => {
            setState({
              dataForms: { header: record, details: rs.data },
              loadingState: false
            })
          })
          .catch(er => {
            message.error(er.message)
            setState({ loadingState: false, currentTab: 'browse' })
          })
        }, 500)
      },
      onVoidTransaction: (ids: string) => {
        Modal.confirm({
          title: 'Void Confirmation',
          content: 'Are you sure want to void this transaction ?',
          onOk () {
            setState({ loadingState: true, currentTab: 'browse' })
            voidTransaction(ids)
              .then(rs => {
                Modal.success({
                  title: 'Success',
                  content: 'Transaction has been void.',
                  onOk: () => {
                    findDataCash()
                  }
                })
              })
              .catch(er => {
                message.error(er.message)
                setState({ loadingState: false })
              })
          }
        })
      }
    }
  }
}