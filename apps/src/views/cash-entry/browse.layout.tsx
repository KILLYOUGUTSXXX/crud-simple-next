import { ICashControllers } from '@afx/controllers/cash-entry.controller'
import { IDataCash } from '@afx/interfaces/cash-entry.iface'
import { CloseCircleOutlined, EditOutlined } from '@ant-design/icons'
import { 
  Row, Col, Divider, Form, Input, Table,
  Card,
  TableProps,
  Tooltip,
  Tag
} from 'antd'

const Searching = Input.Search
const FormItem = Form.Item

export default function BrowseLayout ({ controllers }: { controllers: ICashControllers }) {
  const forms = Form.useForm<any>()[0]
  const { state, Browse: controller } = controllers

  const buildActions = (record: IDataCash) => {
    return [
      <Tooltip title="Edit Transaction" placement="bottomRight">
        <EditOutlined
          className="text-blue-400 text-xl hover:cursor-pointer hover:opacity-50 duration-300"
          onClick={() => controller.onEditRecord(record)}
        />
      </Tooltip>,
      <Divider type="vertical" />,
      <Tooltip title="Void Transaction" placement="bottomRight">
        <CloseCircleOutlined
          className="text-red-600 text-xl hover:cursor-pointer hover:opacity-50 duration-300"
          onClick={() => controller.onVoidTransaction((record.id as string))}
        />
      </Tooltip>
    ]
  }

  const buildStatus = (_v: boolean) => {
    return _v ? <Tag color="blue">ACTIVE</Tag> : <Tag color="red">VOID</Tag>
  }

  const tableProps: TableProps<any> = {
    loading: state.loadingState,
    bordered: true,
    columns: [
      { title: 'Trans ID', key: 'id', dataIndex: 'id', width: 130 },
      { title: 'Memo', key: 'memo', dataIndex: 'memo', width: 400 },
      { title: 'Status', key: 'status', dataIndex: 'status', width: 100, render: buildStatus },
      { title: 'Created At', key: 'createdat', dataIndex: 'createdat', width: 200 },
      { title: 'Updated At', key: 'updatedat', dataIndex: 'updatedat', width: 200 },
      { title: 'Action', key: 'action', width: 80, render: (_, record) => buildActions(record) }
    ],
    scroll: { x: 1200, y: 300 },
    dataSource: state.listCashEntry,
    pagination: { ...state.pagination },
    onChange (n) {
      controller.onFetchDataCash({
        _page: n.current,
        _pageSize: n.pageSize,
        q: (forms.getFieldValue('q') || '')
      })
    }
  }
  return (
    <Row className="flex flex-col gap-y-2">
      <Col span={24}>
        <Card size="small">
          <Form form={forms}>
            <FormItem name="q" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
              <Searching
                disabled={state.loadingState}
                placeholder="Search here ..."
                onSearch={(_s) => controller.onFetchDataCash({ q: _s })}
                autoComplete="off"
              />
            </FormItem>
          </Form>
        </Card>
      </Col>
      <Col span={24}>
        <Card>
          <Table {...tableProps} />
        </Card>
      </Col>
    </Row>
  )
}