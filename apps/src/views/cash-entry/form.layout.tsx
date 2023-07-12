import {
  Col, Row, Button, Input, InputNumber, Form, ColProps,
  Card, DatePicker, List, ListProps, Radio, Tag, Divider, Switch, Space, FormInstance, Spin
} from 'antd'
import moment, { Moment } from 'moment'
import Controller, { ICashControllers } from '@afx/controllers/cash-entry.controller'
import { parseCurrency, parseDate } from '@afx/utils/parser.util'
import { CloseCircleFilled, DeleteFilled, EditFilled, EditOutlined, PlusOutlined, SaveFilled, SyncOutlined } from '@ant-design/icons'
import { IDataCash, IDataCashDetail, IStateCashEntry } from '../../interfaces/cash-entry.iface'
import { CSSProperties, useEffect } from 'react'

const InputArea = Input.TextArea
const FormItem = Form.Item


const formItemLayouts: {
  wrapperCol: ColProps,
  labelCol: ColProps,
  style: CSSProperties
}  =  {
  labelCol: { lg: 4, xl: 4, md: 6, xs: 7, sm: 7 },
  wrapperCol: { lg: 20, xl: 20, md: 18, xs: 16, sm: 16 },
  style: { margin: '4px 0px' }
}

export default function FormLayout ({ controllers }: { controllers: ICashControllers }) {
  const { Form: controller, state } = controllers

  const isVoidTransaction = (typeof state.dataForms.header.status === 'boolean' && !state.dataForms.header.status)
  const formsHeader: FormInstance<IDataCash> = Form.useForm()[0]
  const formsDetail: FormInstance<IDataCashDetail> = Form.useForm()[0]

  const totals = state.dataForms.details.reduce((a, b) => ({
    IN: a.IN + (b.type === 'IN' ? b.value : 0),
    OUT: a.OUT + (b.type === 'OUT' ? b.value : 0)
  }), { IN: 0, OUT: 0 })

  const listProps: ListProps<any> =  {
    size: 'small',
    style: { height: 200, overflowY: 'scroll' },
    itemLayout: 'horizontal',
    dataSource: state.dataForms.details,
    renderItem: (items: IDataCashDetail) => (
      <List.Item
        actions={[
          <DeleteFilled
            className="text-red-600 text-lg hover:cursor-pointer hover:opacity-50 duration-300"
            disabled={state.loadingState}
            onClick={() => controller.onDeleteItem(items.id as string)}
          />,
          <EditFilled
            className="text-blue-400 text-lg hover:cursor-pointer hover:opacity-50 duration-300"
            disabled={state.loadingState}
            onClick={() => controller.onEditItem(formsDetail, items)}
          />
        ]}
      >
        <List.Item.Meta
          title={(
            <span>
              <Tag color={items.type === 'IN' ? 'green' : 'blue'}>{items.type}</Tag> Rp. {parseCurrency(items.value)}
            </span>
          )}
          description={(
            <p style={{ fontSize: 11 }}>
              <span style={{ fontWeight: 'bold' }}>{parseDate(items.transdate)} | </span>
              <span>{items.desc}</span>
            </p>
          )}
        />
      </List.Item>
    )
  }

  const extraCardButton = [
    <Button
      icon={<CloseCircleFilled />}
      disabled={!(typeof state.dataForms.header.id === 'string') || state.loadingState || isVoidTransaction}
      onClick={controller.onCancelTransaction}
      type="primary"
      size="small"
      danger
    >Cancel</Button>,
    <Divider type="vertical"  />,
    <Button
      icon={<SaveFilled />}
      size="small"
      onClick={() => controller.onSaveTransaction(formsHeader)}
      type="primary"
      disabled={state.loadingState || isVoidTransaction}
    >Save</Button>
  ]

  useEffect(() => {
    formsHeader.setFieldsValue(state.dataForms.header)
  }, [state.dataForms.header])

  return (
    <Row>
      <Col span={24} className="flex flex-col gap-y-3">
        <Row>
          <Card size="small" className="p-2 w-full" title="Input Header" extra={extraCardButton}>
            <Form className="w-full" form={formsHeader}>
              <Col xl={12} lg={12} md={24} xs={24} sm={24}>
                <FormItem label="Trans ID" {...formItemLayouts}>
                  {
                    state.loadingState ? <Spin size="small" spinning />
                      : <strong>{state.dataForms.header.id || '[By System]'}</strong>
                  }
                </FormItem>
                <FormItem label="Status" {...formItemLayouts}>
                  {
                    state.loadingState ? <Spin size="small" spinning />
                      :typeof state.dataForms.header.status !== 'boolean' || state.dataForms.header.status ? 
                        <Tag color="blue">ACTIVE</Tag> : <Tag color="red">VOID</Tag>
                  }
                </FormItem>
                <FormItem label="Memo" name="memo" {...formItemLayouts} rules={[{ required: true }]}>
                  <InputArea rows={3} className="w-full" />
                </FormItem>
              </Col>
            </Form>
          </Card>
        </Row>
        <Row gutter={12}>
          <Col xl={12} lg={12} md={24} xs={24} sm={24}>
            <Card size="small" className="p-2" title="Input Details">
              <Row>
                <Form className="w-full" form={formsDetail}>
                  <FormItem label="Value" name="value" {...formItemLayouts} rules={[{ required: true }]}>
                    <InputNumber
                      className="w-full"
                      formatter={(value) => parseCurrency(value as number)}
                      parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                  </FormItem>
                  <FormItem label="Trans Date" name="transdate" {...formItemLayouts} rules={[{ required: true }]}>
                    <DatePicker
                      className="w-full"
                      format="DD MMMM YYYY"
                      disabledDate={_x => _x  > moment().endOf('day')}
                    />
                  </FormItem>
                  <FormItem label="Type" name="type" {...formItemLayouts} initialValue="IN" rules={[{ required: true }]}>
                    <Radio.Group>
                      <Radio key="IN" value="IN">IN</Radio>
                      <Radio key="OUT" value="OUT">OUT</Radio>
                    </Radio.Group>
                  </FormItem>
                  <FormItem label="Description" name="desc" {...formItemLayouts} rules={[{ required: true }]}>
                    <InputArea rows={3} className="w-full" />
                  </FormItem>
                </Form>
              </Row>
              <Row gutter={8} className="justify-end mt-2">
                <Col xl={4} lg={5} md={6} sm={24} xs={24}>
                  <Button
                    icon={<SyncOutlined />}
                    onClick={() => controller.onResetForm(formsDetail)}
                    type="primary"
                    danger
                    disabled={state.loadingState || isVoidTransaction}
                    className="w-full"
                  >
                  {state.inputType === 'edit' ? 'CANCEL' : 'RESET'}
                  </Button>
                </Col>
                <Col xl={4} lg={5} md={6} sm={24} xs={24}>
                  <Button
                    icon={state.inputType === 'add' ? <PlusOutlined /> : <EditOutlined />}
                    onClick={() => controller.onSaveItem(formsDetail)}
                    type="primary"
                    className="w-full"
                    disabled={state.loadingState || isVoidTransaction}
                  >
                    {state.inputType === 'edit' ? 'EDIT' : 'ADD'}
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xl={12} lg={12} md={24} xs={24} sm={24}>
            <Card size="small" className="p-2" title="List Details">
              <List {...listProps} />
              <Divider />
              <Row>
                <Col span={12}>
                  <Tag color="green" style={{ width: 50, textAlign: 'center' }}>IN</Tag> : {parseCurrency(totals.IN)}
                </Col>
                <Col span={12}>
                  <Tag color="blue" style={{ width: 50, textAlign: 'center' }}>OUT</Tag> : {parseCurrency(totals.OUT)}
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}